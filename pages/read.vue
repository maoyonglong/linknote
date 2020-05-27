<template>
  <div>
    <v-header v-bind="header">
      <Button slot="left" @click="toggleGlobalShowAnswer" class="answer-global-btn">
        {{globalShowAnswer ? '隐藏全部答案' : '显示全部答案'}}
      </Button>
    </v-header>
    <main class="main">
      <div class="flex">
        <article class="flex-grow animate__animated animate__fadeInLeft">
          <h1 class="title">
            {{article.title}}
          </h1>
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
          <section class="content" ref="content" v-html="article.content"></section>
        </article>
        <aside></aside>
      </div>
    </main>
  </div>
</template>

<script>
import { fullPage } from '~/assets/scripts/util'
import VHeader from '~/components/Header'

let answerBtnOver = false

export default {
  layout: 'read',
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
            name: result.author.pname,
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
      },
      showAnswers: [],
      answerContentDoms: [],
      globalShowAnswer: false
    }
  },
  watch: {
    showAnswers: {
      handler: function (val) {
        this.globalShowAnswer = this.showAnswers.length > 0 && this.showAnswers.every(answer => answer)
      },
      deep: true
    }
  },
  methods: {
    toggleGlobalShowAnswer () {
      const contentRef = this.$refs.content
      // const answersTextDoms = contentRef.querySelectorAll('.answer .answer-content')
      // answersTextDoms.forEach(dom => {
      //   dom.style.visibility = this.showAnswer ? 'visible' : 'hidden'
      // })
      this.globalShowAnswer = !this.globalShowAnswer
      this.showAnswers.forEach((answer, i) => {
        this.toggleAnswer(i, this.globalShowAnswer)
      })
    },
    toggleAnswer (i, answer) {
      this.$set(this.showAnswers, i, answer)
      this.answerContentDoms[i].style.visibility = answer ? 'visible' : 'hidden'
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block)
      })
      const contentRef = this.$refs.content
      const answersDoms = contentRef.querySelectorAll('.answer')
      answersDoms.forEach(dom => {
        const btn = document.createElement('button')
        const contentDom = dom.children[0]
        const domParent = dom.parentNode
        const idx = this.answerContentDoms.push(contentDom) - 1
        this.showAnswers.push(false)
        // 祖先transform不是none时，fixed相对于该祖先定位，所以把btn放在body的下一级比较好
        document.body.appendChild(btn)
        btn.innerText = '显示答案'
        btn.className = 'animate__animated ivu-btn ivu-btn-default answer-toggle-btn'
        dom.addEventListener('mouseenter', (event) => {
          btn.innerText = (this.showAnswers[idx] ? '隐藏' : '显示') + '答案'
          btn.classList.toggle('animate__fadeIn')
          btn.style.left = event.clientX + 'px'
          btn.style.top = event.clientY + 'px'
          btn.style.display = 'block'
        })
        domParent.addEventListener('mouseleave', (event) => {
          // 离开domParent和按钮超过一秒按钮自动消失
          setTimeout(() => {
            if (!answerBtnOver) {
              btn.classList.toggle('animate__fadeIn')
              btn.style.display = 'none'
            }
          }, 1000)
        })
        btn.addEventListener('click', () => {
          // const showAnswer = this.showAnswers[idx]
          // this.$set(this.showAnswers, idx, !showAnswer)
          this.toggleAnswer(idx, !this.showAnswers[idx])
          btn.innerText = (this.showAnswers[idx] ? '隐藏' : '显示') + '答案'
          // contentDom.style.visibility = showAnswer ? 'visible' : 'hidden'
        })
        btn.addEventListener('mouseenter', () => {
          answerBtnOver = true
        })
        btn.addEventListener('mouseleave', () => {
          answerBtnOver = false
        })
      })
    })
  }
}
</script>

<style>
/* js生成的button类名中不含v-data等无法应用 */
.answer-toggle-btn {
  position: fixed;
  display: none;
}
</style>

<style lang="scss" scoped>
main {
  height: 100%;
  padding: 10px 40px;
  background-color: $bgColor;
}
aside {
  min-width: 300px;
  max-width: 400px;
}
article {
  padding: 20px;
  background-color: #fff;
}
.author {
  &-info {
    margin-bottom: 20px;
  }
  &-name {
    font-size: 16px;
    font-weight: 500;
  }
  &-avatar {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }
}
.answer-global-btn {
  margin-top: 15px;
  margin-right: 20px;
  height: 30px;
}
.content /deep/ {
  line-height: 1.2;
  padding: 10px;
  font-size: 18px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 20px;
  }
  img {
    width: 100%;
  }
  .answer {
    color: red;
    border-bottom: 2px solid red;
    &-block {
      display: block;
      padding: 20px 40px;
      margin-bottom: 20px;
    }
    &-content {
      visibility: hidden;
    }
  }
}
</style>
