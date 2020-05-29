export default async function ({ req, store }) {
  const uidStr = req ? req.session.uid : null
  if (
    uidStr &&
    store.state.uid
  ) {
    const dispatch = store.dispatch
    dispatch('setUid', uidStr)
    try {
      const profile = await $axios.get('/api/profile/self')
      const result = profile.data.result
      dispatch('setPname', result.pname)
      dispatch('setAvatar', result.avatar)
    } catch (err) {}
  }
}
