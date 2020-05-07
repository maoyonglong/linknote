export function action(executions, roleCondition, success) {
  return async (req, res, next) => {
    // get action
    let action = 'get'
    let role = 'visitor'

    if (roleCondition) {
      role = await roleCondition(req)
      // 判断是否是管理员
      if (req.userDoc && req.userDoc.role === 'admin') {
        role = 'admin'
      }
    }

    if (
      req.method.toLowerCase() !== 'get' &&
      action.body.action
    ) {
      action = req.body.action.toLowerCase()
    }

    // method:action
    let execution = executions[`${req.method.toLowerCase()}:${action}`]

    if (execution) {
      try {
        let doc = await execution(req, role)

        if (success) {
          success(req, res, role)
        } else {
          res.send({
            code: 0,
            msg: '操作成功',
            result: {
              result: doc,
              role
            }
          })
        }
      } catch (err) {
        if (err.code) {
          res.status(err.status).send(err)
        } else {
          next(err)
        }
      }
    }
  }
}

export function uploadImg () {

}
