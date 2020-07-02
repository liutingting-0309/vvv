import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'
import Welcome from './components/welcome.vue'
import Users from './components/users/users.vue'
import Roles from './components/rights/roles.vue'
import Rights from './components/rights/rights.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/roles',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights }
      ]
    },
  ]
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
//push 
const VueRouterPush = VueRouter.prototype.push 
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()  放行 next("/login") 强制跳转

  if (to.path == '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()

})

export default router
