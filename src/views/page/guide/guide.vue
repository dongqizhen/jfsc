<template>
  <center-page
    titleText=""
    :dataArr="dataArr"
    :openKeys="['sub1', 'sub2', 'sub3', 'sub4']"
    :defaultSelectedKeys="defaultSelectedKeys"
    :currentSelectedKeys="currentSelectedKeys"
  >
    <div slot="header">
      <Header></Header>
    </div>
  </center-page>
</template>
<script>
  import Header from "../../../components/header/header";
  import centerPage from "../../../components/common/centerPage";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return {
        currentSelectedKeys: "0",
        defaultSelectedKeys: ["0"],
        dataArr: [
          // {
          //   id: 1,
          //   key: "sub1",
          //   name: "入门指南",
          //   icon: "#iconrumenzhinan",
          //   menus: [
          //     { key: "1", name: "关于我们", href: "/footer/guide/aboutUs" },
          //     {
          //       key: "2",
          //       name: "如何注册",
          //       href: "/footer/guide/howToRegister"
          //     },
          //     { key: "3", name: "卖家入门", href: "/footer/guide/sellerEntry" },
          //     { key: "4", name: "买家入门", href: "/footer/guide/buyerEntry" }
          //   ]
          // },
        ]
      };
    },
    created() {
      _getData("topic/queryTopicList", {}).then(data => {
        _.map(data, o => {
          o.key = "sub" + o.id;
          o.name = o.title;
          o.menus = o.topicVoList;
          _.map(o.topicVoList, val => {
            val.name = val.title;
            val.key = val.id + "";
            val.href = "/footer/guide/" + val.subtitle;
          });
        });
        console.log(data);
        this.dataArr = data;
      });
    },
    mounted() {
      this.currentSelectedKeys = this.$route.query.keyId;
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
      .ant-layout-has-sider {
        .title {
          display: none;
        }
      }
    }
  }
</style>
