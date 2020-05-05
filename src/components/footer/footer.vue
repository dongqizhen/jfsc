<template>
  <div class="footer">
    <!-- <div class="icon-nav">
      <ul class="commonWidth">
        <li v-for="item in iconArr" :key="item.id">
          <div class="left">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.icon"></use>
            </svg>
          </div>
          <div class="right">
            {{ item.name }}
            <span>{{ item.sub }}</span>
          </div>
        </li>
      </ul>
    </div> -->

    <div class="commonWidth">
      <div class="copyright">
        Copyright 2005-2016 jfsc.com Corporation, All Rights Reserved
        &nbsp;&nbsp;&nbsp;&nbsp; 亟待解决的1ddddddd &nbsp;&nbsp;&nbsp;&nbsp;
        版权所属：积分商城
      </div>
    </div>
  </div>
</template>

<script>
  import { _getData } from "../../config/getData";

  const iconArr = [
    {
      name: "一线品牌",
      icon: "#iconyixianpinpai1",
      id: 0,
      sub: "精选品牌，放心选购"
    },
    {
      name: "参数对比",
      icon: "#iconcanshuduibi1",
      id: 1,
      sub: "同类对比，只选最优"
    },
    {
      name: "优质售后",
      icon: "#iconshouhou",
      id: 2,
      sub: "人工备件，维修不愁"
    },
    {
      name: "设备详情",
      icon: "#iconshebeixiangqing",
      id: 3,
      sub: "视频案例，全部摸透"
    }
  ];
  export default {
    data() {
      return {
        footerList: "",
        iconArr
      };
    },
    mounted() {}
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";

  .footer {
    height: 100px;
    border-top: 2px solid $theme-color;
    display: flex;
    flex-direction: column;
    .icon-nav {
      height: 94px;
      background: #fafafa;
      border-bottom: 1px solid #dddddd;
      ul {
        flex-direction: inherit;
        padding-left: 82px;
        li {
          display: flex;
          justify-content: flex-start;

          align-items: center;
          margin-right: 109px;
          &:last-child {
            margin-right: 0;
          }
          .left {
            margin-right: 10px;
            .icon {
              height: 58px;
              width: 58px;
            }
          }
          .right {
            font-size: 15px;
            color: #333333;
            font-weight: 600;
            display: flex;
            flex-direction: column;

            span {
              margin-top: 3px;
              font-size: 12px;
              color: #666666;
              font-weight: normal;
            }
          }
        }
      }
    }
    .commonWidth {
      width: 1200px;
      display: flex;
      flex-direction: column;

      .link {
        padding: 43px 0 33px;
        border-bottom: 1px solid #ddd;
        display: flex;
        width: 100%;
        .left {
          ul {
            display: flex;
            justify-content: flex-start;
            li {
              width: 124px;
              display: flex;
              flex-direction: column;
              h2 {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #333333;
                height: 22px;
                line-height: 22px;
                margin-bottom: 25px;
              }
              span {
                display: flex;
                height: 17px;
                align-items: center;
                margin-bottom: 10px;
                a {
                  display: flex;
                  height: 17px;
                  font-family: PingFangSC-Regular;
                  font-size: 12px;
                  color: #666666;
                  &:hover {
                    color: $theme-color;
                  }
                }
              }
            }
          }
        }
        .right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > img {
            display: flex;
            height: 77px;
          }
          i {
            display: flex;
            height: 60px;
            border-left: 1px solid #cccccc;
            margin-left: 35px;
            margin-right: 35px;
          }
          > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            > img {
              width: 137px;
              margin-bottom: 7px;
            }
          }
        }
      }
      .copyright {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
      }
    }
  }
</style>