<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">
          <upload v-on:getVal="getImgUrl"></upload>
        </div>
        <p><!-- 支持格式：jpg/png --></p>
        <div class="btn">
          <a-button @click="sure">确定</a-button>
          <a-button @click="cancel">取消</a-button>
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
  import upload from "../common/upload";
  import { _getData } from "../../config/getData";
  export default {
    data() {
      return {
        visible: false,
        options: {
          title: "上传支付证明",
          closable: true,
          maskClosable: false,
          wrapClassName: "submitPay",
          centered: false
        },
        submitData: {
          imgUrl: ""
        },
        success: false
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
      orderId: {
        type: [String, Number],
        required: true
      }
    },
    components: {
      modal,
      upload
    },
    methods: {
      toLogin() {
        const { href } = this.$router.resolve({
          path: "/login"
        });
        this.visible = false;
        window.open(href, "_blank");
      },
      getImgUrl(val) {
        console.log(val);
        this.submitData.imgUrl = val[0];
      },
      sure() {
        //上传后台接口
        if (this.submitData.imgUrl == "") {
          this.$message.warning("请先添加图片", 1);
          return;
        }
        _getData("/order/addPayProve", {
          orderId: this.orderId,
          payProve: this.submitData.imgUrl
        }).then(data => {
          console.log("上传支付证明成功：：：", data);
          this.$message.success("上传支付证明成功", 1);
          this.visible = false;
          this.success = true;
        });
      },
      cancel() {
        this.visible = false;
        this.success = false;
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
          if (this.success) {
            console.log(this.$parent);
            this.$parent.data.isPayProve = 1;
            this.$parent.data.payProve = this.submitData.imgUrl;
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>