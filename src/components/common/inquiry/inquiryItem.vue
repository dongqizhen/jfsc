<template>
  <div class="inquiryItem">
    <inquiry-title
      :checkedList="selectDatas"
      v-on:getChecked="getChecked"
      :data="data"
      :isShowInfo="isShowInfo"
    ></inquiry-title>
    <div class="inquiryProduct">
      <div class="leftInfoBox">
        <inquiry-product-item
          v-for="item in data.goodList"
          :key="item.id"
          :itemData="item"
          :isShowInfo="isShowInfo"
          :checkedList="goodList"
          :checkProductInfo="checkedProductInfoArr"
          v-on:getCheckedList="getCheckedList"
        ></inquiry-product-item>
      </div>
      <div class="amount" v-if="isShowInfo.current == 2">
        ¥{{ data.totalPrice }}
      </div>
      <div class="operating">
        <div>
          <router-link
            tag="li"
            :to="{
              path: `inquiryOrderDetail/${data.id}`,
              query: {
                isShowInfo: JSON.stringify(this.isShowInfo),
                keyId: isShowInfo.isMerchant ? '6' : '2'
              }
            }"
          >
            <a target="_blank">查看详情</a>
          </router-link>
        </div>
        <div @click="deleteInquiryOrder(data.id)">
          {{ isShowInfo.current == 1 ? "关闭" : "删除" }}询价单
        </div>
        <div
          v-if="isShowInfo.current == 1 && !isShowInfo.isMerchant"
          @click="remindQuote(data.storeId, data.id)"
          class="remind"
        >
          {{ data.remind == 1 ? "已" : "" }}提醒商家报价
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import inquiryTitle from "./inquiryTitle";
  import inquiryProductItem from "./inquiryProductItem";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return {
        selectDatas: this.checkedList,
        goodList: [],
        checkedProductInfoArr: []
      };
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      checkedList: {
        type: Array,
        required: true
      },
      isShowInfo: {
        type: Object
      }
    },
    watch: {
      checkedList(newVal) {
        //console.log("变化的值：：：：", newVal);
        this.selectDatas = newVal;
        if (newVal.length > 0) {
          _.map(newVal, o => {
            if (o.id == this.data.id) {
              this.goodList = o.goodList;
              this.checkedProductInfoArr = o.productInfo;
            }
          });
        } else {
          this.goodList = [];
          this.checkedProductInfoArr = [];
        }
      }
    },
    methods: {
      getCheckedList(val) {
        // console.log(this.data.id);
        //console.log("选择的值：", val);
        this.goodList = val.goodList;
        // console.log(this.selectDatas);
        let itemIsCheckAll;
        if (this.data.goodList.length == val.goodList.length) {
          itemIsCheckAll = true;
        } else {
          itemIsCheckAll = false;
        }
        // console.log(itemIsCheckAll);
        if (this.selectDatas.length == 0) {
          this.selectDatas.push({
            id: this.data.id,
            goodList: val.goodList,
            isCheckAll: itemIsCheckAll,
            productInfo: val.productInfo
          });
        } else {
          if (
            _.find(this.selectDatas, o => {
              return o.id == this.data.id;
            })
          ) {
            _.map(this.selectDatas, o => {
              if (o.id == this.data.id) {
                o.goodList = val.goodList;
                o.isCheckAll = itemIsCheckAll;
                o.productInfo = val.productInfo;
              }
            });
          } else {
            this.selectDatas.push({
              id: this.data.id,
              goodList: val.goodList,
              isCheckAll: itemIsCheckAll,
              productInfo: val.productInfo
            });
          }
        }
        // console.log(this.selectDatas);
        this.$emit("getChecked", this.selectDatas);
      },
      getChecked(val) {
        //console.log("就是他：：：", val);
        if (
          _.find(val, o => {
            return o.id == this.data.id;
          })
        ) {
          this.goodList = _.find(val, o => {
            return o.id == this.data.id;
          }).goodList;
          this.checkedProductInfoArr = _.find(val, o => {
            return o.id == this.data.id;
          }).productInfo;
        } else {
          this.goodList = [];
          this.checkedProductInfoArr = [];
        }
        this.selectDatas = val;
        this.$emit("getChecked", val);
      },
      deleteInquiryOrder(id) {
        console.log(id);
        if (this.isShowInfo.current == 1) {
          //关闭询价单
          _getData("/enquiryPlus/enquiryClose", {
            ids: id
          }).then(data => {
            console.log("关闭询价单：", data);
            this.$message.success("关闭询价单成功", 1);
            this.$emit("getIsDelete", data);
          });
        } else {
          _getData("/enquiryPlus/deleteEnquiry", { ids: id, flag: "user" }).then(
            data => {
              console.log("删除询价单：", data);
              this.$message.success("删除成功", 1);
              this.$emit("getIsDelete", data);
            }
          );
        }
      },
      remindQuote(storeId, enquiryId) {
        if (this.data.remind == 0) {
          _getData("/message/enquiryRemind", {
            param: {
              storeId: storeId, //备注：商铺id
              enquiryId: enquiryId //备注：询价单id
            }
          }).then(data => {
            console.log("提醒商家报价：", data);
            this.data.remind = 1;
          });
        } else {
          alert("已提醒商家报价");
          return;
        }
      }
    },
    components: {
      inquiryProductItem,
      inquiryTitle
    }
  };
</script>
<style lang="scss" scoped>
  .inquiryProduct {
    display: flex;
    border: 1px solid #ddd;
    border-top: none;
    margin-bottom: 10px;
    .leftInfoBox {
      flex: 1;
      /deep/.inquiryProductItem {
        border: none;
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .amount {
      width: 110px;
      border-left: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #f10215;
    }
    .operating {
      width: 96px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #ddd;
      color: #333;
      font-size: 12px;
      padding-top: 10px;
      div {
        margin-bottom: 10px;
        cursor: pointer;
        a {
          color: #333;
          &:hover {
            color: #f10215;
          }
        }
        &:hover {
          color: #f10215;
        }
      }
      // .remind {
      //   color: #f10215;
      //   font-size: 14px;
      //   font-weight: 600;
      // }
    }
  }
</style>
