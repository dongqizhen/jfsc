<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">
          您是否已经收到该订单？
        </div>
        <div class="btn">
          <a-button type="primary" :loading="loading" @click="sure">
            确认收货
          </a-button>
          <a-button @click="visible = false">取消</a-button>
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
  import { _getData } from "../../config/getData";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        loading: false,
        visible: false,
        options: {
          title: "提示",
          closable: true,
          maskClosable: false,
          wrapClassName: "confirmReceipt",
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
      orderId: {
        type: [String, Number]
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    components: {
      modal
    },
    methods: {
      toLogin() {
        const { href } = this.$router.resolve({
          path: "/login"
        });
        this.visible = false;
        window.open(href, "_blank");
      },
      sure() {
        this.loading = true;
        _getData("/order/updateOrderStatus", {
          orderId: this.orderId,
          orderStatus: "affirm"
        }).then(data => {
          console.log(data);
          this.loading = false;
          if (data.code != 500) {
            this.visible = false;
            if (this.$route.name == "我的订单详情") {
              this.$router.replace({
                path: "/userCenter/myOrder",
                query: { keyId: "3", status: 4 }
              });
            } else {
              this.$emit("returnValue", 4); //4表示已经收货，进入待评价状态
            }
          }
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
          this.$parent.confirmVisible = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>