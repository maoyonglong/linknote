import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 昵称(pick name)
  pname: {
    type: String,
    required: true
  },
  // 性别
  sex: {
    type: String,
    enum: ['boy', 'gril'],
    required: true
  },
  // 头像
  avatar: {
    type: String,
    default: '/static/avatar.png'
  },
  city: {
    type: String,
    required: true
  },
  // 个人介绍
  intro: {
    type: String,
    default: '这个人没有留下任何个人介绍...'
  },
  phone: {
    type: String,
    default: ''
  },
  birthday: {
    type: Date,
    default: null
  },
  email: {
    type: String,
    required: true,
    match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  },
  // 是否保密
  private: {
    type: Boolean,
    default: true
  },
  // 关注
  following: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  // 粉丝
  followed: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

export default model('profile', schema)
