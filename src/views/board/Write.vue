<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnSave"
      >
        저장
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
      <div class="category-selection">
        <label for="category">카테고리 선택:</label>
        <select v-model="selectedCategory" id="category">
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="errors.category" class="error-message">
          {{ errors.category }}
        </p>
      </div>
      <input
        type="text"
        v-model="title"
        class="w3-input w3-border"
        placeholder="제목을 입력해주세요."
      />
      <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
    </div>
    <div class="board-contents">
      <textarea
        id=""
        cols="30"
        rows="10"
        v-model="contents"
        class="w3-input w3-border"
        style="resize: none"
        placeholder="내용을 입력해주세요."
      >
      </textarea>
      <p v-if="errors.contents" class="error-message">{{ errors.contents }}</p>
    </div>
    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnSave"
      >
        저장
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
</template>

<script>
import axiosInstance from "@/utils/axios";

export default {
  data() {
    // 변수생성
    return {
      requestBody: this.$route.query,
      idx: this.$route.query.idx,
      title: "",
      contents: "",
      created_at: "",
      selectedCategory: "", // 선택된 카테고리
      categories: [], // 카테고리 목록
      errors: {}, // 에러 메시지를 저장할 객체
    };
  },
  mounted() {
    this.fnGetView();
    this.loadCategories(); // 카테고리 로드
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        axiosInstance
          .get(this.$serverUrl + "/board/" + this.idx, {
            params: this.requestBody,
          })
          .then((res) => {
            this.title = res.data.title;
            this.contents = res.data.contents;
            this.author = res.data.author;
            this.created_at = res.data.created_at;
            this.selectedCategory = res.data.category; // 기존 카테고리 로드
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./list",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./detail",
        query: this.requestBody,
      });
    },
    fnSave() {
      // 에러 메시지 초기화
      this.errors = {};

      // 유효성 검사
      if (!this.selectedCategory) {
        this.errors.category = "카테고리를 선택해주세요.";
      }
      if (!this.title) {
        this.errors.title = "제목을 입력해주세요.";
      }
      if (!this.contents) {
        this.errors.contents = "내용을 입력해주세요.";
      }

      // 에러가 있으면 요청을 보내지 않음
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      let apiUrl = this.$serverUrl + "/board";
      this.form = {
        idx: this.idx,
        title: this.title,
        contents: this.contents,
        category_id: this.selectedCategory, // 선택된 카테고리 포함
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (this.idx === undefined) {
        //INSERT
        axiosInstance
          .post(apiUrl, this.form, config)
          .then((res) => {
            alert("글이 저장되었습니다.");
            console.log("데이터 확인" + res.data.idx);
            this.fnView(res.data.idx);
          })
          .catch((err) => {
            if (err.message.indexOf("Network Error") > -1) {
              alert(
                "네트워크가 원할하지 않습니다.\n잠시 후 다시 시도해주세요."
              );
            }
          });
      } else {
        //UPDATE
        axiosInstance
          .patch(apiUrl, this.form, config)
          .then((res) => {
            alert("글이 저장되었습니다.");
            this.fnView(res.data.idx);
          })
          .catch((err) => {
            if (err.message.indexOf("Network Error") > -1) {
              alert(
                "네트워크가 원할하지 않습니다.\n잠시 후 다시 시도해주세요."
              );
            }
          });
      }
    },
    loadCategories() {
      // 서버에서 카테고리 목록을 불러오는 로직 추가
      axiosInstance
        .get(this.$serverUrl + "/board/list/category/categoryList")
        .then((res) => {
          this.categories = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.category-selection {
  margin-bottom: 10px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.common-buttons {
  margin-top: 20px;
}
</style>
