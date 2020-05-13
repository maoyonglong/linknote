<template>
  <v-profile
    :editSpanState.sync="sure"
    @blur="onExcuteBtn"
    ref="profile"
  >
    <h3 slot="tip">
      双击文本值可以快速进入编辑状态！<br />
      点击输入框外可以快速保存修改！
    </h3>
    <Button
      type="primary"
      @click="onExcuteBtn"
    >
      {{!sure ? '确定' : '修改'}}
    </Button>
    <Button
      v-if="!sure"
      @click="cancel"
    >取消</Button>
  </v-profile>
</template>

<script>
import VProfile from '~/components/profile'

export default {
  components: {
    VProfile
  },
  mounted () {
    this.$axios.get('/api/profile/self')
      .then(res => {
        const data = res.data

        if (data.code === 0) {
          const result = data.result
          const childData = this.$refs.profile.$data
          result.city = result.city.split('/')
          childData.option.img = result.avatar
          delete result.avatar
          childData.formData = result
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
  },
  data () {
    return {
      sure: true
    }
  },
  methods: {
    onExcuteBtn () {
      this.sure = !this.sure
      if (this.sure) {
        this.$refs.profile.validate()
          .then(childData => {
            childData.loading = true
            this.$axios({
              url: '/api/profile/update',
              method: 'post',
              data: {
                avatar: childData.option.img,
                ...childData.formData,
                city: childData.formData.city.join('/')
              }
            }).then(res => {
                const data = res.data
                if (data.code === 0) {
                  this.$Message.success(data.msg)
                } else {
                  this.$Message.error(data.err.message)
                }
              }).catch(err => {
                this.$Message.error(err.message)
              }).finally(() => {
                childData.loading = false
              })
          }).catch(() => {
            this.$Message.error('表单填写错误！')
          })
      }
    },
    cancel () {
      this.sure = true
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 20px;
  color: #ed4014;
}
</style>
