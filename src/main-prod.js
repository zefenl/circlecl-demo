import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import NProgress from 'nprogress'
import { Message } from 'element-ui'

import 'nprogress/nprogress.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标样式表
import './assets/fonts/iconfont.css'
// 导入svg文件
import './assets/fonts/iconfont.js'

// 全局挂载axios
axios.defaults.baseURL = 'http://localhost:3000'

Vue.prototype.$http = axios
Vue.config.productionTip = false

// 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(response => {
  NProgress.done()
  return response
}, err => {
  if (err.response.status === 400) {
    Message.error('请求参数出错')
  }
})

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(Number(originVal))
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
