<template>
  <div>
    <a-anchor class="toolMenu menu" :affix="false">
      <a-anchor-link href="#writeReview">
        <span slot="title" @click="toolMenuClick(1)">
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconpinglun"></use>
            </svg>
          </i>
          {{ item.commentNum }}
        </span>
      </a-anchor-link>
      <a-anchor-link href="#a">
        <span
          slot="title"
          @click="toolMenuClick(2)"
          :class="isCollect && 'active'"
        >
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconshoucang" v-if="!isCollect"></use>
              <use xlink:href="#iconpingjiashixinwujiaoxing" v-else></use>
            </svg>
          </i>
          {{ item.favoriteNum }}
        </span>
      </a-anchor-link>
      <a-anchor-link href="#a">
        <span
          slot="title"
          @click="toolMenuClick(3)"
          :class="isThumpUp && 'active'"
        >
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconzan" v-if="!isThumpUp"></use>
              <use xlink:href="#iconzanx" v-else></use>
            </svg>
          </i>
          {{ thumpUpNumber }}
        </span>
      </a-anchor-link>
      <a-anchor-link href="#shareMenu">
        <span slot="title">
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconfenxiang"></use>
            </svg>
          </i>
          {{ item.shareNum }}
        </span>
      </a-anchor-link>
    </a-anchor>
    <login-modal-vue :Visible="visible" type="login"></login-modal-vue>
  </div>

  <!-- <span @click="toolMenuClick(2)">
      <a>
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconshoucang" v-if="!isCollect"></use>
            <use xlink:href="#iconpingjiashixinwujiaoxing" v-else></use>
          </svg>
        </i>
        {{ item.favoriteNum }}
      </a>
    </span>
    <span @click="toolMenuClick(3)">
      <a>
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconzan" v-if="!isThumpUp"></use>
            <use xlink:href="#iconzanx" v-else></use>
          </svg>
        </i>
        {{ thumpUpNumber }}
      </a>
    </span>
    <span @click="toolMenuClick(4)">
      <a href="#writeReview">
        <i>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconfenxiang"></use>
          </svg>
        </i>
        {{ item.shareNum }}
      </a>
    </span> -->
</template>

<script>
  import { _getData } from "../../../config/getData";
  import { mapState } from "vuex";
  import loginModalVue from "../../modal/loginModal.vue";
  export default {
    data() {
      return {
        isThumpUp: 0, //是否点赞
        thumpUpNumber: "", //点赞数
        isCollect: 0, //是否收藏
        collectNumber: "", //收藏数
        visible: false
      };
    },
    props: ["item", "type"],
    components: { loginModalVue },
    created() {
      if (this.type == "video") {
        this.isThumpUp = this.item.isDianzan;
      } else {
        this.isThumpUp = this.item.isDianZan;
      }

      this.thumpUpNumber = this.item.amount;
      this.isCollect = this.item.isFavorite;
    },
    methods: {
      async collect() {
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/dianzan!request.action`,
          {
            method: "addOrDeleteFavorite",
            token: "",
            version: 2.0,
            source: "iso",
            userid: this.$userid,
            params: {
              id: this.item.id,
              type: this.selectType, //
              controlflag: this.isCollect //1表示取消，0表示添加（传的是现在的状态）
            }
          }
        ).then(data => {
          this.isCollect = this.isCollect ? 0 : 1;
        });
      },
      async thumpUp() {
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/dianzan!request.action`,
          {
            method: "addOrDeleteDianzan",
            token: "",
            userid: this.$userid,
            version: 2.0,
            source: "iso",
            params: {
              id: this.item.id,
              type: this.selectType, //
              controlflag: this.isThumpUp //1表示取消，0表示添加（传的是现在的状态）
            }
          }
        ).then(data => {
          this.thumpUpNumber = this.isThumpUp
            ? (this.thumpUpNumber -= 1)
            : (this.thumpUpNumber += 1);
          this.isThumpUp = this.isThumpUp ? 0 : 1;
        });
      },
      toolMenuClick(val) {
        if (!this.isLogin && val != 4) {
          this.visible = true;
          return;
        }
        switch (val) {
          case 1:
            break;
          case 2:
            this.collect();
            break;
          case 3:
            this.thumpUp();
            break;
          case 4:
            break;
        }
      }
    },
    computed: {
      ...mapState(["isLogin", "userInfo"]),
      selectType() {
        switch (this.type) {
          case "article":
            return 7;
          case "video":
            return 4;
          case "case":
            return 5;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";

  .ant-anchor-wrapper {
    padding: 0;
    width: 50px;
    height: 240px;
    margin: 0;
    display: flex;
    box-shadow: $base-box-shadow;
    /deep/ .ant-anchor {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      width: 100%;
      > .ant-anchor-ink {
        display: none;
      }
      .ant-anchor-link {
        padding: 0;
        flex: 1;
        display: flex;

        a {
          text-decoration: none;
          display: flex;
          height: 100%;
          width: 100%;
          font-size: 14px;
          color: #7e8c8d;

          font-weight: 600;
          span {
            display: flex;
            height: 100%;
            width: 100%;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            i {
              margin: 0;
              .icon {
                width: 16px;
                height: 16px;
              }
            }
            &::after {
              content: "评论";
              width: 50px;
              height: 100%;
              position: absolute;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 15px;
              white-space: pre;
              color: #ffffff;
              word-break: break-all;
              background: $theme-color;
              display: none;
              flex-wrap: wrap;
              text-align: center;
            }
            &:hover {
              &::after {
                display: flex;
              }
            }
          }
        }
        &:nth-child(3) {
          > a > span::after {
            content: "收藏";
          }
          > a > span.active::after {
            content: "取消\A收藏";
          }
        }
        &:nth-child(4) {
          a > span::after {
            content: "点赞";
          }
          a > span.active::after {
            content: "取消\A点赞";
          }
        }
        &:nth-child(5) {
          a > span::after {
            content: "分享";
          }
        }
        &:hover {
          a > span::after {
            display: flex;
          }
        }
      }
    }
  }
</style>