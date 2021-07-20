import Vue from 'vue'
import App from './App'
import io from './commons/socket/weapp.socket.io.js'

Vue.config.productionTip = false
// Vue.prototype.serverUrl = "http://192.168.202.121:3000"
// Vue.prototype.socket = io("http://192.168.202.121:3001")
Vue.prototype.serverUrl = "http://localhost:3000"
Vue.prototype.socket = io("http://localhost:3001")
// Vue.prototype.serverUrl = "http://42.194.137.37:3000"
// Vue.prototype.socket = io("http://42.194.137.37:3001")
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
