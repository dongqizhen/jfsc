<template>
  <div class="inquiryTitle">
    <div class="left-box">
      <div class="checkedBox" v-if="isShowInfo.isTrue">
        <a-checkbox
          @change="onChange(data.id)"
          :checked="checkedChange(data.id)"
        ></a-checkbox>
      </div>
      <div class="common orderNumber">
        <span>询价单编号：</span>
        <span>{{ data.enquirySn }}</span>
      </div>
      <div class="common orderSubmitTime">
        <span class="svgBox">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icontijiaoshijian"></use>
          </svg>
        </span>
        <span>
          {{ isShowInfo.current == 2 ? "报价时间" : "询价单提交时间" }}：</span
        >
        <span>
          {{
            isShowInfo.current == 2
              ? data.updatedOn
                ? data.updatedOn.substring(0, 16)
                : ""
              : data.createdOn
              ? data.createdOn.substring(0, 16)
              : ""
          }}
        </span>
      </div>
      <div
        class="common userName"
        v-if="isShowInfo.isMerchant || !isShowInfo.isDetail"
      >
        <span><img :src="data.shopImage"/></span>
        <span>{{ isShowInfo.isMerchant ? data.userName : data.shopName }}</span>
      </div>
    </div>
    <div class="right-box">
      <div class="common orderStatus">
        <span class="svgBox">
          <svg class="icon" aria-hidden="true">
            <use
              v-bind:xlink:href="
                isShowInfo.current == 1
                  ? '#iconbaojiazhong'
                  : isShowInfo.current == 2
                  ? '#iconyibaojia'
                  : '#iconyiguanbi'
              "
            ></use>
          </svg>
        </span>
        <span>{{ isShowInfo.isOrder ? "订单" : "询价单" }}状态：</span>
        <span>{{
          isShowInfo.isOrder
            ? data.order_status == 1
              ? "待接单"
              : data.order_status == 2
              ? "待发货"
              : data.order_status == 3
              ? "待收货"
              : data.order_status == 4
              ? "待评价"
              : data.order_status == 5
              ? "已完成"
              : data.order_status == 6
              ? "退货"
              : "已关闭"
            : isShowInfo.current == 1
            ? "报价中"
            : isShowInfo.current == 2
            ? "已报价"
            : "已关闭"
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from "lodash";
  export default {
    data() {
      return { list: this.checkedList };
    },
    props: {
      data: {
        type: Object,
        required: false
      },
      checkedList: {
        type: Array,
        required: false
      },
      isShowInfo: {
        type: Object
      }
    },
    watch: {
      checkedList() {
        this.list = this.checkedList;
      }
    },
    methods: {
      onChange(id) {
        if (
          _.find(this.list, o => {
            return o.id == id;
          })
        ) {
          if (
            _.find(this.list, o => {
              return o.id == id;
            }).isCheckAll
          ) {
            this.list = _.without(
              this.list,
              _.find(this.list, o => {
                return o.id == id;
              })
            );
          } else {
            let goodListIds = [];
            let productInfo = [];
            _.map(this.data.goodList, o => {
              goodListIds.push(o.id);
              productInfo.push(o);
            });
            _.map(this.list, o => {
              if (o.id == id) {
                o.goodList = goodListIds;
                o.isCheckAll = true;
                o.productInfo = productInfo;
              }
            });
          }
        } else {
          let goodListIds = [];
          let productInfo = [];
          _.map(this.data.goodList, o => {
            goodListIds.push(o.id);
            productInfo.push(o);
          });
          this.list.push({
            id: id,
            goodList: goodListIds,
            isCheckAll: true,
            productInfo: productInfo
          });
        }
        this.$emit("getChecked", this.list);
      },
      checkedChange(id) {
        for (const val of this.list) {
          if (val.id == id && val.isCheckAll) {
            return true;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .inquiryTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(245, 166, 35, 0.05);
    border: $border_style;
    padding: 0 20px;
    height: 40px;
    .common {
      font-size: 12px;
      color: #333;
      font-weight: 600;
      margin-right: 30px;
      .svgBox {
        margin-right: 6px;
      }
      img {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
    .left-box {
      display: flex;
      align-items: center;
      .checkedBox {
        margin-right: 12px;
      }
    }
    .right-box {
      display: flex;
      .common {
        margin-right: 0;
      }
    }
  }
</style>
