<template>
  <div id="page" class="flex">
    <div class="relative">
      <div class="tree-list folder-list">
        <div class="tree-item active">
          <div class="flex center-vert">
            <i class="iconfont icon-folder">&#xe80c;</i>
            <span>foldesr</span>
          </div>
          <Poptip>
            <i class="iconfont">&#xe6bb;</i>
            <ul class="pop-list" slot="content">
              <li class="pop-item">item 1</li>
              <li class="pop-item">item 2</li>
            </ul>
          </Poptip>
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="tree-list file-list">
        <div class="tree-item active">
          <div class="flex center-vert">
            <i class="iconfont icon-file">&#xe679;</i>
            <span>file</span>
          </div>
          <i class="iconfont">&#xe6bb;</i>
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

export default {
  data () {
    const self = this
    return {
      header: {
        isLogin: true
      },
      loading: true,
      content: '',
      action: '/uploads/images',
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

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
              'image': function () {
                console.log(file)
              }
            }
          }
        },
        theme: 'snow'
      }
    }
  },
   methods: {
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
        this.loading = false
        this.$Message.info('上传图片成功！')
        const path = res.data.result

        // 图片回显
        if (path) {
          const quill = this.$refs.myQuillEditor.quill
          const range = quill.getSelection()
          quill.insertEmbed(range !== null ? range.index : 0, 'image', path)
        }
      }).catch(() => {
        this.loading = false
        this.$Message.error('上传图片失败！')
      })

      return false
    }
  },
  asyncData ({ $axios }) {
    $axios({
      url: '/api/folder',
      method: 'get',
      params: {
        uid: Cookies.get('USER_TOKEN')
      }
    })
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
