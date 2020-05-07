import {Router} from 'express'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'
import profileModel from '../model/profile'
import {action} from './common'
import {Types} from 'mongoose'

const router = Router()

const executions = {
  'get:get': req => profileModel.findById(Types.ObjectId(req.params.uid)),
  'post:delete': async req => {
    const doc = await pro.findById(Types.ObjectId(req.params.uid))

    if (!doc) {
      return Promise.reject({
        code: -1,
        status: 422,
        msg: '用户不存在'
      })
    }

    return doc
  }
}

const roleCondition = req => {
  const uidStr = req.params.uid
  const ownerId = req.userDoc ? req.userDoc._id : null

  return Promise.resolve(ownerId && uidStr === ownerId.toString() ? 'owner' : 'visitor')
}

router.use('/api/profile/:uid', auth(), rbac, action(executions, roleCondition))

export default router
