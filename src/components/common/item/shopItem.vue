<template>
  <router-link
    tag="li"
    :to="{
      path: '/shopDetails',
      query: {
        nav_index: $route.query.nav_index,
        shopId: item.sid,
        shopName: item.shopName
      }
    }"
    class="shop-item"
  >
    <a target="_blank">
      <div class="top">
        <div class="img_box">
          <div
            v-lazy-container="{
              selector: 'img'
            }"
          >
            <img :data-src="item.image" alt="" v-if="item.image" />
            <img v-else src="../../../assets/images/default.png" alt="" />
          </div>

          <span
            :class="
              item.type == 3
                ? 'self'
                : item.type == 2
                ? 'agency'
                : item.type == 4
                ? 'rest'
                : item.type == 5
                ? 'serve'
                : ''
            "
          >
            <img :src="item.webIcon" alt="" />
          </span>
        </div>
        <h2>{{ item.shopName }}</h2>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconzhaodianpuweizhi"></use>
          </svg>
          销售地区：<span
            v-for="(val, i) in item.defaultProvinceData"
            :key="val.provinceId"
          >
            {{ val.provinceName + (i < item.defaultProvinceData ? "," : "") }}
          </span>
        </p>
      </div>
      <div class="bottom">
        <ul>
          <li>
            访问量<span>{{ item.accessNum }}</span>
          </li>
          <li>
            咨询数<span>{{ item.consultNum }}</span>
          </li>
          <li>
            好评率<span>{{ item.highPraiseNum }}%</span>
          </li>
          <li>
            成交数<span>{{ item.salenum }}</span>
          </li>
        </ul>
      </div>
    </a>
  </router-link>
</template>

<script>
  export default {
    data() {
      return {};
    },

    props: ["item"],
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  li.shop-item {
    background: #fff;
    height: 407px;
    width: 291px;
    margin-bottom: 20px;
    box-shadow: $base-box-shadow;
    cursor: pointer;
    display: flex;
    margin-right: 24px;
    /deep/ img[lazy="loading"] {
      /*your style here*/
      background: url("../../../assets/images/loading.gif") no-repeat center;
      background-size: 100px;
      background-color: #f7f9fa;
    }
    /deep/ img[lazy="error"] {
      /*your style here*/
      background: url("../../../assets/images/default.png") no-repeat center;
      background-size: 100% 100%;
      //display: none;
      // background-color: #f7f9fa;
    }
    a {
      display: flex;
      height: 100%;
      flex-direction: column;
      text-decoration: none;
      &:hover {
        .img_box > div > img {
          transform: scale(1.1);
        }
      }
    }
    &:hover {
      .top {
        h2 {
          color: $theme-color;
        }
      }
    }
    .top {
      padding: 15px;
      padding-bottom: 0;
      flex: 1;
      .img_box {
        height: 261px;
        width: 261px;
        background: url("../../../assets/images/default.png") no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;
        position: relative;
        > div {
          height: 100%;
          width: 100%;
          > img {
            height: 100%;
            width: 100%;
            transition: transform 0.5s ease;
          }
        }

        span {
          display: flex;
          position: absolute;
          right: 0;
          top: -1px;

          img {
            height: 22px;
            // width: ;
          }
          // background: url("../../../assets/images/shop.svg") no-repeat center;
          // &.self {
          //   background-image: url("../../../assets/images/self.svg");
          // }
          // &.agency {
          //   background-image: url("../../../assets/images/agency.svg");
          // }
          // &.rest {
          //   background-image: url("../../../assets/images/rest.svg");
          // }
          // &.serve {
          //   width: 55px;
          //   background-image: url("../../../assets/images/serve.svg");
          // }
        }
      }
      h2 {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        height: 22px;
        line-height: 22px;
        margin: 8px 0;
        width: 224px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        font-size: 12px;
        color: #666666;
        width: 224px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .bottom {
      height: 57px;
      border-top: 1px solid #e0e7ea;
      padding: 0 15px;
      display: flex;
      align-items: center;
      > ul {
        overflow: hidden;
        width: 100%;
        //height: 100%;
        li {
          font-size: 12px;
          color: #999999;
          width: 50%;
          float: left;
          height: 24px;
          line-height: 24px;
          //margin-top: 5px;
          span {
            color: #f10215;
            margin-left: 6px;
          }
          &:nth-child(2n) {
            padding-left: 20px;
          }
        }
      }
    }
  }
</style>