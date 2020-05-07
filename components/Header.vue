<template>
  <header class="header flex center-vert">
    <div class="container flex">
      <a class="archor link">发现</a>
      <a v-if="isLogin" href="/space" class="archor avatar-link flex center-vert" @mouseenter="handleAvatarList">
        <img class="avatar" :src="avatar" :alt="avatarAlt">
        <Icon type="md-arrow-dropdown" />
        <Button type="info" class="write-btn" @click="toWrite">写笔记</Button>
      </a>
      <div v-else class="flex">
        <a class="archor" href="/login">登陆</a>
        <a class="archor" href="/register">注册</a>
      </div>
    </div>
    <avatar-list></avatar-list>
  </header>
</template>

<script>
import avatarList from './avatarList'

export default {
  components: {
    avatarList
  },
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
  methods: {
    handleAvatarList () {

    },
    toWrite () {
      this.$router.push('/write')
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  .container {
    justify-content: flex-end;
  }
  .archor {
    color: $textColor;
    padding: 10px;
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
    margin-right: 10px;
    &-link {
      padding: 0;
    }
  }
}
.write-btn {
  margin-left: 20px;
}
</style>
