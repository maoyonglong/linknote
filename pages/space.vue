<template>
  <div id="page" class="layout">
    <Spin v-if="loading" fix size="large"></Spin>
    <Layout v-else style="overflow: hidden;">
      <v-header :isLogin="true"></v-header>
      <Layout style="overflow: hidden;">
        <Sider hide-trigger :style="{'overflow-y': 'scroll', background: '#fff', paddingTop: '60px', borderRight: '1px solid #dcdee2', position: 'fixed', height: '100%'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>笔记
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="2">
              <nuxt-link to="/space/profile"><Icon type="ios-keypad"></Icon>个人设置</nuxt-link>
            </MenuItem>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>笔记
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="2">
              <nuxt-link to="/space/profile"><Icon type="ios-keypad"></Icon>个人设置</nuxt-link>
            </MenuItem>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>笔记
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="2">
              <nuxt-link to="/space/profile"><Icon type="ios-keypad"></Icon>个人设置</nuxt-link>
            </MenuItem>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>笔记
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="2">
              <nuxt-link to="/space/profile"><Icon type="ios-keypad"></Icon>个人设置</nuxt-link>
            </MenuItem>
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>笔记
              </template>
              <MenuItem name="1-1">Option 1</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
            </Submenu>
            <MenuItem name="2">
              <nuxt-link to="/space/profile"><Icon type="ios-keypad"></Icon>个人设置</nuxt-link>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
          <Content id="content" :style="{padding: '24px', paddingTop: '84px', minHeight: '280px', background: '#fff'}">
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

.ivu-menu-vertical.ivu-menu-light:after {
  display: none;
}
</style>
