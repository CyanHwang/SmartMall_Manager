import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path:'/login',component:()=>import('../views/Login.vue')},
    {path:'/register',component:()=>import('../views/Register.vue')},
    {
      path: '/',
      component: Home,
      children:[{
        path:'/',component:()=>import ('../views/Welcome.vue')
      },{
        path:'/categories',component:()=>import('../views/categories/List.vue')
      },{
        path:'/categories/create',component:()=>import('../views/categories/Edit.vue')
      },{
        path:'/categories/edit/:id',component:()=>import('../views/categories/Edit.vue',),props:true
      }]
    },
  ]
})

export default router
