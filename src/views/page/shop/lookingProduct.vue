<template>
  <div class="looking-product">
    <Header></Header>
    <search></search>
    <Nav :defaultNav="defaultNav"></Nav>
    <div class="container">
      <div class="commonWidth">
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <side-bar></side-bar>
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import search from "../../../components/common/search.vue";
  import Nav from "../../../components/common/nav.vue";
  import sideBar from "../../../components/sideBar/sideBar.vue";
  import breadcrumbVue from "../../../components/common/breadcrumb.vue";
  import { mixin } from "../../../components/mixin/mixin";
  export default {
    data() {
      return {
        routes: ""
      };
    },
    mixins: [mixin],
    components: {
      Header,
      Footer,
      search,
      Nav,
      breadcrumbVue,
      sideBar
    },
    beforeRouteUpdate(to, from, next) {
      this.defaultNav = to.query.nav_index;
      next();
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .container {
    .content {
    }
  }
</style>