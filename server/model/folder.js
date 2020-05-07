import './db'
import {Schema, model} from 'mongoose'

const schema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
})

export default model('folder', schema)
