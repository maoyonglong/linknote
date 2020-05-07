import {Router} from 'express'
import {UPLOAD_ROOT} from '../config'
import fs from 'fs-extra'
import path from 'path'
import multer from 'multer'
import auth from '../middleware/auth'

const router = new Router()

const filename = async (req, file, cb) => {
  const fileName = file.fieldname + '-' + new Date().getTime() + path.extname(file.originalname)
  cb(null, fileName)
}

const genDest = subDirCb => async (req, file, cb) => {
  try {
    const dir = path.join(UPLOAD_ROOT, subDirCb(req, file))
    console.log(dir)
    await fs.ensureDir(dir)
    cb(null, dir)
  } catch (err) {
    cb(err)
  }
}

const imageUploader = multer({
  storage: multer.diskStorage({
    filename,
    destination: genDest(() => 'images')
  }),
  fileFilter (req, file, cb) {
    let ext = path.extname(file.originalname);
    let extArr = ['.jpg', '.jpeg', '.gif', '.png'];
    if (!extArr.includes(ext)) {
      cb(new Error('扩展名不正确'))
    }

    cb(null, true);
  }
})

router.post('/uploads/images', imageUploader.single('img'), (req, res) => {
  res.send({
    code: 0,
    msg: '上传图片成功',
    result: req.file.path
  });
})

export default router
