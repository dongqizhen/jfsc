<template>
  <div class="index">
    <!-- 头部 -->
    <Header />
    <!-- 搜索 -->
    <search></search>
    <!-- 头部TAB -->
    <Nav></Nav>
    <div class="container">
      <!-- 轮播图 -->
      <banner />
      <!-- 产品分类 -->
      <!-- <product-category-vue></product-category-vue> -->
      <!-- 品牌分类 -->
      <!-- <brand-category-vue></brand-category-vue> -->
      <!-- 推荐产品 -->
      <div class="recommend">
        <div class="commonWidth">
          <div class="recommend_page">
            <ul class="floor" v-if="recommend_tabs_index == 0">
              <li>
                <div class="content">
                  <ul class="right">
                    <product-item
                      v-for="(item, i) in goodList"
                      :key="item.id"
                      :list="item"
                    ></product-item>
                  </ul>
                </div>
              </li>
            </ul>
            <div class="recommend_content_box" v-else>
              <div class="left">
                <ul class="recommend_article" v-if="recommend_tabs_index == 1">
                  <article-item
                    v-for="item in articleList"
                    :key="item.id"
                    :item="item"
                  ></article-item>
                </ul>
                <ul class="recommond_video" v-if="recommend_tabs_index == 2">
                  <video-item
                    v-for="item in videoList"
                    :key="item.id"
                    :item="item"
                  ></video-item>
                </ul>
                <ul class="recommond_case" v-if="recommend_tabs_index == 3">
                  <case-item
                    v-for="item in maintenanceList"
                    :key="item.id"
                    :item="item"
                  ></case-item>
                </ul>
                <a-button @click="skip">
                  查看全部
                  <icon-font type="iconchakanquanbu" />
                </a-button>
              </div>
              <div class="right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <Footer />
    <!-- 侧边栏 -->
    <side-bar />
  </div>
</template>

