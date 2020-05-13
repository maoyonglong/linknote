<template>
  <div class="edit-span">
    <slot name="span" v-if="state">
      <span @dblclick="dblclickText">{{text}}</span>
    </slot>
    <slot v-else>
      <Input :value="text" @change="changeInput" @blur="blurInput"></Input>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    // true - span, false - edit
    state: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    }
  },
  methods: {
    dblclickText () {
      const id = this.id
      this.$emit('update:state', {
        state: false,
        id
      })
    },
    blurInput () {
      this.$emit('update:state', {
        state: true,
        id: this.id
      })
    },
    changeInput () {
      this.$emit('update:text', {
        text: this.text,
        id: this.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
