import Cookies from 'js-cookie'
import {local} from 'store2'

export default function ({ $axios }) {
  $axios.onRequest(config => {
    const token = Cookies.get('USER_TOKEN')
    if (token) {
      $axios.setToken(`berear ${token}`)
    } else {
      const uname = local.get('uname')
      const pwd = local.get('pwd')
      if (uname && pwd) {
        config.method = 'post'
        config.url = '/api/login'
        config.uname = uname
        config.pwd = pwd
        return Promise.resolve(config)
      }
    }
    return Promise.resolve(config)
  })
}
