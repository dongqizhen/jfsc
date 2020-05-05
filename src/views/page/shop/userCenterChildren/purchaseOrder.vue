<template>
  <div class="shoppingCart">
    <common-title title="选购单"></common-title>
    <div v-if="!isLoading">
      <div class="listContainer">
        <list-title :titleArr="titleArr"></list-title>
        <div class="listContent" v-if="data.length > 0">
          <purchase-order-item
            v-for="item in data"
            :key="item.id"
            :data="item"
            :isCheckAll="isCheckAll(item.sid)"
            v-on:getIsCheckAll="getIsCheckAll"
            :selectDatas="selectDatas"
            v-on:getIsDelete="getIsDelete"
          ></purchase-order-item>
        </div>
        <no-data text="暂无数据" v-else></no-data>
        <div class="tfooter">
          <check-all
            :amount="products.length"
            :checkAll="checkAll"
            v-on:isCheckAll="isCheckAllMethod"
            v-on:isDelete="batchDeleteData"
            v-if="data.length > 0"
          >
            <div slot="right-box">
              <a-button
                type="primary"
                :loading="loading"
                v-bind:class="['remark', products.length > 0 ? 'active' : '']"
                @click="addInquiry"
              >
                一键获取报价
              </a-button>
            </div>
          </check-all>
        </div>
      </div>
      <side-bar />
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import _ from "lodash";
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import checkAll from "../../../../components/common/checkAll";
  import listTitle from "../../../../components/common/listTitle";
  import purchaseOrderItem from "../../../../components/common/purchaseOrderItem";
  import sideBar from "../../../../components/sideBar/sideBar";
  import { _getData } from "../../../../config/getData";
  export default {
    data() {
      return {
        loading: false,
        isLoading: true,
        data: [],
        checkAll: false,
        checkedList: [],
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "备注",
          "操作"
        ],
        selectDatas: [],
        products: [],
        allProducts: []
      };
    },
    methods: {
      addInquiry() {
        if (this.selectDatas.length == 0) {
          this.$message.warning("请先选择产品", 1);
          return;
        } else {
          this.loading = true;
          _.map(this.selectDatas, o => {
            let selectProducts = [];
            _.map(o.goodsList, value => {
              _.map(this.allProducts, val => {
                if (value == val.goods_id) {
                  selectProducts.push({
                    goodsId: value,
                    number: val.number,
                    buyerDescription: val.goods_specifition_name_value
                      ? val.goods_specifition_name_value
                      : ""
                  });
                }
              });
            });
            o.goodsList = selectProducts;
          });
        }
        _getData("/enquiryPlus/addEnquiry", { param: this.selectDatas }).then(
          data => {
            // console.log("一键获取报价：", data);
            this.loading = false;
            if (data.code != 500) {
              this.getCart().then(() => {
                let { href } = this.$router.resolve({
                  path: "/userCenter/myInquiry",
                  query: { keyId: "2" }
                });
                window.open(href, "_blank");
              });
            }
          }
        );
      },
      getIsCheckAll(val) {
        // console.log(val);
        if (val.isCheckAll) {
          if (
            _.find(this.selectDatas, o => {
              return o.storeId == val.storeId;
            })
          ) {
            _.each(this.selectDatas, value => {
              if (value.storeId == val.storeId) {
                value.goodsList = val.goodsList;
                value.isCheckAll = val.isCheckAll;
              }
            });
          } else {
            this.selectDatas.push({
              storeId: val.storeId,
              goodsList: val.goodsList,
              isCheckAll: val.isCheckAll
            });
          }
        } else {
          if (val.goodsList.length == 0) {
            _.each(this.selectDatas, value => {
              if (value.storeId == val.storeId) {
                this.selectDatas = _.without(this.selectDatas, value);
              }
            });
          } else {
            if (
              _.find(this.selectDatas, o => {
                return o.storeId == val.storeId;
              })
            ) {
              _.each(this.selectDatas, item => {
                if (item.storeId == val.storeId) {
                  item.goodsList = val.goodsList;
                  item.isCheckAll = val.isCheckAll;
                }
              });
            } else {
              this.selectDatas.push({
                storeId: val.storeId,
                goodsList: val.goodsList,
                isCheckAll: val.isCheckAll
              });
            }
          }
        }
        // console.log(this.selectDatas);
        this.products = [];
        _.map(this.selectDatas, o => {
          for (const item of o.goodsList) {
            this.products.push(item);
          }
        });
        if (this.products.length == this.allProducts.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      isCheckAllMethod(val) {
        this.products = [];
        this.selectDatas = [];
        if (val) {
          this.checkAll = true;
          this.products = this.allProducts;
          _.map(this.data, o => {
            let goodsIds = [];
            for (const item of o.list) {
              goodsIds.push(item.goods_id);
            }
            this.selectDatas.push({
              storeId: o.sid,
              goodsList: goodsIds,
              isCheckAll: true
            });
          });
        } else {
          this.checkAll = false;
        }
      },
      isCheckAll(id) {
        for (const val of this.selectDatas) {
          if (val.storeId == id) {
            return val.isCheckAll;
          }
        }
      },
      getIsDelete(val) {
        // console.log(val);
        this.$message.success("删除成功", 1);
        this.getCart();
      },
      batchDeleteData() {
        // console.log(this.selectDatas);
        if (this.selectDatas.length > 0) {
          let selectProduct = [];
          _.map(this.selectDatas, o => {
            _.map(o.goodsList, val => {
              selectProduct.push(val);
            });
          });
          _getData("/cart/delete", { goodIds: selectProduct.join(",") }).then(
            data => {
              // console.log(data);
              if (data.code != 500) {
                this.$message.success("删除成功", 1);
              }
            }
          );
        } else {
          this.$message.warning("请先选择产品", 1);
          return;
        }
      },
      async getCart() {
        this.isLoading = true;
        return await _getData("/cart/getCarts", {})
          .then(data => {
            console.log("获取选购单：", data);
            this.data = data.list;
            _.map(data.list, o => {
              for (const item of o.list) {
                this.allProducts.push(item);
              }
            });
          })
          .then(() => {
            this.isLoading = false;
          });
      }
    },
    mounted() {
      this.getCart().then(() => {
        this.isLoading = false;
      });
    },
    components: {
      commonTitle,
      checkAll,
      listTitle,
      purchaseOrderItem,
      sideBar
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .shoppingCart {
    min-height: 666px;
    background-color: #fff;
    padding: 4px 20px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 110px;
    .listContainer {
      margin-top: 12px;
      /deep/.listTitle {
        ul {
          li {
            &:nth-child(4) {
              width: 100px;
            }
            &:nth-child(5) {
              width: 80px;
            }
            &:nth-child(6) {
              width: 160px;
              margin-right: 30px;
            }
          }
        }
      }
      .listContent {
        margin-top: 24px;
      }
      /deep/.no-data {
        height: 520px;
      }
      .tfooter {
        .remark {
          padding: 0 22px;
          height: 42px;
          background-color: #ccc;
          color: #fff;
          font-size: 14px;
          line-height: 42px;
          text-align: center;
          font-weight: 600;
          border: none;
          border-radius: 0;
          cursor: pointer;
          &.active {
            background-image: linear-gradient(90deg, #f10000 0%, #ff4e1a 100%);
          }
        }
        [ant-click-animating-without-extra-node]:after {
          display: none;
        }
      }
    }
  }
</style>
