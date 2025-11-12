import { createRouter, createWebHistory } from "vue-router";
import mainLayout from "@/layout/main-layout.vue";
import Home from "@/views/home/home.vue";
import LoginPage from "@/views/login/login-page.vue";

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

// Navigation guard kiểm tra quyền admin
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.path !== '/login' && (!user || user.role !== 'admin')) {
    next('/login'); // Nếu không phải admin, chuyển về trang login
  } else {
    next(); // Nếu là admin hoặc đang ở trang login, cho phép truy cập
  }
});

export default router;
