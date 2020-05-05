<template>
  <div class="login">
    <div class="container">
      <div class="main-container">
        <router-link class="logo" tag="h2" to="/">
          <img src="../../../assets/images/logo.png" alt="" />
        </router-link>

        <div class="login-container">
          <div class="banner">
            <img src="../../../assets/images/登录注册页插图.png" alt="" />
          </div>
          <div class="login-box">
            <router-view></router-view>
            <!-- <div class="wechat">
              <span></span>
              <p @mouseenter="isHover = true" @mouseleave="isHover = false">
                <svg class="icon" aria-hidden="true">
                  <use v-if="!isHover" xlink:href="#iconweixin"></use>
                  <use v-else xlink:href="#iconweixin-copy"></use>
                </svg>
                微信登录
              </p>
              <span></span>
            </div> -->
          </div>
        </div>
        <div class="slogan">
          <span></span>
          积分商城
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  export default {
    data() {
      return {
        isHover: false
      };
    },
    methods: {
      ...mapMutations([
        "changeLoginState",
        "changeUserInfoState",
        "changeUserShopInfoState"
      ])
    },
    mounted() {
      // this.changeLoginState(false);
      // this.changeUserInfoState({});
      // this.changeUserShopInfoState({});
      // window.clearVuexAlong();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";

  input::-webkit-input-placeholder {
    color: #ccc;
    font-size: 15px !important;
    //line-height: 30px;
    line-height: normal;
  }

  #app {
    height: 100%;
  }
  .login {
    height: 100%;
    background: #fdf6ea;
  }
  .container {
    background: #fdf6ea;
    padding: 0;

    .main-container {
      width: 1200px;
      margin: 0 auto;
      .logo {
        padding: 84px 0;
        padding-top: 65px;
        cursor: pointer;
        img {
          height: 77px;
        }
      }
      .login-container {
        height: 535px;
        background: #fff;
        width: 948px;
        margin: 0 auto;
        box-shadow: 2px 7px 24px 0 rgba(241, 2, 21, 0.09);
        border-radius: 12px;
        display: flex;
        justify-content: flex-start;
        .banner {
          flex: 1;
        }
        .login-box {
          /* width: 508px; */
          height: 100%;

          width: 508px;
          margin-left: -14px;

          position: relative;
          display: flex;
          justify-content: center;
          .wechat {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 40px;
            margin: 0 auto;
            span {
              display: flex;
              width: 132px;
              border-bottom: 1px solid #cccccc;
            }
            p {
              margin: 0 10px;
              font-size: 15px;
              color: #999999;
              display: flex;
              align-items: center;
              cursor: pointer;
              &:hover {
                opacity: 0.7;
                color: #5bcf47;
              }
              .icon {
                height: 16px;
                width: 19px;
                margin-right: 2px;
              }
            }
          }
        }
      }
      .slogan {
        font-size: 16px;
        color: #ee7322;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 77px;
        padding-bottom: 100px;

        span {
          display: flex;
          width: 124px;
          height: 2px;
          transform: scaleX(-1);
          background: url("../../../assets/images/line.png") no-repeat center;
          &:last-child {
            transform: rotate(360deg);
            margin-left: 10px;
          }
          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>