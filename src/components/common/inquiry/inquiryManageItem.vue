<template>
  <div class="inquiryManageItem">
    <order-title
      :checkedList="checkedList"
      v-on:getChecked="getChecked"
      :data="data"
      :isShowInfo="isShowInfo"
    ></order-title>
    <div class="inquiryProduct">
      <div class="leftInfoBox">
        <inquiry-product-item
          v-for="item in data.goodList"
          :key="item.id"
          :itemData="item"
          :isShowInfo="isShowInfo"
          :checkedList="data.goodList"
          v-on:getCheckedList="getCheckedList"
        ></inquiry-product-item>
      </div>
      <div class="amount" v-if="isShowInfo.current == 2">
        ¥{{ data.totalPrice }}
      </div>
      <div class="operating">
        <div v-if="isShowInfo.current == 1">
          <router-link
            tag="li"
            :to="{
              path: `editInquiry/${data.id}`,
              query: { isShowInfo: isShowInfo, keyId: '6' }
            }"
          >
            <a target="_blank">编辑报价</a>
          </router-link>
        </div>
        <div v-else>
          <router-link
            tag="li"
            :to="{
              path: `inquiryOrderDetail/${data.id}`,
              query: { isShowInfo: JSON.stringify(this.isShowInfo), keyId: '6' }
            }"
          >
            <a target="_blank">查看详情</a>
          </router-link>
        </div>
        <div
          @click="deleteInquiryOrder(data.id)"
          v-if="isShowInfo.current != 1"
        >
          删除询价单
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import orderTitle from "../order/orderTitle";
  import inquiryProductItem from "./inquiryProductItem";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return { selectDatas: this.checkedList, goodList: [] };
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
        console.log("变化的值：：：：", newVal);
        this.selectDatas = newVal;
        if (newVal.length > 0) {
          _.map(newVal, o => {
            if (o.id == this.data.id) {
              this.goodList = o.goodList;
            }
          });
        } else {
          this.goodList = [];
        }
      }
    },
    methods: {
      getCheckedList(val) {
        console.log("选择的值：", val);
        this.goodList = val;
        let itemIsCheckAll;
        if (this.data.goodList.length == val.length) {
          itemIsCheckAll = true;
        } else {
          itemIsCheckAll = false;
        }
        if (this.selectDatas.length == 0) {
          this.selectDatas.push({
            id: this.data.id,
            goodList: val,
            isCheckAll: itemIsCheckAll
          });
        } else {
          if (
            _.find(this.selectDatas, o => {
              return o.id == this.data.id;
            })
          ) {
            _.map(this.selectDatas, o => {
              if (o.id == this.data.id) {
                o.goodList = val;
                o.isCheckAll = itemIsCheckAll;
              }
            });
          } else {
            this.selectDatas.push({
              id: this.data.id,
              goodList: val,
              isCheckAll: itemIsCheckAll
            });
          }
        }
        this.$emit("getChecked", this.selectDatas);
      },
      getChecked(val) {
        if (
          _.find(val, o => {
            return o.id == this.data.id;
          })
        ) {
          this.goodList = _.find(val, o => {
            return o.id == this.data.id;
          }).goodList;
        } else {
          this.goodList = [];
        }
        this.selectDatas = val;
        this.$emit("getChecked", val);
      },
      deleteInquiryOrder(id) {
        console.log(id);
        _getData("/enquiryPlus/deleteEnquiry", { ids: id, flag: "shop" }).then(
          data => {
            console.log("删除询价单：", data);
            this.$emit("getIsDelete", data);
          }
        );
      }
    },
    components: {
      orderTitle,
      inquiryProductItem
    }
  };
</script>
<style lang="scss" scoped>
  .inquiryManageItem {
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
      }
    }
  }
</style>
