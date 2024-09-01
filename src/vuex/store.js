import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const store = createStore({
  state: {
    userIdx: null,
    userId: null,
    userName: null,
    isAuth: false,
    isLogin: false,
    userRole: null,
    errorState: null,
    loadingStatus: false,
  },
  mutations,
  getters,
  actions,
  plugins: [
    // state에 있는 것들 싹 다 localstorage에
    // 넣고 새로고침할 때마다 불러와서 초기화 되는 일 없게함
    createPersistedState({
      storage: window.localStorage,
    }),
  ],
});

export default store;
