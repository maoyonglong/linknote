<template>
  <div class="wrap">
    <v-header></v-header>
    <div>
      <logo />
      <h2 class="subtitle">
        欢迎使用林克笔记
      </h2>
      <Button
        type="primary"
        size="large"
        style="font-size: 20px;"
        @click="onStart"
        @mouseover.native="onStartBtnOver()"
        @mouseout.native="onStartBtnOut()"
      >
        <span>开始使用</span>
        <Icon :class="['arrow', {active: isStartBtnOver}]" type="md-arrow-round-forward" style="margin-left: 10px" size="24"/>
      </Button>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VHeader from '~/components/Header'

export default {
  layout: 'default',
  components: {
    Logo,
    VHeader
  },
  data () {
    return {
      isStartBtnOver: false
    }
  },
  methods: {
    onStart () {
      if (this.$store.getters.isLogin) {
        this.$router.push('/write')
      } else {
        this.$router.push('/login')
      }
    },
    onStartBtnOver () {
      this.isStartBtnOver = true
    },
    onStartBtnOut () {
      this.isStartBtnOver = false
    }
  },
  mounted () {
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

<style lang="scss" scoped>
/deep/ .ivu-btn > span {
  display: flex;
  align-items: center;
}
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
  font-style: italic;
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
.arrow {
  transition: all 200ms;
  &.active {
    transform: translateX(10px);
  }
}
</style>
