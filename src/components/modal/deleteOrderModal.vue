<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icondingdanshanchu"></use>
          </svg>
          {{ deleteObj.isOrder ? "订单" : "" }}删除后无法恢复
        </div>
        <div class="btn">
          <a-button @click="sure">确定删除</a-button>
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
        visible: false,
        options: {
          title: "提示",
          closable: true,
          maskClosable: false,
          wrapClassName: "deleteOrder",
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
      deleteObj: {
        type: Object
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
        if (this.deleteObj.isOrder) {
          console.log(this.deleteObj.deleteId);
          _getData("/order/deleteOrder", {
            ids: this.deleteObj.deleteId,
            flag: this.deleteObj.isMerchant ? "shop" : "user"
          }).then(data => {
            console.log(data);
            this.$message.success("订单删除成功", 1);
            this.visible = false;
          });
        } else {
          _getData(
            `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
            {
              method: "deleteUserAddressList",
              userid: this.userInfo.id,
              token: "",
              params: { userAddressList: [this.deleteObj.deleteId] }
            }
          ).then(data => {
            console.log(data);
            this.visible = false;
          });
        }
      }
    },
    watch: {
      Visible(newVal) {
        this.visible = newVal;
      },
      visible(newVal) {
        // console.log(newVal);
        // console.log(this.$parent);
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