export default (req, res, next) => {
  if (req.userDoc.role === 'admin') {
    next()
  }
  res.send({
    code: -1,
    msg: '无权限访问！',
    err: new Error('no right.')
  }).end()
}
