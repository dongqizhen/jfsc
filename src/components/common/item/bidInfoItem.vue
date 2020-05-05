<template>
  <router-link
    class="bid-info-item"
    tag="li"
    :to="{
      path: '/details/bidinfoDetails',
      query: { nav_index: 0, id: item.id }
    }"
  >
    <a target="_blank">
      <div class="bid-left">
        <h2>{{ item.productName }}</h2>

        <span>{{ item.brandName }}/{{ item.modelId }}</span>
        <div>
          <div>
            开标时间 <span>{{ item.bidDate }}</span>
          </div>
          <div>
            采购单位 <span>{{ item.hospitalName }}</span
            ><span>{{ item.level }}</span>
          </div>
          <div>
            中标单位 <span>{{ item.bider }}</span>
          </div>
        </div>
      </div>
      <div class="price">
        <span>单品价格</span>
        <img
          src="../../../assets/images/diamond.png"
          v-if="item.avgAmount == '钻石会员可见'"
          alt=""
        />
        <span v-else>{{ item.avgAmount }}万元</span>
      </div>
      <div class="adress">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icongongsidizhi"></use>
        </svg>
        {{ item.provinceName }}
      </div>
    </a>
  </router-link>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    data() {
      return {};
    },
    computed: {
      ...mapState(["isLogin"])
    },
    props: ["item"]
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .bid-info-item {
    height: 160px;
    background: #fff;
    box-shadow: $base-box-shadow;
    display: flex;
    margin-right: 0;
    width: 100%;

    cursor: pointer;
    position: relative;
    a {
      text-decoration: none;
      display: flex;
      padding: 13.5px 20px;
      height: 100%;
      width: 100%;
    }
    &:hover {
      .bid-left {
        h2 {
          color: $theme-color;
        }
      }
    }
    .bid-left {
      h2 {
        font-size: 18px;
        color: #000000;
        font-weight: 600;
        height: 25px;
        display: flex;
        align-items: center;
      }
      > span {
        display: flex;
        align-items: center;
        height: 21px;
        font-size: 15px;
        color: #333333;
        margin-top: 7px;
        margin-bottom: 16px;
      }
      > div {
        display: flex;
        flex-direction: column;
        > div {
          display: flex;
          font-size: 12px;
          color: #666666;

          margin-bottom: 6px;
          span {
            font-size: 12px;
            color: #333333;
            margin-left: 10px;

            &:nth-child(2) {
              background: rgba(245, 166, 35, 0.08);
              height: 16px;
              font-size: 11px;
              color: #f5a623;
              padding: 0 4px;
              align-items: center;
              margin-left: 5px;
            }
          }
        }
      }
    }
    .price {
      position: absolute;
      right: 20px;
      top: 13.5px;
      display: flex;
      flex-direction: column;
      img {
        height: 27px;
        margin-top: 10px;
      }
      span {
        font-size: 11px;
        color: #999999;
        display: flex;
        justify-content: flex-end;
        &:last-child {
          font-size: 20px;
          color: #f10215;
          font-weight: 600;
        }
      }
    }
    .adress {
      position: absolute;
      bottom: 13.5px;
      right: 20px;
      font-size: 12px;
      color: #999999;
      display: flex;
      align-items: center;
      .icon {
        width: 11px;
        height: 11px;
        margin-right: 4px;
        margin-top: 1px;
      }
    }
  }
</style>