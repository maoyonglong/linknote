import _ from 'lodash'

const list = [
  {
    url: '/profile',
    method: 'post',
    body: {
      action: 'delete'
    },
    roles: ['admin'] // 可以是函数
  }
]

// ordinary list
list.unshift.apply(list, [
  {
    url: '/profile',
    method: 'get'
  }
])

function compare(t, s) {
  let match = true

  for (let [key, val] of Object.entries(s)) {
    if (!match) break

    // filter especial keys
    if (key === 'method' && req.method.toLowerCase() !== val) {
      match = false
      break
    }
    if (key === 'roles') continue

    if (_.isPlainObject(val)) {
      compare(t[key], val)
    } else {
      match = t === val
    }
  }

  return match
}

export default (req, res, next) => {
  // const role = req.useDoc ? req.useDoc.role : req.role
  // let match = false

  // if (!role) next()

  // try {
  //   list.forEach(accessList => {
  //     const roles = accessList.roles

  //     match = (
  //       !roles ||
  //       (_.isArray(roles) && roles.indexOf(role) >= 0) ||
  //       (_.isFunction(roles) && roles(role))
  //     ) && compare(req, accessList)

  //     if (match) {
  //       throw new Error('找到匹配结果，提前退出循环')
  //     }
  //   })
  // } catch (err) {
  //   // 提前退出循环
  // }

  // if (!match) {
  //   res.status(422).send({
  //     code: -1,
  //     msg: '无权访问'
  //   })
  // } else {
  //   next()
  // }
}
