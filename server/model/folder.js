import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  privacy: {
    type: Boolean,
    default: false
  }
})

export default model('folder', schema)
