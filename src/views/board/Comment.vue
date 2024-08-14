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
        <li v-for="comment in comments" :key="comment.id" class="comment-item">
          <p class="comment-author">{{ comment.author }}</p>
          <p class="comment-content">{{ comment.content }}</p>
          <p class="comment-date">{{ comment.created_at }}</p>
        </li>
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
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.comment-author {
  font-weight: bold;
}

.comment-content {
  margin: 5px 0;
}

.comment-date {
  font-size: 0.85em;
  color: #777;
}
</style>
