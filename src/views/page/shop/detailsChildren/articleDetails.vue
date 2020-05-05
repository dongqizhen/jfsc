<template>
  <div class="article-details">
    <div class="left">
      <div v-if="!isLoading">
        <div class="article_box">
          <h2>
            {{ detail.topic }}
            <p>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconxinghaoliebiaoliulanliang"></use>
                </svg>
                {{ detail.hits }}
              </span>
              <span>{{ detail.createdOn }}</span>
            </p>
          </h2>

          <div class="introduce">
            <div
              class="content"
              v-html="convertStr"
              v-lazy-container="{
                selector: 'img'
              }"
            ></div>
            <ul>
              <li>标签字数</li>
              <li>标签字数</li>
              <li>最长显示多少再定</li>
            </ul>
            <share-menu-vue :data="detail"></share-menu-vue>
          </div>
        </div>
        <comment-vue
          :isLogin="$store.state.isLogin"
          :commentData="commentData"
          v-if="commentData"
          type="article"
        ></comment-vue>
        <menu-vue :item="detail" type="article"></menu-vue>
      </div>
      <loading v-else></loading>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import shareMenuVue from "../../../../components/common/share/shareMenu.vue";
  import commentVue from "../../../../components/common/comment/comment.vue";
  import menuVue from "../../../../components/common/share/menu.vue";
  import { _getData } from "../../../../config/getData";

  export default {
    metaInfo() {
      return {
        title: this.detail.topic + "-积分商城",
        meta: []
      };
    },
    data() {
      return {
        isLogin: true,
        isLoading: true,
        title: "",
        description: "",
        detail: {
          topic:
            "积分商城-全国领先的医疗设备、医疗器械、医疗备件、医疗配件交易平台"
        },
        commentData: ""
      };
    },
    components: {
      shareMenuVue,
      commentVue,
      menuVue
    },
    computed: {
      convertStr() {
        return this.detail.content.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          "<img data-src=$1 style='width:100%;height:auto' />"
          // /(?<=\<img [^>]*src=['"])([^'"]+)(?=[^>]*>)/gi,
          // '"data-src="$1'
        );
      }
    },
    methods: {
      async getCommentList(page = 1, pageSize = 20) {
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/learn!request.action`,
          {
            method: "getArticleCommentListV1",
            userid: this.$userid,
            token: "",
            params: {
              id: this.$route.query.id,
              currentPage: page,
              countPerPage: pageSize
            }
          }
        ).then(data => {
          this.commentData = data.result;
        });
      }
    },
    mounted() {
      //获取详情
      _getData(`${this.$API_URL.HYGPROURL}/server_pro/learn!request.action`, {
        method: "getArticleDetails",
        userid: this.$userid,
        token: "",
        params: { id: this.$route.query.id }
      })
        .then(data => {
          this.detail = data.result;
        })
        .then(() => {
          this.getCommentList().then(() => {
            this.isLoading = false;
          });
        });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .article-details {
    width: 100%;
  }
  .left {
    width: $content-left;
    background: $base-background;
    padding-bottom: 0;

    position: relative;
    .article_box {
      padding: 20px;
      padding-bottom: 0px;
      margin-bottom: 10px;
      background: #fff;
      box-shadow: $base-box-shadow;
      > h2 {
        font-size: 24px;
        color: #333333;
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        font-weight: bold;
        p {
          font-size: 14px;
          color: #999999;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 5px;
          font-weight: normal;
          span {
            display: flex;
            height: 20px;
            align-items: center;
            margin-right: 20px;
            &:first-child {
              justify-content: flex-start;
              .icon {
                margin-right: 5px;
                width: 15px;
                height: 10px;
              }
            }
          }
        }
      }

      .introduce {
        margin-top: 24px;
        .content {
          border-top: 1px solid #dddddd;
          padding-top: 24px;
          letter-spacing: 1px;
          font-size: 16px;
          color: #333333;
          line-height: 32px;

          /deep/ img[lazy="loading"] {
            /*your style here*/
            background: url("../../../../assets/images/loading.gif") no-repeat
              center;
            background-size: 200px;
            // background-color: #f7f9fa;
          }
          /deep/ img[lazy="error"] {
            /*your style here*/
            background: url("../../../../assets/images/loading.gif") no-repeat
              center;
            background-size: 200px;
            // background-color: #f7f9fa;
          }
        }
        > ul {
          display: flex;
          justify-content: flex-start;
          margin-top: 24px;
          margin-bottom: 24px;
          li {
            margin-right: 4px;
            height: 25px;
            padding: 0 10px;
            background: #f7f7f7;
            border-radius: 15px;

            font-size: 12px;
            color: #fb6441;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 25px;
          }
        }
        /deep/ .share {
          border-top: 0.5px solid #dddddd;
        }
      }
    }
    /deep/ .menu {
      position: absolute;
      left: -60px;
      top: 0;

      // justify-content: space-between;
    }
  }
  .right {
  }
</style>