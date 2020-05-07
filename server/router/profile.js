import {Router} from 'express'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'
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

router.get('/api/profile/:uid', auth(), owner, async function (req, res) {
  const doc = await profileModel.findById(Types.ObjectId(req.params.uid))
  if (doc) {
    res.send({
      code: 0,
      msg: '操作成功!',
      result: doc
    })
  } else {
    res.status(404)
  }
})

export default router
