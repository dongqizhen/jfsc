<template>
  <div class="header">
    <div class="content">
      <div class="left">
        <p v-if="!isMerchant">欢迎来到积分商城</p>
        <p v-else class="backIndex">
          <router-link to="/" replace>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconfanhuishouye"></use>
            </svg>
            返回积分商城首页
          </router-link>
        </p>
        <div v-if="!isLogin">
          <router-link to="/login">请登录</router-link>
          <router-link to="/register" tag="span"><a>免费注册</a></router-link>
        </div>
        <div v-else>
          <a>
            {{
              userInfo.phone.substr(0, 3) + "****" + userInfo.phone.substr(7)
            }}
          </a>
          <span @click="exitHandler"><a>退出</a></span>
        </div>
      </div>
      <ul class="right">
        <!-- <router-link tag="li" to="/userCenter"> </router-link> -->
        <li v-if="isLogin && !isMerchant" @click="toUserCenter">
          <a>
            个人中心
          </a>
        </li>

        <!-- <router-link tag="li" to="/userCenter" v-if="!isMerchant">
          <a target="_blank">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icongouwuche"></use>
            </svg>
            我的选购单
          </a>
        </router-link> -->
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "../../config/getData";
  export default {
    data() {
      return {
        codeShow: false,
        isMerchant: false,
        isFooter: false
      };
    },
    methods: {
      toUserCenter() {
        const { href } = this.$router.resolve({
          path: "/userCenter/myOrder"
        });

        window.open(href, "_blank");
      },
      exitHandler() {
        this.changeLoginState(false);
        this.changeUserInfoState({});
        this.changeUserShopInfoState({});
        window.clearVuexAlong();
        this.$router.push("/login");
      },
      ...mapMutations([
        "changeLoginState",
        "changeUserInfoState",
        "changeUserShopInfoState"
      ]),
      system() {
        if (this.$route.path.indexOf("merchant") != -1) {
          let { href } = this.$router.resolve({
            path: "/merchant/messageCenter",
            query: { type: "system", keyId: "10" }
          });
          window.open(href, "_blank");
        } else {
          let { href } = this.$router.resolve({
            path: "/userCenter/myMessage",
            query: { type: "system", keyId: "9" }
          });
          window.open(href, "_blank");
        }
      },
      privateMessage() {
        if (this.$route.path.indexOf("merchant") != -1) {
          let { href } = this.$router.resolve({
            path: "/merchant/messageCenter",
            query: { type: "private", keyId: "10" }
          });
          window.open(href, "_blank");
        } else {
          let { href } = this.$router.resolve({
            path: "/userCenter/myMessage",
            query: { type: "private", keyId: "9" }
          });
          window.open(href, "_blank");
        }
      },
      openMerchant() {
        if (this.$getLocalStorage()) {
          let { href } = this.$router.resolve({ path: "/merchant" });
          window.open(href, "_blank");
        } else {
          this.$router.push("/login");
        }
      }
    },
    computed: {
      ...mapState(["isLogin", "userInfo", "userShopInfo"])
    },
    mounted() {
      console.log(this.$route.path);
      if (this.$route.path.indexOf("merchant") != -1) {
        this.isMerchant = true;
      } else {
        this.isMerchant = false;
      }
      if (this.$route.path.indexOf("footer") != -1) {
        this.isFooter = true;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";

  .header {
    height: 40px;
    width: 100%;
    background: #f5f5f5;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 14px;
    .content {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        color: #333333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        p {
          display: flex;
        }
        a {
          padding: 0 20px 0 10px;
          color: $theme-color;
          text-decoration: none;
        }
        span {
          > a {
            color: #999999;
            padding: 0;
            &:hover {
              color: $theme-color;
            }
          }
        }
      }
      .right {
        display: flex;
        justify-content: flex-start;
        height: 100%;
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 30px;
          cursor: pointer;
          a {
            color: #666666;
            text-decoration: none;
            line-height: 14px;
            &:hover {
              color: $theme-color;
            }
            svg {
              margin-right: 5px;
            }
            .redColor {
              color: $theme-color;
              font-size: 16px;
              font-weight: 600;
            }
            .whiteColor {
              color: #fff;
              font-size: 16px;
              font-weight: 600;
            }
          }
          &:last-child {
            position: relative;
            .code {
              height: 66px;
              width: 66px;
              position: absolute;
              bottom: -62px;
              opacity: 1;
              z-index: 999;
              .icon {
                height: 66px;
                width: 66px;
              }
            }
          }
        }
      }
    }
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(5px);
    opacity: 0;
  }
</style>
