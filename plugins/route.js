export default ({
  app,
  route,
  redirect,
  store
}) => {
  app.router.beforeEach((to, from, next) => {
    const toPath = to.path
    const fromPath = from.path
    if (['/write', '/profile', '/space/profile'].includes(fromPath)) {
      if (store.state.notSave) {
        const isLeave = confirm('内容未保存，是否离开该页面？')
        isLeave ? next() : next(false)
      }
    } else {
      next()
    }
  })
  app.router.beforeEach((to, from ,next) => {
    console.log(to.path, from.path)
    next()
  })
}
