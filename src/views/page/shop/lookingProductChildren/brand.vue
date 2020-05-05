<template>
  <div class="brand">
    <breadcrumb-vue :routes="routes"></breadcrumb-vue>
    <recommends-tab-vue
      :tabs="tabs"
      v-on:tabClick="tabClick"
      v-if="tabs.length"
    >
      <a-button slot="btn">
        <router-link
          :to="{
            path: '/comparisonOfParameters',
            query: {
              nav_index: $route.query.nav_index,
              modelId: $route.query.modelId,
              categoryId: $route.query.categoryId,
              categoryName: $route.query.categoryName
            }
          }"
          target="_blank"
        >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconcanshuduibi"></use>
          </svg>
          参数对比
        </router-link>
      </a-button>
    </recommends-tab-vue>
    <div class="main-content">
      <div class="left">
        <shop-nav-vue
          :navArr="navArr"
          v-on:tabClick="shopTabClick"
          ref="shopNav"
        ></shop-nav-vue>
        <div v-if="!isLoading">
          <div v-if="arr.length">
            <ul v-if="defaultVal == 0">
              <model-item-vue
                v-for="item in arr"
                :key="item.id"
                :item="item"
              ></model-item-vue>
            </ul>
            <ul class="recommend_article" v-if="defaultVal == 1">
              <article-item-vue
                v-for="item in arr"
                :key="item.id"
                :item="item"
              ></article-item-vue>
            </ul>
            <ul class="recommond_video" v-if="defaultVal == 2">
              <video-item-vue
                v-for="item in arr"
                :key="item.id"
                :item="item"
              ></video-item-vue>
            </ul>
            <ul class="recommond_case" v-if="defaultVal == 3">
              <case-item-vue
                v-for="item in arr"
                :key="item.id"
                :item="item"
              ></case-item-vue>
            </ul>
            <ul class="recommond_bid" v-if="defaultVal == 4">
              <bid-info-item-vue
                v-for="item in arr"
                :key="item.id"
                :item="item"
              ></bid-info-item-vue>
            </ul>
            <pagination
              :data="data"
              v-if="defaultVal"
              v-on:onPaginationChange="onPaginationChange"
              ref="pagination"
            ></pagination>
          </div>
          <no-data v-else></no-data>
        </div>

        <loading-vue v-else></loading-vue>
      </div>
      <div class="right">
        <brand-card-vue></brand-card-vue>
      </div>
    </div>
  </div>
</template>

