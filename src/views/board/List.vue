<template>
  <div class="board-container">
    <LeftSidebar
      @categorySelected="filterByCategory"
      @totalPostsSelected="allBoards"
    />
    <div class="vertical-divider"></div>
    <div class="board-content">
      <div class="board-list">
        <div class="common-buttons" v-if="isAdmin">
          <button
            type="button"
            class="w3-button w3-round w3-blue-gray"
            v-on:click="fnWrite"
          >
            등록
          </button>
          <p v-if="isAdmin">Welcome, {{ userName }}!</p>
        </div>
        <div class="post-summary">
          <span>{{ selectedCategory ? selectedCategory : "전체 글" }} </span>
          <span>&nbsp;{{ paging.total_list_cnt }}</span>
        </div>
        <hr />
        <div
          v-for="(row, idx) in list"
          :key="idx"
          class="post-card"
          v-on:click="fnView(`${row.idx}`)"
        >
          <h2 class="post-title">
            <div class="title-container">
              <a class="post-title-text">{{ row.title }}</a>
              <div class="icon-container">
                <i
                  class="bi"
                  :class="row.liked ? 'bi-heart-fill' : 'bi-heart'"
                  style="cursor: pointer; color: red; font-size: 14px"
                ></i>
                <span class="like-count">{{ row.like_count }}</span>
                <i
                  class="bi bi-eye-fill"
                  style="
                    user-select: none;
                    color: #999;
                    font-size: 16px;
                    margin-left: 8px;
                  "
                ></i>
                <span class="view-count"> {{ row.view_count }} </span>
              </div>
            </div>
          </h2>
          <p class="post-contents">{{ row.contents }}</p>
          <p class="post-author">
            {{ row.author }} | {{ formatDate(row.created_at) }} |
            {{ row.category.name }}
          </p>
        </div>
        <div
          class="pagination w3-bar w3-padding-16 w3-small"
          v-if="paging.total_list_cnt > 0"
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
              @click="fnPage(`${paging.start_page - 1}`)"
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
                  @click="fnPage(`${n}`)"
                  :key="index"
                  >{{ n }}</a
                >
              </template>
            </template>
            <a
              href="javascript:;"
              v-if="paging.total_page_cnt > paging.end_page"
              @click="fnPage(`${paging.end_page + 1}`)"
              class="next w3-button w3-border"
              >&gt;</a
            >
            <a
              href="javascript:;"
              @click="fnPage(`${paging.total_page_cnt}`)"
              class="last w3-button w3-border"
              >&gt;&gt;</a
            >
          </span>
        </div>
      </div>
    </div>
  </div>

  <div>
    <select v-model="search_key">
      <option value="">- 선택 -</option>
      <option value="author">작성자</option>
      <option value="title">제목</option>
      <option value="contents">내용</option>
    </select>
    &nbsp;
    <input
      type="text"
      v-model="search_value"
      @keyup.enter="fnPageWithSearch()"
    />
    &nbsp;
    <button @click="fnPageWithSearch()">검색</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftSidebar from "@/components/LeftSidebar.vue";

