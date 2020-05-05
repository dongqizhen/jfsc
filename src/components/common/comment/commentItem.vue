<template>
  <li class="comment-item">
    <div class="img_box">
      <svg class="icon" aria-hidden="true" v-if="!item.userImageUrl">
        <use xlink:href="#iconweidenglutouxiang"></use>
      </svg>
      <img v-else :src="item.userImageUrl" alt="" />
    </div>
    <div class="main">
      <span>
        {{ item.username }}
        <span>{{ item.createdOn }}</span>
      </span>
      <p v-html="content">
        <!-- {{ decodeURI(item.content).replace(/\n/g, "<br />") }}
        <span v-if="item.commentId && item.commentId != -1">
          &nbsp;&nbsp;//
          <span>@{{ item.commentName }}</span
          >：{{ decodeURI(item.commentContent) }}
        </span> -->

        <!-- {{
          item.commentId && item.commentId != -1
            ? "&nbsp;&nbsp;//@" +
              item.commentName +
              "：" +
              decodeURI(item.commentContent)
            : ""
        }} -->
      </p>
      <div class="replay">
        <div class="btn">
          <div class="replay-btn">
            <span v-if="$userid == item.userId" @click="deleteComment(item.id)">
              删除&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
            <span @click="replayBtnClick">回复</span>

            <span
              @click="
                if (item.replyList) {
                  packUp();
                }
              "
            >
              &nbsp;&nbsp;·&nbsp;
              {{ item.commentNum }}条回复
              <svg
                v-if="item.replyList"
                class="icon"
                :class="commentIsShow && 'active'"
                aria-hidden="true"
              >
                <use xlink:href="#iconhuifuzhankai"></use>
              </svg>
            </span>
          </div>
          <span>
            <vue-star animate="animated jello" color="#F05654" ref="vueStar">
              <svg
                class="icon"
                aria-hidden="true"
                slot="icon"
                @click="giveALike(item.id)"
              >
                <use xlink:href="#iconzan" v-if="!isCommentLike"></use>
                <use xlink:href="#iconzanx" v-else></use>
              </svg>
            </vue-star>

            {{ commentAmount }}
          </span>
        </div>
        <transition name="slide-fade">
          <div class="replay-area" v-if="isLogin && iptIsShow">
            <a-textarea placeholder="写下您的评论" :rows="4" v-model="value" />
            <a-button @click="sendComment(item)" :loading="loading"
              >发送</a-button
            >
          </div>
        </transition>
      </div>
      <transition name="slide-fade">
        <div class="replay-container" v-if="commentIsShow">
          <div>
            <slot name="replay-container"></slot>
          </div>
          <slot name="more-comment"></slot>
        </div>
      </transition>
    </div>
    <login-modal-vue type="login" :Visible="visible"></login-modal-vue>
  </li>
</template>

