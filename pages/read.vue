<template>
  <div id="page">
    <v-header v-bind="header"></v-header>
    <main class="main">
      <div class="container flex">
        <article class="flex-grow">
          <h1 class="title">{{article.title}}</h1>
          <div class="author-info flex center-vert">
            <a class="archor author-avatar" :href="`/space/${author.id}`">
              <img class="avatar" :src="author.avatar" alt="author">
            </a>
            <div>
              <div class="author-name">{{author.name}}</div>
              <div class="article-info desc">
                <span>{{author.date}}</span>
              </div>
            </div>
          </div>
          <section v-html="article.content"></section>
        </article>
        <aside></aside>
      </div>
    </main>
  </div>
</template>

<script>
import { fullPage } from './util'
import VHeader from '~/components/Header'

export default {
  components: {
    VHeader
  },
  data () {
    return {
      header: {
        isLogin: true
      },
      article: {
        title: '文章标题',
        content: '<p>文章内容</p>'
      },
      author: {
        avatar: '/avatar.jpg',
        name: 'author',
        date: '2020.5.1 15:32:00',
        id: ''
      }
    }
  },
  mounted () {
    fullPage()
  }
}
</script>

<style lang="scss" scoped>
.container {}
main {
  height: 100%;
  padding-top: 10px;
  background-color: $bgColor;
}
article {
  padding: 20px;
  background-color: #fff;
}
aside {
  width: 260px;
  margin-left: 10px;
}
.author {
  &-info {
    margin-bottom: 20px;
  }
  &-name {
    font-size: 20px;
  }
  &-avatar {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }
}
</style>
