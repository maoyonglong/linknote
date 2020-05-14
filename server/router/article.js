import {Router} from 'express'
// import auth from '../middleware/auth'
// import rbac from '../middleware/rbac'
import {Types} from 'mongoose'
import articleModel from '../model/article'
import folderModel from '../model/folder'
import _ from 'lodash'
import fs from 'fs-extra'
import {STATIC_ROOT} from '../config'
import path from path

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
    content,
    date,
    assets,
    publish,
    privacy
  } = req.body
  const folderDoc = await folderModel.findOne({uid, _id: doc.folder_id})

  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '找不到文章所在文件夹！',
      err: new Error('no found.')
    })
    return
  }

  const doc = new articleModel({
    folderId,
    tag,
    doctype,
    title,
    content,
    date,
    assets,
    publish,
    privacy
  })

  await doc.save()

  res.send({
    code: 0,
    msg: '添加文章成功！'
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
    msg: '添加文章成功！'
  })
})

router.get('/api/articles', async function (req, res) {
  const uidStr = req.session.uid
  const folderId = req.body.folderId
  let docs

  if (folderId) {
    docs = await articleModel.aggregate([
      {
        $lookup: {
          from: 'folders',
          localField: 'folder_id',
          foreignField: '_id',
          as: 'folder'
        }
      }
    ])
  } else {
    docs = await articleModel.find()
  }

  if (uidStr) {
    docs = docs.filter(doc => doc.folder.uid.toString() === uidStr)
  } else {
    docs = docs.filter(doc => !doc.privacy)
  }

  res.send({
    code: 0,
    msg: '文章列表查找成功！',
    result: docs
  })

})

router.get('/api/article/a/:aid', async function (req, res) {
  const uidStr = req.session.uid
  const aid = req.params.aid

  if (aid) return

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
    const folderDoc = await folderId.findOne({_id: doc.folder_id, uid: Types.ObjectId(uidStr)})
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
