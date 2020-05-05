<template>
  <div class="shop-introduction">
    <Header></Header>
    <search></search>
    <Nav :defaultNav="defaultNav"></Nav>
    <div class="container">
      <div class="commonWidth">
        <breadcrumb-vue></breadcrumb-vue>
        <div class="content">
          <div class="left">
            <ul class="header">
              <li>{{ shopdetails.accessNum }}<span>访问量</span></li>
              <li>{{ shopdetails.consultNum }}<span>咨询数</span></li>
              <li>{{ shopdetails.salenum }}<span>成交数</span></li>
              <li>{{ shopdetails.highPraiseNum }}%<span>好评率</span></li>
            </ul>
            <div class="basic-information information">
              <h2><span></span>基本资料</h2>
              <ul>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icondianpumingcheng"></use>
                    </svg>
                    店铺名称
                  </span>
                  {{ shopdetails.shopName }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconjingyingfanwei"></use>
                    </svg>
                    经营范围
                  </span>
                  {{ shopdetails.shopScope }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconleixing"></use>
                    </svg>
                    店铺类型
                  </span>
                  {{ shopdetails.typeName }}
                </li>
              </ul>
            </div>
            <div class="certificated-information information">
              <h2><span></span>认证资料</h2>
              <ul>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icongongsimingcheng"></use>
                    </svg>
                    公司名称
                  </span>
                  {{ shopdetails.companyName }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconlianxiren"></use>
                    </svg>
                    联系人
                  </span>
                  {{ shopdetails.linkName }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconshoujihao"></use>
                    </svg>
                    手机号
                  </span>
                  {{ shopdetails.mobile }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconzuoji"></use>
                    </svg>
                    座机
                  </span>
                  {{ shopdetails.workPhone }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconqiyeyouxiang"></use>
                    </svg>
                    企业邮箱
                  </span>
                  {{ shopdetails.email }}
                </li>
                <li>
                  <span>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icongongsidizhi"></use>
                    </svg>
                    公司地址
                  </span>
                  {{ shopdetails.companyAddress }}
                </li>
              </ul>
            </div>
            <div class="information introduction">
              <h2><span></span>店铺介绍</h2>
              <div v-html="shopdetails.introduce"></div>
            </div>
          </div>
          <div class="right">
            <shop-card-vue :detail="shopdetails"></shop-card-vue>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <side-bar></side-bar>
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import search from "../../../components/common/search.vue";
  import Nav from "../../../components/common/nav.vue";
  import sideBar from "../../../components/sideBar/sideBar.vue";
  import breadcrumbVue from "../../../components/common/breadcrumb.vue";

  import { mixin } from "../../../components/mixin/mixin";
  import shopCardVue from "../../../components/common/shopCard.vue";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return { shopdetails: "" };
    },
    mixins: [mixin],
    components: {
      Header,
      Footer,
      search,
      Nav,
      sideBar,
      breadcrumbVue,
      shopCardVue
    },
    beforeRouteLeave(to, from, next) {
      next();
    },
    mounted() {
      _getData("/store/homeStore", {
        storeId: this.$route.query.shopId
      }).then(data => {
        console.log("店铺详情", data);
        this.shopdetails = data;
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .container {
    .commonWidth {
      .content {
        display: flex;
        justify-content: space-between;
        .left {
          width: $content-left;
          .header {
            box-shadow: $base-box-shadow;
            height: 138px;
            display: flex;
            justify-content: flex-start;
            background: #fff;
            li {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #f5a623;
              font-family: BebasNeue;
              position: relative;
              span {
                font-size: 14px;
                color: #999999;
                margin-top: 5px;
              }
              &:last-child {
                &::after {
                  display: none;
                }
              }
              &::after {
                content: "";
                height: 30px;
                border-left: 1px solid #dddddd;
                position: absolute;
                right: 0;
              }
            }
          }
          .information {
            background: #fff;
            box-shadow: $base-box-shadow;
            display: flex;
            flex-direction: column;

            > h2 {
              height: 50px;

              font-size: 17px;
              color: #333333;
              font-weight: 600;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              border-bottom: 1px solid #dddddd;
              padding-left: 16px;
              span {
                display: flex;
                height: 16px;
                width: 4px;
                background: #f5a623;
                margin-right: 8px;
              }
            }
            ul {
              flex: 1;
              padding: 24px 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              li {
                padding-left: 16px;
                font-size: 14px;
                color: #333333;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                span {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  width: 93px;
                  font-size: 14px;
                  color: #999999;
                  .icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                  }
                }
              }
            }
            &.basic-information {
              margin: 20px 0;
              height: 207px;
            }
            &.certificated-information {
              height: 330px;
              margin-bottom: 20px;
            }
            &.introduction {
              > div {
                padding: 24px 16px;
                /deep/ img {
                  width: 100%;
                }
              }
            }
          }
        }
        .right {
          width: 280px;
        }
      }
    }
  }
</style>