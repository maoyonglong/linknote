<template>
  <div id="page" class="layout">
    <Spin v-if="loading" fix size="large"></Spin>
    <Layout v-else style="overflow: hidden;">
      <v-header :isLogin="true"></v-header>
      <Layout style="overflow: hidden;">
        <Sider hide-trigger :style="{'overflow-y': 'scroll', background: '#fff', paddingTop: '60px', borderRight: '1px solid #dcdee2', position: 'fixed', height: '100%'}">
          <Menu active-name="1" theme="light" width="auto">
            <MenuItem name="1">
              <nuxt-link class="archor" to="/space"><Icon type="ios-paper" class="icon" />笔记</nuxt-link>
            </MenuItem>
            <MenuItem name="2">
              <nuxt-link class="archor" to="/space/profile"><Icon type="ios-keypad" class="icon" ></Icon>个人设置</nuxt-link>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
          <Content
            id="content"
            class="animate__animated animate__fadeInTop"
            :style="{padding: '24px', paddingTop: '84px', minHeight: '280px', background: '#fff'}"
          >
            <nuxt-child></nuxt-child>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import VHeader from '~/components/Header'
import {fullPage} from '~/assets/scripts/util'

export default {
  components: {
    VHeader
  },
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    fullPage()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  &-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  &-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
}

.icon {
  margin-right: 6px;
}

.archor {
  color: black;
}

.ivu-menu-vertical.ivu-menu-light:after {
  display: none;
}

.ivu-menu-item-selected .archor {
  color: $activeColor;
  font-weight: bold;
}
</style>
