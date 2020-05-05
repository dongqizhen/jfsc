<template>
  <router-link
    tag="li"
    class="case-item"
    :to="{
      path: '/details/caseDetails',
      query: { nav_index: $route.query.nav_index, id: item.id }
    }"
  >
    <a target="_blank">
      <div class="photo">
        <div class="img_box">
          <img :src="item.userImageUrl" v-if="item.userImageUrl" alt="" />
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#iconweidenglutouxiang"></use>
          </svg>
        </div>
        <p>
          {{ item.author }}
          <a>
            {{ item.createdOn }}
            <span>
              <i>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconxinghaoliebiaoliulanliang"></use>
                </svg>
              </i>
              {{ item.dcount }}
            </span>
          </a>
        </p>
        <span :class="!item.tradeType ? 'free' : ''">
          <i v-if="item.tradeType">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzuanshi"></use>
            </svg>
          </i>
          {{ isPay }}
        </span>
      </div>
      <h2>
        {{ item.name }}
      </h2>
      <p v-text="convert"></p>
      <div class="tip">
        <ul>
          <li v-if="item.productline">{{ item.productline }}</li>
          <li v-if="item.brandName">{{ item.brandName }}</li>
          <li v-if="item.modelName">{{ item.modelName }}</li>
        </ul>
        <div class="toolMenu">
          <span>
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconpinglun"></use>
              </svg>
            </i>
            {{ item.commentNum }}
          </span>
          <span>
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconshoucang" v-if="!item.isFavorite"></use>
                <use xlink:href="#iconpingjiashixinwujiaoxing" v-else></use>
              </svg>
            </i>
            {{ item.favoriteNum }}
          </span>
          <span>
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconzan" v-if="!item.isDianZan"></use>
                <use xlink:href="#iconzanx" v-else></use>
              </svg>
            </i>
            {{ item.amount }}
          </span>
          <span>
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconfenxiang"></use>
              </svg>
            </i>
            {{ item.shareNum }}
          </span>
        </div>
      </div>
    </a>
  </router-link>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ["item"],
    computed: {
      convert() {
        let introduce = "";
        if (this.item.isNew == 0) {
          introduce = this.item.introduce.replace(
            /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g,
            ""
          );
        } else {
          this.item.failurePhenomenon = window.decodeURIComponent(
            this.item.failurePhenomenon
          );
          introduce = this.item.failurePhenomenon.replace(
            /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g,
            ""
          );
        }

        if (introduce.length > 100) {
          return introduce.substr(0, 100) + "...";
        } else {
          return introduce;
        }
      },
      isPay() {
        if (this.item.tradeType) {
          return;
        } else {
          return "免费";
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  li.case-item {
    height: 181px;
    margin-bottom: 16px;
    background: #fff;
    box-shadow: $base-box-shadow;
    padding: 10px 20px;
    padding-bottom: 0;
    cursor: pointer;
    &:hover {
      > a > h2 {
        color: $theme-color;
      }
    }
    a {
      text-decoration: none;
    }
    .photo {
      display: flex;
      justify-content: space-between;
      height: 38px;
      align-items: center;
      .img_box {
        height: 30px;
        width: 30px;
        border-radius: 16px;
        background: url("../../../assets/images/default.png") no-repeat center;
        background-size: 100% 100%;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 100%;
          width: 100%;
          border-radius: 16px;
        }
      }
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #2b3e50;
        a {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #7e8c8d;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            margin-left: 17px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            i {
              margin-right: 5px;
              display: flex;
              align-items: center;
              //margin-top: 1px;
              .icon {
                width: 14px;
                height: 10px;
              }
            }
          }
        }
      }
      > span {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #bd10e0;
        &.free {
          color: #f5a623;
        }
      }
    }
    h2 {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      height: 43px;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 43px;
    }
    p {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      min-height: 42px;
    }
    .tip {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      ul {
        display: flex;
        justify-content: flex-start;
        li {
          margin-right: 4px;
          height: 25px;
          padding: 0 10px;
          background: #f7f7f7;
          border-radius: 15px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #fb6441;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 25px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .toolMenu {
        display: flex;

        justify-content: flex-end;
        flex: 1;

        span {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #999999;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-top: 1px;
          height: 21px;
          line-height: 21px;
          margin-right: 20px;
          i {
            margin-right: 4px;
            .icon {
              width: 16px;
              height: 16px;
            }
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>