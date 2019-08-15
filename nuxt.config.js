module.exports = {
  globalName: 'webtoon',
  mode: 'universal',
  srcDir: 'src/',
  server: {
    host: '0.0.0.0'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: '재미있는 네이버 웹툰',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  router: {
    // custom link class names
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    publicPath: '/dist/',
    postcss: {
      plugins: {
        autoprefixer: {}
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {}
  }
}
