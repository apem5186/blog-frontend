<!--

출처 : https://onethejay.tistory.com/58

-->

<template>
  <Header />
  <router-view />
  <Footer />
  <LoadingBar :loading="this.$store.state.loadingStatus"></LoadingBar>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import LoadingBar from "@/views/common/LoadingBar";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    LoadingBar,
  },
};
</script>

<style>
#app {
  font-family: "AppleSDGothicNeo", "Noto Sans KR", Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
