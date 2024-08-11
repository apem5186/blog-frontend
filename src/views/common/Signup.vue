<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="userId"></label>
        <input
          type="text"
          id="userId"
          v-model="user_id"
          required
          placeholder="아이디"
        />
        {{ userId }}
      </div>
      <div>
        <label for="userName"></label>
        <input
          type="text"
          id="userName"
          v-model="user_name"
          required
          placeholder="이름"
        />
        {{ userName }}
      </div>
      <div>
        <label for="userPw"></label>
        <input
          type="password"
          id="userPw"
          v-model="user_pw"
          required
          placeholder="비밀번호"
        />
        {{ userPw }}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user_id: "",
      user_name: "",
      user_pw: "",
    };
  },
  methods: {
    async submitForm() {
      const apiUrl = "http://localhost:8081/user/save";
      const form = {
        user_id: this.user_id,
        user_name: this.user_name,
        user_pw: this.user_pw,
      };

      console.log("Form Data: ", form); // Debug: Log form data

      try {
        const response = await axios.post(apiUrl, form, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (response) {
          alert("회원가입이 완료되었습니다.");
          this.goToPages();
        }
      } catch (err) {
        console.error("Error: ", err);
        if (err.message.includes("Network Error")) {
          alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
        } else {
          alert("회원가입 중 오류가 발생했습니다.");
        }
      }
    },
    goToPages() {
      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>

<style scoped>
.signup {
  max-width: 300px;
  margin: 0 auto;
}
.signup h2 {
  text-align: center;
}
.signup form {
  display: flex;
  flex-direction: column;
}
.signup form div {
  margin-bottom: 15px;
}
.signup form label {
  margin-bottom: 5px;
}
.signup form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.signup form button {
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.signup form button:hover {
  background-color: #218838;
}
</style>
