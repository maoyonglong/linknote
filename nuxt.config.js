
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.bootcdn.net/ajax/libs/minireset.css/0.0.2/minireset.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.0/animate.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/10.0.3/styles/a11y-dark.min.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  styleResources: {
    scss: [
      './assets/styles/global.scss',
      './assets/styles/theme.scss'
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'iview/dist/styles/iview.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css',
    './assets/styles/editor.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/iview',
    '@/plugins/axios',
    {
      src: '~/plugins/vue-quill-editor',
      ssr: false
    },
    {
      src: '~/plugins/vue-cropper',
      ssr: false
    },
    {
      src: '~/plugins/route',
      ssr: true
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  router: {
    middleware: 'auth'
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'vue-quill-editor'
    ],
    extractCSS: {
      allChunks: true
    },
    analyze: true,
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
