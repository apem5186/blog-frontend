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
    <div v-if="selectedMenu === 1" class="category-list">
      <div class="add-category">
        <button @click="toggleAddCategory" class="add-button">
          {{ showCategoryForm ? "Close" : "Add" }}
        </button>
      </div>
      <div v-if="showCategoryForm" class="category-form">
        <input
          v-model="newCategory"
          type="text"
          placeholder="새 카테고리 입력"
          @input="checkDuplicateCategory"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button @click="registerCategory" class="register-button">등록</button>
      </div>
      <hr />
      <div v-for="category in list" :key="category.id" class="category-item">
        <div class="category-text">
          {{ category.name }}
        </div>
        <i class="bi bi-x delete-icon" @click="confirmDelete(category)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedMenu: null, // 선택된 메뉴를 추적하기 위한 상태
      menuItems: ["프로필", "카테고리", "게시글", "댓글"], // 메뉴 항목 배열
      list: [], // 카테고리 목록
      showCategoryForm: false, // 카테고리 추가 폼 표시 여부
      newCategory: "", // 새 카테고리 이름
      errorMessage: "", // 에러 메시지
    };
  },
  computed: {
    ...mapGetters(["getIsLogin"]),
    isLogin() {
      return this.getIsLogin;
    },
  },
  methods: {
    selectMenu(index) {
      // 동일한 메뉴를 클릭하면 선택 해제, 아니면 선택
      this.selectedMenu = this.selectedMenu === index ? null : index;
      if (index === 1) {
        this.fetchCategories();
      }
    },
    fetchCategories() {
      this.$axios
        .get(this.$serverUrl + "/board/list/category/categoryList")
        .then((response) => {
          this.list = response.data; // 받은 데이터를 list 변수에 저장
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    },
    toggleAddCategory() {
      this.showCategoryForm = !this.showCategoryForm;
      this.errorMessage = ""; // 폼을 열 때 에러 메시지 초기화
      this.newCategory = ""; // 폼을 열 때 입력 필드 초기화
    },
    checkDuplicateCategory() {
      if (this.list.some((category) => category.name === this.newCategory)) {
        this.errorMessage = "There is already a same category.";
      } else {
        this.errorMessage = "";
      }
    },
    registerCategory() {
      if (this.errorMessage) {
        alert("There is already a same category.");
      } else {
        this.$axios
          .post(this.$serverUrl + "/board/list/category", this.newCategory, {
            headers: { "Content-Type": "text/plain" },
          })
          .then((response) => {
            this.list.push(response.data); // 새로운 카테고리를 리스트에 추가
            this.newCategory = ""; // 입력 폼 초기화
            this.showCategoryForm = false; // 폼 숨기기
            this.errorMessage = ""; // 에러 메시지 초기화
          })
          .catch((error) => {
            console.error("Error registering category:", error);
          });
      }
    },
    confirmDelete(category) {
      const confirmation = confirm(
        `Are you sure you want to delete the ${category.name} category?`
      );
      if (confirmation) {
        this.deleteCategory(category.id);
      }
    },
    deleteCategory(id) {
      this.$axios
        .delete(`${this.$serverUrl}/board/list/category/${id}`)
        .then(() => {
          this.list = this.list.filter((category) => category.id !== id);
          alert("Category deleted successfully.");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete category.");
        });
    },
    redirectToLogin() {
      alert("로그인 후 이용가능합니다.");
      this.$router.push("/login");
    },
  },
  mounted() {
    if (!this.isLogin) {
      this.redirectToLogin();
    }
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

.category-list {
  width: 100%;
  max-width: 400px; /* 부모 요소와 너비 일치 */
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.category-text {
  cursor: pointer;
  user-select: none;
}

.category-text:hover {
  background-color: #42b883;
  color: white;
  border-radius: 4px;
  padding: 5px;
}

.delete-icon {
  color: red;
  cursor: pointer;
  margin-left: 10px;
}

.add-category {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.add-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #2c3e50;
}

.category-form {
  margin-top: 10px;
  display: flex;
  align-items: center;
  width: 100%;
}

.category-form input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.register-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: auto;
}

.register-button:hover {
  background-color: #2c3e50;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
