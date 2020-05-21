<template>
  <div id="page" class="flex" style="overflow: hidden;">
    <div class="flex">
      <div class="relative">
        <div class="top-btn-wrap">
          <nuxt-link to="/">
            <Button>
              <Icon type="md-home" />
              回到首页
            </Button>
          </nuxt-link>
          <Button @click="addFolder">
            <Icon type="md-add" />
            添加
          </Button>
        </div>
        <div class="tree-list folder-list">
          <div
            :class="['tree-item', {active: i === folderActiveIdx}]"
            v-for="(v, i) in folders"
            :key="i"
            @click="selectFolder(i)"
          >
            <div class="flex center-vert">
              <i class="iconfont icon-folder">&#xe80c;</i>
              <span>{{v.name}}</span>
            </div>
            <Poptip placement="bottom" v-model="v.popTipVisible">
              <i class="iconfont">&#xe6bb;</i>
              <ul class="pop-list" slot="content">
                <li class="pop-item" @click.stop="renameFolder(i)">重命名</li>
                <li class="pop-item" @click.stop="delFolder(i)">删除</li>
              </ul>
            </Poptip>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="top-btn-wrap">
          <Button @click="addFile">
            <Icon type="md-add" />
            添加
          </Button>
        </div>
        <div class="tree-list file-list" v-if="folders.length > 0">
          <div
            :class="['tree-item', {active: fileActiveIdx === i}]"
            v-for="(v, i) in folders[folderActiveIdx].files"
            :key="i"
            @click="selectFile(i)"
          >
            <div class="flex center-vert">
              <i class="iconfont icon-file">&#xe679;</i>
              <span>{{v.name}}</span>
            </div>
            <Poptip placement="bottom" v-model="v.popTipVisible">
              <i class="iconfont">&#xe6bb;</i>
              <ul class="pop-list" slot="content">
                <li class="pop-item" @click.stop="renameFile(i)">重命名</li>
                <li class="pop-item" @click.stop="delFile(i)">删除</li>
              </ul>
            </Poptip>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-grow">
      <quill-editor
        class="quill-editor"
        v-model="content"
        ref="myQuillEditor"
        @change="onEditorChange($event)"
        :options="editorOption"
      >
        <div class="toolbar" slot="toolbar">
          <Button type="primary">
            <Icon type="md-cloud-download" />
            发布文章
          </Button>
          <Button type="info">
            <Icon type="md-cloud-upload" />
            保存
          </Button>
          <Button type="error">
            <Icon type="md-trash" />
            删除
          </Button>
          <Button type="success">
            <Icon type="md-search" />
            预览
          </Button>
          <div class="title-wrap">
            <Input placeholder="请输入标题" v-model="title" />
          </div>
        </div>
      </quill-editor>
      <Spin fix v-if="loading"></Spin>
      <Upload
        accept="image/*"
        :action="action"
        :before-upload="handleUpload"
        ref="upload"
        v-show="false"
      >
      </Upload>
    </div>
  </div>
</template>

<script>
import { fullPage, restHeight } from '~/assets/scripts/util'
import Cookies from 'js-cookie'

const fonts = ['Microsoft-YaHei','SimSun', 'SimHei','KaiTi','Arial','Times-New-Roman', 'FangSong']
const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '36px']

const getFiles = function (axios, folderId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/articles',
      method: 'get',
      params: {folderId}
    }).then(res => {
      const data = res.data
      if (data.code === 0) {
        const docs = data.result
        docs.forEach(doc => {
          doc.id = doc._id.toString()
          doc.popTipVisible = false
          delete doc._id
          delete doc.folderId
        })
        resolve(docs)
      } else {
        resolve(data)
      }
    })
  })
}

