<template>
  <div class="inquiryDetail">
    <common-title title="询价单"></common-title>
    <div v-if="!isLoading">
      <div class="listContainer">
        <order-title
          :isShowInfo="isShowInfo"
          :data="data"
          :checkedList="checkedList"
          v-on:getChecked="getChecked"
        ></order-title>
        <div class="shopAndlink">
          <div class="shopName">
            <img :src="data.shopImage" />
            {{ data.shopName }}
          </div>
          <div class="linkName">联系人：{{ data.shopLinkName }}</div>
          <div class="phone">联系方式：{{ data.shopTel }}</div>
        </div>
        <div class="listContent">
          <list-title :titleArr="titleArr"></list-title>
          <ul>
            <li
              v-for="item in data.goodList"
              :key="item.id"
              :class="addClass(item.id)"
            >
              <span>
                <label>
                  <a-checkbox
                    @change="onChange(item.id)"
                    :checked="checkedChange(item.id)"
                  ></a-checkbox
                ></label>
              </span>
              <span @click="turnToProductDetail(item.goodsId, item.storeId)">
                <img :src="item.goodsImage" />
              </span>
              <span @click="turnToProductDetail(item.goodsId, item.storeId)">
                {{ item.goodsName }}
              </span>
              <span>{{ item.goodsBrand }}/{{ item.goodsModel }}</span>
              <span>{{ item.showPrice }}</span>
              <span v-if="isShowInfo.current != 3">
                {{ item.number }}
              </span>
              <span v-if="isShowInfo.current == 3">
                <van-stepper v-model="item.number" :max="item.goods_number" />
                <i class="stockNumber">库存{{ item.goods_number }}件</i>
              </span>
              <span>
                {{
                  item.arrivalTime ? item.arrivalTime.substring(0, 16) : "暂无"
                }}
              </span>
              <span
                v-if="isShowInfo.current != 3"
                :style="isShowInfo.current == 1 ? 'width:160px' : ''"
              >
                {{ item.userRemark }}
              </span>
              <span v-if="isShowInfo.current == 2">{{ item.shopRemark }}</span>
              <span v-if="isShowInfo.current == 3" style="width: 160px;">
                <a-textarea
                  style="width: 157px;"
                  placeholder="请输入备注"
                  v-model="item.introduce"
                ></a-textarea>
              </span>
            </li>
          </ul>
        </div>
        <div class="tfooter">
          <check-all
            :amount="checkedList.length"
            :checkAll="checkAll"
            v-on:isCheckAll="isCheckAllMethod"
          >
            <div slot="right-box" class="right-box">
              <a-button
                type="primary"
                :loading="remindLoading"
                :class="[
                  'commonStyle',
                  data.remind == 1 ? 'disabledStyle' : 'remind'
                ]"
                v-if="isShowInfo.current == 1"
                @click="remindQuote(data.storeId, data.id)"
              >
                {{ data.remind == 1 ? "已" : "" }}提醒商家报价
              </a-button>
              <div class="totalInfo" v-if="isShowInfo.current == 2">
                <span class="totalPrice">
                  报价总金额：<i>¥{{ data.totalPrice }}</i>
                </span>
                <a-button
                  type="primary"
                  :loading="quoteLoading"
                  class="download"
                  @click="turnMyQuote"
                >
                  转为我的报价
                </a-button>
                <a-button
                  type="primary"
                  :loading="orderLoading"
                  class="edit"
                  @click="submitOrder"
                >
                  提交订单
                </a-button>
              </div>
              <a-button
                type="primary"
                :loading="getQuoteLoading"
                :class="[
                  'commonStyle',
                  checkedList.length > 0 ? 'remind' : 'disabledStyle'
                ]"
                v-if="isShowInfo.current == 3"
                @click="getQuote"
              >
                一键获取报价
              </a-button>
            </div>
          </check-all>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import _ from "lodash";
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import checkAll from "../../../../components/common/checkAll";
  import orderTitle from "../../../../components/common/order/orderTitle";
  import listTitle from "../../../../components/common/listTitle";
  import { _getData } from "../../../../config/getData";
  export default {
    data() {
      return {
        isLoading: true,
        remindLoading: false,
        quoteLoading: false,
        orderLoading: false,
        getQuoteLoading: false,
        isShowInfo: {
          isDetail: true,
          isShow: false,
          current: 1,
          isOrder: false,
          isTrue: false
        },
        data: {},
        current: 1,
        checkAll: false,
        checkedList: [],
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "到货时间",
          "询价备注"
        ],
        goodsList: []
      };
    },
    methods: {
      turnMyQuote() {
        this.quoteLoading = true;
        if (this.checkedList.length == 0) {
          this.$message.warning("请选择产品", 1);
          this.quoteLoading = false;
          return;
        } else {
          _getData("/quotation/toMyQuotation", {
            param: {
              ids: this.checkedList.join(",")
            }
          }).then(data => {
            console.log(data);
            this.quoteLoading = false;
            if (data.code != 500) {
              let { href } = this.$router.resolve({
                path: `/userCenter/editQuote/${data.id}`,
                query: { keyId: "4" }
              });
              window.open(href, "_blank");
            }
          });
        }
      },
      submitOrder() {
        this.orderLoading = true;
        if (this.checkedList.length == 0) {
          this.$message.warning("请选择产品", 1);
          this.orderLoading = false;
          return;
        } else {
          const { href } = this.$router.resolve({
            path: `/userCenter/submitOrder/${this.checkedList.join(",")}`,
            query: { keyId: "2" }
          });
          this.orderLoading = false;
          window.open(href, "_blank");
        }
      },
      remindQuote(storeId, enquiryId) {
        if (this.data.remind == 0) {
          this.remindLoading = true;
          _getData("/message/enquiryRemind", {
            param: {
              storeId: storeId, //备注：商铺id
              enquiryId: enquiryId //备注：询价单id
            }
          }).then(data => {
            console.log("提醒商家报价：", data);
            this.remindLoading = false;
            if (data.code != 500) {
              this.$message.success("已提醒商家报价", 1);
              this.data.remind = 1;
            }
          });
        } else {
          this.$message.warning("已提醒商家报价", 1);
          return;
        }
      },
      getQuote() {
        if (this.checkedList.length > 0) {
          this.getQuoteLoading = true;
          let goodsList = [];
          _.map(this.checkedList, val => {
            _.map(this.data.goodList, o => {
              if (o.id == val) {
                goodsList.push({
                  goodsId: o.goodsId,
                  number: o.number,
                  buyerDescription: o.introduce
                });
              }
            });
          });
          console.log(goodsList);
          _getData("/enquiryPlus/addEnquiry", {
            param: [{ storeId: this.data.storeId, goodsList: goodsList }]
          }).then(data => {
            console.log("一键获取报价：", data);
            this.getQuoteLoading = false;
            if (data.code != 500) {
              const { href } = this.$router.resolve({
                path: "/userCenter/myInquiry",
                query: { keyId: "2" }
              });
              window.open(href, "_blank");
            }
          });
        } else {
          this.$message.warning("请选择产品", 1);
          return;
        }
      },
      turnToProductDetail(id, storeId) {
        let { href } = this.$router.resolve({
          path: `/details/productDetails/${id}`,
          query: { shopId: storeId }
        });
        window.open(href, "_blank");
      },
      tab(tabVal) {
        this.current = tabVal;
      },
      onChange(id) {
        if (_.indexOf(this.checkedList, id) == -1) {
          this.checkedList.push(id);
        } else {
          this.checkedList = _.without(this.checkedList, id);
        }
        if (this.checkedList.length == this.data.goodList.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      addClass(id) {
        for (const val of this.checkedList) {
          if (val == id) {
            return "active";
          }
        }
      },
      checkedChange(id) {
        for (const val of this.checkedList) {
          if (val == id) {
            return true;
          }
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
        }
      },
      getInquiryDetail() {
        _getData("/enquiryPlus/enquiryDetail", {
          id: this.$route.params.id
        }).then(data => {
          console.log("获取询价单详情：", data);
          this.data = data;
          this.isLoading = false;
        });
      }
    },
    mounted() {
      this.getInquiryDetail();
      console.log(this.$route.query.isShowInfo);
      this.isShowInfo = JSON.parse(this.$route.query.isShowInfo);
      this.isShowInfo.isTrue = false;
      this.isShowInfo.isDetail = true;
      if (this.isShowInfo.current == 2) {
        this.titleArr = [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "到货时间",
          "询价备注",
          "报价备注"
        ];
      }
    },
    components: {
      commonTitle,
      checkAll,
      orderTitle,
      listTitle
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  @import "../../../../assets/scss/_input";
  .inquiryDetail {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .common-title {
      .right-box {
        ul {
          display: flex;
          align-items: center;
          li {
            width: 76px;
            height: 27px;
            line-height: 27px;
            border: 1px solid #dddddd;
            font-size: 12px;
            color: #333;
            text-align: center;
            font-weight: normal;
            border-right: none;
            cursor: pointer;
            &:last-child {
              border-right: 1px solid #dddddd;
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
      /deep/.orderTitle {
        .common {
          font-size: 14px;
        }
      }
      .shopAndlink {
        display: flex;
        font-size: 14px;
        color: #333333;
        align-items: center;
        height: 70px;
        padding-left: 22px;
        .shopName {
          margin-right: 40px;
          height: 20px;
          display: flex;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-right: 4px;
            margin-top: 2px;
          }
        }
        .linkName {
          margin-right: 40px;
        }
      }
      .listContent {
        /deep/.listTitle {
          ul {
            li {
              &:nth-child(2) {
                width: 145px;
              }
              &:nth-child(4) {
                width: 70px;
              }
              &:nth-child(5) {
                width: 92px;
              }
              &:nth-child(6) {
                width: 68px;
              }
              &:nth-child(7) {
                width: 68px;
                margin-right: 30px;
              }
              &:last-child {
                width: 68px;
              }
            }
          }
        }
        ul {
          margin-top: 10px;
          %span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666;
            margin-right: 30px;
            &:first-child {
              width: 34px;
              padding-left: 20px;
              margin-right: 0;
            }
            &:nth-child(2) {
              width: 70px;
              margin-left: 12px;
              margin-right: 12px;
              img {
                width: 100%;
                height: 70px;
              }
              &:hover {
                cursor: pointer;
              }
            }
            &:nth-child(3) {
              width: 145px;
              &:hover {
                cursor: pointer;
              }
            }
            &:nth-child(4) {
              width: 98px;
            }
            &:nth-child(5) {
              width: 70px;
              word-wrap: break-word;
              overflow: hidden;
            }
            &:nth-child(6) {
              width: 92px;
              /deep/.van-stepper {
                .van-stepper__minus,
                .van-stepper__plus {
                  width: 20px;
                  height: 20px;
                  border-radius: 0;
                  border: $border-style;
                  background: #f6f6f6;
                  margin: 0;
                  &:hover {
                    cursor: pointer;
                  }
                }
                .van-stepper__input {
                  width: 38px;
                  height: 16px;
                  margin: 0;
                  background-color: #fff;
                  border-top: $border-style;
                  border-bottom: $border-style;
                }
              }
              .stockNumber {
                font-style: normal;
                font-size: 10px;
                color: #ccc;
                margin-top: 4px;
              }
            }
            &:nth-child(7) {
              width: 68px;
            }
            &:nth-child(8) {
              width: 68px;
              overflow: hidden;
            }
            &:last-child {
              margin-right: 0;
              .ant-input {
                font-size: 12px;
                resize: none;
                height: 65px;
              }
            }
          }
          li {
            display: flex;
            height: 93px;
            border: 1px solid #ddd;
            margin-bottom: 12px;
            padding-top: 11px;
            &.active {
              background-color: rgba(245, 166, 35, 0.06);
            }
            span {
              @extend %span;
            }
          }
        }
      }
      .tfooter {
        .right-box {
          .ant-btn {
            border: none;
            border-radius: 0;
            &:hover {
              opacity: 0.7;
            }
          }
          [ant-click-animating-without-extra-node]:after {
            display: none;
          }
          .commonStyle {
            width: 132px;
            height: 42px;
            line-height: 42px;
            font-size: 14px;
            color: #ffffff;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
          }
          .remind {
            background-image: linear-gradient(-90deg, #ff4e1a 0%, #f10000 100%);
          }
          .disabledStyle {
            background-image: linear-gradient(-90deg, #ccc 0%, #ccc 100%);
          }
          .totalInfo {
            height: 42px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .totalPrice {
              font-size: 12px;
              color: #666666;
              margin-right: 40px;
              i {
                font-size: 16px;
                color: $theme-color;
                font-style: normal;
                font-weight: 600;
              }
            }
            .download {
              width: 132px;
              height: 100%;
              line-height: 40px;
              text-align: center;
              background-image: linear-gradient(90deg, #ff4e1a 100%, #f10000 0%);
              font-size: 14px;
              color: #ffffff;
              font-weight: 600;
              cursor: pointer;
            }
            .edit {
              width: 104px;
              height: 100%;
              line-height: 40px;
              text-align: center;
              font-size: 14px;
              color: #ffffff;
              font-weight: 600;
              background: #f5a623;
              cursor: pointer;
              a {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
