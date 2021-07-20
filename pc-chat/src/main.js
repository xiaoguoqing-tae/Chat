import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import axios from 'axios'
import qs from "qs"
//elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import io from 'socket.io-client'

import animated from 'animate.css' // npm install animate.css --save安装，在引入

Vue.use(animated)
Vue.use(qs)
Vue.prototype.axios = axios
Vue.prototype.url = "http://localhost:3000"
Vue.prototype.socket = io("http://localhost:3001")

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  axios,
  render: h => h(App),
}).$mount('#app')
