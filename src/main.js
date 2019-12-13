import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/iview.js'
import './assets/css/global.css'
import './my_theme/index.less'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.filter('formatDate', (val) => {
  val = new Date(val)
  const Y = val.getFullYear()
  const M = (val.getMonth() + 1 + '').padStart(2, '0')
  const D = (val.getDate() + '').padStart(2, '0')
  const h = (val.getHours() + '').padStart(2, '0')
  const m = (val.getMinutes() + '').padStart(2, '0')
  const s = (val.getSeconds() + '').padStart(2, '0')
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
})

Vue.component('TreeTable', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
