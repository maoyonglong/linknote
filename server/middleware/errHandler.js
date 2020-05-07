export default (err, req, res, next) => {
  if (err) {
    console.log(err)
  }

  next(err)
}
