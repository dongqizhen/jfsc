<template>
  <div class="model">
    <breadcrumb-vue :routes="routes"></breadcrumb-vue>
    <div v-if="!isLoading">
      <recommends-tab-vue
        v-if="tabs.length"
        :tabs="tabs"
        v-on:tabClick="tabClick"
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
      <div class="main-content-box">
        <div class="left">
          <shop-nav-vue
            :navArr="navArr"
            v-on:tabClick="shopTabClick"
            ref="shopNav"
          ></shop-nav-vue>
          <div class="main-content">
            <div v-if="!shopIsloading">
              <div v-if="shopList.length">
                <ul v-if="startWith('店铺')">
                  <shop-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :item="item"
                  ></shop-item-vue>
                  <!-- <bid-info-item-vue /> -->
                </ul>
                <ul v-else-if="index < navList.length">
                  <product-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :list="item"
                  ></product-item-vue>
                </ul>
                <ul v-else-if="startWith('文章')">
                  <article-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :item="item"
                  ></article-item-vue>
                </ul>
                <ul v-else-if="startWith('视频')">
                  <video-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :item="item"
                  ></video-item-vue>
                </ul>
                <ul v-else-if="startWith('案例')">
                  <case-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :item="item"
                  ></case-item-vue>
                </ul>
                <ul v-else-if="startWith('中标信息')">
                  <bid-info-item-vue
                    v-for="item in shopList"
                    :key="item.id"
                    :item="item"
                  ></bid-info-item-vue>
                </ul>
              </div>
              <no-data v-else text="暂无数据"></no-data>
            </div>
            <loading-vue v-else></loading-vue>
            <pagination-vue
              v-if="shopList.length"
              :data="data"
              v-on:onPaginationChange="onPaginationChange"
              ref="pagination"
            ></pagination-vue>
          </div>
        </div>
        <div class="right">
          <brand-card-vue :data="modelDetail"></brand-card-vue>
        </div>
      </div>
    </div>
    <loading-vue v-else></loading-vue>
  </div>
</template>

