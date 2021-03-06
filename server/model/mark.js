import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  // 文章id
  article_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
})

export default model('mark', schema)
