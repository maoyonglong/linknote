<template>
  <div id="page" class="l-centerForm-page">
    <main class="l-centerForm-page-center" v-show="finished">
      <nuxt />
    </main>
  </div>
</template>

<script>
import { fullPage } from '~/assets/scripts/util'

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
$prefix: unquote("l-centerForm");

.#{$prefix}-page {
  position: relative;
  overflow: hidden;
  background-color: $bgColor;
  /deep/ .title {
    padding: 20px;
    text-align: center;
  }

  /deep/ .form {
    padding-right: 20px;
  }
}

.#{$prefix}-page-center {
  // position: absolute;
  width: 450px;
  border-radius: 10px;
  box-shadow: 0 0 2px $shadowColor;
  margin: 100px auto;
  padding: 10px;
  background-color: #fff;
}
</style>
