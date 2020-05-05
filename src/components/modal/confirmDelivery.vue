<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="orderInfo">
          <div class="common">
            <div class="left-box">
              快递公司
            </div>
            <div class="right-box">
              <a-input
                placeholder="请输入快递公司"
                v-model.trim="courierCompany"
                ref="courierCompany"
              ></a-input>
            </div>
          </div>
          <div class="common">
            <div class="left-box">
              快递单号
            </div>
            <div class="right-box">
              <a-input
                placeholder="请输入快递单号"
                v-model.trim="courierNumber"
                ref="courierNumber"
              ></a-input>
            </div>
          </div>
        </div>
        <div class="btn">
          <a-button :loading="loading" @click="sureOrder">确认发货</a-button>
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

  export default {
    data() {
      return {
        loading: false,
        courierCompany: "",
        courierNumber: "",
        visible: false,
        options: {
          title: "填写快递单号",
          closable: true,
          maskClosable: false,
          wrapClassName: "confirmDelivery",
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
        type: Number
      }
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
      sureOrder() {
        if (!this.courierCompany) {
          this.$message.warning("请输入快递公司");
          this.$refs.courierCompany.focus();
          return;
        }
        if (!this.courierNumber) {
          this.$message.warining("请输入快递单号");
          this.$refs.courierNumber.focus();
          return;
        }
        this.loading = true;
        _getData("/order/affirmOrder", {
          orderId: this.orderId,
          shippingName: this.courierCompany,
          shippingNo: this.courierNumber
        }).then(data => {
          console.log(data);
          this.loading = false;
          if (data.code != 500) {
            if (this.$route.name == "订单详情") {
              this.$router.replace({
                path: "/merchant/orderManage",
                query: { keyId: "7", status: 3 }
              });
            } else {
              this.$emit("returnValue", 3); //3表示已发货，进入待收货状态
            }
            this.visible = false;
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
          this.$parent.sureVisible = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>