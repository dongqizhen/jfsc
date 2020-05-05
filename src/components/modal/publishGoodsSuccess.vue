<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <p>
          <svg class="icon" aria-hidden="true">
            <use
              v-if="type != 'login'"
              xlink:href="#iconzhanghaoanquanduigou"
            ></use>
            <use v-else xlink:href="#iconweidenglugantanhao"></use>
          </svg>
          {{ title }}
        </p>
        <div class="btn">
          <a-button @click="toEnquiry">
            查看已{{ title == "产品发布成功" ? "发布" : "保存" }}产品
          </a-button>
          <a-button @click="visible = false" v-show="title == '产品发布成功'"
            >继续发布
          </a-button>
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

  export default {
    data() {
      return {
        visible: false,
        options: {
          title: "提示",
          closable: true,
          maskClosable: false,
          wrapClassName: "success",
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
        default: "产品发布成功",
        required: false
      }
    },
    components: {
      modal
    },
    methods: {
      toLogin() {
        this.visible = false;
        this.$router.push({
          path: "/login"
        });
      },
      //去产品管理
      toEnquiry() {
        this.$router.replace({
          path: "/merchant/productManage",
          query: { keyId: "5" }
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