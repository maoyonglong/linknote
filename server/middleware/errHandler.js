export default (err, req, res, next) => {
  if (err) {
    res.send({
      code: -1,
      msg: '服务器错误！操作失败！',
      err
    })
  }

  next(err)
}
