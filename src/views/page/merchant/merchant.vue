<template>
  <center-page
    titleText="商家中心"
    :dataArr="dataArr"
    :openKeys="['sub1', 'sub2', 'sub3']"
    :defaultSelectedKeys="defaultSelectedKeys"
    :currentSelectedKeys="currentSelectedKeys"
    :shopStatus="shopStatus"
  >
    <div slot="header">
      <Header></Header>
    </div>
  </center-page>
</template>
<script>
  import Header from "../../../components/header/header";
  import centerPage from "../../../components/common/centerPage";
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return {
        shopStatus: 2,
        currentSelectedKeys: "0",
        defaultSelectedKeys: ["0"],
        dataArr: [
          {
            id: 1,
            key: "sub1",
            name: "店铺管理",
            icon: "#icondianpuguanli",
            menus: [
              { key: "1", name: "店铺首页", href: "/merchant/shopIndex" },
              { key: "2", name: "店铺信息", href: "/merchant/shopInfo" },
              { key: "3", name: "店铺认证", href: "/merchant/shopCertification" }
            ]
          },
          {
            id: 2,
            key: "sub2",
            name: "店铺运营",
            icon: "#icondianpuyunying",
            menus: [
              { key: "4", name: "发布产品", href: "/merchant/publishGoods" },
              { key: "5", name: "产品管理", href: "/merchant/productManage" },
              { key: "6", name: "询价管理", href: "/merchant/inquiryManage" },
              { key: "7", name: "订单管理", href: "/merchant/orderManage" }
            ]
          },
          {
            id: 3,
            key: "sub3",
            name: "其他",
            icon: "#iconqita",
            menus: [
              { key: "8", name: "账号安全", href: "/merchant/accountSecurity" },
              // { key: "9", name: "个人中心", href: "/merchant/personalCenter" },
              { key: "10", name: "消息中心", href: "/merchant/messageCenter" }
            ]
          }
        ]
      };
    },
    computed: {
      ...mapState(["isLogin", "userShopInfo"])
    },
    methods: {
      ...mapMutations(["changeUserShopInfoState"])
    },
    beforeRouteUpdate(to, from, next) {
      console.log(this.userShopInfo);
      this.currentSelectedKeys = to.query.keyId;
      next();
    },
    beforeMount() {
      console.log(this.userShopInfo.audit_status);
      console.log(this.defaultSelectedKeys);
      _getData("/user/getUser", {})
        .then(data => {
          if (data.code == 500) {
            return;
          } else {
            this.changeUserShopInfoState(data);
          }
        })
        .then(() => {
          if (this.userShopInfo.audit_status == 2) {
            if (this.$route.query.keyId) {
              this.currentSelectedKeys = this.$route.query.keyId;
            } else {
              this.currentSelectedKeys = "1";
              this.$router.replace({
                path: "/merchant/shopIndex",
                query: { keyId: "1" }
              });
            }
          } else {
            this.shopStatus = this.userShopInfo.audit_status
              ? this.userShopInfo.audit_status
              : 0;
            this.defaultSelectedKeys = ["0"];
            this.$router.replace({
              path: "/merchant/openShop",
              query: { keyId: "0", shopStatus: this.shopStatus }
            });
          }
        });
    },
    components: {
      Header,
      centerPage
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
        height: $header-height;
        background: $theme-color;
        .header {
          background: $theme-color;
          .content {
            .left {
              color: #fff;
              a {
                color: #fff;
              }
              p.backIndex {
                width: 168px;
                height: 30px;
                border-radius: 16px;
                background-color: #fff;
                justify-content: center;
                align-items: center;
                .icon {
                  margin-right: 3px;
                }
                a {
                  color: $theme-color;
                  font-weight: 600;
                  font-size: 14px;
                  display: flex;
                  justify-content: center;
                  padding: 0;
                }
              }
            }
            .right {
              li {
                a {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
