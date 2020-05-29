export default ({
  app,
  store
}) => {
  app.router.beforeEach(async (to, from, next) => {
    const toPath = to.path
    const fromPath = from.path
    if (
      ['/write', '/profile', '/space/profile'].includes(fromPath) &&
      store.state.notSave
    ) {
      const isLeave = confirm('内容未保存，是否离开该页面？')
      isLeave ? next() : next(false)
    } else {
      store.dispatch('setNotSave', false)
      next()
    }
  })
  app.router.beforeEach((to, from ,next) => {
    next()
  })
}
