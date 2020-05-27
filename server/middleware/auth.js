import aclPromise from '../acl'
import {NEED_LOGIN, ACL_CONFIG} from '../config'

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

    console.log(uidStr)

    // 用户未登陆时，过滤掉需要登陆的资源
    if (uidStr === null) {
      if (NEED_LOGIN.some(path => resource === path)) {
        return res.send({
          code: -1,
          msg: '用户未授权访问',
          err: new Error('no right.')
        })
      } else {
        return next()
      }
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

    let isAdmin = await acl.hasRole(uidStr, 'admin')

    if (isAdmin) {
      return next()
    }

    let isAllowed = await acl.isAllowed(uidStr, resource, req.method.toLowerCase())
    console.log(isAllowed)

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
