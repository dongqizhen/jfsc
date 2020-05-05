<template>
  <div class="one-of-brand-classific">
    <breadcrumb-vue :routes="routes"></breadcrumb-vue>
    <div class="search" ref="search">
      <span
        v-for="(val, i) in nav"
        :key="`nav-${i}`"
        @click="navClick(val, i)"
        :class="val == defaultsNav && 'active'"
      >
        {{ val }}
      </span>
      <!-- <span>一线品牌</span>
      <span class="all active">全部</span> -->
      <ul>
        <li
          v-for="item in letter"
          :key="item"
          @click="letterClick(item)"
          :class="item == defaultsNav && 'active'"
        >
          {{ item }}
        </li>
      </ul>
      <div class="ipt">
        <input
          type="text"
          placeholder="请输入品牌名称"
          v-model="val"
          @keyup.enter="search"
        />
        <span @click="search">搜索</span>
      </div>
    </div>
    <span
      class="manageBtn"
      @click="brandVisible = !brandVisible"
      v-if="isLogin && defaultsNav == '常用品牌' && $route.query.nav_index == 2"
    >
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconguanlichangyongfenlei"></use>
      </svg>
      管理常用品牌
      <!-- <a-tooltip
        title="当前品牌下只展示有型号产品的常用分类"
        :getPopupContainer="getPopupContainer"
        placement="right"
      >
        <svg
          class="icon icon-tip"
          aria-hidden="true"
          v-if="$route.query.nav_index == 1"
        >
          <use xlink:href="#iconzhushi1"></use>
        </svg>
      </a-tooltip> -->
      <common-brands-modal-vue
        :brandVisible="brandVisible"
        v-on:success="success"
      ></common-brands-modal-vue>
    </span>
    <span
      v-if="isLogin && defaultsNav == '常用品牌' && $route.query.nav_index == 1"
      class="note"
    >
      <svg class="icon icon-tip" aria-hidden="true">
        <use xlink:href="#iconzhushi1"></use>
      </svg>
      注：当前分类下仅展示有型号产品的常用品牌
    </span>
    <div class="content">
      <div class="left" :class="$route.query.nav_index == 2 && 'active'">
        <div v-if="!isLoading">
          <div v-if="arr.length">
            <ul>
              <router-link
                v-for="(item, i) in arr"
                :key="item.id"
                tag="li"
                :to="
                  $route.query.nav_index == 2
                    ? {
                        path: '/lookingProduct',
                        query: {
                          nav_index: 2,
                          brandId: item.id,
                          brandName: item.name
                        }
                      }
                    : $route.query.nav_index == 1
                    ? {
                        path: 'brand',
                        query: {
                          nav_index: 1,
                          categoryId: $route.query.categoryId,
                          categoryName: $route.query.categoryName,
                          brandId: item.id,
                          brandName: item.name
                        }
                      }
                    : ''
                "
              >
                <a>
                  <div class="img_box">
                    <img
                      :src="
                        item.app_list_pic_url
                          ? item.app_list_pic_url
                          : '../../../../assets/images/default.png'
                      "
                    />
                    <img
                      v-if="defaultsNav == '一线品牌'"
                      :src="'/assets/images/o-0' + ((i + 1) % 12) + '.png'"
                      class="over"
                    />
                  </div>
                  {{ item.name }}
                </a>
              </router-link>
            </ul>
          </div>
          <no-data v-else text="暂无数据"></no-data>
        </div>
        <loading v-else></loading>
      </div>

      <div class="right">
        <brand-card-vue
          v-if="$route.query.nav_index == 1"
          :data="categoryDetail"
        ></brand-card-vue>
      </div>
    </div>
  </div>
</template>

