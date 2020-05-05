<template>
  <div class="shop-card">
    <div class="shop">
      <span class="leftTopIcon">
        <svg class="icon" aria-hidden="true">
          <use
            xlink:href="#iconyirenzhengjiaobiao"
            v-if="detail.auditStatus == 2"
          ></use>
        </svg>
      </span>
      <span class="rightTopIcon">
        <img :src="detail.webIcon" alt="" />
      </span>
      <div class="img_box">
        <img :src="detail.image" alt="" v-if="detail.image" />
      </div>
      <p>{{ detail.shopName }}</p>
      <ul>
        <!-- <li>
          <span>店铺类型：</span><span>{{ detail.typeName }}</span>
        </li> -->
        <li>
          <span>经营范围：</span><span>{{ detail.shopScope }}</span>
        </li>
        <li>
          <span>销售地区： </span>
          <span>
            <span v-for="item in detail.defaultProvinceData" :key="item.id">
              {{ item.provinceName + ":" }}
              <span v-for="val in item.defaultCityData" :key="val.id">{{
                val.name + ","
              }}</span>
            </span>
          </span>
        </li>
      </ul>
      <div class="btn">
        <a-button v-if="type == 'introduce'">
          <router-link
            :to="{
              path: '/shopIntroduction',
              query: {
                nav_index: $route.query.nav_index,
                shopId: $route.query.shopId
              }
            }"
            target="_blank"
          >
            店铺介绍
          </router-link>
        </a-button>
        <a-button v-else>
          <router-link
            :to="{
              path: '/shopDetails',
              query: {
                nav_index: 3,
                shopId: $route.query.shopId
              }
            }"
            target="_blank"
          >
            进店看看
          </router-link>
        </a-button>
        <a-button @click="collect">{{
          isCollection ? "已收藏" : "收藏店铺"
        }}</a-button>
      </div>
      <div class="service">
        <a-button>
          <router-link
            :to="{
              path: '/userCenter/myMessage/contactService',
              query: {
                keyId: '9',
                topTitle: 'sub1',
                shopId: $route.query.shopId
              }
            }"
            target="_blank"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconlianxikefu"></use>
            </svg>
            联系客服
          </router-link>
        </a-button>
      </div>
      <div class="shop-bottom-shadow"></div>
      <login-modal-vue :Visible="visible" :type="modeltype"></login-modal-vue>
    </div>
  </div>
</template>

<script>
  import { _getData } from "../../config/getData";

  import { mapState, mapMutations } from "vuex";
  import loginModalVue from "../modal/loginModal.vue";
  export default {
    data() {
      return {
        isCollection: 0,
        visible: false,
        modeltype: "login"
      };
    },
    components: { loginModalVue },
    props: ["type", "detail"],
    computed: {
      ...mapState(["isLogin"])
    },
    created() {
      this.isCollection = this.detail.collectId;
    },
    methods: {
      collect() {
        if (this.isLogin) {
          if (this.isCollection == 0) {
            _getData("collect/add", {
              valueId: this.detail.sid,
              typeId: 1
            }).then(data => {
              this.isCollection = 1;
              this.$message.success("店铺收藏成功");
            });
          } else {
            _getData("collect/delete", {
              valueId: this.detail.sid,
              typeId: 1
            }).then(data => {
              this.isCollection = 0;
              this.$message.success("取消收藏成功");
            });
          }
        } else {
          this.visible = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .shop {
    min-height: 362px;
    background: #ffffff;
    box-shadow: $base-box-shadow;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0 44px;
    .leftTopIcon {
      position: absolute;
      top: 0;
      left: 0;
      .icon {
        height: 50px;
        width: 50px;
      }
    }
    .rightTopIcon {
      position: absolute;
      right: 0;
      display: flex;
      top: 0px;
      z-index: 100;
      img {
        height: 22px;
      }
    }
    .img_box {
      height: 179px;
      width: 179px;
      background: $base-background;
      margin-top: 34px;
      margin-bottom: 8px;
      position: relative;
      > img {
        height: 100%;
        width: 100%;
      }
      span {
      }
    }
    p {
      font-size: 15px;
      color: #2b3e50;
      font-weight: 600;

      line-height: 22px;
      // padding: 0 18px;
    }
    > ul {
      //padding: 0 44px;
      margin-top: 24px;
      width: 100%;
      li {
        display: flex;
        justify-content: flex-start;
        min-height: 20px;
        // align-items: center;
        margin-bottom: 12px;
        > span {
          font-size: 14px;
          color: #526c85;

          &:first-child {
            width: 70px;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
          }
          &:last-child {
            font-weight: 600;
            flex: 1;
          }
        }
        &:last-child {
          flex-direction: column;
          > span {
            &:last-child {
              display: flex;
              flex-direction: column;
            }
          }
        }
      }
    }
    .btn {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 19px;
      /deep/ .ant-btn-default {
        width: 87px;
        height: 31px;
        text-align: center;
        a {
          text-decoration: none;
        }
        span {
          display: flex;
          height: 29px;
          align-items: center;
          justify-content: center;
          line-height: 29px;
        }
        &:hover {
          opacity: 0.7;
        }
        &:first-child {
          background: rgba(241, 2, 21, 0.03);
          border: 1px solid #f10215;
          font-size: 14px;
          color: #f10215;
          font-weight: 600;
          margin-right: 13px;
        }
        &:last-child {
          background: rgba(245, 166, 35, 0.1);
          border: 1px solid #f5a623;
          font-size: 14px;
          color: #f5a623;
          font-weight: 600;
        }
      }
    }
    .service {
      margin-top: 20px;
      .ant-btn-default {
        //border: none;
        font-size: 14px;
        color: #666666;
        box-shadow: none;
        border: #fff 1px solid;
        background: #fff;
        a {
          display: flex;
          align-items: center;
          text-decoration: none;
          &:hover {
            opacity: 0.7;
          }
        }
        &:active {
          box-shadow: none;
        }
        &::after {
          display: none;
        }
        .icon {
          width: 16.5px;
          height: 14px;
          margin-right: 5px;
        }
        span {
        }
      }
    }
    .shop-bottom-shadow {
      background: url("../../assets/images/shopBottomShadow.png") no-repeat center;
      height: 18px;
      position: absolute;
      bottom: -14px;
      width: 100%;
    }
  }
</style>