export default {
  name: "List",
  components: {
    LeftSidebar,
  },
  computed: {
    ...mapGetters(["getUserRole", "getUserName"]),
    isAdmin() {
      return this.getUserRole === "ROLE_ADMIN";
    },
    userName() {
      return this.getUserName;
    },
  },

  data() {
    // 변수생성
    return {
      requestBody: {}, // 리스트 페이지 데이터전송
      list: {}, // 리스트 데이터
      no: "", // 게시판 숫자처리
      paging: {
        block: 0,
        end_page: 0,
        next_page: 0,
        page: 0,
        page_size: 0,
        prev_block: 0,
        start_index: 0,
        start_page: 0,
        total_block_cnt: 0,
        total_list_cnt: 0,
        total_page_cnt: 0,
      }, // 페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      search_key: this.$route.query.sk ? this.$route.query.sk : "",
      search_value: this.$route.query.sv ? this.$route.query.sv : "",
      keyword: this.$route.query.keyword,
      isCategorySelected: false, // 카테고리 선택 플래그
      selectedCategory: null, // 선택된 카테고리
      isLiked: false, // 좋아요 상태
      likeCount: 0, // 좋아요 개수
      viewCount: 0, // 조회수 개수
      paginavigation: function () {
        // 페이징 처리 for문 커스텀
        let pageNumber = [];
        let start_page = this.paging.start_page;
        let end_page = this.paging.end_page;
        for (let i = start_page; i <= end_page; i++) pageNumber.push(i);
        return pageNumber;
      },
    };
  },
  mounted() {
    this.fnGetList();
  },
  methods: {
    fnGetList() {
      this.isCategorySelected = false; // 전체 게시글을 불러오므로 카테고리 선택 플래그 초기화
      this.selectedCategory = null;
      this.requestBody = {
        // 데이터 전송
        sk: this.search_key,
        sv: this.search_value,
        page: this.page,
        size: this.size,
      };

      this.$axios
        .get(this.$serverUrl + "/board/list", {
          params: this.requestBody,
          headers: {},
        })
        .then((res) => {
          if (res.data.result_code === "OK") {
            this.list = res.data.data; // 서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용 가능
            this.paging = res.data.pagination;
            this.no =
              this.paging.total_list_cnt -
              (this.paging.page - 1) * this.paging.page_size;
          }
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원할하지 않습니다.\n잠시 후 다시 시도해주세요.");
          } else alert(err.message);
        });
    },

    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./detail",
        query: this.requestBody,
      });
    },

    fnWrite() {
      this.$router.push({
        path: "./write",
      });
    },

    fnPage(n) {
      if (this.page !== n) {
        this.page = n;
      }
      if (this.isCategorySelected) {
        // 카테고리별 게시글 불러오기
        this.filterByCategory(this.selectedCategory);
      } else {
        // 전체 게시글 불러오기
        this.fnGetList();
      }
    },

    fnPageWithSearch(n) {
      if (this.page !== n) {
        this.page = n;
      }
      this.fnGetList();
    },

    created() {
      console.log("User Role:", this.getUserRole);
      console.log("User Name:", this.getUserName);
    },
    formatDate(value) {
      if (!value) return "";
      return value.split(" ")[0]; // 'yyyy-MM-dd hh-MM-ss' 형식에서 날짜 부분만 추출
    },
    allBoards() {
      this.page = 1;
      this.selectedCategory = "";
      this.fnGetList();
    },
    filterByCategory(category) {
      // 선택한 카테고리에 따라 게시글 목록 필터링하는 로직 추가
      this.search_key = "category";
      this.search_value = category.name;
      // fnPage()에서 filterByCategory(category)는 category.name 하면 undefined임
      // 카테고리 눌렀으면 category.name이 있고 페이지네이션 눌렀으면 category.name이 undefined
      // ??는 nullish로 category.name이 null이나 undefined이 아니면 category.name 아니면 category
      this.selectedCategory = category.name ?? category;
      // 카테고리 메뉴 선택한거면 1, 페이지네이션 눌렀으면 this.page
      let pageNo = category.name != null ? 1 : this.page;
      this.isCategorySelected = true; // 카테고리 선택 플래그 설정
      this.requestBody = {
        page: pageNo,
        size: 10,
      };
      this.$axios
        .get(
          `${this.$serverUrl}/board/list/category/${this.selectedCategory}`,
          {
            params: this.requestBody,
            headers: {},
          }
        )
        .then((res) => {
          if (res.data.result_code === "OK") {
            this.list = res.data.data; // Update the list with the filtered posts
            this.paging = res.data.pagination;
            this.no =
              this.paging.total_list_cnt -
              (this.paging.page - 1) * this.paging.page_size;
          }
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert(
              "The network is not working properly.\nPlease try again later."
            );
          } else alert(err.message);
        });
    },
  },
};
</script>

<style scoped>
.board-container {
  display: flex;
  width: 100%;
}

.vertical-divider {
  width: 1px;
  background-color: #ccc;
  margin: 0;
}

.board-content {
  flex: 3;
}
.board-list {
  margin-left: 10%;
  text-align: left; /* 기본 텍스트 정렬을 왼쪽으로 설정 */
}

.view-count,
.like-count {
  margin-left: 0.25em;
  font-weight: bold;
  font-size: 0.75em;
}

.post-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.post-title-text {
  flex: 1;
  text-align: left;
}

.icon-container {
  display: flex;
  align-items: center;
}

.post-summary {
  margin-bottom: 20px;
  font-weight: bold;
  text-align: left; /* 왼쪽 정렬 */
}

.post-summary :last-child {
  color: #42b983;
}

.post-card {
  margin-bottom: 20px;
  text-align: left; /* 왼쪽 정렬 */
  cursor: pointer; /* 커서를 포인터로 변경 */
  padding: 10px;
  transition: background-color 0.3s;
}

.post-card:hover {
  background-color: #f0f0f0; /* 호버 시 배경색 변경 */
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  text-align: left; /* 왼쪽 정렬 */
}

.post-author {
  color: #777;
  font-size: 14px;
  text-align: left; /* 왼쪽 정렬 */
}

.post-contents {
  color: #777; /* post-author와 동일한 색상 */
  font-size: 14px;
  text-align: left; /* 왼쪽 정렬 */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 3줄 이상 표시하지 않음 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0;
}
</style>
