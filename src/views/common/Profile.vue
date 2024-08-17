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
    <ProfileBoard v-if="selectedMenu === 2" />
    <ProfileCategory v-if="selectedMenu === 1" />
    <ProfileUserInfo v-if="selectedMenu === 0" />
  </div>
</template>

<script>
import ProfileBoard from "./profile_components/ProfileBoard.vue";
import ProfileCategory from "./profile_components/ProfileCategory.vue";
import ProfileUserInfo from "./profile_components/ProfileUserInfo.vue";

export default {
  components: {
    ProfileCategory,
    ProfileUserInfo,
    ProfileBoard,
  },
  data() {
    return {
      selectedMenu: null, // 선택된 메뉴를 추적하기 위한 상태
      menuItems: ["프로필", "카테고리", "게시글", "댓글"], // 메뉴 항목 배열
    };
  },
  methods: {
    selectMenu(index) {
      // 동일한 메뉴를 클릭하면 선택 해제, 아니면 선택
      this.selectedMenu = this.selectedMenu === index ? null : index;
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
