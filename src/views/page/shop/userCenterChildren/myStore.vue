<template>
  <div class="myStore">
    <div v-if="!isLoading">
      <common-title title="我的收藏">
        <div slot="titleRight" class="right-box">
          <div class="search-box">
            <a-input
              placeholder="请输入搜索内容"
              v-model="name"
              @pressEnter="search"
            ></a-input>
            <a-button class="searchBtn" @click="search">搜索</a-button>
            <a-button class="clearBtn" @click="clear">清空</a-button>
          </div>
          <div class="tab-box">
            <div :class="current == 0 ? 'active' : ''" @click="getTab(0)">
              产品({{ goodsCount }})
            </div>
            <div :class="current == 1 ? 'active' : ''" @click="getTab(1)">
              店铺({{ shopCount }})
            </div>
          </div>
        </div>
      </common-title>
      <div class="listContainer">
        <div v-if="!goodLoading">
          <div class="listContent" v-if="data.length > 0">
            <ul v-if="current == 0">
              <product-item
                v-for="item in data"
                :key="item.id"
                :list="item"
              ></product-item>
            </ul>
            <ul v-else>
              <shop-item
                v-for="item in data"
                :key="item.id"
                :item="item"
              ></shop-item>
            </ul>
            <pagination
              :data="paginationData"
              v-on:onPaginationChange="getPaginationChange"
              v-if="paginationData.count != 0"
            ></pagination>
          </div>
          <no-data v-else type="no-collect" text="暂无数据"></no-data>
        </div>
        <loading v-else :number="2" :rows="4"></loading>
      </div>
    </div>
    <loading v-else :number="2"></loading>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import productItem from "../../../../components/common/item/productItem";
  import shopItem from "../../../../components/common/item/shopItem";
  import pagination from "../../../../components/common/pagination";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        isLoading: true,
        data: [],
        name: "", //搜索关键字
        current: 0,
        goodsCount: 0,
        shopCount: 0,
        // searchParams: {
        //   name: "",
        //   typeId: 0, //收藏类型 0 商品 1 店铺
        //   currentPage: 1,
        //   countPerPage: 8
        // },
        goodLoading: true,
        paginationData: {}
      };
    },
    methods: {
      getPaginationChange(page) {
        //console.log(val);
        //this.searchParams.currentPage = val;
        this.getList(page);
      },
      search() {
        this.getList();
        this.getStoreNumber();
      },
      clear() {
        this.name = "";
      },
      getTab(val) {
        this.current = val;
        //this.searchParams.typeId = val;
        this.getList();
      },
      async getList(currentPage = 1) {
        this.goodLoading = true;
        return await _getData("/collect/list", {
          name: this.name,
          typeId: this.current, //收藏类型 0 商品 1 店铺
          currentPage: currentPage,
          countPerPage: 8
        })
          .then(data => {
            console.log("获取收藏数据：", data);
            this.data = data.data;
            this.paginationData = data;
          })
          .then(() => {
            this.goodLoading = false;
          });
      },
      async getStoreNumber() {
        return await _getData("/collect/count", {
          name: this.name
        }).then(data => {
          console.log("获取的收藏的数量：：：", data);
          this.goodsCount = data.goodsCount;
          this.shopCount = data.shopCount;
        });
      }
    },
    components: {
      commonTitle,
      productItem,
      shopItem,
      pagination
    },
    mounted() {
      _getDataAll([this.getList(), this.getStoreNumber()]).then(() => {
        this.isLoading = false;
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .myStore {
    width: 1040px;
    min-height: 571px;
    margin-bottom: 100px;
    .common-title {
      height: 59px;
      background-color: #fff;
      padding: 0 13px 0 20px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      border-bottom: none;
      .right-box {
        width: 774px;
        display: flex;
        justify-content: space-between;
        .search-box {
          display: flex;
          /deep/.ant-input {
            height: 27px;
            line-height: 27px;
            font-size: 12px;
            font-weight: normal;
            &:hover {
              border-color: $theme-color;
            }
            &:focus {
              border-color: $theme-color;
              box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
            }
          }
          /deep/.ant-btn {
            margin-right: 10px;
            height: 27px;
            font-size: 12px;
            color: #ffffff;
            border-radius: 0%;
          }
          .searchBtn {
            background-color: $theme-color;
            border-color: $theme-color;
            margin-left: 10px;
          }
          .clearBtn {
            background-color: #999;
            border-color: #999;
          }
        }
        .tab-box {
          display: flex;
          > div {
            width: 69px;
            height: 27px;
            line-height: 27px;
            font-size: 12px;
            color: #333333;
            font-weight: normal;
            border: $border-style;
            text-align: center;
            cursor: pointer;
            &:first-child {
              border-right: none;
            }
            &.active {
              background: #ffdfaa;
              border: 1px solid #f5a623;
            }
          }
        }
      }
    }

    .listContainer {
      margin-top: 12px;
      margin-right: -50px;
      /deep/ .loading {
        width: 1040px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        > li {
          width: 254px;
          margin-right: 8px;
          float: left;
          margin-bottom: 8px;
          /deep/ .img {
            height: 224px;
            width: 224px;
          }
          &.product-item {
            /deep/ .address {
              > div {
                > div {
                  width: 135px;
                }
              }
            }
          }
          &.shop-item {
            /deep/.img_box {
              width: 224px;
              height: 224px;
            }
          }
        }
      }
      /deep/.no-data {
        width: 1040px;
        height: 500px;
        background-color: #fff;
      }
    }
  }
</style>
