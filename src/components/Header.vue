<!-- Header.vue -->
<template>
  <header>
    <div id="header-content">
      <div id="site-title">
        <router-link to="/" class="title">Blog-Platform</router-link>
        <div v-if="isLogin" class="user-profile">
          <i class="bi bi-person-circle profile-icon" @click="toggleMenu"></i>
          <div v-if="menuVisible" class="dropdown-menu">
            <router-link to="/profile">상세정보</router-link>
            <router-link to="/">그냥넣어봄ㅋㅋ</router-link>
            <a @click="fnLogout">로그아웃</a>
          </div>
        </div>
      </div>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/board/list">게시판</router-link> |
        <router-link to="/login" v-if="!isLogin">로그인</router-link>
        <a v-if="isLogin" @click="fnLogout">로그아웃</a>
        {{ isLogin }}
      </div>
    </div>
  </header>
  <hr />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      menuVisible: false,
    };
  },
  computed: {
    ...mapGetters(["getIsLogin"]),
    isLogin() {
      return this.getIsLogin;
    },
  },
  methods: {
    toggleMenu(event) {
      event.stopPropagation();
      this.menuVisible = !this.menuVisible;
      console.log(this.menuVisible);
    },
    fnLogout() {
      this.$store.commit("LOADING_STATUS", true); // LoadingBar 표시

      localStorage.removeItem("user_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("vuex");
      this.$store.commit("SET_IS_LOGIN", false);
      this.$store.commit("USER_ID", null);
      this.$store.commit("USER_NAME", null);
      this.$store.commit("USER_ROLE", null);
      this.$store.commit("ERROR_STATE", null);
      this.$store.commit("IS_AUTH", false);

      setTimeout(() => {
        this.$store.commit("LOADING_STATUS", false); // LoadingBar 숨기기
        location.reload();
      }, 500); // 로딩 상태를 보여주기 위해 약간의 지연을 추가
    },
    closeMenu(event) {
      if (!this.$el.contains(event.target)) {
        this.menuVisible = false;
      }
    },
  },
  watch: {
    menuVisible(value) {
      console.log(value);
      if (value) {
        document.addEventListener("click", this.closeMenu);
      } else {
        document.removeEventListener("click", this.closeMenu);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeMenu);
  },
};
</script>

<style scoped>
#header-content {
  text-align: left;
  padding-top: 30px;
  padding-left: 30px;
}

#site-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-profile {
  position: relative;
  margin-right: 60px;
}

.profile-icon {
  font-size: 24px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 100px;
  background-color: #f9f9f9;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.dropdown-menu a {
  font-size: 12px;
  text-decoration: none;
  color: black;
  padding: 8px;
}

.dropdown-menu a:hover {
  background-color: #f1f1f1;
}

#site-title a {
  text-decoration: none;
  color: #2c3e50;
}
#site-title .title {
  color: #42b883;
}
a {
  cursor: pointer;
  text-decoration: underline;
}
</style>
