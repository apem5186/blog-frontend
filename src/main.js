import "./assets/common.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import axios from "./utils/axios";
import store from "./vuex/store";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
app.config.globalProperties.$axios = axios; //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
// app.config.globalProperties.$serverUrl = "//localhost:8081"; // api server
app.config.globalProperties.$serverUrl =
  "//ec2-43-201-145-111.ap-northeast-2.compute.amazonaws.com:8081"; // ec2 server 배포할 땐 이걸로 해야함
app.use(router).use(store).mount("#app");
