// src/vuex/actions.js
import {
  USER_ID,
  USER_NAME,
  IS_AUTH,
  IS_LOGIN,
  USER_ROLE,
  ERROR_STATE,
} from "./mutation_types";
import loginAPI from "../service/loginAPI";

let setUserId = ({ commit }, data) => {
  console.log("setting user ID : " + data);
  commit(USER_ID, data);
};

let setUserName = ({ commit }, data) => {
  console.log("setting userName : " + data);
  commit(USER_NAME, data);
};

let setErrorState = ({ commit }, data) => {
  commit(ERROR_STATE, data);
};

let setIsAuth = ({ commit }, data) => {
  commit(IS_AUTH, data);
};

let setUserRole = ({ commit }, data) => {
  console.log("setting user Role : " + data);
  commit(USER_ROLE, data);
};

let setIsLogin = ({ commit }, data) => {
  commit(IS_LOGIN, data);
};

// 백엔드에서 반환한 결과값을 가지고 로그인 성공 실패 여부를 vuex에 넣어준다.
let processResponse = (store, loginResponse) => {
  switch (loginResponse) {
    case "notFound":
      setErrorState(store, "Wrong ID or Password");
      setIsAuth(store, false);
      break;
    default:
      setUserId(store, loginResponse.data.user_id);
      setUserName(store, loginResponse.data.user_name);
      setErrorState(store, "");
      setIsAuth(store, true);
      setIsLogin(store, true);
      setUserRole(store, loginResponse.data.user_role);
  }
};

export default {
  async login(store, { user_id, user_pw }) {
    let loginResponse = await loginAPI.doLogin(user_id, user_pw);
    processResponse(store, loginResponse);
    return store.getters.getIsAuth; // 로그인 결과를 리턴한다.
  },
};
