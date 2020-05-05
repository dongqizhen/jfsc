<template>
  <div class="detaile">
    <Header></Header>
    <search></search>
    <Nav :defaultNav="defaultNav"></Nav>
    <div class="container">
      <div class="commonWidth">
        <breadcrumb-vue :routes="routes"></breadcrumb-vue>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <side-bar />
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
        routes: [
          {
            path: "/",
            name: "首页"
          }
        ]
      };
    },
    mixins: [mixin],
    components: {
      Header,
      Footer,
      search,
      Nav,
      sideBar,
      breadcrumbVue
    },
    mounted() {
      console.log(this.$router, this.$route);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routes.push({
          name: vm.$route.name,
          path: vm.$route.path
        });
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  .detaile {
    .container {
      background: $base-background;
      padding-bottom: 110px;

      .content {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>