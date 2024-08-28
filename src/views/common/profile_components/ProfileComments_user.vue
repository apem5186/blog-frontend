<template>
  <div class="profile-comments">
    <h3>댓글 관리 ({{ this.totalElements }})</h3>
    <div v-if="comments.length === 0">
      <p>No comments found.</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-card">
            <div class="comment-header">
              <span>{{ comment.author }}</span>
              <span>
                <span class="comment-date">{{ comment.created_at }}</span>
                <span>
                  |
                  <i
                    class="bi bi-trash-fill delete-icon"
                    @click="confirmDelete(comment.id, comment.author)"
                  >
                    Delete
                  </i>
                </span>
              </span>
            </div>
            <div class="comment-body">
              <router-link
                :to="{
                  path: `/board/detail`,
                  query: { idx: comment.board_id },
                }"
                class="comment-content-link"
              >
                <p class="comment-content">
                  {{ truncatedContent(comment.content) }}
                </p>
              </router-link>
            </div>
            <div class="comment-footer">
              <span class="comment-board-info">
                {{ comment.board_category }} · {{ comment.board_title }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <button @click="fnPage(1)" :disabled="currentPage === 1">
          &lt;&lt;
        </button>
        <button @click="fnPage(currentPage - 1)" :disabled="currentPage === 1">
          &lt;
        </button>
        <button
          v-for="n in visiblePages"
          :key="n"
          @click="fnPage(n)"
          :class="{ active: currentPage === n }"
        >
          {{ n }}
        </button>
        <button
          @click="fnPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          &gt;
        </button>
        <button
          @click="fnPage(totalPages)"
          :disabled="currentPage === totalPages"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      comments: [], // 댓글 리스트
      currentPage: 1, // 현재 페이지 번호
      totalElements: 0, // 전체 댓글 수
      totalPages: 1, // 전체 페이지 수
      pageSize: 10, // 한 페이지에 표시할 댓글 수
      pageWindowSize: 10, // Number of pages to display in the pagination bar
    };
  },
  computed: {
    ...mapGetters(["getUserName"]),
    username() {
      return this.getUserName;
    },
    visiblePages() {
      const startPage =
        Math.floor((this.currentPage - 1) / this.pageWindowSize) *
          this.pageWindowSize +
        1;
      const endPage = Math.min(
        startPage + this.pageWindowSize - 1,
        this.totalPages
      );

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    fetchComments() {
      const params = {
        page: this.currentPage,
        size: this.pageSize,
      };
      axiosInstance
        .get(`${this.$serverUrl}/comment/comments/${this.username}`, { params })
        .then((response) => {
          this.comments = response.data.content; // 댓글 리스트
          this.totalPages = response.data.total_pages; // 전체 페이지 수
          this.totalElements = response.data.total_elements;
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    },
    fnPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
        this.fetchComments(); // Reload the comment list when the page changes
      }
    },
    confirmDelete(commentId, username) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
        this.deleteComment(commentId, username);
      }
    },
    deleteComment(commentId, username) {
      axiosInstance
        .delete(`${this.$serverUrl}/comment/delete`, {
          params: { commentId, username },
        })
        .then(() => {
          this.fetchComments(); // 삭제 후 댓글 리스트 갱신
        })
        .catch((error) => {
          console.error("Error deleting comment:", error);
        });
    },
    isCurrentUser(author) {
      // 댓글 작성자와 현재 로그인 한 유저 비교 // 아직 쓰이는 곳 없음
      return author === this.$store.getters.getUserName;
    },
    truncatedContent(content) {
      const maxLength = 30; // 최대 글자 수
      return content.length > maxLength
        ? content.slice(0, maxLength) + " ···"
        : content;
    },
  },
  mounted() {
    this.fetchComments(); // 컴포넌트 로드 시 댓글 리스트 불러오기
  },
};
</script>

<style scoped>
.profile-comments {
  margin-top: 20px;
}

.comment-item {
  border: 1px solid #ddd;
  margin-bottom: 7px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

li {
  list-style-type: none;
}

.comment-card {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 5px;
}

.comment-header,
.comment-footer {
  display: flex;
  justify-content: space-between;
}

.comment-body {
  display: flex;
  margin-bottom: 10px;
  justify-content: flex-start;
}

.comment-content-link {
  text-decoration: none;
  color: #333;
}

.comment-content-link:hover .comment-content {
  text-decoration: underline;
}

.comment-content {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.comment-date {
  margin-left: 0.5em;
  font-size: 0.85em;
  color: #777;
}

.comment-board-info {
  font-size: 0.85em;
  color: #999;
}

.delete-icon {
  cursor: pointer;
  font-style: normal;
}

.delete-icon:hover {
  color: red;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination button {
  padding: 5px 15px;
  border: 1px solid;
  border-color: #ddd;
  cursor: pointer;
  background-color: white;
}

.pagination button.active {
  background-color: #42b983;
  color: white;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
