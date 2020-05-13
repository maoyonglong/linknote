import './db'
import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
  // 用户名
  uname: {
    type: String,
    unique: true
  },
  // 密码
  pwd: {
    type: String,
    required: true,
    set (val) {
      return bcrypt.hashSync(val, 10)
    }
  },
  // 是否激活
  activation: {
    type: Boolean,
    default: false
  }
})

export default model('user', schema)
