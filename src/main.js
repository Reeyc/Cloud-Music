import Vue from 'vue'
import App from './App'
import store from './store/index'

Vue.prototype.$store = store
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

//小程序的页面组件 和 App.vue组件 的写法和引入方式是一致的，设置一个属性来区分两者
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
