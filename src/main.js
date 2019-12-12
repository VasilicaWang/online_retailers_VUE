import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/iview.js'
import './assets/css/global.css'
import './my_theme/index.less'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
