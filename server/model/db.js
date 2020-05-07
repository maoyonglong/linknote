import mongoose from 'mongoose'
import DBError from './err'

mongoose.connect('mongodb://localhost:27017/linknote', {
  useNewUrlParser: true
})
.then(() => {
  console.log('链接成功')
}).catch(err => {
  const dbErr = new DBError(err)
  console.log(dbErr)
})
