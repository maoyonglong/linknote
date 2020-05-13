/**
 * 通过token判断访问状态
 * 通过维护数据库的rbac表来判断是否能访问资源
 * auth + acl
 * req.auth -> 保存登陆用户在用户表的信息
 * req.rbac -> 标记用户的登记状态
 */
import passport from 'passport'
import bcrypt from 'bcrypt'
import localStrategy from 'passport-local'

const LocalStrategy = localStrategy.Strategy

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }
}

const saltRounds = 10
