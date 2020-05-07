<template>
  <header class="header flex center-vert">
    <div class="container flex">
      <a class="archor link">发现</a>
      <div class="flex center-vert" v-if="isLogin" @mouseenter="handleAvatarList">
        <a
          class="avatar-wrap archor flex center-vert"
          :style="{'backgroundColor': avatarListVisible ? '#f9f9f9' : 'transparent'}"
          @mouseenter="showAvatarList"
          @mouseleave="hideAvatarList"
          href="/space"
        >
          <img class="avatar" :src="avatar" :alt="avatarAlt">
          <Icon type="md-arrow-dropdown" />
          <ul class="absolute avatar-list" v-show="avatarListVisible">
            <li><a class="archor" href="/space">个人中心</a></li>
            <li @click="logout"><span class="archor">退出</span></li>
          </ul>
        </a>
        <Button type="info" class="write-btn" @click="toWrite">写笔记</Button>
      </div>

      <div v-else class="flex">
        <a class="archor" href="/login">登陆</a>
        <a class="archor" href="/register">注册</a>
      </div>
    </div>
    <Spin v-if="loading" fix size="large"></Spin>
  </header>
</template>

<script>
export default {
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: '/avatar.jpg'
    },
    avatarAlt: {
      type: String,
      default: '用户头像'
    }
  },
  data () {
    return {
      avatarListVisible: false,
      loading: false
    }
  },
  methods: {
    logout () {
      this.loading = true
      this.$axios.post('/api/logout')
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success({
              content: '退出成功！',
              onClose: () => {
                this.$router.redirect('/')
              }
            })
          } else {
            this.$Message.error('退出失败！')
          }
        }).catch(err => {
          this.$Message.error(err.msg)
        }).finally(() => {
          this.loading = false
        })
    },
    toWrite () {
      this.$router.push('/write')
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
    font-size: $normalFontSize;
    &:hover {
      color: $activeColor;
    }
  }
  .link {
    margin-right: 20px;
    font-size: 14px;
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
      font-size: 12px;
    }
  }
}
</style>
