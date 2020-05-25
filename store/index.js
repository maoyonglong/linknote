export const state = () => ({
  uid: null,
  avatar: '/avatar.png',
  pname: '用户xxx',
  notSave: false
})

export const getters = {
  isLogin (state) {
    return !!state.uid
  }
}

export const actions = {
  setUid ({commit}, payload) {
    commit('setUid', payload)
  },
  setAvatar ({commit}, payload) {
    commit('setAvatar', payload)
  },
  setPname ({commit}, payload) {
    commit('setPname', payload)
  },
  setNotSave ({commit}, payload) {
    commit('setNotSave', payload)
  },
  logout ({commit}) {
    commit('logout')
  },
  async nuxtServerInit ({ dispatch  }, { req, $axios }) {
    const uid = req.session.uid
    if (!uid) return

    dispatch('setUid', uid)

    try {
      const profile = await $axios.get('/api/profile/self')
      const result = profile.data.result
      dispatch('setPname', result.pname)
      dispatch('setAvatar', result.avatar)
    } catch (err) {}
  }
}

export const mutations = {
  setUid (state, payload) {
    state.uid = payload
  },
  setAvatar (state, payload) {
    state.avatar = payload
  },
  setPname (state, payload) {
    state.pname = payload
  },
  setNotSave (state, payload) {
    state.notSave = payload
  },
  logout (state) {
    state.uid = null,
    state.avatar = '/avatar.png',
    state.pname = '用户xxx',
    state.notSave = false
  }
}
