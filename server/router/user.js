import {Router} from 'express'
import userModel from '../model/user'
import bcrypt from 'bcrypt'
import _ from 'lodash'

const router = Router()

router.post('/api/login', async (req, res) => {
  const {uname, pwd} = req.body
  const userDoc = await userModel.findOne({
    uname
  })
  if (!userDoc) {
    res.send({
      code: -1,
      msg: '用户名不存在！',
      err: new Error('custom error: this user is not existed.')
    })
  } else if (bcrypt.compareSync(pwd, userDoc.pwd)) {
    const userIdStr = userDoc._id.toString()
    req.session.uid = userIdStr

    res.send({
      code: 0,
      msg: '登陆成功！',
      result: userIdStr
    })
  } else {
    res.send({
      code: -1,
      msg: '密码错误！',
      err: new Error('custom error: password is error.')
    })
  }
})

router.post('/api/logout',  (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.send({
        code: -1,
        msg: '退出失败'
      })
      return
    } else {
      res.send({
        code: 0,
        msg: '退出成功！'
      })
    }
  })
})

router.post('/api/register', async (req, res) => {
  const {
    uname,
    pwd
  } = req.body
  const userDoc = new userModel({
    uname,
    pwd
  })
  const userIdStr = userDoc._id.toString()

  await userDoc.save()

  req.session.uid = userIdStr

  // const cloneUserDoc = Object.create(userDoc)
  // cloneUserDoc._id = userIdStr

  // await redisClient.set(token, cloneUserDoc)
  // await redisClient.expire(uidStr, EXPIRE)

  res.send({
    code: 0,
    msg: '注册成功！',
    result: userIdStr
  })
})

router.post('/api/register/activate', (req, res) => {
  // todo
})

export default router
