<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive" />
      <!-- <modal-vue :isShow="visible" :options="options"></modal-vue> -->
    </div>
  </a-locale-provider>
</template>
<script>
  import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
  import modalVue from "./components/modal/modal.vue";
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "./config/getData";
  export default {
    provide() {
      return { reload: this.reload };
    },
    data() {
      return {
        locale: zhCN,
        visible: false,
        options: {
          title: "提示"
        },
        isRouterAlive: true
      };
    },
    components: { modalVue },
    mounted() {
      // this.visible = true;
      //this.showNote();
      console.log(window.history);
      console.log(this.$API_URL);
      _getData("/user/getUser", {}).then(data => {
        console.log("获取用户的店铺信息：：：：：", data);
        if (data && data.code != 500 && data.code != 1) {
          this.changeUserShopInfoState(data);
        }
      });
    },
    methods: {
      ...mapMutations([
        "changeLoginState",
        "changeUserInfoState",
        "changeUserShopInfoState"
      ]),
      async showNote() {
        this.visible = true;
        this.changeLoginState(false);
        this.changeUserInfoState({});
        this.changeUserShopInfoState({});
        window.clearVuexAlong();
        this.$notification.warn({
          message: "提示",
          description: "账号在别处登录，请您重新登录",
          onClose: () => {
            this.$router.push("/login");
          }
        });
      },
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function() {
          this.isRouterAlive = true;
        });
      }
    }
  };
</script>
<style lang="scss">
  ::-webkit-input-placeholder {
    color: #b2b2b2;
  }

  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #b2b2b2;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #b2b2b2;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #b2b2b2;
  }

  p {
    margin-bottom: 0;
  }
  ol,
  ul,
  li {
    margin-bottom: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0;
  }
  #app {
    height: 100%;
  }
  a {
    text-decoration: none !important;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .commonWidth {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
  }
  .container {
    padding-bottom: 110px;
    background: #f7f9fa;
  }
  .el-picker-panel {
    .el-date-table {
      td.today {
        span {
          color: #f10215;
        }
      }
      td.start-date,
      td.end-date {
        span {
          background-color: #f10215;
        }
      }
    }
  }
  .ant-select-dropdown-menu-item:hover {
    background-color: #fafafa;
  }
  .ant-select-dropdown-menu-item-active {
    background-color: #fff;
  }
  .el-select,
  .el-cascader {
    height: 33px;
    line-height: 33px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
        padding-left: 10px;
        color: #333;
        font-size: 14px;
        border: 1px solid #ccc;
        &:focus {
          border-color: #f10215;
          box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
        }
        &:hover {
          border-color: #f10215;
        }
      }
      .el-input__suffix {
        .el-input__suffix-inner {
          height: 12px;
          .el-input__icon {
            line-height: 33px;
          }
        }
      }
    }
    .el-cascader__label {
      padding-left: 13px;
    }
  }
  .el-select-dropdown__item {
    &.selected {
      color: #f10215;
    }
  }
  .el-cascader-menu {
    .el-cascader-menu__item {
      &.is-active {
        color: #f10215;
      }
    }
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #f10215;
    border-color: #f10215;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #f10215 !important;
  }
  .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #f10215;
  }
  .ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #f10215;
    outline: 0;
    -webkit-box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
    box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
    border-right-width: 1px !important;
  }
  .ant-calendar-range .ant-calendar-in-range-cell:before {
    background: rgba(241, 2, 21, 0.05);
  }
  .ant-calendar-today .ant-calendar-date {
    border-color: #f10215;
    color: #f10215;
  }
  .ant-calendar-selected-day .ant-calendar-date {
    background-color: #fff;
  }
  .ant-calendar-selected-date .ant-calendar-date,
  .ant-calendar-selected-start-date .ant-calendar-date,
  .ant-calendar-selected-end-date .ant-calendar-date {
    background: #f10215;
    color: #fff;
  }
  .ant-calendar-cell {
    .ant-calendar-date {
      &:hover {
        background: #f10215;
        color: #fff;
      }
    }
  }
  .ant-calendar-footer-btn .ant-calendar-today-btn {
    color: #f10215;
  }
</style>
