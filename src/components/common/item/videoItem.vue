<template>
  <router-link
    class="video-item"
    tag="li"
    :to="{
      path: '/details/videoDetails',
      query: { nav_index: $route.query.nav_index, id: item.id }
    }"
  >
    <a target="_blank">
      <div class="video_box">
        <img :src="item.image" alt="" />
        <p class="look-num">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconxinghaoliebiaoliulanliang-copy"></use>
            </svg>
            {{ item.watchAmount }}
          </span>
          <span>{{ item.totalTime }}</span>
        </p>
        <div class="play-btn">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconshipinliebiaoyebofang"></use>
          </svg>
        </div>
        <span :class="isPay"></span>
      </div>
      <div class="content">
        <h2>
          {{ item.title }}
        </h2>
        <div class="lecturer">
          <p>
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconjiangshi"></use>
              </svg>
            </i>
            <span> 讲师：{{ item.speaker }} </span>
          </p>
          <ul>
            <li v-for="label in item.labelList" :key="label.id">
              {{ label.name }}
            </li>
          </ul>
        </div>
      </div>
      <ul class="menu">
        <li>
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconpinglun"></use>
            </svg>
          </i>
          {{ item.commentNum }}
        </li>
        <li>
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconshoucang" v-if="!item.isFavorite"></use>
              <use xlink:href="#iconpingjiashixinwujiaoxing" v-else></use>
            </svg>
          </i>
          {{ item.favoriteNum }}
        </li>
        <li>
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzan" v-if="!item.isDianZan"></use>
              <use xlink:href="#iconzanx" v-else></use>
            </svg>
          </i>
          {{ item.amount }}
        </li>
        <li>
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconfenxiang"></use>
            </svg>
          </i>
          {{ item.shareNum }}
        </li>
      </ul>
    </a>
  </router-link>
</template>

<script>
  import menuVue from "../share/menu.vue";

  export default {
    data() {
      return {};
    },
    created() {},
    components: {
      menuVue
    },
    computed: {
      isPay() {
        if (this.item.tradeType == 0) {
          return "free";
        } else {
          if (this.item.ispay == 0) {
            return "pay";
          } else {
            return "free";
          }
        }
      }
    },
    props: ["item"]
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  li.video-item {
    width: 422px;
    height: 389px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: $base-box-shadow;
    margin-bottom: 16px;
    cursor: pointer;
    &:hover {
      .content {
        h2 {
          color: $theme-color;
        }
      }
    }
    a {
      display: flex;
      text-decoration: none;
      width: 100%;
      flex-direction: column;
      height: 100%;
    }
    .video_box {
      height: 237px;
      background: #f7f9fa;
      position: relative;
      img {
        height: 100%;
        width: 100%;
      }
      .look-num {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 26px;
        width: 100%;
        font-size: 12px;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 0 12px;
        background-image: linear-gradient(
          -180deg,
          rgba(98, 98, 98, 0) 0%,
          rgba(51, 51, 51, 0.3) 100%
        );
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 26px;
        }
        .icon {
          height: 10px;
          width: 15px;
          margin-right: 5px;
        }
      }
      .play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -22px;
        margin-top: -22px;
        .icon {
          width: 44px;
          height: 44px;
        }
      }
      > span {
        position: absolute;
        height: 22px;
        width: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        right: 0;
        top: 0;
        &.pay {
          background: url("../../../assets/images/pay.png") no-repeat;
          background-size: 100% 100%;
        }
        &.free {
          background: url("../../../assets/images/free.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .content {
      padding: 10px;
      padding-bottom: 0;
      display: flex;
      flex: 1;
      flex-direction: column;
      h2 {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #333333;
        height: 50px;
        display: flex;
        align-items: center;
      }
      .lecturer {
        display: flex;
        justify-content: space-between;
        height: 52px;
        align-items: center;
        p {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          width: 180px;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          i {
            display: flex;
            margin-right: 3px;
            margin-top: 1px;
            height: 100%;
            .icon {
              width: 7px;
              height: 7px;
            }
          }
          span {
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        > ul {
          display: flex;
          flex: 1;
          justify-content: flex-end;

          > li {
            margin-right: 4px;
            height: 25px;
            padding: 0 10px;
            background: #f7f7f7;
            border-radius: 15px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #fb6441;
            // display: flex;
            justify-content: center;
            align-items: center;
            line-height: 25px;
            width: 68px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: center;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
    .menu {
      height: 40px;
      display: flex;
      align-items: center;
      border-top: 1px solid rgba($color: #e0e7ea, $alpha: 0.5);
      li {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #999999;
        font-weight: 600;
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 4px;
          margin-top: 3px;
        }
      }
    }
  }
</style>