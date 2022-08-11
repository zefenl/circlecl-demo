import router from './index'

const Users = () => import(/* webpackChunkName: "user_admin" */ '@/components/users/Users.vue')
const Admin = () => import(/* webpackChunkName: "user_admin" */ '@/components/users/Admin.vue')
const Category = () => import(/* webpackChunkName: "category" */ '@/components/category/index.vue')
const Goods = () => import(/* webpackChunkName: "goods" */ '@/components/goods/goods.vue')
const AddGood = () => import(/* webpackChunkName: "goods" */ '@/components/goods/addGood.vue')
const EditGood = () => import(/* webpackChunkName: "goods" */ '@/components/goods/editGood.vue')
const Skus = () => import(/* webpackChunkName: "goods" */ '@/components/goods/skus.vue')
const Order = () => import(/* webpackChunkName: "order" */ '@/components/order/index.vue')
const NotFound = () => import(/* webpackChunkName: "home_weclome" */ '@/components/NotFound.vue')

const asyncRoutes = [
  { name: 'users', rou: [{ path: '/users', component: Users }] },
  { name: 'admin', rou: [{ path: '/admin', component: Admin }] },
  { name: 'category', rou: [{ path: '/category', component: Category }] },
  { name: 'spu', rou: [{ path: '/spu', component: Goods }, { path: '/spu/add', component: AddGood }, { path: '/spu/edit/:id', component: EditGood }] },
  { name: 'sku', rou: [{ path: '/sku', component: Skus }] },
  { name: 'order', rou: [{ path: '/order', component: Order }] }
]

export const addAsyncRouter = (arr) => {
  arr.forEach(item => {
    for (let i = 0; i < asyncRoutes.length; i++) {
      if (item === asyncRoutes[i].name) {
        asyncRoutes[i].rou.forEach(rou => {
          router.addRoute('home', rou)
        })
      }
    }
  })
  router.addRoute('home', { path: '/*', component: NotFound })
}
