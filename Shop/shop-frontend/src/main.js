import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  let userId = localStorage.getItem('userId')
  config.headers.common['Authorization'] = 'Bearer ' + token
  config.headers.common['userId'] = userId
  return config;
})

axios.interceptors.response.use(data => {
  return data
}, error => {
  ElementUI.Message.error('登录失效')
  router.push('/login')
})


new Vue({
  el: '#app',
  router,
  axios,
  render: h => h(App)
})
