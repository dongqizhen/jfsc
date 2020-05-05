<template>
  <div class="notice">
    <!-- 头部 -->
    <Header />
    <!-- 搜索 -->
    <search></search>
    <!-- 头部TAB -->
    <Nav></Nav>
    <div class="container">
      <div class="commonWidth">
        <div class="notice-detail" v-if="!isLoading">
          <h2>
            {{ notice.title }}
            <span>2017-08-22 19:32</span>
          </h2>
          <div
            class="content"
            v-lazy-container="{
              selector: 'img'
            }"
            v-html="convertStr"
          ></div>
        </div>
        <loading v-else></loading>
      </div>
    </div>
    <!-- 底部 -->
    <Footer />
    <!-- 侧边栏 -->
    <side-bar />
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import sideBar from "../../../components/sideBar/sideBar.vue";
  import search from "../../../components/common/search.vue";
  import { _getData } from "../../../config/getData";
  import Nav from "../../../components/common/nav.vue";

  export default {
    data() {
      return {
        notice: "",
        isLoading: true
      };
    },
    computed: {
      convertStr() {
        return this.notice.content.replace(
          // /(?<=\<img [^>]*src=['"])([^'"]+)(?=[^>]*>)/gi,
          // '"data-src="$1'
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          "<img data-src=$1 style='width:100%;height:auto' />"
        );
      }
    },
    created() {
      _getData("/topic/queryTopic", {
        id: this.$route.query.id
      })
        .then(data => {
          console.log(data);
          this.notice = data;
        })
        .then(() => {
          this.$nextTick().then(() => {
            this.isLoading = false;
          });
        });
    },
    components: {
      Header,
      Footer,
      sideBar,
      Nav,
      search
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .notice {
    .commonWidth {
      padding-top: 24px;
    }
    .notice-detail {
      padding: 0 98px;
      box-shadow: $base-box-shadow;

      background: #fff;
      h2 {
        height: 86px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #333333;
        border-bottom: 1px solid #dddddd;
        font-weight: 600;
        flex-direction: column;
        span {
          font-size: 14px;
          color: #999999;
          font-weight: normal;
        }
      }
      .content {
        padding: 10px 0 50px;
        /deep/ img[lazy="loading"] {
          /*your style here*/
          background: url("../../../assets/images/loading.gif") no-repeat center;
          background-size: 200px;
          // background-color: #f7f9fa;
        }
        /deep/ img[lazy="error"] {
          /*your style here*/
          background: url("../../../assets/images/loading.gif") no-repeat center;
          background-size: 200px;
          display: none;
          // background-color: #f7f9fa;
        }
        /deep/ img {
          width: 100%;
        }
      }
    }
  }
</style>