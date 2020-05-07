import articleModel from '../model/article'
import {Router} from 'express'
import {action} from './common'
import auth from '../middleware/auth'
// import rbac from '../middleware/rbac'
// import {Types} from 'mongoose'

const router = new Router()

const parseAction = function (req, res, next) {
  const method = req.method

  console.log(method)
  next()
}

router.post('/api/article/a/:aid', auth(), parseAction, function (req, res) {
  res.send(1)
})

// const executions = {
//   "get:read": async (req, role) => {
//     const doc = await articleModel.findById(Types.ObjectId(req.params.aid))
//     const type = req.query.type

//     if (role === 'admin') return doc

//     // 确保文章已发布
//     if (type === 'publish' && !doc.publish) {
//       return Promise.reject({
//         code: -1,
//         status: 422,
//         msg: '文章未发布'
//       })
//     }

//     let canRead = true

//     function hasRight () {
//       if (role === 'visitor') {
//         const secret = doc.secret
//         const uid = req.userDoc ? req.userDoc._id : null

//         // 如果不是公开的，要判断权限，需要uid
//         if (secret !== 'public' && !uid) return false

//         if (secret === 'private') return false

//         if (secret === 'followed') {

//         }

//         if (secret === 'some') {

//         }
//       }

//       return true
//     }

//     canRead = hasRight()

//     // owner
//     return canRead ? doc : Promise.reject({
//       code: -1,
//       status: 422,
//       msg: '无权限访问'
//     })
//   },
//   "post:save": req => () => {

//   },
//   "post:publish": req => () => {}
// }

// const roleCondition = async req => {
//   const aid = Types.ObjectId(req.params.aid) // article_id
//   const uid = req.userDoc ? req.userDoc._id : null

//   return uid &&
//     doc.uid.toString() === await articleModel.findById(aid).toString()
//     ? 'owner' : 'visitor'
// }

// router.use('/api/article/a/:aid', auth(), rbac, action(executions, roleCondition))

export default router
