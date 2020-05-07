import {Router} from 'express'
import userModel from '../model/user'
import {SECRET} from '../config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import redisClient from '../redis/client'
import _ from 'lodash'

const EXPIRE = 60 * 60

const router = Router()

async function genToken (key, val) {
  try {
    const token = jwt.sign({
      id: uidStr
    }, SECRET)
    await redisClient.set(key, _.assign({
      token
    }, val))
    await redisClient.expire(uidStr, EXPIRE)
    return token
  } catch (err) {
    return Promise.reject(err)
  }
}

router.post('/api/login', async (req, res) => {
  let {uname, pwd} = req.body
  const userDoc = await userModel.findOne({
    uname
  })
  const userStr = userDoc._id.toString()
  if (!userDoc) {
    res.status(422).send({
      code: -1,
      msg: '用户名不存在'
    })
  } else if (bcrypt.compareSync(pwd, userDoc.pwd)) {
    const token = genToken(userStr, { userDoc })
    res.send({
      code: 0,
      msg: '登陆成功',
      result: token
    })
  } else {
    res.status(422).send({
      code: -1,
      msg: '密码错误'
    })
  }
})

router.post('/api/logout',  async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ').pop()
    const success = await redisClient.del(jwt.verify(token).id)
    if (success) {
      res.send({
        code: 0,
        msg: '退出成功！'
      })
    } else {
      res.send({
        code: -1,
        msg: '退出失败'
      })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/api/register', async (req, res) => {
  const {
    uname,
    pwd
  } = req.body
  const userDoc = new userModel({
    uname,
    pwd: bcrypt.hashSync(pwd, 10)
  })
  const userStr = userDoc._id.toString()

  try {
    await userDoc.save()

    const token = genToken(userStr, { userDoc })

    res.send({
      code: 0,
      msg: '注册成功',
      result: token
    })
  } catch (err) {
    res.send({
      code: -1,
      msg: '注册失败'
    })
  }
})

router.post('/api/register/activate', (req, res) => {
  // todo
})

export default router
