import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  /**
   * 文件夹id
   */
  folder_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  /**
   * 引用的资源（图片）
   */
  assets: {
    type: Array,
    default: []
  },
  // 文章标签
  tag: {
    type: String,
    default: ''
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
    default: ''
  },
  // 日期
  date: {
    type: Date,
    default: new Date()
  },
  // 是否发布
  publish: {
    type: Boolean,
    default: false
  },
  privacy: {
    type: Boolean,
    default: false
  },
  // 保密密钥（对含密钥的人公开，只有secret为some时，才生效）
  secret: {
    type: String,
    default: ''
  }
})

export default model('aritcle', schema)
