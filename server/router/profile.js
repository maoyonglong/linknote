import {Router} from 'express'
import profileModel from '../model/profile'
import {Types} from 'mongoose'

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
  const uid = Types.ObjectId(req.session.uid)
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

router.post('/api/profile/avatar/update', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)
  const avatar = req.body.avatar
  await profileModel.update({uid}, {avatar})
  res.send({
    code: 0,
    msg: '上传头像成功！'
  })
})

router.post('/api/profile/update', async function (req, res) {
  const uid = Types.ObjectId(req.session.uid)

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

  await profileModel.update({uid}, {
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

  res.send({
    code: 0,
    msg: '个人信息更新成功！'
  })
})

router.get('/api/profile/u/:uid', async function (req, res) {
  console.log('uid')
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

router.get('/api/profile/self', function (req, res) {
  const uid = req.session.uid
  res.redirect('/api/profile/u/' + uid)
})

export default router
