import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/sign-in", component: () => import("../views/Login.vue") ,meta:{isPublic:true}},
    { path: "/sign-up", component: () => import("../views/Register.vue"),meta:{isPublic:true} },
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "/",
          component: () => import("../views/Welcome.vue"),
        },
        {
          path: "/categories",
          component: () => import("../views/categories/List.vue"),
        },

        {
          path: "/products",
          component: () => import("../views/products/List.vue"),
        },
        {
          path: "/products/create",
          component: () => import("../views/products/Edit.vue"),
        },
        {
          path: "/products/edit/:id",
          component: () => import("../views/products/Edit.vue"),
          props: true,
        },
      ],
    },
  ],
});

router.beforeEach((to,from,next)=>{
  if(!to.meta.isPublic&&!localStorage.token){
    return next('/sign-in')
  }
  next()
})

export default router;
