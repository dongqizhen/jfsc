<template>
  <div class="brand-classific">
    <breadcrumb-vue :routes="routes"></breadcrumb-vue>
    <!-- <h2>
      <span class="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconchanpinfenlei"></use>
        </svg>
        品牌分类
      </span>
    </h2> -->
    <div class="main-content">
      <div class="left" :class="$route.query.nav_index == 1 && 'active'">
        <div v-if="!isLoading">
          <div class="left-L">
            <ul class="clearfix">
              <li
                v-for="(item, i) in left"
                :key="`item-${i}`"
                :class="item.id == '' && 'commonCategorie'"
              >
                <h2>
                  <span class="title">
                    <svg class="icon" aria-hidden="true" v-if="item.id == ''">
                      <use xlink:href="#iconpingjiashixinwujiaoxing"></use>
                    </svg>
                    <img :src="item.active_icon" alt="" v-else />
                    {{ item.name }}
                  </span>
                  <span
                    class="btn"
                    @click="handleClick"
                    v-if="!item.id && $route.query.nav_index == 1"
                  >
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconguanlichangyongfenlei"></use>
                    </svg>
                    管理常用分类
                  </span>
                  <span
                    class="note"
                    v-if="!item.id && $route.query.nav_index == 2"
                  >
                    <a-tooltip
                      title="当前品牌下仅展示有型号产品的常用分类"
                      :getPopupContainer="getPopupContainer"
                      placement="right"
                    >
                      <svg class="icon icon-tip" aria-hidden="true">
                        <use xlink:href="#iconzhushi1"></use>
                      </svg>
                    </a-tooltip>
                  </span>
                </h2>

                <div class="brand-box" :class="left_show_arr[i] && 'active'">
                  <ul class="box_com" v-if="item.subCategoryList.length">
                    <router-link
                      :to="
                        $route.query.nav_index == 1
                          ? {
                              path: 'oneOfBrandClassificne',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name
                              }
                            }
                          : $route.query.nav_index == 2
                          ? {
                              path: 'brand',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name,
                                brandId: $route.query.brandId,
                                brandName: $route.query.brandName
                              }
                            }
                          : ''
                      "
                      append
                      tag="li"
                      v-for="val in item.subCategoryList"
                      :key="val.id"
                    >
                      <a>
                        {{ val.name }}
                      </a>
                    </router-link>
                  </ul>
                  <no-data
                    type="no-collect"
                    class="noData"
                    v-else
                    text="暂无常用分类"
                  ></no-data>
                </div>

                <span
                  @click="LeftMoreBtnClick(i)"
                  v-if="left_show_arr[i]"
                  class="active"
                >
                  收起
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icontianjiaduibichanpinxiala"></use>
                  </svg>
                </span>
                <span @click="LeftMoreBtnClick(i)" v-else>
                  更多
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icongengduoxialajiantou"></use>
                  </svg>
                </span>
              </li>
            </ul>
            <common-categories-modal-vue
              :Visible="visible"
              v-on:success="success"
            ></common-categories-modal-vue>
          </div>
          <div class="left-R">
            <ul class="clearfix">
              <li v-for="(item, i) in right" :key="`item_right-${i}`">
                <h2>
                  <span class="title">
                    <!-- <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconpingjiashixinwujiaoxing"></use>
                    </svg> -->
                    <img :src="item.active_icon" alt="" />
                    {{ item.name }}
                  </span>
                </h2>
                <div class="brand-box" :class="right_show_arr[i] && 'active'">
                  <ul class="box_com">
                    <router-link
                      :to="
                        $route.query.nav_index == 1
                          ? {
                              path: 'oneOfBrandClassificne',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name
                              }
                            }
                          : $route.query.nav_index == 2
                          ? {
                              path: 'brand',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name,
                                brandId: $route.query.brandId,
                                brandName: $route.query.brandName
                              }
                            }
                          : ''
                      "
                      append
                      tag="li"
                      v-for="val in item.subCategoryList"
                      :key="val.id"
                    >
                      <a>
                        {{ val.name }}
                      </a>
                    </router-link>
                  </ul>
                </div>

                <span
                  @click="rightMoreBtnClick(i)"
                  v-if="right_show_arr[i]"
                  class="active"
                >
                  收起
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icontianjiaduibichanpinxiala"></use>
                  </svg>
                </span>
                <span @click="rightMoreBtnClick(i)" v-else>
                  更多
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icongengduoxialajiantou"></use>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
          <div class="left-C">
            <ul class="clearfix">
              <li v-for="(item, i) in center" :key="`item-${i}`">
                <h2>
                  <span class="title">
                    <svg class="icon" aria-hidden="true" v-if="item.id == ''">
                      <use xlink:href="#iconpingjiashixinwujiaoxing"></use>
                    </svg>
                    <img :src="item.active_icon" alt="" v-else />
                    {{ item.name }}
                  </span>
                  <span class="btn" @click="handleClick" v-if="!item.id">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconguanlichangyongfenlei"></use>
                    </svg>
                    管理常用分类
                    <common-categories-modal-vue
                      :Visible="visible"
                      v-on:success="success"
                    ></common-categories-modal-vue>
                  </span>
                </h2>
                <div class="brand-box" :class="center_show_arr[i] && 'active'">
                  <ul class="box_com">
                    <router-link
                      :to="
                        $route.query.nav_index == 1
                          ? {
                              path: 'oneOfBrandClassificne',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name
                              }
                            }
                          : $route.query.nav_index == 2
                          ? {
                              path: 'brand',
                              query: {
                                nav_index: $route.query.nav_index,
                                categoryId: val.id,
                                categoryName: val.name,
                                brandId: $route.query.brandId,
                                brandName: $route.query.brandName
                              }
                            }
                          : ''
                      "
                      append
                      tag="li"
                      v-for="val in item.subCategoryList"
                      :key="val.id"
                    >
                      <a>
                        {{ val.name }}
                      </a>
                    </router-link>
                  </ul>
                </div>

                <span
                  @click="centerMoreBtnClick(i)"
                  v-if="center_show_arr[i]"
                  class="active"
                >
                  收起
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icontianjiaduibichanpinxiala"></use>
                  </svg>
                </span>
                <span @click="centerMoreBtnClick(i)" v-else>
                  更多
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icongengduoxialajiantou"></use>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <loading v-else></loading>
      </div>

      <div class="right" :class="$route.query.nav_index == 1 && 'active'">
        <brand-card-vue
          v-if="$route.query.nav_index == 2"
          :data="brandDetail"
        ></brand-card-vue>
      </div>
    </div>
  </div>