<script>
  import { mapState } from "vuex";
  import loginModalVue from "../../modal/loginModal.vue";
  import { _getData } from "../../../config/getData";

  export default {
    data() {
      return {
        iptIsShow: false, //是否显示回复框
        commentIsShow: false,
        visible: false,
        isCommentLike: 0, //评论是否点赞 0 否 1 是
        commentAmount: 0,
        value: "",
        content: "",
        loading: false //发送按钮loading
      };
    },
    props: ["item", "type"],
    components: {
      loginModalVue
    },
    created() {
      this.isCommentLike = this.item.isDianzan;

      this.commentAmount = this.item.amount;
      this.content =
        decodeURI(this.item.content).replace(/\n/g, "<br />") +
        (this.item.commentId && this.item.commentId != -1
          ? "&nbsp;&nbsp;//<span>@" +
            this.item.commentName +
            "</span>：" +
            decodeURI(this.item.commentContent).replace(/\n/g, "<br />")
          : "");
    },
    mounted() {
      if (this.isCommentLike) {
        this.$refs.vueStar.$data.active = true;
        this.$refs.vueStar.$data.toggleAnimate = true;
      }
    },
    methods: {
      //删除评论
      deleteComment(id) {
        _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/videoComment!request.action`,
          {
            method: "deleteCommentById",
            token: "",
            userid: this.$userid,
            params: {
              objId: id, // id
              type: this.type.commentType //表示聊一聊
            }
          }
        )
          .then(() => {
            if (this.$parent.$parent.getCommentList) {
              this.$parent.$parent.getCommentList();
            } else {
              this.$parent.$parent.$parent.getCommentList();
            }
          })
          .then(() => {
            this.$message.success("删除成功");
          });
      },
      //点击回复按钮
      replayBtnClick() {
        if (this.isLogin) {
          this.iptIsShow = !this.iptIsShow;
        } else {
          this.visible = true;
        }
      },
      //点击发送按钮
      sendComment(item) {
        if (this.value == "") return;
        this.loading = true;
        _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/videoComment!request.action`,
          {
            method: "addModelComments",
            userid: this.$userid,
            params: {
              id: this.$route.query.id, //视频id
              type: this.type.commentType, //表示聊一聊
              content: window.encodeURI(this.value), //评论内容，编码
              parentId: item.replyList ? item.id : item.parentId, //被回复顶层评论id
              commentId: item.replyList ? "" : item.id //被回复记录id
            }
          }
        )
          .then(() => {
            this.$nextTick()
              .then(() => {
                this.$message.success("评论成功");
                this.loading = false;
              })
              .then(() => {
                this.value = "";
                this.iptIsShow = false;
                this.commentIsShow = true;
              });
          })
          .then(() => {
            if (this.$parent.$parent.getCommentList) {
              this.$parent.$parent.getCommentList();
            } else {
              this.$parent.$parent.$parent.getCommentList();
            }
          });
      },
      packUp() {
        this.commentIsShow = !this.commentIsShow;
      },
      //点赞
      giveALike(id) {
        this.isCommentLike = !this.isCommentLike;
        this.commentAmount = this.isCommentLike
          ? (this.commentAmount += 1)
          : (this.commentAmount -= 1);
        _getData(`${this.$API_URL.HYGPROURL}/server_pro/dianzan!request.action`, {
          method: "addOrDeleteDianzan_v27",
          token: "",
          userid: this.$userid,
          params: {
            id: id,
            type: this.type.likeType,
            controlflag: this.isCommentLike ? 0 : 1 //1表示取消，0表示添加（传的是现在的状态）
          }
        })
          .then(() => {
            //console.log(this.isCommentLike);
          })
          .then(() => {
            // if (this.$parent.$parent.getCommentList) {
            //   this.$parent.$parent.getCommentList();
            // } else {
            //   this.$parent.$parent.$parent.getCommentList();
            // }
          });
      }
    },
    computed: {
      ...mapState(["isLogin"]),
      getContent() {
        return (this.item.content +=
          this.item.commentId && this.item.commentId != -1
            ? "&nbsp;&nbsp;//<span>@" +
              this.item.commentName +
              "</span>：" +
              decodeURI(this.item.commentContent)
            : "");
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  textarea {
    //height: 91px !important;
    flex: 1;
    resize: none;

    font-size: 14px;
    border: 1px solid #dddddd;
    padding: 10px 20px;
    color: #333;
    &:focus {
      border-color: $theme-color;
      outline: 0;
      -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      box-shadow: 0 0 0 2px rgba($color: $theme-color, $alpha: 0.2);
      border-right-width: 1px !important;
    }
    &:hover {
      border-color: $theme-color;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    //transform: translateY(-5px);
    opacity: 0;
  }

  li {
    display: flex;
    justify-content: flex-start;
    //padding-bottom: 20px;
    border-bottom: 1px solid rgba(221, 221, 221, 0.5);
    padding-top: 20px;
    &:last-child {
      border: 0;
    }
    &:first-child {
      padding-top: 0;
    }
    .img_box {
      height: 30px;
      width: 30px;
      border-radius: 16px;
      background: $image-box-color;
      margin-right: 8px;
      margin-top: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .icon {
        height: 17px;
        width: 17px;
        margin-left: 1px;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        border: none;
      }
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      > span {
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 2px;
        span {
          font-weight: normal;
          font-size: 12px;
          color: #999999;
          margin-left: 10px;
        }
      }
      > p {
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        margin-bottom: 6px;
        // white-space: pre-line;
        /deep/ span {
          color: #3194d0;
          > span {
          }
        }
      }
      .replay {
        font-size: 14px;
        color: #406599;
        display: flex;
        justify-content: flex-start;

        flex-direction: column;
        .btn {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .replay-btn {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span {
              cursor: pointer;
              display: flex;
              align-items: center;
              &:hover {
                opacity: 0.7;
              }
              .icon {
                width: 11px;
                height: 6px;
                margin-top: 2px;
                margin-left: 8px;
                transition: all 0.3s;
                &.active {
                  transform: rotate(180deg);
                }
              }
            }
          }
          > span {
            // font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #999999;
            display: flex;
            align-items: center;
            cursor: pointer;
            .icon {
              width: 16px;
              height: 16px;
            }
            /deep/ .VueStar {
              right: -10px;
              .VueStar__icon {
                width: 16px;
                height: 16px;
                display: flex;
                margin-right: 4px;
              }
            }
          }
        }
        .replay-area {
          // margin-top: 10px;
          margin-bottom: 20px;
          /deep/ .ant-btn {
            display: flex;
            height: 33px;
            width: 76px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-top: 16px;
            background-image: linear-gradient(90deg, #ff4e1a 0%, #f10000 100%);
            font-weight: 600;
            font-size: 14px;
            color: #ffffff;
            float: right;
            border: none;
            &::after {
              display: none;
            }
            line-height: 33px;
            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
      .replay-container {
        /deep/ .more-comment {
          width: auto;
          display: flex;
          font-size: 14px;
          color: #406599;
          cursor: pointer;
          margin-bottom: 10px;
          &:hover {
            opacity: 0.7;
          }
          p {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .icon {
            width: 11px;
            height: 6px;
            margin-top: 2px;
            margin-left: 8px;
            transition: all 0.3s;
            &.active {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }
</style>