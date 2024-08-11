// src/vuex/mutations.js
import * as types from "./mutation_types";

export default {
  [types.USER_ID](state, userId) {
    state.userId = userId;
  },
  [types.USER_NAME](state, userName) {
    state.userName = userName;
  },
  [types.ERROR_STATE](state, errorState) {
    state.errorState = errorState;
  },
  [types.IS_AUTH](state, isAuth) {
    state.isAuth = isAuth;
  },
  [types.IS_LOGIN](state, isLogin) {
    state.isLogin = isLogin;
  },
  [types.USER_ROLE](state, userRole) {
    state.userRole = userRole;
  },
  [types.LOADING_STATUS](state, loadingStatus) {
    state.loadingStatus = loadingStatus;
  },
  SET_IS_LOGIN(state, status) {
    state.isLogin = status;
  },
};
