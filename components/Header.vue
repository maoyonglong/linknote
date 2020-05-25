<template>
  <header class="header flex center-vert">
    <div class="container flex">
      <nuxt-link class="archor link" to="/">首页</nuxt-link>
      <!-- <nuxt-link class="archor link" to="#">发现</nuxt-link> -->
      <a class="archor link" @click="$Modal.info({
        title: '提示',
        content: '该功能暂未实现！'
      })">发现</a>
      <div class="flex center-vert" v-if="isLogin">
        <div
          class="avatar-wrap archor flex center-vert"
          :style="{'backgroundColor': avatarListVisible ? '#f9f9f9' : 'transparent', 'display': 'flex'}"
          @mouseenter="showAvatarList"
          @mouseleave="hideAvatarList"
          @click="toSpace"
        >
          <img class="avatar" :src="avatar" :alt="pname">
          <Icon type="md-arrow-dropdown" />
          <ul class="absolute avatar-list" v-show="avatarListVisible">
            <li><nuxt-link class="archor" to="/space" @click.native.stop>个人中心</nuxt-link></li>
            <li @click.stop="changeUser"><span class="archor">切换账号</span></li>
            <li @click.stop="logout"><span class="archor">退出</span></li>
          </ul>
        </div>
        <Button type="info" class="write-btn" @click="toWrite">写笔记</Button>
      </div>

      <div v-else class="flex">
        <nuxt-link class="archor" to="/login">登陆</nuxt-link>
        <nuxt-link class="archor" to="/register">注册</nuxt-link>
      </div>
    </div>
    <Spin v-if="loading" fix size="large"></Spin>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    isLogin () {
      return this.$store.getters.isLogin
    },
    ...mapState([
      'avatar',
      'pname'
    ])
  },
  data () {
    return {
      avatarListVisible: false,
      loading: false
    }
  },
  methods: {
    logoutFn () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post('/api/logout')
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success({
                content: '退出成功！',
                onClose: () => {
                  this.$store.dispatch('logout')
                  resolve()
                }
              })
            } else {
              reject()
            }
          }).catch(err => {
            this.$Message.error(err.msg)
          }).finally(() => {
            this.loading = false
          })
        })
    },
    logout () {
      this.logoutFn()
        .then(() => {
          this.$router.replace('/')
        }).catch(() => {
          this.$Message.error('退出失败！')
        })
    },
    changeUser () {
      this.logoutFn()
        .then(() => {
          this.$router.replace('/login')
        }).catch(() => {
          this.$Message.error('退出失败！')
        })
    },
    toWrite () {
      this.$router.push('/write')
    },
    toSpace () {
      this.$router.push('/space/profile')
    },
    showAvatarList () {
      this.avatarListVisible = true
    },
    hideAvatarList () {
      this.avatarListVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  .container {
    justify-content: flex-end;
  }
  .archor {
    height: 100%;
    color: $textColor;
    font-size: 14px;
    margin-right: 20px;
    &:hover {
      color: $activeColor;
    }
  }
  .avatar {
    width: 40px;
    height: 40px;
    &-wrap {
      padding: 0 10px;
      position: relative;
      margin-right: 10px;
    }
  }
}
.write-btn {
  margin-left: 20px;
}
.avatar-list {
  top: 60px;
  left: 0;
  background-color: #f9f9f9;
  box-shadow: 0 0 1px $shadowColor;
  li {
    min-width: 80px;
    color: $textColor;
    text-align: center;
    .archor {
      line-height: 14px;
      margin-right: 0;
      padding: 10px;
      font-size: 12px;
      border-bottom: 1px dotted #ddd;
    }
    &:last-child .archor {
      border-bottom: 0;
    }
  }
}
</style>
