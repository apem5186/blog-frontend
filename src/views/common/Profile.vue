<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>Profile</h2>
    </div>
    <div class="profile-menu">
      <span
        v-for="(menu, index) in menuItems"
        :key="index"
        :class="['menu-item', { active: selectedMenu === index }]"
        @click="selectMenu(index)"
      >
        {{ menu }}
      </span>
    </div>
    <hr />
    <ProfileComments v-if="selectedMenu === 3 && this.isAdmin" />
    <ProfileBoard v-if="selectedMenu === 2 && this.isAdmin" />
    <ProfileComments_user v-if="selectedMenu === 2 && !this.isAdmin" />
    <ProfileCategory v-if="selectedMenu === 1 && this.isAdmin" />
    <ProfileBoard_liked v-if="selectedMenu === 1 && !this.isAdmin" />
    <ProfileUserInfo v-if="selectedMenu === 0" />
  </div>
</template>

<script>
import ProfileBoard from "./profile_components/ProfileBoard.vue";
import ProfileCategory from "./profile_components/ProfileCategory.vue";
import ProfileComments from "./profile_components/ProfileComments.vue";
import ProfileUserInfo from "./profile_components/ProfileUserInfo.vue";
import ProfileComments_user from "./profile_components/ProfileComments_user.vue";
import ProfileBoard_liked from "./profile_components/ProfileBoard_liked.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ProfileCategory,
    ProfileUserInfo,
    ProfileBoard,
    ProfileComments,
    ProfileComments_user,
    ProfileBoard_liked,
  },
  computed: {
    ...mapGetters(["getUserRole", "getIsLogin"]),
    isAdmin() {
      return this.getUserRole === "ROLE_ADMIN";
    },
    isLogin() {
      return this.getIsLogin;
    },
    menuItems() {
      // If the user is an admin, show all menu items; otherwise, only show 'Profile'
      return this.isAdmin
        ? ["프로필", "카테고리", "게시글", "댓글"]
        : ["프로필", "좋아요", "댓글"];
    },
  },
  data() {
    return {
      selectedMenu: null, // 상태를 추적하기 위한 변수
    };
  },
  mounted() {
    this.redirectToLogin();
  },
  methods: {
    selectMenu(index) {
      // 동일한 메뉴를 클릭하면 선택 해제, 아니면 선택
      this.selectedMenu = this.selectedMenu === index ? null : index;
    },
    redirectToLogin() {
      if (!this.isLogin) {
        alert("로그인 후 이용가능합니다.");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 70vh;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.profile-menu {
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

.menu-item {
  padding: 10px 15px;
  margin: 5px;
  background-color: #42b883;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #2c3e50;
}

.menu-item.active {
  background-color: #2c3e50; /* 클릭 시 색상 유지 */
}

hr {
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  border: none;
  border-top: 1px solid #ccc;
}
</style>
