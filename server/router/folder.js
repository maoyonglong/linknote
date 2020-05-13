import {Router} from 'express'
import auth from '../middleware/auth'
import folderModel from '../model/folder'

const router = new Router()

const ownerByAid = async function (req, res, next) {
  const id = req.query.aid || req.body.aid
  const uid = req.userDoc._id
  const doc = await folderModel.findById(id)

  req.owner = {
    flag: doc.uid.toString() === uid.toString(),
    doc
  }

  next()
}

const ownerByUid = async function (req, res, next) {
  const id = req.query.uid || req.body.uid
  const uid = req.userDoc._id

  req.owner = {
    flag: id.toString() === uid.toString(),
    doc
  }

  next()
}

router.post('/api/folder', auth(true), ownerByAid, async (req, res) => {
  const action = req.body.action
  const isOwner = req.owner.flag

  if (!isOwner) {
    res.send({
      code: -1,
      msg: '无权限访问！',
      err: new Error('no right.')
    })
  }

  const executions = {
    add: async function () {
      const uid = req.userDoc._id
      const name = req.body.name
      const doc = new folderModel({uid, name})
      await doc.save()
    },
    rename: async function () {
      const _id = req.body.aid
      const name = req.body.name
      await folderModel.updateOne({ _id }, { $set: {name} })
    },
    del: async function () {
      const _id = req.body.aid
      await folderModel.deleteOne({ _id })
    },
  }

  try {
    const execution = executions[action]
    await execution()
    res.send({
      code: 0,
      msg: '操作成功！'
    })
  } catch (err) {
    res.send({
      code: -1,
      msg: '操作失败！'
    })
  }
})

router.get('/api/folder', auth(), ownerByUid, async (req, res) => {
  const isOwner = req.owner.flag
  const type = req.query.type
  try {
    const condition = [
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'folder_id',
          as: 'files'
        }
      }
    ]

    if (!isOwner) {
      condition.push({
        $project: {
          items: {
            $filter: {
              input: "$files",
              as: "item",
              cond: { $gte: [ "$$item.private", false ] }
            }
          }
        }
      })
    }

    let docs = await folderModel.aggregate(condition)

    // 过滤掉不含文章的项
    if (!isOwner) {
      docs = docs.filter(doc => doc.files.length > 0)
    }

    if (type === 'list') {
      docs.forEach(doc => {
        delete doc.files
      })
    }

    res.send({
      code: 0,
      msg: '操作成功！',
      result: docs
    })
  } catch (err) {
    res.send({
      code: -1,
      msg: '操作失败！',
      err
    })
  }
})
