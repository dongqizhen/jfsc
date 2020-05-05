<template>
  <div class="review-container">
    <div class="login" v-if="!isLogin">
      <div>
        登录后方可发表评论
        <span @click="toLogin">登录</span>
      </div>
    </div>
    <div class="write-review-container">
      <div class="write-review" id="writeReview" v-if="isLogin">
        <div class="top">
          <div class="img-box">
            <svg class="icon" aria-hidden="true" v-if="!userInfo.imageUrl">
              <use xlink:href="#iconweidenglutouxiang"></use>
            </svg>
            <img v-else :src="userInfo.imageUrl" alt="" />
          </div>
          <a-textarea placeholder="写下您的评论" v-model="value" :rows="4" />
        </div>

        <a-button :loading="loading" @click="sendComment">发送</a-button>
      </div>
      <h2>
        {{ commentData.amount }}条评论
        <!-- <ul>
          <li
            :class="i == defaultVal && 'active'"
            v-for="(item, i) in ['按时间倒序', '按时间正序']"
            :key="`sort-${i}`"
            @click="handerClick(i)"
          >
            {{ item }}
          </li>
        </ul> -->
      </h2>
      <div class="review_content" v-if="!load">
        <ul v-if="commentData.commentList.length">
          <comment-item-vue
            v-for="item in commentData.commentList"
            :key="item.id"
            :item="item"
            :type="getType"
          >
            <ul slot="replay-container">
              <comment-item-vue
                v-for="val in item.replyList"
                :key="val.id"
                :item="val"
                :type="getType"
              >
              </comment-item-vue>
              <comment-item-vue
                v-if="showMore"
                v-for="val in commetArr"
                :key="val.id"
                :item="val"
                :type="getType"
              >
              </comment-item-vue>
            </ul>

            <div
              class="more-comment"
              slot="more-comment"
              v-if="item.commentNum > 3"
            >
              <p
                @click="
                  if (showMore || commetArr != '') {
                    showMore = !showMore;
                  } else {
                    moreComment(item.id);
                  }
                "
              >
                <span>
                  {{
                    showMore
                      ? "收起"
                      : "查看更多" + (item.commentNum - 3) + "条回复"
                  }}
                </span>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="showMore && 'active'"
                >
                  <use xlink:href="#iconhuifuzhankai"></use>
                </svg>
              </p>
            </div>
          </comment-item-vue>
        </ul>
        <no-data v-else type="no-comment" text="暂无评论"></no-data>
      </div>
      <loading v-else></loading>
    </div>
    <pagination
      :data="commentData"
      v-if="commentData.commentList.length"
      v-on:onPaginationChange="onPaginationChange"
    ></pagination>
  </div>
</template>

<script>
  import commentItemVue from "./commentItem.vue";
  import { mapState } from "vuex";
  import { _getData } from "../../../config/getData";
  import pagination from "../pagination";

  export default {
    data() {
      return {
        defaultVal: 0, //排序
        value: "",
        loading: false, //发送按钮loading
        showMore: false,
        commetArr: "" //某一评论下边的全部评论
        //commentType: ""
      };
    },
    props: {
      isLogin: {
        type: Boolean,
        default: false,
        required: true
      },
      load: {
        type: Boolean,
        default: false
      },
      video: {},
      commentData: {},
      type: {
        type: [String] //video 微课堂
      }
    },
    components: {
      commentItemVue,
      pagination
    },
    computed: {
      ...mapState(["userInfo"]),
      getType() {
        switch (this.type) {
          case "video": //微课堂
            return {
              commentType: 1, //评论type
              likeType: 11 //点赞type
            };
            break;
          case "article": //行业资讯
            return {
              commentType: 5, //评论type
              likeType: 12 //点赞type
            };
            break;
          case "case": //维修宝
            return {
              commentType: 3, //评论type
              likeType: 10 //点赞type
            };
            break;
        }
      }
    },
    mounted() {},
    methods: {
      //点击查看更多回复
      moreComment(id) {
        this.showMore = !this.showMore;
        _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/videoComment!request.action`,
          {
            method: "getAppPageReplyList_v27",
            token: "",
            userid: this.$userid,
            params: {
              currentPage: 1,
              countPerPage: "",
              id: id, //顶层评论id
              type: this.getType.commentType
            }
          }
        ).then(data => {
          this.commetArr = _.drop(data.result.replyList, 3);
        });
      },
      toLogin() {
        this.$router.push({ path: "/login" });
        // const { href } = this.$router.resolve({
        //   path: "/login"
        // });
        // window.open(href, "_blank");
      },
      onPaginationChange(page, pageSize) {
        this.$parent.getCommentList(page);
      },
      handerClick(i) {
        this.defaultVal = i;
      },
      sendComment() {
        if (this.value == "") return;
        this.loading = true;

        _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/videoComment!request.action`,
          {
            method: "addModelComments",
            userid: this.$userid,
            params: {
              id: this.$route.query.id, //视频id
              type: this.getType.commentType, //表示聊一聊
              content: window.encodeURI(this.value), //评论内容，编码
              parentId: "", //被回复顶层评论id
              commentId: "" //被回复记录id
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
              });
          })
          .then(() => {
            this.$parent.getCommentList();
          });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss.scss";
  textarea {
    //height: 91px !important;
    flex: 1;
    resize: none;
    font-size: 14px;
    border: 1px solid #dddddd;
    padding: 10px 20px;
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
  .review-container {
    .login {
      padding: 20px;
      background: #fff;
      margin: 10px 0;
      box-shadow: $base-box-shadow;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 15px;
        color: #815535;
        height: 91px;
        background: #fff7e7;
        border: 1px solid #ded6c5;
        span {
          display: flex;
          height: 33px;
          width: 76px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background-image: linear-gradient(90deg, #ff4e1a 0%, #f10000 100%);
          font-size: 14px;
          color: #ffffff;
          margin-left: 40px;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
    .write-review-container {
      box-shadow: $base-box-shadow;
      .write-review {
        padding: 24px 20px 20px;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        align-items: flex-end;
        background: #fff;

        .top {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          .img-box {
            height: 30px;
            width: 30px;
            background: $image-box-color;
            margin-right: 8px;
            border-radius: 16px;
            img {
              height: 100%;
              width: 100%;
              border-radius: 16px;
            }
          }
        }

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
          border: none;
          line-height: 33px;
          color: #ffffff;
          &::after {
            display: none;
          }
          &:hover {
            opacity: 0.7;
          }
        }
      }
      > h2 {
        height: 40px;
        display: flex;
        align-items: center;
        padding-left: 29px;
        justify-content: space-between;
        background: #f5f5f5;

        font-weight: 600;
        font-size: 15px;
        color: #f5a623;
        ul {
          display: flex;
          justify-content: flex-start;
          padding: 0 20px;
          li {
            font-size: 12px;
            color: #999999;
            cursor: pointer;
            font-weight: normal;
            &.active {
              font-weight: 600;
              font-size: 12px;
              color: #333333;
            }
            &:first-child {
              margin-right: 30px;
            }
          }
        }
      }
      .review_content {
        padding: 20px;
        padding-bottom: 0;
        background: #fff;
        display: flex;
        justify-content: flex-start;
        ul {
          width: 100%;
        }
        /deep/ .no-data {
          height: 500px;
        }
      }
      /deep/ .loading {
        background: #fff;
        padding: 0px 30px;
        padding-bottom: 30px;
      }
    }
    /deep/ .paginationBox {
      margin-bottom: 0;
    }
  }
</style>