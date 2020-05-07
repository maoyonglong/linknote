import {Router} from 'express'
import {action} from './common'
import auth from '../middleware/auth'
import rbac from '../middleware/rbac'

const router = new Router()

const executions = {

}

const roleCondition = req => {

}

router.use('/api/mark', auth(), rbac, action(executions, roleCondition))

export default router
