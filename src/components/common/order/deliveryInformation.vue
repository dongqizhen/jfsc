<template>
  <div class="shippingAddress">
    <div class="left-box">{{ isExpress ? "快递单号" : "收货信息" }}</div>
    <div class="right-box">
      <div>
        <span>
          {{
            isExpress
              ? `快递公司：${data.shipping_name}`
              : `收货人：${data.consignee}`
          }}
        </span>
        <span :class="{ isShow: isExpress }">联系方式：{{ data.mobile }}</span>
      </div>
      <div>
        {{
          isExpress
            ? `快递单号：${data.shipping_no}`
            : `收货地址：${data.address}`
        }}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      data: {
        type: Object
      },
      isExpress: { type: Boolean }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .shippingAddress {
    display: flex;
    border: $border-style;
    color: #333333;
    font-size: 12px;
    .left-box {
      width: 93px;
      height: 83px;
      line-height: 83px;
      text-align: center;
      border-right: $border-style;
      font-weight: 600;
    }
    .right-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 17px;

      div {
        &:first-child {
          margin-bottom: 8px;
          span {
            margin-right: 38px;
          }
          .isShow {
            display: none;
          }
        }
      }
    }
  }
</style>
