import {Router} from 'express'
import userModel from '../model/user'
import roleModel from '../model/role'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import aclPromise from '../acl'

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
    const acl = await aclPromise
    const roleDoc = await roleModel.findOne({uid: userDoc._id})
    const userIdStr = userDoc._id.toString()
    req.session.uid = userIdStr
    req.session.role = roleDoc.role
    await acl.addUserRoles(userIdStr, roleDoc.role)

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
  const uidStr = req.session.uid
  const role = req.session.role
  req.session.destroy(async function (err) {
    if (err) {
      res.send({
        code: -1,
        msg: '退出失败'
      })
      return
    } else {
      const acl = await aclPromise
      await acl.removeUserRoles(uidStr, role)
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
  const roleDoc = new roleModel({
    uid: userDoc._id,
    role: 'ordinary'
  })

  await userDoc.save()
  await roleDoc.save()

  const userIdStr = userDoc._id.toString()

  req.session.uid = userIdStr
  req.session.role = 'ordinary'
  await acl.addUserRoles(userIdStr, 'ordinary')
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
