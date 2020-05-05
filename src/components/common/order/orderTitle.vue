
<template>
  <div class="orderTitle">
    <div class="left-box">
      <div
        :class="['checkedBox', isShowInfo.current == 1 ? 'boxHidden' : '']"
        v-if="isShowInfo.isTrue"
      >
        <a-checkbox
          @change="onChange(data.id)"
          :checked="checkedChange(data.id)"
        ></a-checkbox>
      </div>
      <div class="common orderNumber">
        <span>{{ isShowInfo.isOrder ? "订单" : "询价单" }}编号：</span>
        <span>{{ isShowInfo.isOrder ? data.order_sn : data.enquirySn }}</span>
      </div>
      <div class="common orderSubmitTime">
        <span class="svgBox">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icontijiaoshijian"></use>
          </svg>
        </span>
        <span>{{ isShowInfo.isOrder ? "订单" : "询价单" }}提交时间：</span>
        <span>{{ data.createdOn ? data.createdOn.substring(0, 16) : "" }}</span>
      </div>
      <div
        class="common userName"
        v-if="isShowInfo.isMerchant || !isShowInfo.isDetail"
      >
        <span>
          <img
            v-if="isShowInfo.isMerchant ? data.userAvatar : data.shopImage"
            :src="isShowInfo.isMerchant ? data.userAvatar : data.shopImage"
          />
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#iconlianxiren"></use>
          </svg>
        </span>
        <span>{{ isShowInfo.isMerchant ? data.userName : data.shopName }}</span>
      </div>
    </div>
    <div class="right-box">
      <div class="common orderStatus">
        <span class="svgBox">
          <svg class="icon" aria-hidden="true">
            <use
              v-bind:xlink:href="
                isShowInfo.isOrder
                  ? data.order_status == 6 || data.order_status == 5
                    ? '#iconyibaojia'
                    : data.order_status == 7
                    ? '#iconyiguanbi'
                    : '#iconbaojiazhong'
                  : isShowInfo.current == 1
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
              ? "退货中"
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
        if (_.indexOf(this.list, id) == -1) {
          this.list.push(id);
          this.$emit("getChecked", this.list);
        } else {
          this.list = _.without(this.list, id);
          this.$emit("getChecked", id);
        }
      },
      checkedChange(id) {
        for (const val of this.list) {
          if (val == id) {
            return true;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .orderTitle {
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
        &.boxHidden {
          visibility: hidden;
        }
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
