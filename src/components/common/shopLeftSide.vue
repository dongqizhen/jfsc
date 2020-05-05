<template>
  <div class="shop-left-side">
    <h2>品牌</h2>
    <div class="commonBrand" v-show="isLogin && commonBrand.length">
      <h3>
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconpingjiashixinwujiaoxing"></use>
          </svg>
          常用品牌
        </span>
        <!-- <span @click="btnClicik">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconguanlichangyongfenlei"></use>
          </svg>
          管理常用品牌
        </span> -->
        <!-- <a-tooltip
          title="仅展示有型号产品的常用品牌"
          :getPopupContainer="getPopupContainer"
          placement="right"
        >
          <svg class="icon icon-tip" aria-hidden="true">
            <use xlink:href="#iconzhushi1"></use>
          </svg>
        </a-tooltip> -->
      </h3>
      <div class="item-box" :class="commonMore && 'active'">
        <ul class="item_container">
          <li
            v-for="item in commonBrand"
            :key="item.id"
            @click="$emit('brandClick', item)"
          >
            {{ item.name }}
          </li>
        </ul>
        <!-- <span @click="commonMore = !commonMore" :class="commonMore && 'active'">
          {{ commonMore ? "收起" : "更多" }}

          <svg class="icon" aria-hidden="true" v-if="!commonMore">
            <use xlink:href="#icongengduoxialajiantou"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icontianjiaduibichanpinxiala"></use>
          </svg>
        </span> -->
      </div>
      <common-brands-modal-vue
        :brandVisible="brandVisible"
        v-on:success="success"
      ></common-brands-modal-vue>
    </div>
    <div class="line-products">
      <h3 v-show="brandList.firstLineList.length">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyixianpinpai"></use>
          </svg>
          一线品牌
        </span>
      </h3>
      <ul>
        <li
          class="item-box"
          :class="firstMore && 'active'"
          v-show="brandList.firstLineList && brandList.firstLineList.length"
        >
          <ul class="item_container">
            <li
              v-for="item in brandList.firstLineList"
              :key="item.id"
              @click="$emit('brandClick', item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <span @click="firstMore = !firstMore" :class="firstMore && 'active'">
            {{ firstMore ? "收起" : "更多" }}
            <svg class="icon" aria-hidden="true" v-if="!firstMore">
              <use xlink:href="#icongengduoxialajiantou"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icontianjiaduibichanpinxiala"></use>
            </svg>
          </span>
        </li>
        <li
          class="item-box"
          v-for="(val, key, i) in letterArr"
          :key="key"
          :class="listMore[i] && 'active'"
        >
          <h4>{{ key }}</h4>
          <ul class="item_container">
            <li
              v-for="item in val"
              :key="key + item.id"
              @click="$emit('brandClick', item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <span @click="moreClick(i)" :class="listMore[i] && 'active'">
            {{ listMore[i] ? "收起" : "更多" }}
            <svg class="icon" aria-hidden="true" v-if="!listMore[i]">
              <use xlink:href="#icongengduoxialajiantou"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icontianjiaduibichanpinxiala"></use>
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "../../config/getData";
  import CommonBrandsModalVue from "../modal/CommonBrandsModal.vue";

  export default {
    data() {
      return {
        brandList: [],
        commonBrand: [],
        letterArr: [],
        arr: [],
        brandVisible: false,
        commonMore: false, //常用品牌更多
        firstMore: false, //一线品牌更多
        listMore: []
      };
    },
    props: ["categoryId", "currentPosition"],

    computed: {
      ...mapState(["isLogin"])
    },
    components: {
      CommonBrandsModalVue
    },
    methods: {
      //点击更多
      moreClick(i) {
        if (this.listMore[i]) {
          this.listMore.splice(i, 1, false);
          return;
        }
        this.listMore.splice(i, 1, true);
      },
      //点击管理常用品牌
      btnClicik() {
        this.brandVisible = true;
      },
      success() {
        this.getCommonBrand();
      },
      async getCommonBrand() {
        return await _getData("ubrand/list", {})
          .then(data => {
            this.commonBrand = data.userBrandList;
          })
          .then(() => {});
      },
      async getBrandList() {
        let url = "brand/merge",
          req = { id: this.categoryId };
        if (this.currentPosition) {
          req = this.currentPosition;
          url = "brand/mergeForShopping";
        }
        return await _getData(url, req)
          .then(data => {
            console.log("456", data);
            this.brandList = data;
            this.arr = data.listAll;
            this.commonBrand = data.userbrandList;
            this.letterArr = _.groupBy(
              _.orderBy(
                this.arr,
                val => {
                  return _.upperFirst(val.pinyin).substring(0, 1);
                },
                ["asc"]
              ),
              val => {
                return _.upperFirst(val.pinyin).substring(0, 1);
              }
            );
          })
          .then(() => {
            this.$nextTick().then(() => {
              document.querySelectorAll(".item_container").forEach((val, i) => {
                // console.log(val.offsetHeight);
                if (this.isLogin) {
                  if (i != 0 && val.offsetHeight <= 102) {
                    let dom = (document.querySelectorAll(".item-box")[
                      i
                    ].lastChild.style.display = "none");
                  }
                } else {
                  if (val.offsetHeight <= 102) {
                    let dom = (document.querySelectorAll(".item-box")[
                      i
                    ].lastChild.style.display = "none");
                  }
                }
              });
            });
          });
      },
      init() {
        this.getBrandList().then(() => {
          this.listMore = [...Array(_.keys(this.letterArr).length)];
        });
      }
    },
    mounted() {
      // if (this.isLogin) {
      //   this.getCommonBrand();
      // }

      this.init();
    },
    watch: {
      categoryId() {
        this.getBrandList();
      }
    }
  };
