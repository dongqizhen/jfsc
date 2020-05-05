<template>
  <div class="commonBoxStyle">
    <commonTitle title="账号安全"></commonTitle>
    <div class="informationContent">
      <div class="common">
        <div class="left-box">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzhanghaoanquanduigou"></use>
            </svg>
          </span>
          <span class="title">更改密码</span>
          <span class="description">
            安全性高的密码可以使账户更安全，建议您定期更换密码。
          </span>
        </div>
        <div class="right-box">
          <a-button>
            <router-link
              :to="{
                path: '/userCenter/changePassword',
                query: { keyId: '10' }
              }"
            >
              修改
            </router-link>
          </a-button>
        </div>
      </div>
      <!-- <div class="common">
        <div class="left-box">
          <span>
            <svg class="icon" aria-hidden="true">
              <use
                v-bind:xlink:href="
                  userInfo.email
                    ? '#iconzhanghaoanquanduigou'
                    : '#iconzhanghaoanquancuowu'
                "
              ></use>
            </svg>
          </span>
          <span class="title">绑定邮箱</span>
          <span class="description">
            验证后可用于邮箱找回密码、接受订单提醒等，保障您的账户更安全。
          </span>
        </div>
        <div class="right-box">
          <a-button>
            <router-link
              :to="{ path: '/userCenter/changeEmail', query: { keyId: '10' } }"
              >{{ userInfo.email ? "修改" : "绑定" }}</router-link
            >
          </a-button>
        </div>
      </div>
      <div class="common">
        <div class="left-box">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzhanghaoanquanduigou"></use>
            </svg>
          </span>
          <span class="title">更改手机号</span>
          <span class="description">
            更改后可用于手机找回密码、接受手机动态验证码等，使您的账户更加安全。
          </span>
        </div>
        <div class="right-box">
          <a-button>
            <router-link
              :to="{ path: '/userCenter/changePhone', query: { keyId: '10' } }"
              >修改</router-link
            >
          </a-button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
  import commonTitle from "../../components/common/merchantRightCommonTitle";
  import { mapState } from "vuex";
  export default {
    data() {
      return {};
    },
    props: {
      isAlready: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    methods: {},
    components: {
      commonTitle
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";
  .commonBoxStyle {
    .informationContent {
      margin-top: 44px;
      .common {
        height: 69px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.5px dashed #ddd;
        .left-box {
          display: flex;
          align-items: center;
          span {
            height: 25px;
          }
          .title {
            font-weight: 600;
            font-size: 16px;
            color: #333;
            margin: 0 20px 0 10px;
          }
          .description {
            line-height: 25px;
            font-size: 14px;
            color: #666;
          }
          .icon {
            width: 25px;
            height: 25px;
          }
        }
      }
    }
  }
  .ant-btn {
    background: rgba(245, 166, 35, 0.06);
    border: 1px solid #f5a623;
    border-radius: 4px;
    height: 29px;
    box-shadow: none;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #f5a623;
    margin-right: 60px;
    padding: 0 24px;
    letter-spacing: 0;
    &:hover {
      opacity: 0.7;
    }
  }
</style>