<script>
  import shopNavVue from "../../../../components/common/shopNav.vue";
  import modelItemVue from "../../../../components/common/item/modelItem.vue";
  import brandCardVue from "../../../../components/common/brandCard.vue";
  import recommendsTabVue from "../../../../components/common/recommendsTab.vue";
  import breadcrumbVue from "../../../../components/common/breadcrumb.vue";
  import { _getData } from "../../../../config/getData";
  import loadingVue from "../../../../components/common/loading.vue";
  import videoItemVue from "../../../../components/common/item/videoItem.vue";
  import articleItemVue from "../../../../components/common/item/articleItem.vue";
  import caseItemVue from "../../../../components/common/item/caseItem.vue";
  import pagination from "../../../../components/common/pagination";
  import axios from "axios";
  import bidInfoItemVue from "../../../../components/common/item/bidInfoItem.vue";

  var CancelToken = axios.CancelToken;
  var source = CancelToken.source();

  const modelArr = ["按首字母排序", "按点击量排序"],
    otherArr = ["发布时间", "浏览量", "点赞数"];

  export default {
    data() {
      return {
        arr: [],
        data: {},
        articleList: [],
        caseList: [],
        videoList: [],
        routes: [],
        defaultVal: 0,
        sort: 1, //型号排序标识 1 首字母 0 点击量
        othersort: 0, //案例，视频，文章排序标识  0 发布时间 1 浏览量 2 点赞数
        tabs: [],
        isLoading: true,
        params: "",
        type: "", // 搜索类型：1：文章； 2：视频； 3：案例； 4：中标信息；
        navArr: modelArr,
        cancel: null
      };
    },
    components: {
      shopNavVue,
      modelItemVue,
      brandCardVue,
      recommendsTabVue,
      breadcrumbVue,
      loadingVue,
      videoItemVue,
      articleItemVue,
      caseItemVue,
      pagination,
      bidInfoItemVue
    },
    methods: {
      onPaginationChange(page) {
        this.getList(page);
      },
      shopTabClick(key, val) {
        if (this.defaultVal == 0) {
          this.sort = key ? 0 : 1;
        } else {
          this.othersort = key;
        }
        this.cancel();
        this.getList();
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },
      tabClick(i) {
        this.defaultVal = i;
        this.$refs.shopNav.$data.val = 0;

        if (i == 0) {
          this.navArr = modelArr;
        } else {
          this.navArr = otherArr;
          this.type = i;
        }

        this.cancel();
        this.getList();

        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },

      async getList(page = 1) {
        this.arr = [];

        if (this.defaultVal == 0) {
          return await this.getModelList();
        } else {
          return await this.getOtherList(page);
        }
      },
      //获取型号列表
      async getModelList() {
        this.isLoading = true;
        return await _getData(
          "brandmodel/list",
          {
            categoryId: this.$route.query.categoryId,
            brandId: this.$route.query.brandId,
            sortOrder: this.sort
          },
          {
            cancelToken: new axios.CancelToken(c => {
              // 设置 cancel token
              this.cancel = c;
            })
          }
        )
          .then(data => {
            console.log(data);
            this.arr = data.brandModelList;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.isLoading = false;
            });
            setTimeout(() => {}, 300);
          });
      },

      async getOtherList(page = 1) {
        this.isLoading = true;
        return await _getData(
          `${this.$API_URL.HYGLOGINURL}/server/search32!request.action`,
          {
            method: "simpleSearchForShoping",
            token: "",
            userid: this.$userid || "",
            params: {
              // name: this.params.name,
              productLineName: this.params.productLineName,
              brandName: this.params.brandName,
              modelName: this.params.modelName,
              type: this.type,
              currentPage: page,
              countPerPage: 20,
              sortType: this.othersort,
              searchType: 0,
              sortFlag: 1 //排序标识0正序1 倒序
            }
          },
          {
            cancelToken: new axios.CancelToken(c => {
              // 设置 cancel token

              this.cancel = c;
            })
          }
        )
          .then(data => {
            this.data = data.result;
            this.arr =
              data.result.articlelist ||
              data.result.videolist ||
              data.result.maintenancelist ||
              data.result.bidInfolist;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.isLoading = false;
            });
          });
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to, from);
      next(vm => {
        console.log(vm);
        vm.routes =
          vm.$route.query.nav_index == 2 //找品牌
            ? [
                {
                  name: "首页",
                  path: "/"
                },
                {
                  name: "找品牌",
                  path:
                    "/lookingProduct/oneOfBrandClassificne?nav_index=" +
                    vm.$route.query.nav_index
                },
                {
                  name: vm.$route.query.brandName,
                  path:
                    "/lookingProduct?nav_index=" +
                    vm.$route.query.nav_index +
                    "&brandId=" +
                    vm.$route.query.brandId +
                    "&brandName=" +
                    vm.$route.query.brandName
                },
                {
                  name: vm.$route.query.categoryName,
                  path: "/lookingProduct/brand"
                }
              ]
            : [
                //找产品
                {
                  name: "首页",
                  path: "/"
                },
                {
                  name: "找产品",
                  path: "/lookingProduct?nav_index=" + vm.$route.query.nav_index
                },
                {
                  name: vm.$route.query.categoryName,
                  path:
                    "/lookingProduct/oneOfBrandClassificne?nav_index=" +
                    vm.$route.query.nav_index +
                    "&categoryId=" +
                    vm.$route.query.categoryId +
                    "&categoryName=" +
                    vm.$route.query.categoryName
                },
                {
                  name: vm.$route.query.brandName,
                  path: to.fullPath
                }
              ];
      });
    },
    mounted() {
      this.getList();
    },
    created() {
      _getData("brandmodel/count", {
        categoryId: this.$route.query.categoryId,
        brandId: this.$route.query.brandId
      }).then(data => {
        console.log("数量", data);
        this.params = data;
        this.tabs = [
          `型号(${data.count || 0})`,
          `文章(${data.articleNum || 0})`,
          `视频(${data.videoNum || 0})`,
          `案例(${data.maintenanceNum || 0})`,
          `中标信息(${data.bidInfoNum || 0})`
        ];
      });
      // this.routes =
      //   this.$route.query.nav_index == 2
      //     ? [
      //         {
      //           name: "首页",
      //           path: "/"
      //         },
      //         {
      //           name: "找品牌",
      //           path:
      //             "/lookingProduct/oneOfBrandClassificne?nav_index=" +
      //             this.$route.query.nav_index
      //         },
      //         {
      //           name: "松下",
      //           path: "/lookingProduct?nav_index=" + this.$route.query.nav_index
      //         },
      //         {
      //           name: "超声手术设备",
      //           path: "/lookingProduct/brand"
      //         }
      //       ]
      //     : [
      //         {
      //           name: "首页",
      //           path: "/"
      //         },
      //         {
      //           name: "找产品",
      //           path: "/lookingProduct?nav_index=" + this.$route.query.nav_index
      //         },
      //         {
      //           name: this.$route.query.categoryName,
      //           path:
      //             "/lookingProduct/oneOfBrandClassificne?nav_index=" +
      //             this.$route.query.nav_index
      //         },
      //         {
      //           name: this.$route.query.brandName,
      //           path:
      //             "/lookingProduct/brand?nav_index=" + this.$route.query.nav_index
      //         }
      //       ];
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss.scss";
  .brand {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /deep/ .swiper-container {
      width: $content-left;
      margin-left: 0;
      margin-bottom: 20px;
      margin-top: 4px;
      overflow: initial;
      .ant-btn-default {
        height: 40px;
        width: 120px;
        background: #ffffff;
        border: 1px solid #f5a623;
        color: #f5a623;
        font-size: 16px;
        font-weight: 500;
        line-height: 40px;

        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
        position: absolute;
        right: 0;
        top: -2.5px;
        a {
          display: flex;
          align-items: center;
          line-height: 38px;
          .icon {
            height: 15px;
            width: 15px;
            margin-right: 5px;
            margin-top: 1px;
          }
        }
        &:hover {
          opacity: 0.7;
        }
        > span {
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 38px;
        }
        .icon {
          height: 15px;
          width: 15px;
          margin-right: 5px;
          margin-top: 1px;
        }
      }
    }
    .main-content {
      display: flex;
      justify-content: space-between;
      .left {
        width: $content-left;
        display: flex;
        flex-direction: column;
        /deep/ .shop-nav {
          .nav {
            margin-bottom: 12px;
          }
        }
        /deep/ .recommend_tabs {
          margin-bottom: 20px;
          margin-top: 4px;
        }
        > div:not(.shop-nav) {
          > div {
            margin-right: -36px;
            .model-item {
              margin-right: 16px;
              width: $content-left;
            }
          }
          .recommond_video {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            width: $content-left;
            li {
              // margin-right: 36px;
              margin-bottom: 32px;
            }
          }
          .recommond_case {
            width: $content-left;
          }
          .recommond_bid {
            width: $content-left;
            li {
              margin-bottom: 16px;
            }
          }
        }

        /deep/ .no-data {
          height: 600px;
          background: #ffffff;
        }
        ul {
        }
        .paginationBox {
          margin-bottom: 0;
        }
      }
      .right {
        width: 236px;
      }
    }
  }
</style>