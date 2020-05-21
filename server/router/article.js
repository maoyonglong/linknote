import {Router} from 'express'
// import auth from '../middleware/auth'
// import rbac from '../middleware/rbac'
import {Types} from 'mongoose'
import articleModel from '../model/article'
import folderModel from '../model/folder'
import _ from 'lodash'
import fs from 'fs-extra'
import {STATIC_ROOT} from '../config'
import path from 'path'

const router = new Router()

router.post('/api/article/del', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)
  const articleId = Types.ObjectId(req.body.articleId)

  const doc = await articleModel.findById(articleId)

  if (!doc) {
    res.send({
      code: -1,
      msg: '没有找到该文章！',
      err: new Error('not found.')
    })
    return
  }

  const folderDoc = await folderModel.findOne({uid, _id: doc.folder_id})

  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '您无权删除该文章！',
      err: new Error('no right.')
    })
    return
  }

  await doc.remove()
  await folderDoc.remove()

  res.send({
    code: 0,
    msg: '删除文章成功！'
  })
})

router.post('/api/article/add', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)
  const folderId = Types.ObjectId(req.body.folderId)
  const {
    tag,
    doctype,
    title,
    name,
    content,
    assets,
    publish,
    privacy
  } = req.body
  const folderDoc = await folderModel.findOne({uid, _id: folderId})

  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '找不到文章所在文件夹！',
      err: new Error('no found.')
    })
    return
  }

  const doc = new articleModel({
    folder_id: folderId,
    tag,
    name,
    doctype,
    title,
    content,
    assets,
    publish,
    privacy
  })

  try {
    await doc.save()

    res.send({
      code: 0,
      msg: '添加文章成功！',
      result: doc._id.toString()
    })
  } catch (err) {
    console.log(err)
  }
})

router.post('/api/article/rename', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)
  const articleId = Types.ObjectId(req.body.articleId)
  const name = req.body.name
  const doc = await articleModel.findById(articleId)

  if (!doc) {
    res.send({
      code: -1,
      msg: '文章不存在！',
      err: new Error('no found.')
    })
    return
  }

  const folderDoc = await folderModel.findOne({uid, _id: doc.folder_id})

  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '无权改写该文章！',
      err: new Error('no right.')
    })
    return
  }

  await articleModel.updateOne({_id: articleId}, {name})

  res.send({
    code: 0,
    msg: '文章重命名成功！'
  })
})

router.post('/api/article/update', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)
  const articleId = Types.ObjectId(req.body.articleId)
  const doc = await articleModel.findById(articleId)

  if (!doc) {
    res.send({
      code: -1,
      msg: '文章不存在！',
      err: new Error('no found.')
    })
    return
  }

  const folderDoc = await folderModel.findOne({uid, _id: doc.folder_id})

  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '无权改写该文章！',
      err: new Error('no right.')
    })
    return
  }

  let docObj = {}

  // 删除旧的不被引用的assets
  const assets = req.body.assets
  const oldAssets = doc.assets
  let delAssets = _.differenceWith(oldAssets, assets, _.isEqual)
  const keepAssets = _.differenceWith(oldAssets, delAssets, _.isEqual)
  const httpOrHttpsRe = /^https?/i
  delAssets = delAssets.filter(asset => !httpOrHttpsRe.test(asset))

  delAssets.forEach(asset => {
    let p = path.join(STATIC_ROOT, asset)
    fs.remove(p, err => {
      // log
      console.log(err)
    })
  })

  docObj.assets = _.uniq(assets.concat(keepAssets))

  const arr = [
    'tag',
    'folderId',
    'doctype',
    'title',
    'content',
    'date',
    'publish',
    'privacy'
  ]

  arr.forEach(item => {
    docObj[item] = req.body[item] || doc[item]
  })

  const newDoc = new articleModel(docObj)

  await doc.update(newDoc)

  res.send({
    code: 0,
    msg: '文章更新成功！',
  })
})

router.get('/api/articles', async function (req, res) {
  const uidStr = req.session.uid
  let folderId = Types.ObjectId(req.query.folderId)
  let docs = null, folderDoc = null

  if (folderId) {
    folderId = Types.ObjectId(folderId)
    docs = await folderModel.aggregate([
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'folder_id',
          as: 'files'
        }
      }
    ])
  } else {
    docs = await articleModel.find()
  }

  console.log(folderId, docs)

  if (docs && docs.length > 0) {
    // 查找该文件夹记录
    folderDoc = docs.filter(doc => doc._id.toString() === folderId.toString())
    console.log(folderDoc)
    folderDoc = folderDoc.length === 1 ? folderDoc[0] : null
    // 用户已登陆，需要判断是否作者；
    // 如果不是作者，需要将私密文章筛掉
    if (uidStr && folderDoc) {
      if (uidStr !== folderDoc.uid.toString()) {
        // folderDoc is {..., files: []}
        docs = folderDoc.files.filter(file => !file.privacy)
      } else {
        docs = folderDoc.files
      }
    } else if (folderDoc) {
      docs = folderDoc.files
    } else {
      docs = []
    }
  }

  res.send({
    code: 0,
    msg: '文章列表查找成功！',
    result: docs
  })
})

router.get('/api/article/a/:aid?', async function (req, res) {
  const uidStr = req.session.uid
  let aid = req.params.aid

  if (aid) return

  aid = Types.ObjectId(aid)

  const doc = await articleModel.findById(aid)

  if (!doc) {
    res.send({
      code: -1,
      msg: '文章不存在',
      err: new Error('not found.')
    })
    return
  }

  // 是否私有，私有才判断是否作者
  if (doc.privacy) {
    if (!uidStr) {
      res.send({
        code: -1,
        msg: '无权访问该文章！',
        err: new Error('no right.')
      })
      return
    }
    const folderDoc = await folderModel.findOne({_id: doc.folder_id, uid: Types.ObjectId(uidStr)})
    if (!folderDoc) {
      res.send({
        code: -1,
        msg: '无权访问该文章！',
        err: new Error('no right.')
      })
      return
    }
  }

  res.send({
    code: 0,
    msg: '查看文章成功！',
    result: doc
  })
})

export default router