<script>
  import brandCardVue from "../../../../components/common/brandCard.vue";
  import breadcrumbVue from "../../../../components/common/breadcrumb.vue";
  import CommonBrandsModalVue from "../../../../components/modal/CommonBrandsModal";
  import { _getData } from "../../../../config/getData";
  import { mapState, mapMutations } from "vuex";
  import _ from "lodash";
  import axios from "axios";
  import pinyin from "pinyin";

  export default {
    data() {
      return {
        val: "",
        arr: "",
        navArr: "", //全部类型小类
        routes: "",
        letterArr: "",
        letterVal: "",
        isLoading: false,
        letter: [], //字母索引
        nav: ["一线品牌", "全部"],
        defaultsNav: "", //默认高亮的nav
        brandVisible: false,
        categoryDetail: "",
        getPopupContainer: () => document.querySelector(".manageBtn")
      };
    },
    computed: {
      ...mapState(["isLogin"])
    },
    created() {
      if (this.isLogin) {
        this.nav.unshift("常用品牌");
        this.defaultsNav = "常用品牌";
      } else {
        this.defaultsNav = "一线品牌";
      }

      if (this.$route.query.nav_index == 1) {
        _getData("catalog/getCategory", {
          id: this.$route.query.categoryId
        }).then(data => {
          console.log("小类详情", data);
          this.categoryDetail = data;
        });
      }

      this.routes =
        this.$route.query.nav_index == 2
          ? [
              {
                name: "首页",
                path: "/"
              },
              {
                name: "找品牌",
                path: "/lookingProduct/oneOfBrandClassificne"
              }
            ]
          : [
              {
                name: "首页",
                path: "/"
              },
              {
                name: "找产品",
                path: "/lookingProduct?nav_index=" + this.$route.query.nav_index
              },
              {
                name: this.$route.query.categoryName,
                path: "/lookingProduct/oneOfBrandClassificne"
              }
            ];
    },
    components: {
      brandCardVue,
      breadcrumbVue,
      CommonBrandsModalVue
    },
    mounted() {
      this.getCommonBrandCategory().then(() => {
        // if (this.isLogin) {
        //   this.getCommonBrand();
        // }
      });
    },
    methods: {
      search() {
        if (this.val == "") return;
        this.defaultsNav = "";
        this.isLoading = true;
        _getData(
          "brand/getBrand",
          {
            brandName: this.val.trim(),
            categoryId: this.$route.query.categoryId || ""
          },
          {}
        )
          .then(data => {
            this.arr = data;
          })
          // .then(() => {
          //   this.val = "";
          // })
          .then(() => {
            // this.$nextTick().then(() => {
            //   this.isLoading = false;
            // });
            setTimeout(() => {
              this.isLoading = false;
            }, 300);
          });
      },
      letterClick(item) {
        this.defaultsNav = item;
        this.arr = _.pick(this.letterArr, [item])[item];
        console.log(this.$refs.search.childNodes);
        [...this.$refs.search.childNodes].map((val, i) => {
          val.classList.remove("active");
        });
      },
      async getCommonBrandCategory() {
        this.isLoading = true;
        return await _getData("brand/merge", {
          id: this.$route.query.categoryId || ""
        })
          .then(data => {
            this.navArr = data;
          })
          .then(() => {
            console.log(this.navArr);
            if (this.isLogin) {
              if (this.navArr.userbrandList.length == 0) {
                this.nav.splice(0, 1);
                if (this.navArr.firstLineList.length == 0) {
                  this.nav.splice(0, 1);
                  this.defaultsNav = "全部";
                  this.arr = this.navArr.listAll;
                } else {
                  this.defaultsNav = "一线品牌";
                  this.arr = this.navArr.firstLineList;
                }
              } else {
                this.arr = this.navArr.userbrandList;
              }
            } else {
              if (this.navArr.firstLineList.length == 0) {
                this.nav.splice(0, 1);
                this.defaultsNav = "全部";
                this.arr = this.navArr.listAll;
              } else {
                this.arr = this.navArr.firstLineList;
              }
            }

            this.letterArr = _.groupBy(this.navArr.listAll, val => {
              return _.upperFirst(val.pinyin).substring(0, 1);
            });
            //console.log(this.letterArr, _.keys(this.letterArr));
            this.letter = _.orderBy(_.keys(this.letterArr), val => val, ["asc"]);
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.isLoading = false;
            });
          });
      },
      success() {
        this.getCommonBrandCategory();
        //if (this.defaultsNav == "常用品牌") this.getCommonBrand();
      },
      async getCommonBrand() {
        return await _getData("ubrand/list", {})
          .then(data => {
            console.log("常用品牌", data);
            this.arr = data.userBrandList;
          })
          .then(() => {});
      },
      handleClick(item, i) {},
      navClick(val, i) {
        this.defaultsNav = val;
        console.log(this.defaultsNav);
        switch (val) {
          case "全部":
            this.arr = this.navArr.listAll;
            break;
          case "一线品牌":
            this.arr = this.navArr.firstLineList;
            break;
          case "常用品牌":
            this.arr = this.navArr.userbrandList;
            //this.getCommonBrand();
            break;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss.scss";
  .one-of-brand-classific {
    .search {
      display: flex;
      position: relative;
      justify-content: flex-start;
      margin-top: 4px;
      > span {
        padding: 0 6px;
        font-size: 14px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 26px;
        cursor: pointer;
        margin-right: 10px;
        color: #666666;
        border: 1px solid rgba($color: #333, $alpha: 0.5);
        &.active {
          background: rgba(241, 2, 21, 0.03);
          border: 1px solid #f10215;
          font-size: 14px;
          color: #f10215;
          font-weight: 600;
        }
        // &:not(.all) {
        //   color: #666666;
        //   border: 1px solid #333333;
        // }
        &:hover {
          color: $theme-color;
        }
      }
      ul {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: 26px;
        li {
          font-size: 14px;
          color: #666666;
          font-weight: 600;
          padding-right: 18px;
          cursor: pointer;
          &:hover {
            color: $theme-color;
          }
          &.active {
            color: $theme-color;
          }
        }
      }
      .ipt {
        width: 280px;
        height: 35px;
        position: absolute;
        border: 1px solid $theme-color;
        right: 0px;
        display: flex;
        justify-content: flex-start;
        top: -4px;
        input {
          height: 100%;
          //display: none;
          flex: 1;
          display: flex;
          width: 135px;
          padding: 0 10px;
        }
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          background-image: linear-gradient(90deg, #ff4e1a 0%, #f10000 100%);
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
    span.manageBtn {
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      cursor: pointer;
      margin: 24px 0;
      display: flex;
      align-items: center;
      .icon {
        width: 13px;
        height: 14px;
        margin-right: 5px;
        margin-top: 1px;
      }
      .icon-tip {
        margin-left: 5px;
        margin-bottom: 1px;
      }
      /deep/ .ant-tooltip-inner {
        width: 270px;
      }
    }
    span.note {
      display: flex;
      margin-top: 24px;
      font-size: 14px;
      align-items: center;
      color: #999;
      .icon {
        margin-right: 5px;
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      .left {
        width: 900px;
        // &.active {
        //   width: 900px;
        // }
        ul {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-right: -12px;
          li {
            margin-right: 8px;
            margin-bottom: 30px;
            a {
              display: flex;
              flex-direction: column;
              align-items: center;
              font-size: 15px;
              color: #333333;
              text-decoration: none;
              width: 144px;
              cursor: pointer;
              flex-wrap: wrap;
              text-align: center;
              word-break: break-all;
              .img_box {
                width: 144px;
                height: 104px;
                background: #fff;
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
                margin-bottom: 8px;
                position: relative;
                img {
                  height: 100%;
                  width: 100%;
                }
                .over {
                  position: absolute;
                  left: 0;
                }
              }
              &:hover {
                color: $theme-color;
              }
            }
          }
        }

        /deep/ .no-data {
          height: 620px;
          background: #fff;
        }
      }
      .right {
        width: 280px;
      }
    }
  }
</style>