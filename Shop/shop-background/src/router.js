import Vue from 'vue'
import Router from 'vue-router'
import Home from './features/Home.vue'
import Login from './features/Login.vue'
import Register from './features/Register.vue';
import Library from './features/Library.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/bg',
      name: '主页',
      component: Home
    },
    {
      path: '/bg/login',
      name: '登录',
      component: Login
    },
    {
      path: '/bg/register',
      name: '注册',
      component: Register
    },
    {
      path: '/bg/library',
      name: '图书管理',
      component: Library
    }
  ]
})