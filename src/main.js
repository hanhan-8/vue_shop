import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

import qs from 'qs'
Vue.prototype.$qs = qs

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
