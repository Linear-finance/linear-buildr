const webpack = require("webpack"); //webpack配置扩展
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); //读取差异环境变量

module.exports = {
  ssr: false,
  env: {
    baseUrl: process.env.BACKEND_API,
  },
  server: {
    port: process.env.SERVER_PORT,
    host: "127.0.0.1", // default: localhost
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Linear | Builder",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  //spa模式下页面loading动画
  loadingIndicator: {
    name: "folding-cube",
    // name: "@/static/customLoading.html",
    background: "#345785",
    color: "#fff",
  },
  /*
   ** Global CSS
   */
  css: [
    "@/static/font/Gilroy/Gilroy.css", // 全局字体
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  /*
   ** 全局 SCSS
   */
  styleResources: {
    scss: "./assets/css/*.scss",
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "@/plugins/iview", ssr: false }, //UI框架
    { src: "@/plugins/axios", ssr: false }, //异步请求
    { src: "@/plugins/echarts", ssr: false }, //图表
    { src: "@/plugins/i18n", ssr: false }, //多语言
    { src: "@/plugins/localStorage", ssr: false }, //vuex持久化
    { src: "@/plugins/pubsub", ssr: false }, //发布订阅消息
    // { src: "@/plugins/walletListener", ssr: false }, //全局钱包改变监听
    { src: "@/plugins/refreshListen", ssr: false }, //全局钱包面板数据更新监听
    { src: "@/plugins/fontawesome", ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/fontawesome"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/dotenv-module
    [
      "@nuxtjs/dotenv",
      {
        filename: `.env.${process.env.NODE_ENV}`, //引入对应文件内环境变量到process.env内
      },
    ],
    "@nuxtjs/style-resources",
    "@/module/module",
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  fontawesome: {
    component: "Fa",
    suffix: false,
    icons: {
      solid: true,
      brands: true,
    },
  },
  axios: {
    prefix: "/buildr_api", //url前缀
    proxy: true, //开启跨域代理
  },
  /**
   * url 代理
   */
  proxy: {
    //匹配名称
    "/buildr_api/": {
      target: process.env.BACKEND_API, //代理地址
      pathRewrite: {
        "^/buildr_api/": "/", //将前缀替换成 /
        changeOrigin: true, //标识跨域
        secure: false, //https使用
      },
      proxyTimeout: 600000, //响应超时 毫秒
      timeout: 600000, //请求超时  毫秒
    },
  },
  router: {
    middleware: "i18n", // 引入全局多语言中间件
  },
  target: "static",
  //静态部署添加动态路由子页
  generate: {
    //忽略页面
    exclude: [/^\/demo/],
    routes: [
      "/build",
      "/burn",
      "/claim",
      "/transfer",
      "/bridge",
      "/transaction",
      "/track",
    ],
  },
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        autoprefixer: true,
      },
    },

    analyze: false, //打包文件分析  ,使用npm run build后弹出页面

    extractCSS: true, //css分离

    splitChunks: {
      layouts: false, //layout文件分离
    },

    vendor: ["axios"], // 防止重复打包

    devtools: true, //允许使用vue-devtools,调试时使用

    plugins: [
      //需要时再启用jq,防止打包占用空间
      new webpack.ProvidePlugin({
        // $: "jquery",
        // jQuery: "jquery",
        // "window.jQuery": "jquery"
      }),
      new LodashModuleReplacementPlugin({ shorthands: true }),
    ],

    //按需引入
    babel: {
      plugins: [
        "lodash",
        [
          "import",
          {
            libraryName: "view-design",
            libraryDirectory: "src/components",
          },
        ],
      ],
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },

  telemetry: false, //取消参与调查提示
};
