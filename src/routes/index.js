import { createRouter, createWebHistory } from "vue-router";
import mainLayout from "@/layout/main-layout.vue";
import Home from "@/views/home/home.vue";

const routes = [
  {
    path: "/",
    component: mainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
    ],
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
