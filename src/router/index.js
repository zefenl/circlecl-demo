import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login" */ '@/components/Login.vue')
const Home = () => import(/* webpackChunkName: "home_weclome" */ '@/components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "home_weclome" */ '@/components/Welcome.vue')
const Graphical = () => import(/* webpackChunkName: "home_weclome" */ '@/components/graphical/index.vue')

const Txmap = () => import(/* webpackChunkName: "home_weclome" */ '@/components/txMap/index.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/graphical',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/graphical', component: Graphical },
      { path: '/txmap', component: Txmap }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  // 访问登录页,放行
  if (to.path === '/login' && token) return next('/home')
  if (to.path === '/login') return next()
  // 没有token访问非login强制跳转回登录页
  if (!token) return next('/login')

  next()
})

export default router