</template>

<script>
  import brandCardVue from "../../../../components/common/brandCard.vue";
  import breadcrumbVue from "../../../../components/common/breadcrumb.vue";
  import CommonCategoriesModalVue from "../../../../components/modal/CommonCategoriesModal.vue";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import { mapState, mapMutations } from "vuex";
  import _ from "lodash";

  export default {
    data() {
      return {
        routes: "",
        visible: false,
        left_showMore: false,
        left_index: null,
        left_show_arr: [], //左侧点击更多是否展开控制数组
        right_show_arr: [], //右侧点击更多是否展开控制数组
        center_show_arr: [],
        left: [], //左侧渲染数组
        right: [], //右侧渲染数组
        center: [],
        brandDetail: "",
        commonCategorie: [],
        isLoading: true
      };
    },
    components: {
      brandCardVue,
      breadcrumbVue,
      CommonCategoriesModalVue
    },
    computed: {
      ...mapState(["isLogin"])
    },
    methods: {
      handleClick() {
        this.visible = !this.visible;
      },
      success() {
        this.getCommonCategory();
      },
      LeftMoreBtnClick(i) {
        if (this.left_show_arr[i]) {
          this.left_show_arr.splice(i, 1, false);
          return;
        }
        this.left_show_arr.splice(i, 1, true);
      },
      rightMoreBtnClick(i) {
        if (this.right_show_arr[i]) {
          this.right_show_arr.splice(i, 1, false);

          return;
        }
        this.right_show_arr.splice(i, 1, true);
      },
      centerMoreBtnClick(i) {
        if (this.center_show_arr[i]) {
          this.center_show_arr.splice(i, 1, false);

          return;
        }
        this.center_show_arr.splice(i, 1, true);
      },
      //获取常用分类
      async getCommonCategory() {
        let param = this.$route.query.brandId
          ? { brandId: this.$route.query.brandId }
          : {};
        return await _getData("ucatalog/list", param).then(data => {
          console.log("常用分类", data);
          if (this.isLogin) {
            this.left[0].subCategoryList = data.userCategoryList;
          }
        });
      },
      async getAllCategory() {
        return await _getData("catalog/listAll", {})
          .then(data => {
            console.log("所有", data);
            console.log(this.left);
            _.map(data.currentCategory, (val, i) => {
              if (this.isLogin) {
                if ((i + 1) % 3 == 1) {
                  this.right.push(val);
                } else if ((i + 1) % 3 == 2) {
                  this.center.push(val);
                } else {
                  this.left.push(val);
                }
              } else {
                if ((i + 1) % 3 == 1) {
                  this.left.push(val);
                } else if ((i + 1) % 3 == 2) {
                  this.right.push(val);
                } else {
                  this.center.push(val);
                }
              }
            });
            console.log(this.left, this.right, this.center);
          })
          .then(() => {
            this.$nextTick().then(() => {});
          });
      },
      async getByBrandId() {
        return await _getData("/catalog/getByBrand", {
          brandId: this.$route.query.brandId
        }).then(data => {
          console.log("按品牌", data);
          _.map(data.currentCategory, (val, i) => {
            if (this.isLogin) {
              if ((i + 1) % 3 == 1) {
                this.right.push(val);
              } else if ((i + 1) % 3 == 2) {
                this.center.push(val);
              } else {
                this.left.push(val);
              }
            } else {
              if ((i + 1) % 3 == 1) {
                this.left.push(val);
              } else if ((i + 1) % 3 == 2) {
                this.right.push(val);
              } else {
                this.center.push(val);
              }
            }
          });
        });
      }
    },
    mounted() {
      _getDataAll([
        this.getCommonCategory(),
        this.$route.query.nav_index == 1
          ? this.getAllCategory()
          : this.getByBrandId()
      ])
        .then(() => {
          this.isLoading = false;
        })
        .then(() => {
          document.querySelectorAll(".box_com").forEach((val, i) => {
            console.log(val.offsetHeight);
            if (val.offsetHeight <= 160) {
              val.parentElement.nextElementSibling.style.display = "none";
            }
          });
        });

      //获取所有分类
    },
    created() {
      if (this.$route.query.nav_index == 2) {
        _getData("brand/detail", {
          id: this.$route.query.brandId
        }).then(data => {
          console.log("品牌详情", data);
          this.brandDetail = data;
        });
      }
      if (this.isLogin) {
        this.left = [
          {
            name: "常用分类",
            id: "",
            subCategoryList: []
          }
        ];
      }
      this.routes =
        this.$route.query.nav_index == 1
          ? [
              {
                name: "首页",
                path: "/"
              },
              {
                name: "找产品",
                path: "/lookingProduct"
              }
            ]
          : [
              {
                name: "首页",
                path: "/"
              },
              {
                name: "找品牌",
                path:
                  "/lookingProduct/oneOfBrandClassificne?nav_index=" +
                  this.$route.query.nav_index
              },
              {
                name: this.$route.query.brandName,
                path: "/lookingProduct"
              }
            ];
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  h2 {
    height: 42px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
    span {
      display: flex;
      align-items: center;
    }
    span.title {
      font-weight: 600;
      font-size: 16px;
      color: #333333;
      line-height: 16px;

      .icon {
        width: 19px;
        height: 13px;
        margin-right: 7px;
      }
    }
    span.btn {
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      cursor: pointer;
      .icon {
        width: 13px;
        height: 14px;
        margin-right: 5px;
        margin-top: 1px;
      }
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .main-content {
    display: flex;
    justify-content: space-between;
    .left {
      margin-right: -24px;
      width: $content-left;
      display: flex;
      justify-content: space-between;

      &.active {
        width: 1200px;
        .left-L,
        .left-R,
        .left-C {
          width: 386px;
        }
      }
      > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .left-L,
      .left-R,
      .left-C {
        width: 289px;
        margin-right: 13px;
        > ul {
          width: 100%;
          // display: flex;
          // justify-content: space-between;
          // flex-wrap: wrap;
          margin-bottom: -24px;
          // float: left;
          margin-right: -30px;
          > li {
            width: 100%;
            box-shadow: $base-box-shadow;
            background: #fff;
            margin-bottom: 24px;
            position: relative;
            float: left;
            margin-right: 20px;
            &.commonCategorie {
              > span {
                display: none;
              }
            }
            h2 {
              height: 60px;
              border-bottom: 1px solid #dddddd;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 10px 0 20px;
              .title {
                font-size: 18px;
                color: #333333;
                font-weight: 600;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                img {
                  width: 20px;
                  height: 22px;
                  margin-right: 8px;
                }
                .icon {
                  height: 22px;
                  width: 22px;
                  margin-right: 8px;
                  margin-bottom: 0px;
                }
              }
              .btn {
                font-size: 14px;
                color: #999999;
                cursor: pointer;
                position: relative;
                /deep/ .Common-Categories-Modal {
                  position: absolute;
                  z-index: 1000;
                }
              }
            }
            .brand-box {
              //width: 100%;
              height: 160px;
              overflow: hidden;
              &.active {
                height: auto;
              }
              ul {
                // display: flex;
                // justify-content: flex-start;
                overflow: hidden;
                transition: all 0.3s;
                padding: 20px;
                // flex-wrap: wrap;
                padding-right: 10px;
                margin-right: -30px;
                padding-bottom: 4px;

                li {
                  font-size: 13px;
                  height: auto;
                  margin-right: 30px;
                  margin-bottom: 16px;
                  cursor: pointer;
                  display: flex;
                  height: 18px;
                  float: left;
                  a {
                    color: #666666;
                    text-decoration: none;
                  }
                  &:hover {
                    a {
                      color: $theme-color;
                    }
                  }
                }
              }
            }

            > span {
              position: absolute;
              right: 18px;
              bottom: 20px;
              font-size: 12px;
              color: #019ddd;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              padding: 0 5px;
              background: #fff;
              &.active {
                color: #999999;
                .icon {
                  transform: rotate(180deg);
                }
              }
              .icon {
                height: 6px;
                width: 10px;
                margin-left: 4px;
                margin-top: 1px;
                transition: all 0.3s;
                &.active {
                  transform: rotate(180deg);
                }
              }
              &:hover {
                // opacity: 0.7;
              }
            }
          }
        }
      }
      .left-C {
        margin-right: 0;
      }
    }

    .right {
      width: 280px;
      &.active {
        display: none;
      }
    }
  }
</style>
