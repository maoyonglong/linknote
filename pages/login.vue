<template>
  <div id="page" class="page">
    <main class="page-center" v-show="finished">
      <h1 class="title">登陆</h1>
      <Form class="form" ref="formData" :model="formData" :rules="rules" :label-width="80">
        <FormItem label="用户名" prop="uname">
          <Input v-model="formData.uname" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="pwd">
          <Input type="password" v-model="formData.pwd" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formData')">登陆</Button>
        </FormItem>
      </Form>
    </main>
  </div>
</template>
<script>
import { fullPage } from './util'
import Cookie from 'js-cookie'

export default {
  data () {
    return {
      formData: {
        uname: '',
        pwd: ''
      },
      rules: {
        uname: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '密码长度在6-12个字符之间',
            trigger: 'blur'
          }
        ]
      },
      finished: false
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/login', this.formData)
            .then(res => {
              if (res.data.code === 0) {
                Cookie.set('USER_TOKEN', res.data.result)
                this.$Message.success(res.data.msg)
                return Promise.resolve()
              }
            }).then(() => {
              this.$router.push('/')
            }).catch(err => {
              this.$Message.error(err.message)
            })
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    }
  },
  mounted () {
    fullPage()
    this.finished = true
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  background-color: $bgColor;
}

.title {
  padding: 20px;
  text-align: center;
}

.page-center {
  position: absolute;
  width: 400px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 2px $shadowColor;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}

.form {
  padding-right: 20px;
}
</style>
