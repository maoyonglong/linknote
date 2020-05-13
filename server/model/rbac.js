import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  // 用户id
  uid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 角色
  role: {
    type: String,
    default: 'ordinary',
    enum: [
      'ordinary',
      'admin'
    ]
  }
})

export default model('rbac', schema)