<script>
  import shopNavVue from "../../../../components/common/shopNav.vue";
  import productItemVue from "../../../../components/common/item/productItem.vue";
  import brandCardVue from "../../../../components/common/brandCard.vue";
  import recommendsTabVue from "../../../../components/common/recommendsTab.vue";
  import paginationVue from "../../../../components/common/pagination.vue";
  import breadcrumbVue from "../../../../components/common/breadcrumb.vue";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import loadingVue from "../../../../components/common/loading.vue";
  import _ from "lodash";
  import shopItemVue from "../../../../components/common/item/shopItem.vue";
  import bidInfoItemVue from "../../../../components/common/item/bidInfoItem.vue";
  import videoItemVue from "../../../../components/common/item/videoItem.vue";
  import caseItemVue from "../../../../components/common/item/caseItem.vue";
  import articleItemVue from "../../../../components/common/item/articleItem.vue";
  import axios from "axios";

  const goodsort = ["发布时间", "按价格", "按好评"],
    shopsort = ["发布时间", "按点击量", "按好评"],
    otherArr = ["发布时间", "浏览量", "点赞数"];

  export default {
    data() {
      return {
        routes: [],
        data: "", //带有分页的data数据
        navList: "",
        attributeCategoryId: "", //属性id
        isLoading: true,
        tabs: [],
        countData: "",
        modelDetail: "",
        index: 0,
        navArr: ["发布时间", "按价格", "按好评"],
        shopList: "",
        defaultVal: "",
        goodSort: "createOn", //产品排序类型 “createOn”发布时间 ,"price" 价格 ,“rate”//好评率
        shopSort: "createOn", //店铺排序类型 “createOn”发布时间 ,"hit" 点击量,“rate”//好评率
        othersort: 0, //案例，视频，文章排序标识  0 发布时间 1 浏览量 2 点赞数
        type: "",
        shopIsloading: false,
        cancel: null
      };
    },
    components: {
      shopNavVue,
      videoItemVue,
      productItemVue,
      brandCardVue,
      recommendsTabVue,
      paginationVue,
      breadcrumbVue,
      loadingVue,
      shopItemVue,
      caseItemVue,
      bidInfoItemVue,
      articleItemVue
    },
    computed: {},
    methods: {
      onPaginationChange(page) {
        if (this.index < this.navList.length) {
          this.getGoodsList(page);
        } else if (_.startsWith(this.defaultVal, "店铺")) {
          this.getShopList(page);
        } else {
          this.getOtherList(page);
        }
      },
      startWith(val) {
        return _.startsWith(this.defaultVal, val);
      },
      //获取文章列表
      async getArticleList(page = 1) {
        this.shopIsloading = true;
        return await _getData(
          `${this.$API_URL.HYGLOGINURL}/server/article!request.action`,
          {
            method: "getListWithShoping",
            version: "3.0.0",
            deviceId: "",
            source: "",
            params: {
              currentPage: page,
              countPerPage: 20,
              classifyId: this.countData.classifyId || "",
              sortType: this.othersort,
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
            this.shopList = data.result.articlelist;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
          });
      },
      //获取视频列表
      async getVideoList(page = 1) {
        this.shopIsloading = true;
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/video!request.action`,
          {
            method: "getListWithShoping",
            version: "",
            deviceId: "",
            source: "",
            params: {
              currentPage: page,
              countPerPage: 20,
              vBigCategoryId: this.countData.vBigCategoryId || "",
              vCategoryId: this.countData.vCategoryId || "",
              sortType: this.othersort,
              sortFlag: 1
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
            this.shopList = data.result.videolist;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
            // setTimeout(() => {
            //   this.shopIsloading = false;
            // }, 0);
          });
      },
      //获取维修宝列表
      async getCaseList(page = 1) {
        this.shopIsloading = true;
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/maintenance!request.action`,
          {
            method: "getListWithShoping",
            version: "3.0.0",
            deviceId: "",
            source: "",
            params: {
              currentPage: page,
              countPerPage: 20,
              mCatogoryId: this.countData.mCatogoryId || "",
              mBrandId: this.countData.mBrandId || "",
              sortType: this.othersort,
              sortFlag: 1,
              searchType: 1 //查询类型0列表1详情
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
            this.shopList = data.result.maintenancelist;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
            setTimeout(() => {}, 0);
          });
      },
      async getOtherList(page = 1) {
        this.shopIsloading = true;
        return await _getData(
          `${this.$API_URL.HYGLOGINURL}/server/search32!request.action`,
          {
            method: "simpleSearchForShoping",
            token: "",
            userid: this.$userid || "",
            params: {
              productLineName: this.$route.query.categoryName,
              brandName: this.$route.query.brandName,
              modelName: this.$route.query.modelName,
              type: this.type,
              currentPage: page,
              countPerPage: 20,
              sortType: this.othersort,
              searchType: 1,
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
            this.shopList =
              data.result.articlelist ||
              data.result.videolist ||
              data.result.maintenancelist ||
              data.result.bidInfolist;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
            setTimeout(() => {}, 0);
          });
      },
      shopTabClick(i) {
        this.cancel();
        if (this.index < this.navList.length) {
          this.goodSort = i == 0 ? "createOn" : i == 1 ? "price" : "rate";
          this.getGoodsList();
        } else if (_.startsWith(this.defaultVal, "店铺")) {
          this.shopSort = i == 0 ? "createOn" : i == 1 ? "hit" : "rate";
          this.getShopList();
        } else {
          this.othersort = i;
          this.getOtherList();
        } //else if (_.startsWith(this.defaultVal, "文章")) {
        //   this.othersort = i;
        //   this.getArticleList();
        // } else if (_.startsWith(this.defaultVal, "视频")) {
        //   this.othersort = i;
        //   this.getVideoList();
        // } else if (_.startsWith(this.defaultVal, "案例")) {
        //   this.othersort = i;
        //   this.getCaseList();
        // }
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },
      tabClick(i, val) {
        console.log(val);
        this.index = i;
        this.defaultVal = val;
        this.othersort = 0;
        this.goodSort = "createOn";
        this.shopSort = "createOn";
        this.$refs.shopNav.$data.val = 0;
        this.cancel();
        if (i < this.navList.length) {
          this.navArr = goodsort;
          this.attributeCategoryId = this.navList[i].id;
          this.getGoodsList().then(() => {});
        }
        if (_.startsWith(this.defaultVal, "店铺")) {
          this.navArr = shopsort;
          this.getShopList().then(() => {});
        } else if (_.startsWith(this.defaultVal, "文章")) {
          this.type = 1;
          this.navArr = otherArr;
          this.getOtherList();
        } else if (_.startsWith(this.defaultVal, "视频")) {
          this.type = 2;
          this.navArr = otherArr;
          this.getOtherList();
        } else if (_.startsWith(this.defaultVal, "案例")) {
          this.type = 3;
          this.navArr = otherArr;
          this.getOtherList();
        } else if (_.startsWith(this.defaultVal, "中标")) {
          this.type = 4;
          this.navArr = otherArr;
          this.getOtherList();
        }
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },
      //获取商铺列表
      async getShopList(currentPage = 1) {
        this.shopIsloading = true;
        return await _getData(
          "queryStore",
          {
            modelId: this.$route.query.modelId,
            currentPage,
            countPerPage: 20,
            sort: this.shopSort,
            order: "asc"
          },
          {
            cancelToken: new axios.CancelToken(c => {
              // 设置 cancel token

              this.cancel = c;
            })
          }
        )
          .then(data => {
            console.log("店铺", data);
            this.data = data;
            this.shopList = data.data;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      //获取产品列表
      async getGoodsList(currentPage = 1) {
        this.shopIsloading = true;
        return await _getData(
          "goods/goodslist",
          {
            attributeCategoryId: this.attributeCategoryId,
            currentPage,
            modelId: this.$route.query.modelId,
            countPerPage: 20,
            sort: this.goodSort,
            order: "asc"
          },
          {
            cancelToken: new axios.CancelToken(c => {
              // 设置 cancel token

              this.cancel = c;
            })
          }
        )
          .then(data => {
            console.log("产品列表", data);
            this.data = data;
            this.shopList = data.data;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.shopIsloading = false;
            });
          });
      }
    },
    mounted() {
      _getData("goods/productCount", {
        modelId: this.$route.query.modelId
      })
        .then(data => {
          console.log("nav", data);
          this.navList = data.list;
          this.countData = data.params;
          if (this.navList.length != 0) {
            this.attributeCategoryId = this.navList[0].id;
          }
          this.tabs = [
            ..._.map(data.list, val => {
              return `${val.name}(${val.count})`;
            }),
            ...[
              `店铺(${data.sroreCount || 0})`,
              `文章(${data.articleNum || 0})`,
              `视频(${data.videoNum || 0})`,
              `案例(${data.maintenanceNum || 0})`,
              `中标信息(${data.bidInfoNum || 0})`
            ]
          ];
        })
        .then(() => {
          // console.log(this.defaultVal);
          // console.log(this.tabs);
          if (this.navList.length == 0) {
            this.defaultVal = "店铺";
            this.getShopList().then(() => {
              this.$nextTick().then(() => {
                this.isLoading = false;
              });
            });
          } else {
            this.getGoodsList().then(() => {
              this.$nextTick().then(() => {
                this.isLoading = false;
              });
            });
          }
        });
      // _getDataAll([
      //   //获取nav数量

      //   //获取店铺
      //   this.getShopList()
      // ]).then(() => {
      //   this.$nextTick().then(() => {
      //     this.isLoading = false;
      //   });
      // });

      _getData("brandmodel/info", {
        id: this.$route.query.modelId
      }).then(data => {
        console.log("型号详情", data);
        this.modelDetail = data;
      });
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
                  path:
                    "/lookingProduct/brand?nav_index=" +
                    vm.$route.query.nav_index +
                    "&brandId=" +
                    vm.$route.query.brandId +
                    "&brandName=" +
                    vm.$route.query.brandName +
                    "&categoryId=" +
                    vm.$route.query.categoryId +
                    "&categoryName=" +
                    vm.$route.query.categoryName
                },
                {
                  name: vm.$route.query.modelName,
                  path: "/lookingProduct/model?nav_index=2"
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
                  path:
                    "/lookingProduct/brand?nav_index=" +
                    vm.$route.query.nav_index +
                    "&brandId=" +
                    vm.$route.query.brandId +
                    "&brandName=" +
                    vm.$route.query.brandName +
                    "&categoryId=" +
                    vm.$route.query.categoryId +
                    "&categoryName=" +
                    vm.$route.query.categoryName
                },
                {
                  name: vm.$route.query.modelName,
                  path: "/lookingProduct/model?nav_index=2"
                }
              ];
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .model {
    display: flex;
    flex-direction: column;
    /deep/ .swiper-container {
      //width: $content-left;
      width: 100%;
      margin-left: 0;
      margin-bottom: 20px;
      margin-top: 4px;
      overflow: initial;
      .swiper-slide {
        margin-right: 15px;
      }
      /deep/ .ant-btn-default {
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
        right: -0px;
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
        }
      }
    }
    .main-content-box {
      display: flex;
      justify-content: space-between;
      .left {
        width: 900px;
        /deep/ .recommend_tabs {
          margin-bottom: 20px;
          margin-top: 4px;
        }
        .main-content {
          margin-right: -55px;
          > div > div > ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            //  width: 776px;
            > li {
              margin-right: 14px;
              margin-bottom: 20px;
              &.case-item {
                width: 100%;
                width: 900px;
              }
              &.article-item {
                margin-right: 0;
                width: 900px;
              }
              &.video-item {
                margin-right: 55px;
                margin-bottom: 32px;
              }
              &.bid-info-item {
                margin-right: 0;
                width: 900px;
              }
            }
          }
          /deep/ .loading {
            width: 900px;
          }
          .no-data {
            height: 600px;
            background: #ffffff;
            width: 900px;
          }
        }
        .paginationBox {
          margin-bottom: 0;
        }
      }
      .right {
        width: 280px;
      }
    }
  }
</style>