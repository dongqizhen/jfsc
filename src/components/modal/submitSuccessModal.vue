<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">{{ contentText }}</div>
        <div class="btn">
          <a-button type="primary" :loading="loading" @click="sureSubmit">
            确定重新认证
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
  import { mapMutations } from "vuex";
  export default {
    data() {
      return {
        loading: false,
        visible: false,
        options: {
          title: "提示",
          closable: true,
          maskClosable: false,
          wrapClassName: "submitSuccess",
          centered: false
        },
        contentText:
          "提交信息后将重新认证，您将进入认证中状态，不能进行产品的发布，订单的修改等操作，您确定要进行重新认证吗？"
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
      submitData: {
        type: Object
      }
    },
    components: {
      modal
    },
    methods: {
      ...mapMutations(["changeUserShopInfoState"]),
      sureSubmit() {
        console.log(this.submitData);
        this.loading = true;
        if (this.submitData.mobile) {
          _getData("/store/updateShopCertification", this.submitData)
            .then(data => {
              console.log(data);
              this.loading = false;
            })
            .then(() => {
              this.getUserShopInfo();
            });
        } else {
          _getData("/store/insertOrUpdateStore", this.submitData).then(data => {
            console.log(data);
            this.loading = false;
            if (data.code == 1) {
              this.$parent.shopNameFlag = true;
              this.$parent.shopNameWarnMessage = data.msg;
              this.$parent.$refs.shopName.focus();
              this.visible = false;
              return;
            } else {
              this.getUserShopInfo();
            }
          });
        }
      },
      getUserShopInfo() {
        this.loading = true;
        _getData("/user/getUser", {})
          .then(data => {
            console.log("获取用户的店铺开店信息：", data);
            this.changeUserShopInfoState(data);
          })
          .then(() => {
            this.loading = false;
            this.$message.success("提交修改成功，请耐心等待审核!");
            this.visible = false;
            this.$router.replace({
              path: "/merchant/openShop",
              query: { keyId: "0", shopStatus: 1 }
            });
          });
      },
      toLogin() {
        const { href } = this.$router.resolve({
          path: "/login"
        });
        this.visible = false;
        window.open(href, "_blank");
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