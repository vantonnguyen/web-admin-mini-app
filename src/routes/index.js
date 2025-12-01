import { createRouter, createWebHistory } from "vue-router";
import mainLayout from "@/layout/main-layout.vue";
import Home from "@/views/home/home.vue";
import LoginPage from "@/views/login/login-page.vue";
import CategoryPage from "@/views/category/category-page.vue";
import VocubularyPage from "@/views/vocabulary/vocubulary-page.vue";
import zaloUserPage from "@/views/zalo-user/zalo-user-page.vue";
import { check } from "@/api/auth";

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
      {
        path: "/categories",
        name: "Category Page",
        component: CategoryPage,
      },
      {
        path: "/vocabularies",
        name: "Vocabulary Page",
        component: VocubularyPage,
      },
      {
        path: "/zalo-users",
        name: "Zalo User Page",
        component: zaloUserPage,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (to.path !== "/login" && (!user || user.role !== "admin")) {
    next("/login");
  } else {
    next();
  }
});

window.addEventListener("load", () => {
  check()
    .then((res) => {
      if (res) {
      } else {
        localStorage.removeItem("user");
      }
    })
    .catch(() => {
      localStorage.removeItem("user");
    });
});

export default router;
