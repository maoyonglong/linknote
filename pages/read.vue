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
import { fullPage } from '~/assets/scripts/util'
import VHeader from '~/components/Header'

export default {
  components: {
    VHeader
  },
  async asyncData ({route, app}) {
    const aid = route.query.aid
    if (!aid) return {}
    try {
      const res = await app.$axios({
        url: `/api/article/a/${aid}`,
        method: 'get'
      })
      const data = res.data
      if (data.code === 0) {
        const result = data.result
        return {
          article: {
            content: result.content,
            title: result.title
          },
          author: {
            avatar: result.author.avatar,
            date: result.date,
            name: result.author.uname,
            id: result.author.uid
          }
        }
      }
    } catch (err) {
      return {}
    }
  },
  data () {
    return {
      header: {
        isLogin: this.$store.getters.isLogin
      },
      article: {
        title: '',
        content: ''
      },
      author: {
        avatar: '/avatar.jpg',
        name: 'author',
        date: '',
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
