<template>
  <div class="wrapper">
    <div>
      <div>
        <h2>Please Log In</h2>
        <div id="loginForm">
          <form @submit.prevent="fnLogin">
            <p>
              <input
                class="w3-input"
                name="uid"
                placeholder="Enter your ID"
                v-model="user_id"
              /><br />
            </p>
            <p>
              <input
                name="password"
                class="w3-input"
                placeholder="Enter your password"
                v-model="user_pw"
                type="password"
              />
            </p>
            <p>
              <button type="submit" class="w3-button w3-green w3-round">
                Login
              </button>
            </p>
            <hr />
            <router-link to="/signup">회원가입</router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      user_id: "",
      user_pw: "",
    };
  },
  methods: {
    ...mapActions(["login"]), //vuex/actions에 있는 login 함수

    async fnLogin() {
      if (this.user_id === "") {
        alert("ID를 입력하세요.");
        return;
      }

      if (this.user_pw === "") {
        alert("비밀번호를 입력하세요.");
        return;
      }

      // 로그인 API 호출
      try {
        let loginResult = await this.login({
          user_id: this.user_id,
          user_pw: this.user_pw,
        });
        if (loginResult) this.goToPages();
      } catch (err) {
        if (err.message.indexOf("Network Error") > -1) {
          alert("서버에 접속할 수 없습니다. 상태를 확인해주세요.");
        } else {
          console.error("ERROR : " + err);
          console.error(err.response);
          alert("로그인 정보를 확인할 수 없습니다.");
        }
      }
    },
    goToPages() {
      this.$router.push({
        name: "List",
      });
    },
  },
  computed: {
    ...mapGetters({
      errorState: "getErrorState",
    }),
  },
};
</script>

<style>
.wrapper {
  display: flex;
  align-items: top;
  justify-content: center;
  min-height: 100vh; /* Viewport의 높이로 설정 */
}
#loginForm {
  width: 500px;
}
#loginForm button {
  width: 300px;
}
</style>
