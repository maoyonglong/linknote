import {Router} from 'express'
import profileModel from '../model/profile'
import {Types} from 'mongoose'
import jwt from 'jsonwebtoken'
import { SECRET } from '../config'

const router = Router()

const owner = async (req, res, next) => {
  const pid = req.query.pid
  const uid = req.userDoc._id
  const doc = await profileModel.findById(pid)

  req.owner = {
    flag: doc.uid.toString() === uid.toString(),
    doc
  }

  next()
}

router.post('/api/profile/add', async function (req, res) {
  const uid = jwt.verify(req.session.token, SECRET).id
  const {
    pname,
    sex,
    avatar,
    city,
    intro,
    phone,
    birthday,
    email,
    privacy
  } = req.body

  const doc = new profileModel({
    uid,
    pname,
    sex,
    avatar,
    city,
    intro,
    phone,
    birthday,
    email,
    privacy
  })

  await doc.save()

  res.send({
    code: 0,
    msg: '个人信息上传成功！'
  })
})

router.get('/api/profile/:uid', async function (req, res) {
  const uid = req.params.uid
  const doc = await profileModel.findOne({ uid: Types.ObjectId(uid) })
  if (doc) {
    res.send({
      code: 0,
      msg: '操作成功!',
      result: doc
    })
  } else {
    res.status(404).send()
  }
})

export default router
