import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  /**
   * 文件夹id
   */
  folder_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 文章标签
  tag: {
    type: String,
    required: true
  },
  // 文章类型（markdown/htmlstring）
  doctype: {
    type: String,
    enum: ['md', 'html']
  },
  // 文章标题
  title: {
    type: String,
    required: true
  },
  // 文章内容
  content: {
    type: String,
    required: true
  },
  // 日期
  date: {
    type: Date,
    default: Date.now
  },
  // 是否发布
  publish: {
    type: Boolean,
    default: false
  },
  // 保密等级
  secret: {
    type: String,
    default: 'private',
    enum: [
      'public',
      'private',
      'followed',
      'some'
    ]
  },
  // 保密密钥（对含密钥的人公开，只有secret为some时，才生效）
  secret_key: {
    type: String,
    default: ''
  }
})

export default model('aritcle', schema)
