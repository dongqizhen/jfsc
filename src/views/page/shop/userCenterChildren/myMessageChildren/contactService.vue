<template>
  <div class="contact-service">
    <div class="head">
      <common-title title="消息中心"></common-title>
      <div class="shopInfo">
        <div v-if="sender == 'user'" class="user_box">
          <div v-if="!shopIsLoading">
            <div class="img-box">
              <img :src="shopDetail.image" alt="" />
            </div>
            <div class="right user">
              <h3>{{ shopDetail.shopName }}</h3>
              <p></p>
            </div>
          </div>
          <loading v-else :number="1" :rows="2" avatar></loading>
        </div>
        <div v-else class="store_box">
          <div class="img-box store">
            <img
              :src="firstMessage.senderImage"
              v-if="firstMessage.senderImage"
            />
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#iconweidenglutouxiang"></use>
            </svg>
          </div>
          <div class="right">
            <h3>
              {{ firstMessage.senderName }}
              <span>{{ firstMessage.createdOn }}</span>
            </h3>
            <p>
              {{ firstMessage.content }}
            </p>
          </div>
        </div>
        <router-link
          v-if="sender == 'user'"
          tag="span"
          :to="{
            path: '/shopDetails',
            query: {
              nav_index: 3,
              shopId: $route.query.shopId,
              shopName: shopDetail.shopName
            }
          }"
        >
          <a target="_blank">
            进入店铺
          </a>
        </router-link>
      </div>
    </div>
    <div class="reply">
      <h2>全部回复</h2>
      <div class="replay-content">
        <div v-if="!isLoading">
          <ul
            v-if="
              (sender == 'user' && firstMessage) ||
                (sender == 'store' && replyList.length)
            "
          >
            <li v-for="item in replyList" :key="item.id">
              <div class="img-box">
                <img :src="item.senderImage" v-if="item.senderImage" />
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#iconweidenglutouxiang"></use>
                </svg>
              </div>
              <div class="right">
                <h3>
                  {{ item.senderName }}<span>{{ item.createdOn }}</span>
                </h3>
                <p>
                  {{ item.content }}
                </p>
              </div>
              <a-button
                v-if="$userid == item.sendUserId"
                @click="delMessage(item)"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconshanchu"></use>
                </svg>
                删除
              </a-button>
            </li>
            <li v-if="sender == 'user'">
              <div class="img-box">
                <img
                  :src="firstMessage.senderImage"
                  v-if="firstMessage.senderImage"
                />
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#iconweidenglutouxiang"></use>
                </svg>
              </div>
              <div class="right">
                <h3>
                  {{ firstMessage.senderName
                  }}<span>{{ firstMessage.createdOn }}</span>
                </h3>
                <p>
                  {{ firstMessage.content }}
                </p>
              </div>
              <a-button
                v-if="$userid == firstMessage.sendUserId"
                @click="delMessage(firstMessage)"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconshanchu"></use>
                </svg>
                删除
              </a-button>
            </li>
          </ul>
          <no-data v-else type="no-message" text="暂无消息"></no-data>
        </div>
        <loading v-else :number="2" :rows="4" avatar></loading>
      </div>

      <div class="replay-container">
        <a-textarea
          placeholder="请输入内容…"
          :rows="4"
          v-model="value"
          ref="ipt"
        />
        <a-button
          :disabled="value == ''"
          @click="sendMessage"
          :loading="sendBtnLoad"
          >发送</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
  import commonTitle from "../../../../../components/common/merchantRightCommonTitle";
  import { _getData } from "../../../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        value: "",
        shopDetail: "",
        commentData: "",
        replyList: "",
        firstMessage: "",
        sender: "", //用户类型
        shopIsLoading: true,
        isLoading: true,
        sendBtnLoad: false
      };
    },
    components: {
      commonTitle
    },
    created() {
      console.log(this.$route);
      if (this.$route.query.sender == "store") {
        this.sender = "store";
      } else {
        this.sender = "user";
      }
    },
    methods: {
      sendMessage() {
        this.sendBtnLoad = true;
        _getData("message/sendPersonlMessage", {
          storeId: this.$route.query.shopId, //类型：Number  必有字段  备注：店铺id
          userId:
            this.sender == "user" ? this.$userid : this.firstMessage.sendUserId, //类型：Number  必有字段  备注：用户id
          content: this.value, //类型：String  必有字段  备注：消息内容
          sender: this.sender
        })
          .then(data => {
            this.value = "";
            this.$refs.ipt.focus();
          })
          .then(() => {
            this.getCommentList();
          })
          .then(() => {
            this.sendBtnLoad = false;
          });
      },
      delMessage(item) {
        _getData("message/deleteChatRecord", {
          id: item.id
        }).then(data => {
          this.$message.success("删除成功");
          this.getCommentList();
        });
      },
      getCommentList() {
        this.isLoading = true;
        if (this.sender == "user") {
          _getData("message/beginChat", {
            storeId: this.$route.query.shopId
          })
            .then(data => {
              console.log("消息", data);
              this.commentData = data;
              if (!this.firstMessage) {
                this.firstMessage = data.firstMessage;
              }

              this.replyList = data.replyList;
            })
            .then(() => {
              this.isLoading = false;
            });
        } else {
          _getData("message/chatDetail", {
            id: this.$route.query.id, //类型：Number  必有字段  备
            storeId: this.$route.query.shopId
          })
            .then(data => {
              if (!this.firstMessage) {
                this.firstMessage = data.firstMessage;
              }

              this.replyList = data.replyList;
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      }
    },
    mounted() {
      console.log(this);
      if (this.sender == "user") {
        _getData("/store/homeStore", {
          storeId: this.$route.query.shopId
        })
          .then(data => {
            this.shopDetail = data;
          })
          .then(() => {
            this.shopIsLoading = false;
          });
      }
      this.getCommentList();
      this.$refs.ipt.focus();
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../../assets/scss/_commonScss";
  @import "../../../../../assets/scss/_input";
  .contact-service {
    // min-height: 693px;
    .head {
      background-color: #fff;
      padding: 4px 20px;
      margin-bottom: 10px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      .shopInfo {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div {
          display: flex;
          &.user_box > div {
            display: flex;
          }
          width: 100%;
          .img-box {
            height: 46px;
            width: 46px;
            border-radius: 46px;
            background: #f5f5f5;
            margin-right: 9px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            &.store {
              background: #cbcbcb;
            }
            .icon {
              height: 25px;
              width: 25px;
            }
            img {
              height: 100%;
              width: 100%;
            }
          }

          .right {
            h3 {
              font-size: 15px;
              color: #333333;
              font-weight: 600;
              line-height: 21px;
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              span {
                margin-left: 10px;
                font-size: 12px;
                color: #999999;
              }
            }
            p {
              line-height: 21px;
              font-size: 15px;
              color: #333333;
              width: 688px;
            }
            &.user {
              display: flex;
              align-items: center;
            }
          }
          &:last-child {
            border-bottom: 0;
          }
        }
        > span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 40px;
          background: rgba(245, 166, 35, 0.05);
          border: 1px solid #f5a623;
          border-radius: 20.5px;
          font-size: 15px;
          &:hover {
            opacity: 0.7;
          }
          font-weight: 600;
          cursor: pointer;
          a {
            color: #f5a623;
            text-decoration: none;
          }
        }
      }
    }
    .reply {
      background: #fff;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      margin-bottom: 48px;
      h2 {
        padding-left: 20px;
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #333333;
        border-bottom: 1px solid #dddddd;
      }
      .replay-content {
        height: 390px;
        overflow: auto;
        border-bottom: 1px solid #dddddd;
        background: #fafbfc;
        > div {
          height: 100%;
        }
        .no-data {
          height: 100%;
        }
        .loading {
          padding: 0 20px;
        }
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;

          background-color: #b5b1b1;
        }
        &::-webkit-scrollbar-track {
          background: #f6f6f6;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          background: #aaa;
          border-radius: 2px;
        }
        ul {
          display: flex;
          padding: 0 20px;
          display: flex;
          flex-direction: column;

          //padding-bottom: 50px;

          li {
            display: flex;
            justify-content: flex-start;
            padding: 24px 0;
            align-items: center;
            border-bottom: 0.5px solid #dddddd;
            cursor: pointer;
            .img-box {
              height: 46px;
              width: 46px;
              border-radius: 46px;
              background: #cbcbcb;
              margin-right: 9px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              .icon {
                height: 25px;
                width: 25px;
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
            .right {
              width: 835px;
              h3 {
                font-size: 15px;
                color: #333333;
                font-weight: 600;
                line-height: 21px;
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                span {
                  margin-left: 10px;
                  font-size: 12px;
                  color: #999999;
                }
              }
              p {
                line-height: 21px;
                font-size: 15px;
                color: #333333;
                width: 688px;
              }
            }
            /deep/ .ant-btn {
              background: #f5f5f5;
              border-radius: 15.5px;
              height: 30px;
              width: 75px;
              border: 0;
              font-size: 12px;
              color: #333333;
              border: #f5f5f5 1px solid;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 28px;
              display: none;
              .icon {
                margin-right: 3px;
              }
              &:hover {
                opacity: 0.7;
              }
              &::after {
                display: none;
              }
            }
            &:last-child {
              border-bottom: 0;
            }
            &:hover {
              /deep/ .ant-btn {
                display: flex;
              }
            }
          }
        }
      }

      .replay-container {
        position: relative;
        height: 170px;
        /deep/ .ant-input {
          height: 134px;

          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;

            background-color: #b5b1b1;
          }
          &::-webkit-scrollbar-track {
            background: #f6f6f6;
            border-radius: 2px;
          }
          &::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 2px;
          }
          border: 0;
          padding: 18px 20px;
          resize: none;
          font-size: 15px;
          color: #333;
          &:hover,
          &:focus {
            border: none !important;
            outline: none;
            box-shadow: none !important;
          }
        }
        button {
          position: absolute !important;
          width: 102px;
          height: 42px;
          background-image: linear-gradient(270deg, #ff4e1a 0%, #f10000 100%);
          border-radius: 4px;
          display: flex;
          padding: 0;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #fffefe;
          font-weight: 600;
          border: #fff;
          right: 20px;
          bottom: 17px;
          &[disabled] {
            opacity: 0.5;
            padding: 0;
          }
          &::after {
            display: none;
          }
        }
      }
    }
  }
</style>