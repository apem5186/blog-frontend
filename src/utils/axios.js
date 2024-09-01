import axios from "axios";
import store from "@/vuex/store";
import router from "@/router";

// 로그아웃 함수 정의
function logout() {
  localStorage.removeItem("user_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("vuex");
  store.commit("SET_IS_LOGIN", false);
  store.commit("USER_ID", null);
  store.commit("USER_NAME", null);
  store.commit("USER_ROLE", null);
  store.commit("ERROR_STATE", null);
  store.commit("IS_AUTH", false);
  store.commit("LOADING_STATUS", false); // LoadingBar 숨기기
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  store.commit("LOADING_STATUS", true);

  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    store.commit("LOADING_STATUS", false);
    return response;
  },
  (error) => {
    store.commit("LOADING_STATUS", false); // 에러 시 LOADING_STATUS 설정

    // 에러 뒷처리, 추후 error code로 error 분류예정
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      alert("세션이 만료되었습니다. 로그인을 해주세요.");
      logout();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
