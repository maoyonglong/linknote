export const state = () => ({
  uid: null,
  avatar: '/avatar.jpg',
  pname: '用户xxx',
  notSave: true
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
  async nuxtServerInit ({ dispatch  }, { req, $axios }) {
    const uid = req.session.uid

    if (!uid) return

    dispatch('setUid', uid)

    const profile = await $axios.get('/api/profile/self')
    const result = profile.data.result
    dispatch('setPname', result.pname)
    dispatch('setAvatar', result.avatar)
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
  }
}