export default {
  data () {
    const self = this
    return {
      doctype: 'html',
      title: '文章' + new Date().getTime(),
      content: '',
      assets: [],
      header: {
        isLogin: true
      },
      loading: true,
      action: '/uploads/images',
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              ['image'],

              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction

              [{ 'size': sizes }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6] }],

              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': fonts }],
              [{ 'align': [] }],

              ['clean']                                        // remove formatting button
            ],
            handlers: {
              'image': function (value) {
                if (value) {
                  self.imgHandler()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        },
        theme: 'snow'
      },
      folders: [],
      folderActiveIdx: 0,
      fileActiveIdx: 0
    }
  },
  async asyncData ({ app }) {
    const result = {}
    const $axios = app.$axios
    try {
      const res = await $axios({
        url: '/api/folders/u',
        method: 'get'
      })
      const data = res.data
      if (data.code === 0) {
        const docs = data.result
        docs.forEach(doc => {
          doc.uid = doc.toString()
          doc.id = doc._id.toString()
          doc.files = []
          doc.popTipVisible = false
          delete doc._id
        })
        result.folders = docs
        if (docs.length) {
          const res = await $axios({
            url: '/api/articles',
            method: 'get',
            params: {
              folderId: docs[0].id
            }
          })
          const data = res.data
          if (data.code === 0) {
            const docs = data.result
            docs.forEach(doc => {
              doc.id = doc._id.toString()
              doc.popTipVisible = false
              delete doc._id
              delete doc.folderId
            })
            result.folders[0].files = docs
          } else {
            result.asyncDataErr = data
          }
        }
      } else {
        result.asyncDataErr = data
      }
    } catch (err) {
      result.asyncDataErr = {
        msg: '出现未知错误！',
        err
      }
    }
    return result
  },
  methods: {
    createInputConfirm (options) {
      const title = options.title || ''
      const onOk = options.onOk
      const onCancel = options.onCancel
      const placeholder = options.placeholder || ''
      const _this = this

      function show (okFn, cancelFn) {
        let modalInputValue = ''
        _this.$Modal.confirm({
          // <div>
          //   <h3 class="title">[title]</h3>
          //   <Input v-model="modalInputValue" :placeholder="placeholder"></Input>
          // </div>
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            okFn(modalInputValue)
          },
          onCancel: cancelFn,
          render (h) {
            return h(
              'div',
              [
                h(
                  'h3',
                  {
                    'class': 'title'
                  },
                  title
                ),
                h('Input', {
                  props: {
                    value: modalInputValue,
                    autofocus: true,
                    placeholder
                  },
                  on: {
                    'on-change': function (event) {
                      modalInputValue = event.target.value
                    }
                  }
                })
              ]
            )
          }
        })
      }

      return onOk ? show(onOk, onCancel) : new Promise((resolve, reject) => show(resolve, reject))
    },
    createConfirm (options) {
      const content = options.content || ''
      const onOk = options.onOk
      const onCancel = options.onCancel
      const _this = this

      function show (okFn, cancelFn) {
        _this.$Modal.confirm({
          content,
          onOk: okFn,
          onCancel: cancelFn
        })
      }

      return onOk ? show(onOk, onCancel) : new Promise((resolve, reject) => show(resolve, reject))
    },
    addFile () {
      let fileName = ''
      this.createInputConfirm({
        title: '创建文件',
        placeholder: '请输入文件的名字'
      }).then(name => {
        fileName = name
        const folder = this.folders[this.folderActiveIdx]
        this.loading = true
        return this.$axios({
          url: '/api/article/add',
          method: 'post',
          data: {
            doctype: this.doctype,
            content: this.content,
            title: this.title,
            folderId: folder.id,
            name,
            assets: this.assets,
            publish: false,
            tag: '',
            privacy: false
          }
        })
      }).then((res) => {
        const data = res.data
        const folder = this.folders[this.folderActiveIdx]
        if (data.code === 0) {
          const len = folder.files.push({
            id: data.result,
            name: fileName,
            folderId: folder.id,
            doctype: this.doctype,
            assets: this.assets,
            tag: this.tag,
            publish: false,
            privacy: false
          })
          this.selectFile(len - 1)
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    addFolder () {
      let folderName = ''
      this.createInputConfirm({
        title: '创建文件夹',
        placeholder: '请输入文件夹的名字'
      }).then((name) => {
        folderName = name
        this.loading = true
        return this.$axios({
          url: '/api/folder/add',
          method: 'post',
          data: { name }
        })
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          const folderId = data.result
          const len = this.folders.push({
            id: folderId,
            name: folderName,
            files: []
          })
          this.selectFolder(len - 1)
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch((err) => {
        if (err) {
          this.$Message.error(err.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getActiveFolder () {
      return this.folders[this.folderActiveIdx]
    },
    getFolder (i) {
      return typeof i === 'undefined'? this.getActiveFolder() : this.folders[i]
    },
    getFile (i, folderIdx) {
      return this.getFiles(folderIdx)[i]
    },
    getFiles (i) {
      return this.getFolder(i).files
    },
    getActiveFile () {
      return this.getFiles()[this.fileActiveIdx]
    },
    renameFolder (i) {
      let folder = this.getFolder(i)
      folder.popTipVisible = false
      this.createInputConfirm({
        title: '文件夹重命名',
        placeholder: '请输入文件夹名称'
      }).then(name => {
        this.loading = true
        return this.$axios({
          url: '/api/folder/rename',
          method: 'post',
          data: {folderId: folder.id, name}
        })
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          folder.name = name
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    delFolder (i) {
      this.createConfirm({
        content: '删除文件后无法恢复，是否确定删除？'
      }).then(() => {
        const folderId = this.getFolder(i).id
        this.loading = true
        return this.$axios({
          url: '/api/folder/del',
          method: 'post',
          data: {folderId}
        })
      }).then(res => {
        const data =res.data
        if (data.code === 0) {
          this.folders.splice(i, 1)
          // 如果是选中的项要重置选中项
          if (this.folderActiveIdx === i) {
            this.selectFile(0)
          }
          this.$Message.success(data.msg)
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
    renameFile (i) {
      let article = this.getFile(i)
      article.popTipVisible = false
      this.createInputConfirm({
        title: '文件重命名',
        placeholder: '请输入文件名称'
      }).then((name) => {
        this.loading = true
        return this.$axios({
          url: '/api/article/rename',
          method: 'post',
          data: {name, articleId: article.id}
        })
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          article.name = name
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    delFile (i) {
      this.createConfirm({
        content: '删除文件后无法恢复，是否确定删除？'
      }).then(() => {
        const articleId = this.getFile(i).id
        this.loading = true
        return this.$axios({
          url: '/api/article/del',
          method: 'post',
          data: {articleId}
        })
      }).then(res => {
        const data =res.data
        if (data.code === 0) {
          this.getFiles().splice(this.fileActiveIdx, 1)
          if (i === this.fileActiveIdx) {
            this.selectFile(0)
          }
          this.$Message.success(data.msg)
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
    updateFile () {
      const content = this.content
      const imgSrcRe = /<img src="(.*?)">/g
      const assets = []
      const folder = this.getActiveFolder()
      const file = this.getActiveFile()
      let match
      do {
        match = imgSrcRe.exec(content)
        assets.push(match[1])
      } while (match !== null)
      this.assets = assets
      this.loading = true
      this.$axios({
        url: '/api/article/update',
        method: 'post',
        data: {
          articleId: file.id,
          doctype: this.doctype,
          title: this.title,
          assets,
          content: this.content
        }
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    selectFolder (i) {
      this.folderActiveIdx = i
    },
    selectFile (i) {
      this.fileActiveIdx = i
    },
    onEditorChange ({editor, html, text}) {
      this.content = html
    },
    imgHandler () {
      const imgUploader = document.querySelector(`.ivu-upload-input[accept='image/*']`)
      imgUploader.click()
    },
    handleUpload (file, fileList) {
      const fd = new FormData()
      fd.append('img', file, file.name)
      this.loading = true
      this.$axios({
        method: 'post',
        url: this.action,
        data: fd,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        const data = res.data
        if (data.code === 0) {
          const path = data.result
          const quill = this.$refs.myQuillEditor.quill
          const range = quill.getSelection()
          quill.insertEmbed(range !== null ? range.index : 0, 'image', path)
          this.assets.push(path)
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg + '\n' + data.err.message)
        }
      }).catch((err) => {
        this.$Message.error(err.message)
      }).finally(() => {
        this.loading = false
      })

      return false
    }
  },
  mounted () {
    fullPage()
    this.loading = false
    restHeight('.ql-container')
    const Quill = require('quill')
    const Font = Quill.import('formats/font')
    const Size = Quill.import('formats/size')
    Font.whitelist = fonts
    Size.whitelist = sizes
    Quill.register(Font, true)
    Quill.register(Size, true)
  }
}
</script>

<style lang="scss" scoped>
#page > div {
  height: 100%;
}

.top-btn-wrap {
  padding: 10px;
}

.tree-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: #ddd;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 4px;
      height: 100%;
      background-color: $activeColor;
    }
  }

  .iconfont {
    font-size: 30px;
    &:first-child {
      margin-right: 10px;
    }
    &:last-child {
      margin-left: 10px;
    }
  }

  .icon-folder {
    color: #ffca28;
  }

  .icon-file {
    color: #008df0;
  }
}

/deep/ .ivu-poptip-body {
  padding: 0;
}

.toolbar {
  padding: 10px;
}

.title-wrap {
  padding-top: 10px;
}

.pop-item {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  font-size: $normalFontSize;
  &:hover {
    background-color: $activeBgColor;
    color: #fff;
  }
}

.folder-list,
.file-list {
  overflow-y: scroll;
  height: 100%;
}

.folder-list {
  width: 220px;
}

.file-list {
  width: 250px;
}

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;

  span {
    color: #ee2a7b;
  }
}

.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
</style>
