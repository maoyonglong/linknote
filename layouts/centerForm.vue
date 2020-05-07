<template>
  <div id="page" class="page">
    <main class="page-center" v-show="finished">
      <nuxt />
    </main>
  </div>
</template>

<script>
import { fullPage } from '~/pages/util'

export default {
  data () {
    return {
      finished: false
    }
  },
  mounted () {
    fullPage()
    this.finished = true
  }
}
</script>

<style lang="scss">
.page {
  position: relative;
  background-color: $bgColor;
}

.title {
  padding: 20px;
  text-align: center;
}

.form {
  padding-right: 20px;
}

.page-center {
  position: absolute;
  width: 400px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 2px $shadowColor;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}
</style>
