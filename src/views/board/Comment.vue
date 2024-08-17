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
          <div class="comment-top">
            <span>{{ comment.author }}</span>
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
                <i
                  class="bi bi-pencil-square edit-icon"
                  @click="toggleEditForm(comment.id)"
                >
                  Edit</i
                >
              </span>
            </span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
          <div class="edit-comment">
            <div
              class="edit-comment-container"
              v-if="editCommentId === comment.id"
            >
              <div class="edit-comment-info">
                <div class="edit-comment-user-info">
                  <span class="edit-comment-title">댓글 수정&nbsp;&nbsp;</span>
                  <input
                    class="edit-comment-user-input"
                    type="text"
                    :value="comment.author"
                    disabled
                  />
                </div>
              </div>
              <div class="edit-comment-textarea-wrapper">
                <textarea
                  class="edit-comment-textarea"
                  v-model="editCommentContent"
                  placeholder="수정할 내용을 입력해주세요."
                  maxlength="8000"
                  required
                  tabindex="108"
                  style="height: 99.5px"
                ></textarea>
                <div class="edit-comment-submit-button-wrapper">
                  <button
                    type="submit"
                    class="edit-comment-submit-button"
                    tabindex="109"
                    @click="submitEditComment(comment.id, comment.author)"
                  >
                    작성
                  </button>
                </div>
              </div>
            </div>
          </div>
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
      editCommentId: null, // 현재 수정 중인 댓글의 ID
      editCommentContent: "", // 수정 중인 댓글의 내용
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
    toggleEditForm(commentId) {
      if (this.editCommentId === commentId) {
        // 이미 수정 중인 댓글을 다시 클릭하면 취소
        this.cancelEdit();
      } else {
        // 수정할 댓글을 클릭하면 해당 댓글의 ID와 내용을 설정
        this.editCommentId = commentId;
        const comment = this.comments.find((c) => c.id === commentId);
        this.editCommentContent = comment.content;
      }
    },
    cancelEdit() {
      // 수정 취소
      this.editCommentId = null;
      this.editCommentContent = "";
    },
    submitEditComment(commentId, author) {
      if (!this.editCommentContent.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
      }

      // 수정된 댓글을 서버에 저장하는 로직
      const updatedComment = {
        id: commentId,
        author: author,
        content: this.editCommentContent,
      };

      // 서버에 PATCH 요청 보내기
      this.$axios
        .patch(`${this.$serverUrl}/comment/update`, updatedComment)
        .then(() => {
          const index = this.comments.findIndex((c) => c.id === commentId);
          if (index !== -1) {
            this.comments[index].content = this.editCommentContent;
          }
          this.cancelEdit(); // 수정 완료 후 폼 숨기기
        })
        .catch((error) => {
          console.error("댓글 수정 실패:", error);
        });
    },
  },
  goToLogin() {
    this.$router.push("/login");
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

li {
  list-style-type: none;
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

.edit-comment {
  margin: 1em 0 1em;
}

.edit-comment-container {
  position: relative;
  border: 1px solid;
  border-color: #bbb;
  border-radius: 5px;
}

.edit-comment-info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid;
  border-color: #bbb;
  overflow: hidden;
}

.edit-comment-user-info {
  display: flex;
  padding: 0.5em;
  flex-grow: 1;
  overflow: hidden;
}

.edit-comment-title {
  display: block;
  font-size: 0.9em;
  user-select: none;
}

.edit-comment-user-input {
  opacity: 0.5;
  user-select: none;
  border: none;
}

.edit-comment-textarea-wrapper {
  position: relative;
  padding: 0.5em 0.5em 0;
  display: block;
}

.edit-comment-textarea {
  border: none;
  width: 100%;
  min-height: 4em;
  overflow: hidden;
  resize: none;
  background-color: transparent;
}

.edit-comment-textarea:focus {
  outline: none;
}

.edit-comment-submit-button-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  justify-content: flex-end;
  padding-bottom: 0.5em;
  padding-right: 0.5em;
}

.edit-comment-submit-button {
  padding: 0.25em 1.5em;
  border: 1px solid;
  border-color: #bbb;
  background-color: #fff;
  border-radius: 4px;
  transition-duration: 0.3s;
}

.edit-comment-submit-button:hover {
  background-color: #eee;
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
