import Vue from 'vue'
import App from './App.vue'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false
Vue.use(VueSocketio,socketio('http://localhost:9002/'));
Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount('#app')