<script>
  import Header from "../components/header/header.vue";
  import Footer from "../components/footer/footer.vue";
  import sideBar from "../components/sideBar/sideBar.vue";
  import banner from "../components/common/banner.vue";
  import { Icon } from "ant-design-vue";
  import caseItem from "../components/common/item/caseItem.vue";
  import articleItem from "../components/common/item/articleItem.vue";
  import videoItem from "../components/common/item/videoItem.vue";
  import productItem from "../components/common/item/productItem.vue";
  import search from "../components/common/search.vue";
  import Nav from "../components/common/nav.vue";
  import productCategoryVue from "../components/common/productCategory.vue";
  import recommendsTabVue from "../components/common/recommendsTab.vue";
  import { _getData } from "../config/getData";
  import brandCategoryVue from "../components/common/brandCategory.vue";
  import { mapMutations } from "vuex";
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
  });

  export default {
    data() {
      return {
        recommend_tabs_index: 0, //推荐nav标识
        goodList: [], //产品
        articleList: [], //案列,
        videoList: [], //视频
        maintenanceList: [],
        nav: ["推荐产品(0)", "文章(0)", "视频(0)", "案例(0)"]
        // background: ["#F5A623", "#43D480", "#8880FE", "#0283FF"]
      };
    },

    mounted() {
      //获取推荐数量

      _getData("/api/item/list", {}).then(data => {
        console.log("推荐产品", data);
        this.goodList = data.data.list;
      });
      //文章

      //案例

      //视频
    },
    components: {
      Header,
      Footer,
      search,
      sideBar,
      banner,
      IconFont,
      caseItem,
      articleItem,
      videoItem,
      productItem,
      Nav,
      productCategoryVue,
      recommendsTabVue,
      brandCategoryVue
    },
    beforeRouteLeave(to, from, next) {
      // if (from.name == "登录") {
      //   window.location.reload();
      // }
      next();
    },
    methods: {
      // ...mapMutations(["changeCurrentCityIp"]),
      tabClick(i) {
        this.recommend_tabs_index = i;
      },
      moreButtonClick() {},
      //查看全部
      skip() {
        console.log(this.recommend_tabs_index);
        switch (this.recommend_tabs_index) {
          case 1:
            window.open(
              "http://www.haoyigong.com/industryinfomation/industryInfomation_index.html"
            );
            break;
          case 2:
            window.open(
              "http://www.haoyigong.com/MicroClassroom/ClassroomList.html"
            );
            break;
          case 3:
            window.open("http://www.haoyigong.com/maintenance/repair.html");
            break;
        }
      },
      handleClick() {
        this.brandVisible = true;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../assets/scss/_commonScss";
  .index {
    .container {
      background: #f7f9fa;
      padding-bottom: 110px;

      .recommend {
        .commonWidth {
          .recommend_page {
            width: 100%;
            .floor {
              > li {
                margin-bottom: 30px;

                &:last-child {
                  margin-bottom: 0;
                }
                > a {
                  text-decoration: none;

                  .content ul {
                    li {
                      &:hover {
                        > p {
                          color: $theme-color;
                        }
                      }
                    }
                  }
                }
                h2 {
                  display: flex;
                  justify-content: space-between;
                  height: 43px;
                  align-items: center;
                  p {
                    width: 291px;
                    background: #f5a623;
                    height: 100%;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    align-items: flex-end;
                    // font-family: PingFangSC-Medium;
                    font-size: 22px;
                    // font-weight: 600;
                    color: #ffffff;
                    padding-left: 27px;
                  }
                  ul {
                    display: flex;
                    justify-content: flex-end;
                    flex: 1;
                    height: 100%;
                    align-items: flex-end;
                    border-bottom: 2px solid #f5a623;
                    padding-bottom: 3px;
                    li {
                      // font-family: PingFangSC-Regular;
                      font-size: 14px;

                      margin-right: 30px;
                      cursor: pointer;
                      a {
                        color: #333333;
                        text-decoration: none;
                        &:hover {
                          color: $theme-color;
                        }
                      }
                    }
                  }
                  span {
                    //font-family: PingFangSC-Regular;
                    display: flex;
                    align-items: flex-end;
                    height: 100%;
                    a {
                      font-size: 14px;
                      color: #666666;
                      display: flex;
                      align-items: flex-end;
                      cursor: pointer;
                      height: 100%;
                      text-decoration: none;
                      border-bottom: 2px solid #f5a623;
                      padding-bottom: 3px;
                      .icon {
                        margin-left: 7px;
                        margin-bottom: 3px;
                      }
                      &:hover {
                        opacity: 0.7;
                      }
                    }
                  }
                }
                .content {
                  width: 100%;
                  min-height: 421px;
                  display: flex;
                  justify-content: flex-start;
                  flex-wrap: wrap;

                  .left {
                    width: 291px;
                    background-image: linear-gradient(
                      0deg,
                      #fad961 0%,
                      #f5a623 100%
                    );
                    position: relative;
                    box-shadow: $base-box-shadow;
                    margin-right: 12px;
                    img {
                      height: 100%;
                      width: 100%;
                    }
                    ul {
                      display: flex;
                      justify-content: space-between;
                      flex-wrap: wrap;
                      padding: 0 20px;
                      position: absolute;
                      left: 0;
                      top: 20px;
                      width: 291px;
                      li {
                        height: 30px;
                        width: 120px;
                        border: 2px solid #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 10px;
                        a {
                          text-decoration: none;
                          font-size: 15px;
                          color: #fff;
                        }
                      }
                    }
                  }
                  .right {
                    flex: 1;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    padding-top: 20px;
                    overflow: hidden;
                    //flex-wrap: wrap;
                    margin-right: -12px;
                    li {
                      margin-right: 12px;
                      margin-bottom: 12px;
                      &:last-child {
                        margin-right: 0;
                      }
                    }
                  }
                }
                &.two {
                  .left {
                    background-image: linear-gradient(
                      0deg,
                      #71f7a9 0%,
                      #43d480 99%
                    );
                  }
                  h2 {
                    p {
                      background: #43d480;
                    }
                    ul {
                      border-color: #43d480;
                    }
                    span {
                      a {
                        border-color: #43d480;
                      }
                    }
                  }
                }
                &.three {
                  .left {
                    background-image: linear-gradient(
                      180deg,
                      #8880fe 2%,
                      #aaa4ff 98%
                    );
                  }
                  h2 {
                    p {
                      background: #8880fe;
                    }
                    ul {
                      border-color: #8880fe;
                    }
                    span {
                      a {
                        border-color: #8880fe;
                      }
                    }
                  }
                }
                &.four {
                  .left {
                    background-image: linear-gradient(
                      180deg,
                      #0283ff 2%,
                      #45a4ff 98%
                    );
                  }
                  h2 {
                    p {
                      background: #0283ff;
                    }
                    ul {
                      border-color: #0283ff;
                    }
                    span {
                      a {
                        border-color: #0283ff;
                      }
                    }
                  }
                }
              }
            }
            .recommend_content_box {
              display: flex;
              justify-content: flex-start;
              .left {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: $content-left;
              }
              .recommend_article {
                margin-bottom: 18px;
              }
              .recommond_video {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 100%;
                margin-bottom: 14px;
              }
              .recommond_case {
                width: 100%;
                margin-bottom: 16px;
              }
              .ant-btn {
                width: 127px;
                height: 39px;
                background: #ffffff;
                border-radius: 32px;
                font-family: PingFangSC-Regular;
                //font-size: 16px;
                color: #333333;
                margin: 0 auto;

                &:hover {
                  color: $theme-color;
                  border-color: $theme-color;
                }
                &:active {
                  border-color: $theme-color;
                }
                &:focus {
                  border-color: $theme-color;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
