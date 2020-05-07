<template>
  <div id="page" class="flex">
    <div class="relative">
      <div class="tree-list folder-list">
        <div class="tree-item">
          <div class="tree-icon icon-folder"></div>
          <span>foldesr</span>
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="tree-list file-list">
        <div class="tree-item">
          <div class="tree-icon icon-file"></div>
          <span>file</span>
        </div>
      </div>
    </div>
    <div class="relative">
      <div
        class="quill-editor"
       :content="content"
       ref="myQuillEditor"
       @change="onEditorChange($event)"
       v-quill:myQuillEditor="editorOption"
      >
      </div>
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
import { fullPage, restHeight } from './util'

export default {
  data () {
    const self = this
    return {
      header: {
        isLogin: true
      },
      loading: false,
      content: '',
      action: '/uploads/images',
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              ['link', 'image'],

              [{'header': 1}, {'header': 2}], // custom button values
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
              [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
              [{'direction': 'rtl'}], // text direction

              [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
              [{'header': [1, 2, 3, 4, 5, 6, false]}],

              [{'color': []}, {'background': []}], // dropdown with defaults from theme
              [{'font': []}],
              [{'align': []}],

              ['clean'] // remove formatting button
            ],
            handlers: {
              image () {
                this.quill.format('image', false)// 禁用quill内部上传图片方法
                self.imgHandler(this)
              }
            }
          }
        }
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
  mounted () {
    this.content="<h1>sdfsdfsdf</h1>"
    fullPage()
    restHeight('.ql-container')
  }
}
</script>

<style lang="scss" scoped>
#page > div {
  height: 100%;
}

// .quill-editor {
//   height: 745px;

//   .ql-container {
//     height: 680px;
//   }
// }

.tree {
  &-item {
    display: flex;
    align-items: center;
    padding: 10px;
    .icon {
      &-folder {
        background-color: yellow;
      }
      &-file {
        background-color: blue;
      }
    }
  }
  &-icon {
    width: 60px;
    height: 60px;
    margin-right: 20px;
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
