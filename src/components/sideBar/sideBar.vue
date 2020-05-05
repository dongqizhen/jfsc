<template>
  <div id="components-back-top-demo-custom" class="sidebar">
    <a-back-top>
      <div class="back-top-inner">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconhuidingbu1"></use>
        </svg>
      </div>
    </a-back-top>
  </div>
</template>

<script>
  import modalVue from "../modal/modal.vue";
  import { _getData } from "../../config/getData";

  export default {
    data() {
      return {
        value: "",
        visible: false,
        loading: false,
        options: {
          title: "意见反馈",
          wrapClassName: "suggestions",
          getContainer: () =>
            document.getElementById("components-back-top-demo-custom")
        }
      };
    },
    components: { modalVue },
    methods: {
      handlerClick() {
        this.visible = !this.visible;
      },
      saveSuggestions() {
        this.loading = true;
        _getData("feedback/save", { content: this.value })
          .then(data => {
            console.log(data);
            if (data.code != 500 || data.code != 1) {
              this.value = "";
              this.visible = !this.visible;
              this.$message.success("提交成功，感谢您对积分商城的支持！");
            }
          })
          .then(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";
  .sidebar {
    height: 102px;
    width: 48px;
    position: fixed;
    right: 50px;
    bottom: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 9999;
    //background: red;
    /deep/ .ant-back-top {
      position: static;
      width: 100%;
      height: 47px;
      .back-top-inner {
        height: 100%;
        width: 100%;
        // background: rgba(241, 2, 21, 0.22);
        opacity: 0.22;
        .icon {
          height: 100%;
          width: 100%;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
    .online_server {
      width: 100%;
      height: 47px;
      position: absolute;
      bottom: 0;
      opacity: 0.22;
      font-family: PingFangSC-Medium;
      font-size: 13px;
      color: #ffffff;
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon {
        height: 100%;
        width: 100%;
      }
      &:hover {
        opacity: 1;
      }
    }
    /deep/ .ant-modal-mask {
      // z-index: 9999;
    }
    /deep/ .suggestions {
      z-index: 9999;
      .modal {
        z-index: 9999;
        width: 696px !important;
        .ant-modal-content {
          width: 686px;
          height: 447px;
          z-index: 9999;
          .ant-modal-body {
            padding: 0 34px;
            h2 {
              height: 80px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #333333;
              font-weight: 600;
            }
            /deep/ .ant-input {
              // margin: 0 34px;
              height: 134px;
              height: 202px;
              border: 1px solid #bfc2cc;
              border-radius: 4px;
              background: #fafafa;
              padding: 12px 14px;
              resize: none;
              font-size: 15px;
              color: #333;
              &::-webkit-scrollbar {
                width: 5px;
                height: 5px;

                background-color: #b5b1b1;
              }
              &::-webkit-scrollbar-track {
                background: #f6f6f6;
                border-radius: 2px;
              }
              &::-webkit-scrollbar-thumb {
                background: #aaa;
                border-radius: 2px;
              }

              &:hover,
              &:focus {
                // border: none !important;
                outline: none;
                box-shadow: none !important;
              }
            }
            .btn {
              margin-top: 42px;
              display: flex;
              align-items: center;
              justify-content: center;

              /deep/ .ant-btn {
                height: 42px;
                width: 115px;
                font-size: 18px;
                border-radius: 3px;
                &:hover {
                  opacity: 0.7;
                }
                &:first-child {
                  font-weight: 600;
                  color: #ffffff;
                  background: #f5a623;
                  margin-right: 12px;
                  border-color: #f5a623;
                  padding-left: 15px;
                  &[disabled] {
                    opacity: 0.5;
                  }
                }
                &:last-child {
                  color: #666666;
                  border: 1px solid #cccccc;
                  border-color: #cccccc;
                }
              }
            }
          }
        }
      }
    }
  }
</style>