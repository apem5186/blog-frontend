import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Detail from "@/views/board/Detail.vue";
import Write from "@/views/board/Write.vue";
import Login from "@/views/common/Login.vue";
import Signup from "@/views/common/Signup.vue";
import Profile from "@/views/common/Profile.vue";
import store from "@/vuex/store";
import List from "@/views/board/List.vue";

const requireAuth = () => (from, to, next) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    store.state.isLogin = true;
    return next();
  }
  next("/login");
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/board/list",
    name: "List",
    component: List,
  },
  {
    path: "/board/detail",
    name: "Detail",
    component: Detail,
  },
  {
    path: "/board/write",
    name: "Write",
    component: Write,
    beforeEnter: requireAuth(),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
