<template>
  <div class="brand-card">
    <div class="img_box">
      <div class="img">
        <img
          :src="data.app_list_pic_url || data.icon_url || data.pic_url"
          alt=""
        />
      </div>
      {{ data.name }}
    </div>
    <div class="introduce">
      <div class="desc" :class="isUnwind && 'active'">
        <p>
          {{ data.simple_desc || data.front_desc }}
        </p>
      </div>
      <span
        class="more"
        v-if="isShowMore"
        @click="rightMoreBtnClick"
        :class="isUnwind && 'active'"
      >
        {{ !isUnwind ? "查看更多" : "收起" }}
        <svg class="icon" aria-hidden="true" :class="isUnwind && 'active'">
          <use xlink:href="#icongengduoxialajiantou" v-if="!isUnwind"></use>
          <use xlink:href="#icontianjiaduibichanpinxiala" v-else></use>
        </svg>
      </span>
      <div class="bottom-shadow"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShowMore: false, //是否显示更多按钮
        isUnwind: false //是否展开
      };
    },
    props: ["data"],
    mounted() {
      setTimeout(() => {
        let DOM = document.querySelector(".desc>p");
        if (DOM.offsetHeight > 324) {
          //document.querySelector(".more").style.display = "none";
          this.isShowMore = true;
        }
      }, 100);
    },
    methods: {
      rightMoreBtnClick() {
        this.isUnwind = !this.isUnwind;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .brand-card {
    display: flex;
    flex-direction: column;
    .img_box {
      font-size: 17px;
      color: #333333;
      font-weight: 600;
      background: #fff;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 27px 28px;
      box-shadow: $base-box-shadow;
      .img {
        width: 200px;
        //height: 144px;
        background: $base-background;
        margin-bottom: 25px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .introduce {
      padding: 14px;
      padding-bottom: 16px;
      padding-top: 8px;
      background: #fff;
      margin-top: 12px;
      box-shadow: $base-box-shadow;
      position: relative;

      > div.desc {
        height: 324px;
        overflow: hidden;
        min-height: 150px;
        p {
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          line-height: 27px;
          word-break: break-all;
        }
        &.active {
          height: auto;
        }
      }

      span {
        font-size: 12px;
        color: #019ddd;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 6px;
        cursor: pointer;
        &.active {
          color: #999999;
        }
        &:hover {
          opacity: 0.7;
        }
        .icon {
          height: 6px;
          width: 10px;
          margin-left: 4px;
          margin-top: 1px;
          transition: all 0.3s;
          &.active {
            transform: rotate(180deg);
          }
        }
      }
      .bottom-shadow {
        background: url("../../assets/images/shopBottomShadow.png") no-repeat
          center;
        height: 18px;
        position: absolute;

        bottom: -14px;
        width: 100%;
        left: 0;
      }
    }
  }
</style>