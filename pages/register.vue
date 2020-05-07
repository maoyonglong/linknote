<template>
  <div>
    <Form ref="formData" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="用户名" prop="uname">
        <Input v-model="formData.uname" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem label="密码" prop="pwd">
        <Input type="password" v-model="formData.pwd" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="userPwd">
        <Input type="password" v-model="formData.userPwd" placeholder="请再次输入密码"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formData')">注册</Button>
      </FormItem>
    </Form>
    <Spin v-if="loading" fix size="large"></Spin>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        uname: '',
        pwd: '',
        userPwd: ''
      },
      loading: false,
      rules: {
        uname: [
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
        ],
        userPwd: [
          {
            required: true,
            message: '密码不一致',
            trigger: 'blur',
            validator: (rule, val) => {
              return val === this.formData.pwd
            }
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'post',
            url: '/api/register',
            ...this.formData
          }).then(res => {
              if (res.code === 0) {
                this.$Message.success({
                  content: '注册成功！',
                  onClose: () => {
                    const uid = res.data.result
                    this.$router.push({
                      path: '/profile',
                      query: {
                        uid
                      }
                    })
                  }
                })
              } else {
                this.$Message.error('注册失败！')
              }
            }).catch(err => {
              this.$Message.error(err.message)
            })
        } else {
          this.$Message.error('表单填写格式有误！')
        }
      })
    }
  }
}
</script>
