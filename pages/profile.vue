<template>
  <v-profile class="profile" :editSpanState="false" ref="profile">
    <Button type="primary" @click="handleSubmit()">提交</Button>
  </v-profile>
</template>
<script>
import VProfile from '~/components/profile'

export default {
  components: {
    VProfile
  },
  methods: {
    async handleSubmit () {
      this.$refs.profile.validate()
        .then(childData => {
          childData.loading = true
          this.$axios({
            method: 'post',
            url: '/api/profile/add',
            data: {
              avatar: childData.option.img,
              ...childData.formData,
              city: childData.formData.city.join('/')
            }
          }).then(res => {
            const data = res.data
            if (data.code === 0) {
              this.$Message.success({
                content: '提交成功！',
                onClose: () => {
                  this.$store.dispatch('setNotSave', false)
                  // this.$router.push('/')
                  window.location.href = '/'
                }
              })
            } else {
              this.$Message.error(data.msg + '\n' + data.err.message)
            }
          }).catch(err => {
            this.$Message.error(err.message)
          }).finally(() => {
            childData.loading = false
          })
        }).catch(() => {
          this.$Message.error('表单填写格式有误！')
        })
    }
  },
  mounted () {
    this.$store.dispatch('setNotSave', true)
  }
}
</script>

<style lang="scss" scoped>
.profile {
  width: 60%;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
