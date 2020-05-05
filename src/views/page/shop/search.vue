<template>
  <div class="search">
    <Header></Header>
    <search></search>
    <Nav></Nav>
    <div class="container">
      <div class="commonWidth">
        <breadcrumb-vue :routes="routes">
          <ul slot="search-type" class="search-type">
            <li
              v-for="(item, i) in searchParamas"
              :key="`key-${i}`"
              class="search-type-item"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconwangyelujing"></use>
              </svg>
              <span>
                {{ item.name }}

                <svg
                  class="icon del"
                  aria-hidden="true"
                  v-if="i != 0"
                  @click="delHandleClick(i, item.key)"
                >
                  <use xlink:href="#icontianjiaduibichanpinshanchu"></use>
                </svg>
              </span>
            </li>
          </ul>
        </breadcrumb-vue>

        <div class="main-content">
          <div class="right">
            <div class="recommend_page">
              <div class="recommend_content_box">
                <div class="left" v-if="!isLoading">
                  <div v-if="recommend_tabs_index == 0">
                    <ul v-if="list.storeList && list.storeList.length">
                      <shop-item-vue
                        v-for="item in list.storeList"
                        :key="item.id"
                        :item="item"
                      ></shop-item-vue>
                    </ul>
                    <no-data
                      v-else
                      type="no-search"
                      text="暂无搜索内容"
                    ></no-data>
                  </div>
                  <div v-if="recommend_tabs_index == 1">
                    <ul v-if="list && list.length">
                      <product-item-vue
                        v-for="item in list"
                        :key="item.id"
                        :list="item"
                      ></product-item-vue>
                    </ul>
                    <no-data
                      v-else
                      type="no-search"
                      text="暂无搜索内容"
                    ></no-data>
                  </div>
                  <div v-if="recommend_tabs_index == 2">
                    <ul
                      v-if="list.modelList && list.modelList.length"
                      class="model"
                    >
                      <model-item-vue
                        v-for="item in list.modelList"
                        :key="item.id"
                        :item="item"
                      ></model-item-vue>
                    </ul>
                    <no-data
                      v-else
                      type="no-search"
                      text="暂无搜索内容"
                    ></no-data>
                  </div>
                </div>
                <loading v-else></loading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import search from "../../../components/common/search.vue";
  import Nav from "../../../components/common/nav.vue";
  import breadcrumbVue from "../../../components/common/breadcrumb.vue";
  import shopLeftSideVue from "../../../components/common/shopLeftSide.vue";
  import productCategoryVue from "../../../components/common/productCategory.vue";
  import recommendsTabVue from "../../../components/common/recommendsTab.vue";
  import articleItem from "../../../components/common/item/articleItem.vue";
  import caseItem from "../../../components/common/item/caseItem.vue";
  import videoItem from "../../../components/common/item/videoItem.vue";
  import { _getData } from "../../../config/getData";
  import shopItemVue from "../../../components/common/item/shopItem.vue";
  import productItemVue from "../../../components/common/item/productItem.vue";
  import modelItemVue from "../../../components/common/item/modelItem.vue";
  import _ from "lodash";

  export default {
    data() {
      return {
        routes: [],
        recommend_tabs_index: 1, //推荐nav标识
        nav: ["店铺(0)", "产品(0)", "型号(0)"],
        list: "",
        isLoading: false,
        categoryId: "", //分类id
        brandId: "", //品牌id
        searchParamas: [] //搜素条件集合
      };
    },
    components: {
      Header,
      Footer,
      search,
      Nav,
      breadcrumbVue,
      shopLeftSideVue,
      productCategoryVue,
      recommendsTabVue,
      articleItem,
      caseItem,
      videoItem,
      shopItemVue,
      productItemVue,
      modelItemVue
    },
    created() {
      this.searchParamas.push({
        name: "关键词：" + this.$route.query.val,
        key: "keyword"
      });
      console.log(this.searchParamas);
      this.routes = [
        {
          name: "首页",
          path: "/"
        },
        {
          name: "搜索结果",
          path: "/search"
        }
      ];
    },
    mounted() {
      this.getSearchList(this.$route.query.val);
    },

    methods: {
      categoryClick(item, val) {
        console.log(item, val);
        this.categoryId = item.id;
        this.brandId = "";
        this.searchParamas = _.take(this.searchParamas, 1);
        this.searchParamas.push({
          name: val.name + "：" + item.name,
          key: "category"
        });
        this.getSearchList(this.$route.query.val);
      },
      delHandleClick(i, key) {
        this.searchParamas.splice(i, 1);
        if (key == "brand") {
          this.brandId = "";
        } else if (key == "category") {
          this.categoryId = "";
        }
        this.getSearchList(this.$route.query.val);
      },
      brandClick(item) {
        console.log(item);
        this.brandId = item.id;
        let obj = _.keyBy(this.searchParamas, "key");

        if (!_.has(obj, "brand")) {
          //this.searchParamas = _.dropRight(this.searchParamas);
          this.searchParamas.push({
            name: "品牌：" + item.name,
            key: "brand"
          });
        } else {
          let index = _.indexOf(_.keys(obj), "brand");

          this.searchParamas.splice(index, 1, {
            name: "品牌：" + item.name,
            key: "brand"
          });
        }
        this.getSearchList(this.$route.query.val).then(() => {
          window.scrollTo(0, 0);
        });
      },
      tabClick(i) {
        this.recommend_tabs_index = i;
      },
      async getSearchList(val) {
        this.isLoading = true;
        return await _getData("/api/item/list", {
          name: val
        })
          .then(data => {
            console.log("搜索内容", data);
            this.list = data.data.list;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.isLoading = false;
            });
          });
      }
    },

    beforeRouteUpdate(to, from, next) {
      this.searchParamas = [];
      this.searchParamas.push({
        name: "关键词：" + to.query.val,
        key: "keyword"
      });
      this.getSearchList(to.query.val);
      this.$children[1].value = to.query.val;
      next();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  .search {
    /deep/ .product-category {
      h2 {
        .btn {
          display: none;
        }
      }
    }
    .container {
      .main-content {
        display: flex;
        justify-content: flex-start;
        position: relative;
        > .left {
          width: 254px;
          margin-right: 25px;
          background: #fff;
          box-shadow: $base-box-shadow;
          height: auto;
          //position: absolute;
          align-self: flex-start;
        }
        > .right {
          //width: $content-left;
          display: flex;
          flex: 1;
          flex-direction: column;
          /deep/ .recommend_tabs {
            margin: 0;
            width: 100%;
            margin-bottom: 24px;
          }
          .recommend_page {
            .recommend_content_box {
              width: 100%;
              display: flex;

              .left {
                display: flex;
                width: 100%;
                > div {
                  margin-right: -25px;
                  // width: 100%;
                  display: flex;
                  > ul {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -12px;
                    &.model {
                      width: 921px;
                      li {
                        width: 100%;
                      }
                    }
                    > .product-item {
                      margin-right: 12px;
                      margin-bottom: 12px;
                    }
                  }
                  /deep/ .no-data {
                    height: 500px;
                    background: #fff;
                    width: 921px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>