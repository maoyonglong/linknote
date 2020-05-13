<template>
  <v-profile
    :editSpanState.sync="sure"
    @blur="cancel"
    ref="profile"
  >
    <h3 slot="tip">
      双击文本值可以快速进入编辑状态！<br />
      点击输入框外可以快速保存修改！
    </h3>
    <Button
      type="primary"
      @click="onExcuteBtn"
    >
      {{!sure ? '确定' : '修改'}}
    </Button>
    <Button
      v-if="!sure"
      @click="cancel"
    >取消</Button>
  </v-profile>
</template>

<script>
import VProfile from '~/components/profile'

export default {
  components: {
    VProfile
  },
  data () {
    return {
      sure: true
    }
  },
  methods: {
    onExcuteBtn () {
      this.sure = !this.sure
      if (this.sure) {
        this.$refs.profile.handleSubmit()
      }
    },
    cancel () {
      this.sure = true
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 20px;
  color: #ed4014;
}
</style>
