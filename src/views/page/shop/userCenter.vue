<template>
  <center-page
    titleText="个人中心"
    :dataArr="dataArr"
    :openKeys="['sub1']"
    :defaultSelectedKeys="defaultSelectedKeys"
    :currentSelectedKeys="currentSelectedKeys"
  >
    <div slot="header">
      <Header></Header>
      <div class="middleNav">
        <div class="navBox">
          <div class="logo">
            <router-link to="/">
              <img height="70" src="../../../assets/images/logo.png" alt="" />
            </router-link>
          </div>
          <Nav></Nav>
          <div class="telphone"></div>
        </div>
      </div>
    </div>
    <span slot="Icon">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icongerenzhongxin"></use>
      </svg>
    </span>
  </center-page>
</template>
<script>
  import Header from "../../../components/header/header";
  import centerPage from "../../../components/common/centerPage";
  import Nav from "../../../components/common/nav";
  export default {
    data() {
      return {
        currentSelectedKeys: "0",
        defaultSelectedKeys: ["0"],
        dataArr: [
          {
            id: 3,
            key: "sub1",
            name: "",
            icon: "",
            menus: [
              // { key: "1", name: "选购单", href: "/userCenter" },
              // { key: "2", name: "我的询价", href: "/userCenter/myInquiry" },
              { key: "1", name: "我的订单", href: "/userCenter/myOrder" },
              // { key: "4", name: "我的报价", href: "/userCenter/myQuote" },
              // { key: "5", name: "我的收藏", href: "/userCenter/myStore" },
              { key: "2", name: "地址管理", href: "/userCenter/addressManage" },
              // { key: "7", name: "发票管理", href: "/userCenter/invoiceManage" },
              // { key: "8", name: "个人信息", href: "/userCenter/myCenter" },
              // { key: "9", name: "消息中心", href: "/userCenter/myMessage" },
              { key: "10", name: "账户余额", href: "/userCenter/userSecurity" }
            ]
          }
        ]
      };
    },
    beforeRouteUpdate(to, from, next) {
      this.currentSelectedKeys = to.query.keyId;
      next();
    },
    mounted() {
      if (this.$route.query.keyId) {
        this.currentSelectedKeys = this.$route.query.keyId;
      } else {
        this.currentSelectedKeys = "1";
      }
    },
    components: {
      Header,
      centerPage,
      Nav
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .centerPageCommon {
    /deep/.ant-layout {
      background: $base-background;
      .ant-layout-header {
        padding: 0;
        height: auto;
        .middleNav {
          width: 100%;
          height: 70px;
          background-image: linear-gradient(180deg, #ff4e1a 0%, #f10000 100%);
          .navBox {
            width: 1200px;
            height: 70px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            .logo {
              margin-right: 30px;
              a {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            .nav {
              height: 100%;
              .top_nav {
                height: 100%;
                border-bottom: none;
                .commonWidth {
                  width: 830px;
                  span {
                    display: none;
                  }
                }
                ul {
                  li {
                    a {
                      color: #fff;
                      background: none;
                    }
                  }
                }
              }
            }
            .telphone {
              font-size: 24px;
              color: #fff;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              height: 100%;
              width: 200px;
              .icon {
                width: 20px;
                height: 20px;
                margin-right: 8px;
                margin-top: 1px;
              }
              span {
                display: flex;
                justify-content: flex-end;
              }
            }
          }
        }
      }
      .ant-layout-content {
        overflow: initial;
      }
      .ant-menu-submenu-title {
        display: none;
      }
    }
  }
</style>
