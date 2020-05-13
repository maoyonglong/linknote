import jwt from 'jsonwebtoken'
import {SECRET} from '../config'
import redisClient from '../redis/client'

export default isCheck => async (req, res, next) => {
  // const token = req.headers.authorization.split(' ').pop()
  // let userDoc

  // if (token) {
  //   const uidStr = jwt.verify(token, SECRET).id
  //   userDoc = redisClient.get(uidStr)
  // }

  // if (userDoc) {
  //   req.userDoc = userDoc
  //   next()
  // } else if (isCheck) {
  //   res.redirect('/login')
  // } else {
  //   req.role = 'ordinary'
  //   next()
  // }
  next()
}
