import Vue from 'vue'
import Router from 'vue-router'
import Home from './features/Home.vue'
import Login from './features/Login.vue'
import Register from './features/Register.vue'
import Library from './features/Library.vue'
import ShopCart from './features/ShopCart.vue'
import PaySuccess from './features/PaySuccess.vue'
import Order from './features/Order.vue'
import LibraryDetail from './features/LibraryDetail.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '主页',
      component: Home
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/register',
      name: '注册',
      component: Register
    },
    {
      path: '/library',
      name: '图书管理',
      component: Library
    },
    {
      path: '/shopCart',
      name: '购物车',
      component: ShopCart
    },
    {
      path: '/paySuccess',
      name: '购买成功页',
      component: PaySuccess
    },
    {
      path: '/order',
      name: '订单列表页',
      component: Order
    },
    {
      path: '/libraryDetail',
      name: '图书馆详情',
      component: LibraryDetail
    }
  ]
})