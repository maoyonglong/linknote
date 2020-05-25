import {Router} from 'express'
import folderModel from '../model/folder'
import articleModel from '../model/article'
import {Types} from 'mongoose'

const router = new Router()

const ObjectId = Types.ObjectId

router.post('/api/folder/add', async (req, res) => {
  const uid = ObjectId(req.session.uid)
  const name = req.body.name
  const doc = new folderModel({
    uid,
    name
  })
  await doc.save()
  res.send({
    code: 0,
    msg: '添加文件夹成功！',
    result: doc._id.toString()
  })
})

router.post('/api/folder/del', async (req, res) => {
  const uid = ObjectId(req.session.uid)
  const folderId = ObjectId(req.body.folderId)
  const folderDoc = folderModel.findOne({uid, _id: folderId})
  if (!folderDoc) {
    res.send({
      code: -1,
      msg: '文件夹不存在！',
      err: new Error('not found.')
    })
    return
  }
  await folderDoc.remove()
  // 同时要删除对应的文件
  await articleModel.deleteMany({folder_id: folderId})
  res.send({
    code: 0,
    msg: '删除文件夹成功！'
  })
})

router.post('/api/folder/setPrivacy', async (req, res) => {
  const uid = ObjectId(req.session.uid)
  const folderId = ObjectId(req.body.folderId)
  const privacy = req.body.privacy
  await folderModel.updateOne({uid, folder_id: folderId}, { $set: { privacy } })
  res.send({
    code: 0,
    msg: '文件夹已保密！'
  })
})

router.post('/api/folder/rename', async (req, res) => {
  const uid = ObjectId(req.session.uid)
  const folderId = ObjectId(req.body.folderId)
  const name = req.body.name
  await folderModel.updateOne({uid, folder_id: folderId}, { $set: { name } })
  res.send({
    code: 0,
    msg: '文件夹重命名成功！'
  })
})

router.get('/api/folders/u/:uid?', async (req, res) => {
  const folderUidStr = req.params.uid
  const uidStr = req.session.uid
  let docs

  if (folderUidStr) {
    const folderUid = ObjectId(folderUidStr)
    docs = await folderModel.find({uid: folderUid})
    // 去除未发表的文件夹
    docs = docs.filter(doc => !doc.privacy)
  } else if (uidStr) {
    const uid = ObjectId(uidStr)
    docs = await folderModel.find({uid})
  } else {
    res.send({
      code: -1,
      msg: '找不到文件夹列表！'
    })
    return
  }
  res.send({
    code: 0,
    msg: '查找文件夹列表成功！',
    result: docs
  })
})

export default router