</script>


<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  h2 {
    height: 47px;
    display: flex;
    line-height: 47px;
    padding-left: 20px;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }
  .commonBrand,
  .line-products {
    h3 {
      height: 48px;
      padding-left: 12.5px;
      padding-right: 10px;
      line-height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      span {
        font-size: 13px;
        color: #333333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon {
          height: 13px;
          width: 13px;
          margin-right: 4.5px;
          margin-bottom: 1px;
        }
        &:nth-child(2) {
          font-size: 11px;
          color: #333333;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
          .icon {
            width: 13px;
            height: 14px;
            margin-right: 5px;
            margin-top: 2px;
          }
        }
      }
    }
    .item-box {
      padding: 20px 15px 0 20px;
      position: relative;
      // height: 102px;
      overflow: hidden;
      transition: all 0.3s;
      &.active {
        height: auto;
        overflow: initial;
      }
      h4 {
        background: #f5f5f5;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 14px;
        color: #019ddd;
        font-weight: 600;
      }
      ul {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-right: -20px;

        overflow: hidden;

        li {
          font-size: 14px;
          color: #666666;
          margin-bottom: 20px;
          cursor: pointer;
          margin-right: 20px;
          &:hover {
            color: $theme-color;
          }
        }
      }
      > span {
        font-size: 12px;
        color: #019ddd;
        position: absolute;
        display: flex;
        height: 21px;
        bottom: 20px;
        right: 15px;
        line-height: 21px;
        align-items: center;
        display: flex;
        cursor: pointer;
        background: #fff;
        padding-left: 10px;

        &.active {
          color: #999999;
          .icon {
            transform: rotate(180deg);
          }
        }
        .icon {
          height: 5px;
          width: 9px;
          margin-left: 4px;
          transition: all 0.3s;
          &.active {
          }
        }
      }
    }
  }
  .line-products {
    > ul {
      > li.item-box {
        padding: 0;
        height: 132px;
        &:first-child {
          height: 102px;
        }
        transition: all 0.3s;
        &.active {
          height: auto;
          overflow: initial;
        }
        > ul {
          padding: 20px 15px 0 20px;
          //height: 102px;
          > li {
          }
        }
      }
    }
  }
</style>