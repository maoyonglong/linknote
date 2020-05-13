<template>
  <div class="page">
    <Spin v-if="loading" fix size="large"></Spin>
    <main v-else>
      <h1 class="title">个人信息填写</h1>
      <slot name="tip"></slot>
      <Form ref="formData" class="form" :model="formData" :rules="rules" :label-width="80">
        <div @click="onBlur">
        <Row>
          <Col span="15">
            <FormItem label="昵称" prop="pname">
              <edit-span
                style="max-width: 120px;"
                :state="editSpanState"
                :text="formData.pname"
                :id="0"
                @update:state="onUpdateState"
              >
                <Input
                  :maxlength="10"
                  v-model="formData.pname"
                  placeholder="请输入昵称"
                  ref="input0"
                ></Input>
              </edit-span>
            </FormItem>
            <FormItem label="性别" prop="sex">
              <edit-span
                :state="editSpanState"
                :text="formData.sex"
                @update:state="onUpdateState"
              >
                <RadioGroup v-model="formData.sex">
                  <Radio label="男">
                      <span>男</span>
                  </Radio>
                  <Radio label="女">
                      <span>女</span>
                  </Radio>
                </RadioGroup>
              </edit-span>
            </FormItem>
            <FormItem label="生日" prop="birthday">
              <edit-span
                style="max-width: 140px;"
                :state="editSpanState"
                :text="formatedDate"
                :id="1"
                @update:state="onUpdateState"
              >
                <DatePicker
                  type="date"
                  placeholder="选择日期"
                  v-model="formData.birthday"
                  ref="input1"
                ></DatePicker>
              </edit-span>
            </FormItem>
          </Col>
          <Col span="9">
            <Upload
              v-show="false"
              :action="action"
              :before-upload="handleUpload"
              accept="image/*"
            >
            </Upload>
            <div class="avatar-wrap">
              <img :src="option.img" alt="avatar">
              <Button type="primary" @click="handleAvatarClick" v-if="!editSpanState">
                <Icon type="md-cloud-upload" />
                上传头像
              </Button>
            </div>
          </Col>
        </Row>
        <FormItem label="邮箱" prop="email">
          <edit-span
            style="max-width: 200px;"
            :state="editSpanState"
            :text="formData.email"
            :id="2"
            @update:state="onUpdateState"
          >
            <Input
              type="email"
              v-model="formData.email"
              placeholder="请输入邮箱"
              ref="input2"
            ></Input>
          </edit-span>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <edit-span
            style="max-width: 200px;"
            :state="editSpanState"
            :text="formData.phone"
            :id="3"
            @update:state="onUpdateState"
          >
            <Input
              :maxlength="11"
              type="tel"
              v-model="formData.phone"
              placeholder="请输入手机号码"
              ref="input3"
            ></Input>
          </edit-span>
        </FormItem>
        <FormItem label="城市" prop="city">
          <edit-span
            style="max-width: 120px;"
            :state="editSpanState"
            :text="formatedCity"
            :id="4"
            @update:state="onUpdateState"
          >
            <Cascader
              :data="cities"
              v-model="formData.city"
              ref="input4"
            ></Cascader>
         </edit-span>
        </FormItem>
        <FormItem label="保密" prop="privacy">
          <edit-span
            :state="editSpanState"
            :text="formData.privacy ? '保密' : '公开'"
            @update:state="onUpdateState"
          >
            <i-switch v-model="formData.privacy" size="large">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
          </edit-span>
        </FormItem>
        <FormItem label="个人介绍" prop="intro">
          <edit-span
            :state="editSpanState"
            :text="formData.intro"
            :id="5"
            @update:state="onUpdateState"
          >
            <Input
              type="textarea"
              v-model="formData.intro"
              placeholder="请输入个人介绍"
              show-word-limit
              :maxlength="100"
              ref="input5"
            ></Input>
          </edit-span>
        </FormItem>
        </div>
        <FormItem>
          <!-- button slot -->
          <slot></slot>
        </FormItem>
      </Form>
    </main>
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
  </div>
</template>
<script>
import cities from '~/assets/scripts/cities'
import EditSpan from './EditSpan'
import dateFormat from 'dateFormat'

export default {
  components: {
    EditSpan
  },
  props: {
    editSpanState: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formData: {
        pname: '',
        sex: '男',
        birthday: new Date(),
        email: null,
        phone: null,
        city: [],
        privacy: false,
        intro: null
      },
      action: '/uploads/images',
      cropAvatar: false,
      loading: true,
      cities,
      option: {
        img: '/avatar.png', // 裁剪图片的地址
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
        privacy: [
          { required: true }
        ]
      }
    }
  },
  computed: {
    formatedDate () {
      return dateFormat(this.formData.birthday, 'yyyy-mm-dd')
    },
    formatedCity () {
      return this.formData.city.join('/')
    }
  },
  methods: {
    onBlur (event) {
      const target = event.target
      const formElsClassName = [
        'ivu-input',
        'ivu-radio-input',
        'ivu-switch',
        'ivu-btn',
        'ivu-upload-input'
      ]
      if (
        !this.editSpanState &&
        !formElsClassName.some(name => target.classList.contains(name)) &&
        target.nodeName !== 'SPAN'
      ) {
        this.$emit('blur')
      }
    },
    onUpdateState ({ state, id }) {
      // 先改变，再获取ref
      this.$emit('update:editSpanState', state)
      if (!state) {
        this.$nextTick(() => {
          this.$refs['input' + id].focus()
        })
      }
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            resolve(this.$data)
          } else {
            reject(this.$data)
          }
        })
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
          const avatar = data.result
          this.option.img = avatar
          this.$store.dispatch('setAvatar', avatar)
          // update avatar
          return this.$axios({
            url: '/api/profile/avatar/update',
            method: 'post',
            data: {avatar}
          })
        } else {

        }
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.refs = this.$refs
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.avatar-wrap {
width: 100px;
height: 100px;
}
.cropper-wrap {
  width: 500px;
  height: 300px;
  img {
    width: auto;
  }
}
</style>
