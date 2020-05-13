import {Router} from 'express'
import auth from '../middleware/auth'
// import rbac from '../middleware/rbac'
import {Types} from 'mongoose'
import articleModel from '../model/article'

const router = new Router()

const isOwner = async function (req, res, next) {
  const uid = req.userDoc._id
  const doc = await articleModel.aggregate([
    {
      $lookup: {
        from: 'folders',
        localField: 'folder_id',
        foreignField: '_id',
        as: 'folder'
      }
    }
  ])[0]

  const docUid = doc.folder.folder.uid
  req.owner = {
    flag: docUid.toString() === uid.toString(),
    doc
  }

  next()
}

router.post('/api/article', auth(true), isOwner, async function (req, res) {
  const action = req.body.action
  const aid = req.body.aid

  const executions = {
    add: function () {},
    update: function () {},
    del: function () {}
  }

  const docs = await executions[action]()
  if (action !== 'del') {
    if (docs.length > 0) {
      res.send({
        code: 0,
        msg: '操作成功!',
        result: doc
      })
    } else {
      res.status(404)
    }
  }
})

router.get('/api/article/read/:aid', auth(), isOwner, async function (req, res) {
  const aid = req.params.aid
  const isOwner = req.owner.flag

  const doc = await articleModel.findById(Types.ObjectId(aid))

  if (!doc) {
    res.status(404)
  }

  if (!doc.publish) {
    return Promise.reject({
      code: -1,
      msg: '文章未发布',
      err: new Error('no publish.')
    })
  }

  res.send({
    code: 0,
    msg: '请求成功！',
    result: {
      doc,
      owner: isOwner
    }
  })
})

router.get('/api/article/write', auth(true), async function (req, res) {
  const aid = req.query.aid
  const doc = await articleModel.findById(Types.ObjectId(aid))
  res.send({
    code: 0,
    msg: '请求成功！',
    result: doc
  })
})

router.get('/api/article/list', auth(), isOwner, async function (req, res) {
  const uid = req.userDoc._id
  const docs = await articleModel.find({uid})
  res.send({
    code: 0,
    msg: '请求成功！',
    result: docs
  })
})

export default router
