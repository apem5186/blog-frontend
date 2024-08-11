<template>
  <div class="left-sidebar">
    <h3>카테고리</h3>
    <ul>
      <li @click="selectTotalPosts">전체 글 ({{ totalBoardCounts }})</li>
      <li
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
      >
        {{ category.name }} ({{ postCounts[category.name] || 0 }})
      </li>
    </ul>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";

export default {
  data() {
    return {
      categories: [], // Categories list
      postCounts: {}, // Post counts by category
      totalBoardCounts: "",
    };
  },
  mounted() {
    this.loadCategories();
    this.loadPostCounts();
    this.loadBoardCounts();
  },
  methods: {
    loadCategories() {
      // 카테고리 목록을 서버에서 불러오는 로직
      this.$axios
        .get(this.$serverUrl + "/board/list/category/categoryList")
        .then((res) => {
          this.categories = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadPostCounts() {
      axiosInstance
        .get(this.$serverUrl + "/board-count-by-category")
        .then((res) => {
          this.postCounts = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadBoardCounts() {
      this.$axios
        .get(this.$serverUrl + "/total-boards")
        .then((res) => {
          this.totalBoardCounts = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectTotalPosts() {
      this.$emit("totalPostsSelected");
    },
    selectCategory(category) {
      // 선택된 카테고리에 따라 리스트 필터링 로직
      this.$emit("categorySelected", category);
    },
  },
};
</script>

<style scoped>
.left-sidebar {
  width: 300px;
  padding: 20px;
  text-align: left;
  margin-left: 2%;
}

.left-sidebar h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.left-sidebar ul {
  list-style-type: none;
  padding: 0;
}

.left-sidebar li {
  cursor: pointer;
  padding: 8px 0;
}

.left-sidebar li:hover {
  background-color: #eee;
}
</style>
