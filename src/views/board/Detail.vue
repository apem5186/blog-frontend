<template>
  <div class="board-detail">
    <div class="common-buttons-top">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnUpdate"
        v-if="isAdmin"
      >
        수정
      </button>
      <button
        type="button"
        class="w3-button w3-round w3-red"
        v-on:click="fnDelete"
        v-if="isAdmin"
      >
        삭제
      </button>
      <button
        type="button"
        class="w3-button w3-round w3-gray"
        v-on:click="fnList"
      >
        목록
      </button>
    </div>
    <div class="board-contents">
      <h3>{{ title }}</h3>
      <div>
        <span class="w3-large">{{ author }}</span>
        <br />
        <span>{{ created_at }}</span>
      </div>
    </div>
    <div class="board-contents">
      <span>{{ contents }}</span>
    </div>
    <div class="common-buttons-bottom">
      <div class="like-container">
        <i
          class="bi"
          :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"
          @click="toggleLike"
          style="cursor: pointer; color: red; font-size: 16px"
        ></i>
        <span class="like-count">{{ likeCount }}</span>
        <i
          class="bi bi-eye-fill"
          style="
            user-select: none;
            color: #999;
            font-size: 20px;
            margin-left: 8px;
          "
        ></i>
        <span class="view-count">{{ viewCount }}</span>
      </div>
      <div style="flex-grow: 1"></div>
      <div class="button-container">
        <button
          type="button"
          class="w3-button w3-round w3-blue-gray"
          v-on:click="fnUpdate"
          v-if="isAdmin"
        >
          수정
        </button>
        <button
          type="button"
          class="w3-button w3-round w3-red"
          v-on:click="fnDelete"
          v-if="isAdmin"
        >
          삭제
        </button>
        <button
          type="button"
          class="w3-button w3-round w3-gray"
          v-on:click="fnList"
        >
          목록
        </button>
      </div>
    </div>
    <Comment :board_id="idx" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Comment from "./Comment.vue";

export default {
  components: {
    Comment,
  },
  computed: {
    ...mapGetters(["getUserRole", "getUserIdx", "getIsLogin"]),
    isAdmin() {
      return this.getUserRole === "ROLE_ADMIN";
    },
    userIdx() {
      console.log("USER IDX : " + this.getUserIdx);
      return this.getUserIdx;
    },
    isLogin() {
      return this.getIsLogin;
    },
  },
  data() {
    // 변수생성
    return {
      requestBody: this.$route.query,
      idx: this.$route.query.idx,
      title: "",
      author: "",
      contents: "",
      created_at: "",
      isLiked: false, // 좋아요 상태
      likeCount: 0, // 좋아요 개수
      viewCount: 0, // 조회수 개수
    };
  },
  mounted() {
    this.checkIfLiked(); // 현재 사용자가 이미 좋아요를 눌렀는지 확인
    this.getLikeCount(); // 좋아요 갯수 확인
    this.incrementViewCount(); // 조회수 증가
    this.getViewCount(); // 조회수 갯수 확인
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      this.$axios
        .get(this.$serverUrl + "/board/" + this.idx, {
          params: this.requestBody,
        })
        .then((res) => {
          this.title = res.data.title;
          this.author = res.data.author;
          this.contents = res.data.contents;
          this.created_at = res.data.created_at;
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원할하지 않습니다.\n잠시 후 다시 시도해주세요.");
          }
        });
    },

    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./list",
        query: this.requestBody,
      });
    },

    fnUpdate() {
      this.$router.push({
        path: "./write",
        query: this.requestBody,
      });
    },

    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return;

      this.$axios
        .delete(this.$serverUrl + "/board/" + this.idx, {})
        .then(() => {
          alert("삭제되었습니다.");
          this.fnList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    incrementViewCount() {
      const viewedPosts = sessionStorage.getItem("viewedPosts")
        ? JSON.parse(sessionStorage.getItem("viewedPosts"))
        : [];

      if (!viewedPosts.includes(this.idx)) {
        this.$axios
          .post(`${this.$serverUrl}/board/${this.idx}/view`)
          .then(() => {
            viewedPosts.push(this.idx);
            sessionStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
          })
          .catch((err) => {
            console.log(err);
          });
        this.getViewCount();
      }
    },

    getViewCount() {
      this.$axios
        .get(`${this.$serverUrl}/board/${this.idx}/view-count`)
        .then((res) => {
          this.viewCount = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getLikeCount() {
      this.$axios
        .get(`${this.$serverUrl}/board/like/count/` + this.idx)
        .then((res) => {
          this.likeCount = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    checkIfLiked() {
      if (this.isLogin) {
        // 좋아요 상태를 확인하는 API 호출
        this.$axios
          .get(`${this.$serverUrl}/board/like/check`, {
            params: {
              boardId: this.idx,
              userId: this.userIdx,
            },
          })
          .then((res) => {
            this.isLiked = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    toggleLike() {
      if (!this.isLogin) {
        this.redirectToLogin();
        return;
      }
      const likeDto = {
        // backend에서 property-naming-strategy: SNAKE_CASE로 해놔서 board_id, user_id 이렇게 해야함
        // checkIfLiked에서는 param으로 전달해서 그럴필요없음
        board_id: Number(this.idx),
        user_id: this.userIdx,
      };

      if (this.isLiked) {
        // 이미 좋아요가 눌린 상태일 때
        this.$axios
          .delete(`${this.$serverUrl}/board/like`, { data: likeDto })
          .then(() => {
            this.isLiked = false;
            this.likeCount--;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // 좋아요가 눌리지 않은 상태일 때
        this.$axios
          .post(`${this.$serverUrl}/board/like`, likeDto)
          .then(() => {
            this.isLiked = true;
            this.likeCount++;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    redirectToLogin() {
      alert("로그인 후 이용가능합니다.");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.common-buttons-top {
  display: flex;
  justify-content: right;
  gap: 2px;
}

.common-buttons-bottom {
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.like-container {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.button-container {
  display: flex;
  gap: 2px; /* Add some space between the buttons */
}

.view-count,
.like-count {
  margin-left: 0.5em;
  font-weight: bold;
  font-size: 0.75em;
}
</style>
