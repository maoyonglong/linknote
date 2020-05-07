<template>
  <div class="page">
    <h1 class="title">个人信息填写</h1>
    <Form ref="formData" class="form" :model="formData" :rules="rules" :label-width="80">
      <Row>
        <Col span="20">
          <FormItem label="昵称" prop="pname">
            <Input v-model="formData.pname" placeholder="请输入昵称"></Input>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formData.sex">
              <Radio label="boy">
                  <span>男</span>
              </Radio>
              <Radio label="gril">
                  <span>女</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="生日" prop="birthday">
            <DatePicker type="date" placeholder="选择日期" v-model="formData.birthday"></DatePicker>
          </FormItem>
        </Col>
        <Col span="4">
          <Upload
            v-show="false"
            :action="action"
            :before-upload="handleUpload"
            accept="image/*"
          >
          </Upload>
          <div class="avatar-wrap" @click="handleAvatarClick">
            <img :src="option.img" alt="avatar">
          </div>
        </Col>
      </Row>
      <FormItem label="邮箱" prop="email">
        <Input type="email" v-model="formData.email" placeholder="请输入邮箱"></Input>
      </FormItem>
      <FormItem label="手机号码" prop="phone">
        <Input type="text" v-model="formData.phone" placeholder="请输入手机号码"></Input>
      </FormItem>
      <FormItem label="城市" prop="city">
        <Cascader :data="cities" v-model="formData.city"></Cascader>
      </FormItem>
      <FormItem label="保密" prop="private">
        <i-switch v-model="formData.private" size="large">
          <span slot="open">On</span>
          <span slot="close">Off</span>
        </i-switch>
      </FormItem>
      <FormItem label="个人介绍" prop="intro">
        <Input type="textarea" v-model="formData.intro" placeholder="请输入个人介绍" show-word-limit :maxlength="100"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formData')">提交</Button>
      </FormItem>
    </Form>
    <Modal
      v-model="cropAvatar"
      :mask="true"
      @on-ok="modalOk"
    >
      <div class="cropper-wrap">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :centerBox="option.centerBox"
          :high="option.high"
          :infoTrue="option.infoTrue"
          :enlarge="option.enlarge"
        ></vueCropper>
      </div>
    </Modal>
    <Spin v-if="loading" fix size="large"></Spin>
  </div>
</template>
<script>
import cities from './cities'

export default {
  data () {
    return {
      formData: {
        pname: '',
        sex: 'boy',
        birthday: new Date(),
        email: '',
        phone: '',
        city: [],
        private: false,
        intro: ''
      },
      action: '/uploads/images',
      cropAvatar: false,
      loading: false,
      cities,
      option: {
        img: 'avatar.png', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        canMove: true,
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 100, // 默认生成截图框宽度
        autoCropHeight: 100, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [25, 6], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: 'cover',    // cover  图片铺满容器
      },
      file: '',
      rules: {
        pname: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          {
            message: '用户名已存在',
            validator: (rule, value) => {
              return true
            }
          }
        ],
        sex: [
          { required: true }
        ],
        birthday: [
          { required: true }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
          {
            message: '邮箱已存在',
            validator: (rule, value) => {
              return true
            }
          }
        ],
        private: [
          { required: true }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$axios({
            method: 'post',
            url: '/api/profile',
            action: 'add',
            avatar: this.option.img,
            ...this.formData
          }).then(res => {
            const data = res.data
            if (data.code === 0) {
              this.$Message.success({
                content: '提交成功！',
                onClose: () => {
                  this.$router.push('/')
                }
              })
            }
          }).catch(err => {

          }).finally(() => {
            this.loading = false
          })
        } else {
          this.$Message.error('表单填写格式有误！')
        }
      })
    },
    file2base64(file){
      var reader = new FileReader()
      reader.readAsDataURL(file)
      var self = this
      reader.onload = function (e) {
        // 图片base64化
        let newUrl = this.result    //图片路径
        self.$nextTick(() => {
          self.pageImage = newUrl
          self.option.img = newUrl
          self.dialogVisible = true
        })
      }
    },
    handleAvatarClick () {
      const fileInput = document.querySelector('input[accept="image/*"]')
      fileInput.click()
    },
    handleUpload (file) {
      return new Promise(resolve => {
        this.cropAvatar = true
        const reader = new FileReader
        reader.onload = (evt) => {
          const image = new Image()
          image.onload = function () {
            const width = this.width
            const height = this.height
            if (whenReady) whenReady(width, height)
          }
          this.option.img = evt.target.result
        }
        reader.readAsDataURL(file)
      })
    },
    modalOk () {
      const fd = new FormData()
      const blobPromise = new Promise(resolve => {
        this.$refs.cropper.getCropBlob(data => {
          resolve(data)
        })
      })
      blobPromise.then(data => {
        fd.append('img', data, 'avatar.png')
        this.loading = true

        return this.$axios({
          method: 'post',
          url: this.action,
          data: fd,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.option.img = data.result
          this.$Message.success(data.msg)
        } else {
          return Promise.reject(data)
        }
      }).catch(err => {
        this.$Message.error(err.msg)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 960px;
  margin: 0 auto;
}
.avatar-wrap {
  width: 100px;
  height: 100px;
  margin-left: 50px;
}
.cropper-wrap {
  width: 500px;
  height: 300px;
  img {
    width: auto;
  }
}
</style>
