<template>
  <div class="about-us">
    <header-vue></header-vue>
    <search-vue></search-vue>
    <nav-vue :defaultNav="defaultNav"></nav-vue>
    <div class="container">
      <div class="commonWidth">
        <h2><span></span>关于我们</h2>
        <div class="content" ref="content" id="content">
          <div class="left">
            <a-anchor @click="handleClick" ref="anchor">
              <a-anchor-link
                href="#introduce"
                title="企业简介"
                :class="isFirst ? 'active' : ''"
              />
              <a-anchor-link href="#culture" title="企业文化" />
              <a-anchor-link href="#aboutUs" title="联系我们" />
            </a-anchor>
          </div>
          <div class="right">
            <div class="introduce">
              <h2 id="introduce">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconqiyejianjie"></use>
                </svg>
                企业简介
              </h2>
              <p>
                积分商城主要业务是打造并运营医疗设备、耗材、配件的电子商务交易平台，依托于好医工app，中国医疗设备杂志社，非公立医疗机构协会临床工程师分会，为医院、工程师个人、厂商、第三方服务商提供丰富且优质的设备配件、医疗耗材及医疗设备。为网来会员打造一个集中采购平台，降低采购成本。
              </p>
            </div>
            <div class="culture">
              <h2 id="culture">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconqiyewenhua"></use>
                </svg>
                企业文化
              </h2>
              <div class="img_box">
                <img src="../../../assets/images/culture.jpg" alt="" />
              </div>
              <p>
                积分商城主要业务是打造并运营医疗设备、耗材、配件的电子商务交易平台，依托于好医工app，中国医疗设备杂志社，非公立医疗机构协会临床工程师分会，为医院、工程师个人、厂商、第三方服务商提供丰富且优质的设备配件、医疗耗材及医疗设备。为网来会员打造一个集中采购平台，降低采购成本。
              </p>
            </div>
            <div class="aboutUs">
              <h2 id="aboutUs">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconlianxiwomen"></use>
                </svg>
                联系我们
              </h2>
              <ul>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icongongsixinxi"></use>
                    </svg>
                  </span>
                  公司信息：北京网来天下医疗科技有限公司
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icongongsidizhi"></use>
                    </svg>
                  </span>
                  公司地址：北京顺义区竺园路12号院天竺综合保税区泰达科技园7号楼
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconQQkefu"></use>
                    </svg>
                  </span>
                  QQ客服：1823731121
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconkefudianhua"></use>
                    </svg>
                  </span>
                  客服电话：400-1212-11
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icondianziyoujian"></use>
                    </svg>
                  </span>
                  电子邮件：wltx707@126.com
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-vue></footer-vue>
    <side-bar-vue></side-bar-vue>
  </div>
</template>

<script>
  import headerVue from "../../../components/header/header.vue";
  import footerVue from "../../../components/footer/footer.vue";
  import sideBarVue from "../../../components/sideBar/sideBar.vue";
  import navVue from "../../../components/common/nav.vue";
  import searchVue from "../../../components/common/search.vue";
  import { mixin } from "../../../components/mixin/mixin";

  export default {
    data() {
      return {
        isFirst: true
      };
    },
    mixins: [mixin],
    components: {
      headerVue,
      footerVue,
      navVue,
      searchVue,
      sideBarVue
    },
    mounted() {
      this.$nextTick().then(() => {
        document.addEventListener("scroll", this.onscroll);
      });
    },
    beforeDestroy() {
      document.removeEventListener("scroll", this.onscroll);
    },
    methods: {
      callback(val) {
        console.log(val);
      },
      handleClick(e, link) {
        e.preventDefault();
        console.log(link);
      },
      onscroll() {
        this.isFirst = this.$refs.anchor.activeLink == "" ? true : false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .container {
    .commonWidth {
      display: flex;
      flex-direction: column;
      > h2 {
        height: 66px;
        padding-top: 9px;
        font-size: 20px;
        color: #2b3e50;
        font-weight: 600;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span {
          display: flex;
          height: 20px;
          width: 4px;
          background: $theme-color;
          margin-right: 8px;
        }
      }
      .content {
        display: flex;
        min-height: 590px;
        justify-content: flex-start;
        .left {
          width: 223px;
          height: 400px;
          // box-shadow: $base-box-shadow;
          margin-right: 17px;
          > div {
            width: 223px;
            height: 400px;
          }
          /deep/ .ant-anchor-wrapper {
            display: flex;
            width: 100%;
            height: auto !important;
            justify-content: flex-start;
            width: 223px;
            margin-left: 0;
            padding: 0;
            box-shadow: $base-box-shadow;
            .ant-anchor {
              padding: 0;
              width: 100%;
              height: 400px;
              box-shadow: $base-box-shadow;

              .ant-anchor-ink {
                display: none;
              }
              .ant-anchor-link {
                padding: 0;
                height: 57px;
                display: flex;
                justify-content: flex-start;
                padding-left: 13px;
                align-items: center;
                &.ant-anchor-link-active,
                &.active {
                  background: rgba(241, 2, 21, 0.03);
                  background-image: url("../../../assets/images/redRightArrow.svg");
                  background-repeat: no-repeat;
                  background-size: 14px 26px;
                  background-position: 190px center;
                  a {
                    color: $theme-color;
                    font-weight: 600;
                  }
                }
                a {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  font-size: 16px;
                  color: #666666;
                  height: 100%;
                  text-decoration: none;
                }
                &:hover {
                  background-color: #fafafa;

                  a {
                    color: $theme-color;
                  }
                }
              }
            }
          }
        }
        .right {
          flex: 1;
          background: #fff;
          padding: 8px 44px;
          padding-bottom: 80px;
          box-shadow: $base-box-shadow;
          h2 {
            font-size: 20px;
            color: #333333;
            font-weight: 600;
            height: 48px;
            display: flex;
            align-items: center;
            line-height: 48px;
            .icon {
              width: 13px;
              height: 13px;
              margin-right: 10px;
              margin-top: 2px;
            }
          }
          p {
            font-size: 16px;
            color: #333333;
            line-height: 30px;
            padding: 0 23px;
            padding-right: 61px;
            letter-spacing: 1px;
          }
          .img_box {
            height: 257px;
            width: 612px;
            background: $base-background;
            margin-left: 23px;
            margin-top: 9px;
            margin-bottom: 28px;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .introduce {
            margin-bottom: 50px;
          }
          .culture {
            margin-bottom: 50px;
          }
          .aboutUs {
            ul {
              margin-top: 21px;
              padding-left: 23px;
              li {
                display: flex;
                font-size: 16px;
                color: #666666;
                margin-bottom: 18px;
                align-items: center;
                span {
                  display: flex;
                }
                .icon {
                  margin-right: 15px;
                  width: 18px;
                  height: 17px;
                  margin-top: 3px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>