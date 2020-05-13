import redis from 'redis'
import {promisify} from 'util'

const client = redis.createClient()

client.on('error', err => {
  console.log(err)
})

// const methods = [
//   'set',
//   'get',
//   'lpush',
//   'lrange'
// ]

// methods.forEach(method => {
//   const originMethod = client[method]
//   const promisifiedMethod = promisify(originMethod)
//   client[method] = function () {
//     return promisifiedMethod.apply(this, arguments)
//   }
// })

export default client
