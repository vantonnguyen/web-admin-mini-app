import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login-page.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
