const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - オープンチャットサイト「Freeオープンチャット」',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '無料で使用できるチャットのサイト！！ルームを作成してURLを共有すれば、すぐにチャットを開始！！オープンチャット設定も可能！！オープンチャットはタイトル検索できるので、共通の話題でチャットも楽しもう！！' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'オープンチャットサイト「Freeオープンチャット」' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://freeopenchat.com/' },
      { hid: 'og:title', property: 'og:title', content: 'Freeオープンチャット' },
      { name: 'keywords', content: 'Freeオープンチャット,無料オープンチャット,オープンチャット,無料チャット,フリーチャット,Free Chat,登録不要,検索可能,ルーム作成,URLを共有,プライベートチャット,URLでチャット,すぐにチャット'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/base.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/firebase.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    theme: {
      primary: "#00bcd4",
      secondary: "#f44336",
      accent: "#2196f3",
      error: "#ff5722",
      warning: "#ffeb3b",
      info: "#4caf50",
      success: "#3f51b5",
      background: "#FAFAFA",
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
