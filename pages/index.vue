<template>
  <div class="wrap">
    <v-header></v-header>
    <div>
      <logo />
      <h2 class="subtitle">
        欢迎使用林克笔记
      </h2>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VHeader from '~/components/Header'

let errorTip = null

export default {
  layout: 'default',
  components: {
    Logo,
    VHeader
  },
  mounted () {
    if (this.errorTip) {
      this.$Message.error(errorTip)
      return
    }
    console.log(this.$store.getters.isLogin)
    if (this.$store.getters.isLogin && this.$store.state.pname === '用户xxx') {
      this.$axios.get('/api/profile/self')
        .then(res => {
          const data = res.data
          if (data.code === 0) {
            const result = data.result
            this.$store.dispatch('setPname', result.pname)
            this.$store.dispatch('setAvatar', result.avatar)
          }
        })

    }
  }
}
</script>

<style scoped>
.wrap {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>
