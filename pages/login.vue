<template>
  <div>
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
    <Spin size="large" v-if="loading" fix></Spin>
  </div>
</template>
<script>
import Cookie from 'js-cookie'

export default {
  layout: 'centerForm',
  data () {
    return {
      loading: true,
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
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
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
            }).finally(() => {
              this.loading = false
            })
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    }
  },
  beforeMount () {
    window.addEventListener('load', () => {
      this.loading = false
    })
  }
}
</script>
