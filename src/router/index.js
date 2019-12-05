import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Roles from '../views/power/Roles.vue'
import Rights from '../views/power/Rights.vue'
import Goods from '../views/goods/Goods.vue'
import Params from '../views/goods/Params.vue'
import Cate from '../views/goods/Cate.vue'
import Orders from '../views/order/Orders.vue'
import Reports from '../views/report/Reports.vue'

Vue.use(VueRouter)

const routes = [
  { name: 'login', path: '/login', component: Login },
  { name: 'home',
    path: '/',
    component: Home,
    redirect: { name: 'welcome' },
    children: [
      { name: 'welcome', path: 'welcome', component: Welcome },
      { name: 'users', path: 'users', component: Users },
      { name: 'roles', path: 'roles', component: Roles },
      { name: 'rights', path: 'rights', component: Rights },
      { name: 'goods', path: 'goods', component: Goods },
      { name: 'params', path: 'params', component: Params },
      { name: 'categories', path: 'categories', component: Cate },
      { name: 'orders', path: 'orders', component: Orders },
      { name: 'reports', path: 'reports', component: Reports }
    ] }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  let isToken = window.sessionStorage.getItem('token')
  if (!isToken) return next('/login')
  next()
})

export default router
