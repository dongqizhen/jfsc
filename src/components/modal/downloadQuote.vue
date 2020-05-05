<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="orderInfo emailAddress">
          <div class="common">
            <div class="left-box">
              邮箱地址
            </div>
            <div class="right-box">
              <a-input
                ref="email"
                placeholder="请输入邮箱"
                v-model="email"
              ></a-input>
            </div>
          </div>
        </div>
        <div class="btn">
          <a-button type="primary" @click="sureOrder" :loading="loading"
            >确认下载</a-button
          >
          <a-button type="primary" @click="visible = false">取消</a-button>
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
          <a-button type="primary" @click="toLogin">去登录</a-button>
          <a-button type="primary" @click="visible = false">取消</a-button>
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
        email: "",
        loading: false,
        visible: false,
        options: {
          title: "填写邮箱地址",
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
      quoteId: {
        type: [String, Number]
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
        this.loading = true;
        if (!this.email) {
          this.loading = false;
          this.$message.warning("请输入邮箱", 1);
          this.$refs.email.focus();
          return;
        } else {
          if (
            !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
              this.email
            )
          ) {
            this.loading = false;
            this.$message.warning("请输入正确的邮箱", 1);
            this.$refs.email.focus();
            return;
          }
        }
        _getData("/quotation/queryProjectInfoBySchemeId", {
          id: this.quoteId,
          toAddress: this.email
        }).then(data => {
          console.log(data);
          this.loading = false;
          if (data.code != 500) {
            this.$message.success("邮件发送成功，请查收！", 1);
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
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>