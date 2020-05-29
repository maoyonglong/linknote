import aclPromise from '../acl'
import {NEED_LOGIN, ACL_CONFIG, NOT_NEED_LOGIN} from '../config'

let aclResources = []
ACL_CONFIG.forEach(conf => {
  const allows = conf.allows
  allows.forEach(allow => {
    aclResources = aclResources.concat(allow.resources)
  })
})

export default function auth () {
  return async function (req, res, next) {
    const acl = await aclPromise
    let resource = req.path
    const uidStr = req.session && req.session.uid ? req.session.uid : null

    // 用户未登陆时，过滤掉需要登陆的资源
    if (uidStr === null) {
      if (NEED_LOGIN.some(reStr => new RegExp(reStr).test(resource))) {
        return res.send({
          code: -1,
          msg: '用户未授权访问',
          err: new Error('no right.')
        })
      } else {
        return next()
      }
    }

    if (!await acl.hasRole(uidStr, req.session.role)) {
      console.log(req.session.role)
      await acl.addUserRoles(uidStr, req.session.role)
    }

    if (NOT_NEED_LOGIN.some(reStr => new RegExp(reStr).test(resource))) {
      return next()
    }

    // 如果不在资源限制中，直接通过
    if (aclResources.indexOf(resource) < 0) {
      return next()
    }

    if (req.route) {
      resource = resource + req.route.path
    }

    // 容错 如果访问的是 /admin/sign/ 后面为 /符号认定也为过
    if (resource[resource.length - 1] === '/') {
      resource = resource.slice(0, -1)
    }

    // 如果访问的首页，是''
    if (resource === '') {
      resource = '/'
    }

    let isAdmin = await acl.hasRole(uidStr, 'admin')

    if (isAdmin) {
      return next()
    }

    console.log(resource, req.method)

    let isAllowed = await acl.isAllowed(uidStr, resource, req.method.toLowerCase())

    if (!isAllowed) {
      return res.send({
        code: -1,
        msg: '用户未授权访问',
        err: new Error('no right.')
      })
    }
    next()
  }
}
