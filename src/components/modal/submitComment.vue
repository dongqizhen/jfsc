<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">
          <product-item-comment
            v-for="item in data"
            :key="item.id"
            :data="item"
            ref="commentInfo"
          ></product-item-comment>
        </div>
        <div class="btn">
          <a-button @click="submitComment">提交评价</a-button>
        </div>
      </div>
      <div slot="content" v-else>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconweidenglugantanhao"></use>
          </svg>
          你还没登录
        </p>
        <div class="btn">
          <a-button @click="toLogin">去登录</a-button>
          <a-button @click="visible = false">取消</a-button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import modal from "./modal.vue";
  import productItemComment from "../common/comment/productItemComment";
  import { _getData } from "../../config/getData";
  export default {
    data() {
      return {
        visible: false,
        options: {
          title: "评价",
          closable: true,
          maskClosable: false,
          wrapClassName: "submitComment",
          centered: false
        }
      };
    },
    props: {
      Visible: {
        type: Boolean,
        default: false,
        required: true
      },
      type: {
        type: String,
        required: false
      },
      title: {
        type: String,
        default: "提交成功",
        required: false
      },
      data: {
        type: Array
      }
    },
    components: {
      modal,
      productItemComment
    },
    methods: {
      toLogin() {
        const { href } = this.$router.resolve({
          path: "/login"
        });
        this.visible = false;
        window.open(href, "_blank");
      },
      submitComment() {
        console.log(this.$refs.commentInfo);
        const commentList = [];
        _.map(this.$refs.commentInfo, val => {
          let obj = {};
          obj.typeId = 0;
          obj.valueId = val.productId;
          let imagesList = [];
          _.map(val.uploadList, o => {
            imagesList.push(o.url);
          });
          obj.imagesList = imagesList;
          obj.performance = val.submitData.performance;
          obj.content = val.submitData.content;
          obj.quality = val.submitData.quality;
          obj.aftersale = val.submitData.aftersale;
          obj.train = val.submitData.train;
          commentList.push(obj);
        });
        // console.log(commentList);
        _getData("/comment/comment", { commentList: commentList }).then(data => {
          // console.log("评价是否成功：", data);
          alert("评论成功");
          this.visible = false;
        });
      }
    },
    watch: {
      Visible(newVal) {
        this.visible = newVal;
      },
      visible(newVal) {
        if (!newVal) {
          this.$parent.visible = false;
          this.$parent.payVisible = false;
          this.$parent.sureVisible = false;
          this.$parent.commentVisible = false;
          this.$parent.deleteVisible = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>