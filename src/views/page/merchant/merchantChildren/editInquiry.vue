<template>
  <div class="inquiryOrderDetail">
    <common-title title="编辑询价单"></common-title>
    <div v-if="!isLoading">
      <div class="inquiryContainer">
        <order-title
          :isShowInfo="isShowInfo"
          :data="data"
          :checkedList="checkedList"
        ></order-title>
        <div class="inquiryContent">
          <list-title :titleArr="titleArr"></list-title>
          <div class="listContent">
            <edit-inquiry-product
              v-for="item in data.goodList"
              :key="item.id"
              :itemData="item"
              v-on:getChecked="getChecked"
              :checkedList="checkedList"
              v-on:getData="getData"
              :checkAll="checkAll"
            ></edit-inquiry-product>
          </div>
          <div class="list-footer">
            <check-all
              :amount="checkedList.length"
              :checkAll="checkAll"
              v-on:isCheckAll="isCheckAllMethod"
            >
              <div slot="right-box" class="right-box">
                <a-button
                  type="primary"
                  :loading="loading"
                  :class="['submit', { active: checkedList.length > 0 }]"
                  @click="submitQuote"
                >
                  提交报价
                </a-button>
              </div>
            </check-all>
          </div>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>
<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import orderTitle from "../../../../components/common/order/orderTitle";
  import listTitle from "../../../../components/common/listTitle";
  import checkAll from "../../../../components/common/checkAll";
  import editInquiryProduct from "../../../../components/common/inquiry/editInquiryProduct";
  import { _getData } from "../../../../config/getData";
  export default {
    data() {
      return {
        loading: false,
        isLoading: true,
        isShowInfo: {
          isDetail: true,
          isShow: false,
          current: 1,
          isOrder: false,
          isTrue: true
        },
        checkedList: [],
        checkAll: false,
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "到货时间",
          "询价备注",
          "报价备注"
        ],
        data: {},
        goodsList: []
      };
    },
    methods: {
      submitQuote() {
        // console.log(this.checkedList);
        // console.log(this.goodsList);
        if (this.goodsList.length < this.checkedList.length) {
          this.$message.warning("报价不能为空", 1);
          return;
        } else {
          this.loading = true;
          let flag = true;
          _.map(this.goodsList, o => {
            if (flag) {
              if (!o.unitPrice) {
                flag = false;
                this.loading = false;
                this.$message.warning("报价不能为空", 1);
              }
              if (o.unitPrice == 0) {
                flag = false;
                this.loading = false;
                this.$message.warning("报价不能为0", 1);
              }
            }
          });
          if (flag) {
            _getData("/enquiryPlus/updateEnquiry", {
              param: [{ id: this.$route.params.id, goodsList: this.goodsList }]
            }).then(data => {
              console.log(data);
              this.loading = false;
              if (data.code != 500) {
                this.$message.success("报价成功", 1);
                this.$router.replace({
                  path: "/merchant/inquiryManage",
                  query: { status: 2, keyId: "6" }
                });
              }
            });
          }
        }
      },
      getData(val) {
        console.log("获取所填的数据：", val);
        if (typeof val == "object") {
          _.map(this.goodsList, value => {
            if (value.goodsId == val.data.id) {
              this.goodsList = _.without(this.goodsList, value);
            }
          });

          this.goodsList.push({
            goodsId: val.data.id,
            unitPrice: val.data.unitPrice,
            arrivalTime: val.data.arrivalTime,
            sellerDescription: val.data.shopRemark,
            number: val.data.number
          });
        } else {
          _.map(this.goodsList, value => {
            if (value.goodsId == val) {
              this.goodsList = _.without(this.goodsList, value);
            }
          });
        }
      },
      getChecked(val) {
        if (typeof val == "object") {
          this.checkedList = val;
        } else {
          if (_.indexOf(this.checkedList, val) != -1) {
            this.checkedList = _.without(this.checkedList, val);
          }
        }
        if (this.checkedList.length == this.data.goodList.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      isCheckAllMethod(val) {
        if (val) {
          this.checkAll = true;
          this.checkedList = [];
          for (const val of this.data.goodList) {
            this.checkedList.push(val.id);
          }
        } else {
          this.checkAll = false;
          this.checkedList = [];
          this.goodsList = [];
        }
      }
    },
    mounted() {
      _getData("/enquiryPlus/enquiryDetail", { id: this.$route.params.id }).then(
        data => {
          console.log("获取询价单详情：", data);
          this.data = data;
          this.isLoading = false;
          _.map(this.data.goodList, o => {
            this.checkedList.push(o.id);
          });
          this.checkAll = true;
        }
      );
    },
    components: {
      commonTitle,
      orderTitle,
      listTitle,
      checkAll,
      editInquiryProduct
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .inquiryOrderDetail {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    .inquiryContainer {
      padding-top: 24px;
      /deep/.orderTitle {
        margin-bottom: 24px;
        .common {
          font-size: 14px;
        }
        .left-box {
          .checkedBox {
            display: none;
          }
        }
      }
      /deep/.listTitle {
        margin-bottom: 12px;
        ul {
          li {
            margin-right: 20px;
            &:nth-child(1) {
              margin-right: 12px;
            }
            &:nth-child(2) {
              width: 138px;
            }
            &:nth-child(3) {
              margin-right: 10px;
            }
            &:nth-child(4) {
              width: 98px;
            }
            &:nth-child(5) {
              width: 50px;
            }
            &:nth-child(6) {
              width: 100px;
            }
            &:nth-child(7) {
              width: 98px;
            }
          }
        }
      }
      /deep/.listContent {
        .inquiryProductItem {
          border-bottom: none;
          &:last-child {
            border-bottom: $border-style;
          }
        }
      }
      .list-footer {
        margin-top: 12px;
        /deep/.checkedAllBox {
          .left-box {
            visibility: hidden;
          }
        }
        .right-box {
          width: 104px;
          .submit {
            width: 104px;
            height: 42px;
            line-height: 42px;
            padding: 0 24px;
            border: none;
            border-radius: 0;
            outline: none;
            color: #fff;
            font-size: 14px;
            background-color: #ccc;
            cursor: pointer;
            &.active {
              background-color: #f5a623;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          [ant-click-animating-without-extra-node]:after {
            display: none;
          }
        }
      }
    }
  }
</style>

