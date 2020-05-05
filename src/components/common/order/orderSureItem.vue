<template>
  <div class="orderSureItemproduct">
    <div class="shopName">
      <img :src="data.storeImage" />
      <span>{{ data.storeName }}</span>
    </div>
    <div class="productList">
      <ul>
        <li v-for="item in data.goodsList" :key="item.id">
          <span>
            <img :src="item.goodsImage" />
          </span>
          <span>{{ item.goodsName }}</span>
          <span>{{ item.goodsBrand }}/{{ item.goodsModel }}</span>
          <span>{{ item.unitPrice }}</span>
          <span>{{ item.number }}</span>
          <span>¥{{ item.unitPrice * item.number }}</span>
          <span>{{
            item.offerTime ? item.offerTime.substring(0, 16) : ""
          }}</span>
        </li>
      </ul>
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .orderSureItemproduct {
    margin-top: 24px;
    margin-bottom: 12px;
    .shopName {
      display: flex;
      align-items: center;
      margin-left: 20px;
      margin-bottom: 12px;
      img {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 4px;
      }
    }
    .productList {
      ul {
        li {
          display: flex;
          height: 91px;
          border: 1px solid #ddd;
          padding-top: 10px;
          border-top: none;
          color: #333;
          font-size: 12px;
          &:first-child {
            border-top: $border-style;
          }
          img {
            width: 70px;
            height: 70px;
          }
          span {
            margin-right: 30px;
            &:first-child {
              margin-left: 30px;
              margin-right: 30px;
              width: 70px;
              height: 70px;
            }
            &:nth-child(2) {
              width: 155px;
            }
            &:nth-child(3) {
              width: 125px;
              margin-right: 60px;
            }
            &:nth-child(4) {
              width: 80px;
              margin-right: 30px;
            }
            &:nth-child(5) {
              width: 70px;
            }
            &:nth-child(6) {
              width: 100px;
            }
          }
        }
      }
    }
  }
</style>
