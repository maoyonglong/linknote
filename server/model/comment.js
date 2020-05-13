import {Schema} from 'mongoose'
const schema = new Schema({
  // 评论用户id
  uid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 文章id
  article_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 内容
  content: {
    type: String,
    required: true,
    validate (content) {
      return content !== ''
    }
  },
  // 日期
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('comment', schema)
