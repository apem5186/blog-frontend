<template>
  <div class="profile-board-container">
    <h3>글 관리 ({{ paging.total_list_cnt }})</h3>
    <div v-for="board in list" :key="board.idx" class="board-card">
      <div class="board-title">
        <router-link
          :to="{ path: `/board/detail`, query: { idx: board.idx } }"
          class="board-title-link"
        >
          <h5>{{ board.title }}</h5>
        </router-link>
        <div class="board-actions">
          <button @click="deleteBoard(board.idx)" class="delete-button">
            삭제
          </button>
        </div>
      </div>
      <div class="board-info">
        <span class="board-category">{{ board.category.name }}</span
        >ㆍ<span class="board-author">{{ board.author }}</span
        >ㆍ<span class="board-date">{{ board.created_at }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="paging.total_list_cnt > 0"
      class="pagination w3-bar w3-padding-16 w3-small"
    >
      <span class="pg">
        <a
          href="javascript:;"
          @click="fnPage(1)"
          class="first w3-button w3-border"
          >&lt;&lt;</a
        >
        <a
          href="javascript:;"
          v-if="paging.start_page > 10"
          @click="fnPage(paging.start_page - 1)"
          class="prev w3-button w3-border"
          >&lt;</a
        >
        <template v-for="(n, index) in paginavigation()">
          <template v-if="paging.page === n">
            <strong class="w3-button w3-border w3-green" :key="index">{{
              n
            }}</strong>
          </template>
          <template v-else>
            <a
              class="w3-button w3-border"
              href="javascript:;"
              @click="fnPage(n)"
              :key="index"
              >{{ n }}</a
            >
          </template>
        </template>
        <a
          href="javascript:;"
          v-if="paging.total_page_cnt > paging.end_page"
          @click="fnPage(paging.end_page + 1)"
          class="next w3-button w3-border"
          >&gt;</a
        >
        <a
          href="javascript:;"
          @click="fnPage(paging.total_page_cnt)"
          class="last w3-button w3-border"
          >&gt;&gt;</a
        >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], // 게시글 목록
      paging: {}, // 페이징 데이터
      page: 1,
      size: 10,
    };
  },
  mounted() {
    this.fnGetList();
  },
  methods: {
    fnGetList() {
      this.$axios
        .get(this.$serverUrl + "/board/list", {
          params: {
            page: this.page,
            size: this.size,
          },
        })
        .then((res) => {
          if (res.data.result_code === "OK") {
            this.list = res.data.data;
            this.paging = res.data.pagination;
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load boards.");
        });
    },
    fnPage(n) {
      this.page = n;
      this.fnGetList();
    },
    paginavigation() {
      let pageNumber = [];
      let start_page = this.paging.start_page;
      let end_page = this.paging.end_page;
      for (let i = start_page; i <= end_page; i++) pageNumber.push(i);
      return pageNumber;
    },
    deleteBoard(idx) {
      if (confirm("Are you sure you want to delete this board?")) {
        this.$axios
          .delete(`${this.$serverUrl}/board/${idx}`)
          .then(() => {
            alert("Board deleted successfully.");
            this.fnGetList(); // Reload the list after deletion
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to delete board.");
          });
      }
    },
  },
};
</script>

<style scoped>
.profile-board-container {
  padding: 20px;
}

.board-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.board-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-title h5 {
  margin: 0;
}

.board-title-link {
  text-decoration: none;
  color: #333;
}

.board-title-link:hover {
  color: #42b983;
  text-decoration: underline;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delete-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #ff4d4d;
}

.board-info {
  display: flex;
  justify-content: left;
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}
</style>
