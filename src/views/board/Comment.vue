<template>
  <div class="comments-section">
    <!-- Comment Form -->
    <div class="comment-form">
      <h3>Leave a Comment</h3>
      <textarea
        v-model="newComment.content"
        :placeholder="
          isLogin
            ? 'Write your comment here...'
            : 'Please log in to leave a comment.'
        "
        class="comment-input"
        :disabled="!isLogin"
        @input="validateComment"
      ></textarea>
      <button
        v-if="isLogin"
        @click="submitComment"
        class="submit-button"
        :disabled="!canSubmit"
      >
        Submit
      </button>
      <button v-else @click="goToLogin" class="submit-button">Login</button>
    </div>

    <!-- Comment List -->
    <div class="comment-list">
      <h3>Comments</h3>
      <ul>
        <ol v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-top">
            <span>
              {{ comment.author }}
            </span>
            <span>
              <span class="comment-date">{{ comment.created_at }}</span>
              <span v-if="isCurrentUser(comment.author)">
                |
                <i
                  class="bi bi-trash-fill delete-icon"
                  @click="confirmDelete(comment.id)"
                >
                  Delete</i
                >
                |
                <i class="bi bi-pencil-square edit-icon"> Edit</i>
              </span>
            </span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </ol>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axiosInstance from "@/utils/axios";

export default {
  props: {
    board_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: [], // Comment list
      newComment: {
        author: "",
        content: "",
        board_id: this.board_id, // Will be set to the current board's ID
      },
      canSubmit: false, // 댓글 입력 여부
    };
  },
  computed: {
    ...mapGetters([
      "getUserName",
      "getErrorState",
      "getIsLogin",
      "getUserRole",
    ]),
    isLogin() {
      return this.getIsLogin;
    },
    userName() {
      return this.getUserName;
    },
  },
  mounted() {
    this.loadComments();
    if (this.isLogin) {
      this.newComment.author = this.userName;
    }
  },
  methods: {
    loadComments() {
      // Load comments for the given board
      axiosInstance
        .get(`${this.$serverUrl}/comment/board/${this.board_id}`)
        .then((response) => {
          this.comments = response.data;
        })
        .catch((error) => {
          console.error("Failed to load comments:", error);
        });
    },
    validateComment() {
      // 댓글이 공백이 아니면 canSubmit을 true로 설정
      this.canSubmit = this.newComment.content.trim().length > 0;
    },
    submitComment() {
      if (!this.newComment.content.trim()) {
        alert("Please write a comment before submitting.");
        return;
      }

      this.newComment.boardId = this.boardId;

      axiosInstance
        .post(`${this.$serverUrl}/comment`, this.newComment)
        .then((response) => {
          this.comments.push(response.data);
          this.newComment.content = ""; // Clear the comment input
          this.canSubmit = false; // 입력이 비어있으므로 canSubmit 다시 비활성화
          this.loadComments();
        })
        .catch((error) => {
          console.error("Failed to submit comment:", error);
        });
    },
    isCurrentUser(author) {
      return this.getUserName === author;
    },
    confirmDelete(commentId) {
      const confirmation = confirm("댓글을 삭제하시겠습니까?");
      if (confirmation) {
        this.deleteComment(commentId);
      }
    },
    deleteComment(commentId) {
      this.$axios
        .delete(`${this.$serverUrl}/comment/delete`, {
          params: {
            commentId: commentId,
            username: this.userName,
          },
        })
        .then(() => {
          alert("삭제되었습니다.");
          this.loadComments();
        })
        .catch((err) => {
          console.error("댓글 삭제 실패 : " + err);
        });
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.comments-section {
  margin-top: 20px;
}

.comment-form {
  margin-bottom: 20px;
}

.comment-input {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  padding: 0;
  margin-bottom: 15px;
  border: 1px solid #eee;
}

.comment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px 0 8px;
  font-weight: bold;
  background-color: rgb(228, 241, 228);
}

.comment-top span {
  display: inline-flex;
  align-items: center;
}

.comment-content {
  padding-left: 8px;
  margin: 5px 0;
}

.comment-date {
  font-size: 0.85em;
  color: #777;
  margin-right: 10px;
}

.delete-icon,
.edit-icon {
  font-size: 0.85em;
  color: #777;
  font-style: normal;
  cursor: pointer;
  margin: 5px 5px;
}
.delete-icon:hover,
.edit-icon:hover {
  color: tomato;
}
</style>
