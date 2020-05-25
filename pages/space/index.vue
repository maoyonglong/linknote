<template>
  <div>
    <Spin size="large" fix v-show="loading"></Spin>
    <Row style="position: relative;">
      <Col span="6" style="padding: 10px;">
        <div style="position: fixed;">
          <Breadcrumb>
            <BreadcrumbItem>{{activeFolder ? activeFolder.name : ''}}</BreadcrumbItem>
            <BreadcrumbItem>{{activeFile ? activeFile.name : ''}}</BreadcrumbItem>
          </Breadcrumb>
          <List>
            <ListItem
              :class="['list-item', {active: folderIdx === activeFolderIdx}]"
              v-for="(folder, folderIdx) in folders"
              :key="folderIdx"
              @click.native="selectFolder(folderIdx)"
            >
              <i class="iconfont">&#xe80c;</i>
              {{folder.name}}
            </ListItem>
          </List>
        </div>
      </Col>
      <Col span="18" style="padding: 10px;">
        <List>
          <ListItem class="list-item" v-for="(file, fileIdx) in activeFolderFiles" :key="fileIdx">
            <nuxt-link :to="`/read?aid=${file._id.toString()}`" class="flex">
              <img style="width: 100px;  margin-right: 20px;" :src="file.assets[0]" v-if="file.assets && file.assets.length" alt="">
              <div class="height: 100%;">
                <h2 class="title">{{file.title}}</h2>
                <p>{{getDesc(file.content)}}</p>
              </div>
            </nuxt-link>
          </ListItem>
        </List>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      activeFolderIdx: 0,
      activeFileIdx: 0,
      folders: []
    }
  },
  async asyncData ({ app }) {
    const $axios = app.$axios
    const result = {}
    try {
      const res = await $axios({
        url: '/api/folders/u',
        method: 'get'
      })
      const data = res.data
      if (data.code === 0) {
        const folders = data.result
        result.folders = folders
        if (folders.length) {
          result.activeFolderIdx = 0
          const res = await $axios({
            url: '/api/articles',
            method: 'get',
            params: {
              folderId: folders[0]._id
            }
          })
          const data = res.data
          if (data.code === 0) {
            const files = data.result
            folders[0].files = files
          }
        }
      }
      return result
    } catch (err) {
      return
    }
  },
  computed: {
    activeFolder: function () {
      return this.folders[this.activeFolderIdx] || null
    },
    activeFolderFiles: function () {
      const activeFolder = this.activeFolder
      return (activeFolder ? activeFolder.files : null) || []
    },
    activeFile: function () {
      const files = this.activeFolderFiles
      return files.length ? files[this.activeFileIdx] : null
    }
  },
  methods: {
    selectFolder (i) {
      this.activeFolderIdx = i
      const activeFolder = this.activeFolder
      if (activeFolder.files && activeFolder.files.length) return
      this.loading = true
      this.$axios({
        url: '/api/articles',
        method: 'get',
        params: {
          folderId: activeFolder._id.toString()
        }
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          activeFolder.files = data.result
          // 这是因为函数开头的activeFolderIdx改变时，触发computed，但是没有files
          // 这里再次改变一次，用于触发更新后的computed
          this.activeFolderIdx = -1
          this.activeFolderIdx = i
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        if (err) {
          this.$Message.error(err.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getDesc (content) {
      const div = document.createElement('div')
      div.innerHTML = content
      return div.innerText
    }
  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  margin-right: 6px;
  color: #ffca28;
  font-size: 20px;
}
.list-item {
  cursor: pointer;
  &.active {
    color: $activeColor;
  }
}
</style>
