<template>
  <!-- <div class="modal"> -->
  <!-- <a-button type="primary" @click="showModal">
      Open Modal with customized button props
    </a-button> -->
  <a-modal
    class="modal"
    :title="options.title"
    v-model="visible"
    @ok="handleOk"
    :afterClose="afterClose"
    :wrapClassName="options.wrapClassName"
    :maskClosable="options.maskClosable"
    :getContainer="options.getContainer"
    :destroyOnClose="options.destroyOnClose"
    :maskStyle="
      options.maskStyle || {
        'background-color': 'rgba(0, 0, 0, 0.17)'
      }
    "
    :footer="options.footer || null"
    :centered="options.centered || false"
  >
    <slot name="content"></slot>

    <div slot="footer"></div>
  </a-modal>
  <!-- </div> -->
</template>

<script>
  //!-----提示：父组件必须有visible属性-----
  export default {
    data() {
      return {
        visible: false
      };
    },
    props: {
      //是否显示
      isShow: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        default: () => ({
          title: "", //标题
          closable: true, //是否显示右上角的关闭按钮 Boolean
          maskClosable: true, //点击蒙层是否允许关闭 Boolean
          wrapClassName: "", //对话框外层容器的类名
          destroyOnClose: false, //关闭时销毁 Modal 里的子元素
          getContainer: () => document.body, //指定 Modal 挂载的 HTML 节点
          maskStyle: {
            "background-color": "rgba(0, 0, 0, 0.17)"
          }
        }),
        required: false
      }
    },

    methods: {
      handleOk(e) {
        console.log(this);
        this.visible = false;
        this.$parent.visible = false;
      },
      afterClose() {
        this.visible = false;
        this.$parent.visible = false;
        this.$emit("afterClose");
      }
    },
    mounted() {
      // console.log(this.options);
    },
    computed: {},
    watch: {
      isShow(newVal, oldval) {
        //console.log(newVal);
        this.visible = newVal;
      }
    }
  };
</script>

<style lang="scss">
  @import "../../assets/scss/_commonScss";
  body .ant-modal-mask {
    background: rgba(0, 0, 0, 0.17);
  }
  .ant-modal {
    border: 5px solid rgba(151, 151, 151, 0.16);
    padding-bottom: 0;
  }

  .ant-modal-wrap {
    .ant-modal-content {
      .ant-modal-close {
        height: 38px;
        width: 38px;
        .ant-modal-close-x {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            height: 15px;
            width: 15px;
          }
        }
      }
      .ant-modal-header {
        border-bottom: 0;
        padding: 0;
        height: 38px;
        background: #f6f6f6;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ant-modal-title {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #666666;
          padding-left: 20px;
        }
      }
      .ant-modal-footer {
        border-top: 0;
      }
    }
  }
  .commonBrand {
    .ant-modal {
      width: 873px !important;

      padding-bottom: 0;
      .ant-modal-header {
        margin-bottom: 15px;
      }
      .ant-modal-body {
        padding: 0 23px;
        h2 {
          height: 57px;
          display: flex;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #000000;
          justify-content: flex-start;
          align-items: center;
          line-height: 18px;
          font-weight: 500;
          span {
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #999999;
            margin-left: 8px;
            line-height: 15px;
            margin-top: 2px;
          }
        }
        .common {
          background: #f5f5f5;
          border-radius: 4px;
          padding: 0 20px;
          padding-top: 21.5px;
          display: flex;
          padding-right: 0;
          justify-content: flex-start;
          flex-wrap: wrap;
          //margin-right: -16px;
          min-height: 138px;
          &::-webkit-scrollbar {
            width: 2px;
            height: 2px;

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
          li {
            width: 97px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 16px;
            font-family: PingFangSC-Semibold;
            font-size: 13px;
            color: #333333;
            margin-bottom: 21.5px;
            position: relative;
            cursor: pointer;

            .img_box {
              background: #fff;
              width: 100%;
              height: 70px;
              margin-bottom: 6px;
              box-shadow: $base-box-shadow;
              img {
                height: 100%;
                width: 100%;
              }
            }
            i {
              position: absolute;
              right: -7px;
              top: -7px;
              cursor: pointer;
              .icon {
                height: 14px;
                width: 14px;
              }
            }
          }
        }
        .common_brand {
          margin-bottom: 24px;
          .list-group {
            ul {
              max-height: 260px;
              overflow: auto;
              &::-webkit-scrollbar {
                width: 2px;
                height: 2px;

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
              li {
                cursor: move;
              }
            }
          }
        }
        .all_brand {
          overflow: hidden;
          margin-bottom: 40px;
          .word_nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 28.5px;
            height: 28.5px;
            margin-bottom: 13px;
            > span {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 20px;
              width: 40px;
              border: 1px solid #333333;
              font-weight: 600;
              font-size: 12px;
              margin-right: 6px;
              cursor: pointer;
              &:hover {
                color: $theme-color;
              }
              &.active {
                color: $theme-color;
                background: rgba(241, 2, 21, 0.03);
                border: 0.5px solid $theme-color;
              }
            }
            ul {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex: 1;
              height: 100%;

              li {
                font-weight: 600;
                font-size: 12px;
                color: #666666;
                padding: 0 6.5px;
                cursor: pointer;
                height: 100%;
                line-height: 28.5px;
                &:hover {
                  color: $theme-color;
                }
                &.active {
                  color: $theme-color;
                }
              }
            }
            .inp_box {
              height: 28.5px;
              width: 181.5px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              background: #ffffff;
              border: 1px solid $theme-color;
              input {
                flex: 1;
                width: 122.5px;
                height: 100%;
                font-family: PingFangSC-Regular;
                font-size: 13px;
                //color: #999999;
                padding-left: 11.5px;
                color: #000;
              }
              span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 59px;
                height: 100%;
                cursor: pointer;
                background-image: linear-gradient(
                  90deg,
                  #ff4e1a 0%,
                  #f10000 100%
                );
                font-family: PingFangSC-Medium;
                font-size: 13px;
                color: #ffffff;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
          .common {
            height: 260px;
            overflow: auto;
            li {
              .img_box {
                position: relative;
                &::before {
                  content: "添加至\A常用品牌";
                  display: flex;
                  align-items: center;
                  white-space: pre;
                  height: 100%;
                  width: 100%;
                  background: #fdefd9;
                  text-align: center;
                  display: none;
                  font-family: PingFangSC-Semibold;
                  font-size: 12px;
                  color: #f5a623;
                  justify-content: center;
                  position: absolute;
                }
                &:hover {
                  &::before {
                    display: flex;
                  }
                }
              }
            }
          }
        }
        .ant-btn-primary {
          background: #f5a623;
          border-radius: 3px;
          width: 96.5px;
          height: 31px;
          border: 0;
          margin-bottom: 52px;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #ffffff;
          &:hover {
            opacity: 0.7;
          }
        }
        .flip-list-move {
          transition: transform 0.5s;
        }
        .no-move {
          transition: transform 0s;
        }
        .ghost {
          opacity: 0.5;
          // background: #c8ebfb;
          cursor: pointer;
          .img_box {
            &::before {
              display: none;
            }
          }
        }
        .sortable-chosen {
          .img_box {
            &::before {
              display: none;
            }
          }
        }
        .list-group {
          min-height: 20px;
        }
        .list-group-item {
          cursor: move;
        }
        .list-group-item i {
          cursor: pointer;
        }
      }
    }
  }
  %ant-modal {
    padding-bottom: 0;
    .ant-modal-content {
      .ant-modal-body {
        height: 226px;
        padding: 0;
        > div {
          display: flex;
          height: 100%;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          p {
            font-size: 20px;
            color: #333333;
            font-weight: 600;
            display: flex;
            height: 34px;
            justify-content: flex-start;
            align-items: center;
            line-height: 34px;
            margin-bottom: 40px;
            .icon {
              height: 28px;
              width: 28px;
              margin-right: 12px;
              margin-top: 2px;
            }
          }
          .btn {
            .ant-btn {
              height: 42px;
              // width: 115px;
              font-size: 16px;
              color: #666666;
              border: 1px solid #cccccc;
              border-radius: 3px;
              &:hover {
                opacity: 0.7;
              }
              &:first-child {
                margin-right: 12px;
                background: #f5a623;
                border: 1px #f5a623 solid;
                color: #ffffff;
              }
              &:last-child {
                &::after {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
  .success {
    .ant-modal {
      @extend %ant-modal;
    }
  }
  .submitSuccess {
    .ant-modal {
      width: 696px !important;
      height: 329px !important;
      @extend %ant-modal;
      .ant-modal-content {
        .ant-modal-body {
          height: 291px;
          > div {
            .alertContent {
              width: 420px;
              height: 44px;
              font-size: 16px;
              color: #333333;
              margin-bottom: 44px;
              text-align: center;
            }
          }
          .ant-btn {
            padding: 0 24px;
          }
        }
      }
    }
  }
  .lookPay {
    .ant-modal {
      max-width: 800px;
      padding-bottom: 0;
      .ant-modal-content {
        .ant-modal-body {
          padding: 0;
          > div {
            width: 100%;
          }
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .confirmDelivery {
    .ant-modal {
      width: 696px !important;
      height: 271px !important;
      padding-bottom: 0;
      .ant-modal-content {
        .ant-modal-body {
          height: 233px;
          padding: 0;
          > div {
            padding-left: 44px;
            padding-top: 4px;
            .common {
              display: flex;
              align-items: center;
              margin-top: 20px;
              .left-box {
                font-size: 12px;
                color: #666666;
                margin-right: 24px;
              }
              .right-box {
                .ant-input {
                  width: 240px;
                  height: 31px;
                }
                /deep/.ant-input:hover {
                  border-color: $theme-color;
                }

                /deep/.ant-input:focus {
                  border-color: $theme-color;
                  box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
                }
              }
            }
            .btn {
              display: flex;
              align-items: center;
              margin-top: 30px;
              .ant-btn {
                background-color: #fff;
                border-color: #ccc;
                color: #666;
                box-shadow: none;
                width: 70px;
                font-size: 12px;
                &:first-child {
                  width: 96px;
                  margin-left: 73px;
                  margin-right: 10px;
                  background: #f5a623;
                  border-color: #f5a623;
                  color: #fff;
                }
                &:hover {
                  opacity: 0.7;
                }
              }
            }
          }
          .emailAddress {
            padding-top: 20px;
            .common {
              margin-bottom: 40px;
            }
          }
        }
      }
    }
  }
  .addAddress {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding-left: 44px;
      }
    }
    .alertContent {
      .common {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .left-box {
          width: 73px;
          font-size: 12px;
          color: #666666;
        }
        .right-box {
          display: flex;
          .ant-input {
            width: 240px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #333;
          }
          /deep/.ant-input:hover {
            border-color: $theme-color;
          }

          /deep/.ant-input:focus {
            border-color: $theme-color;
            box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
          }
          .testTrue {
            font-size: 12px;
            color: #f11f1f;
            margin-left: 14px;
            height: 30px;
            line-height: 30px;
            i {
              font-style: normal;
              margin-right: 5px;
            }
          }
        }
        .select-area {
          font-size: 14px;
          color: #999999;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          border: $border-style;
          border-radius: 4px;
          width: 240px;
          padding-left: 10px;
          height: 30px;
          > span {
            font-size: 12px;
            color: #333333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            width: 100%;
            padding-right: 9px;
            span.space {
              color: #ccc;
            }
            .area {
              height: 24px;
              width: 18px;
              margin-right: 6px;
            }
            .icon:not(.area) {
              width: 13px;
              height: 7px;
              margin-left: 3px;
              transition: all 0.3s;
              &.active {
                transform: rotate(180deg);
              }
            }
          }
          .area-container {
            position: absolute;
            background: #fff;
            box-shadow: $base-box-shadow;
            padding: 18px 20px;
            width: 785px;
            top: 40px;
            left: -118px;
            z-index: 100;
            opacity: 1;
            h2 {
              border-bottom: 1px solid #dddddd;
              display: flex;
              justify-content: flex-start;
              span {
                display: flex;
                width: 126px;
                height: 38px;
                font-weight: 600;
                font-size: 15px;

                align-items: center;
                justify-content: center;
                color: #333333;
                &.active {
                  background: #019ddd;
                  color: #ffffff;
                }
              }
            }
            i {
              display: flex;
              position: absolute;
              top: -6px;
              width: 0px;
              left: 200px;
              margin-left: -5.5px;
              height: 0px;

              border-left: 25px solid transparent;
              border-right: 25px solid transparent;

              border-bottom: 12px solid #fff;
            }
            ul {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              padding-top: 20px;
              li {
                width: 25%;
                display: flex;
                justify-content: center;
                line-height: 36px;
                cursor: pointer;
                &:hover {
                  color: #019ddd;
                }
              }
            }
          }
          .slide-fade-enter-active {
            transition: all 0.3s ease;
          }
          .slide-fade-leave-active {
            transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
          }
          .slide-fade-enter,
          .slide-fade-leave-to {
            transform: translateY(10px);
            opacity: 0;
          }
        }
      }
    }
    .btn {
      display: flex;
      align-items: center;
      .ant-btn {
        background-color: #fff;
        border-color: #ccc;
        color: #666;
        box-shadow: none;
        width: 70px;
        font-size: 12px;
        &:first-child {
          width: 96px;
          margin-left: 73px;
          margin-right: 10px;
          background: #f5a623;
          border-color: #f5a623;
          color: #fff;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .editQuote {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding-left: 44px;
      }
      .alertContent {
        .common {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .left-box {
            width: 73px;
            font-size: 12px;
            color: #666666;
          }
          .right-box {
            display: flex;
            align-items: center;
            .ant-input {
              width: 240px;
              height: 30px;
              line-height: 30px;
              font-size: 12px;
              color: #333;
              &:hover {
                border-color: $theme-color;
              }
              &:focus {
                border-color: $theme-color;
                box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
              }
            }
            .textArea {
              height: 94px;
              line-height: 22px;
              resize: none;
            }
            .warning {
              color: $theme-color;
              margin-left: 10px;
            }
          }
        }
        .remark {
          align-items: flex-start;
        }
      }
      .btn {
        .ant-btn {
          background-color: #fff;
          border-color: #ccc;
          color: #666;
          box-shadow: none;
          width: 70px;
          font-size: 12px;
          &:first-child {
            width: 96px;
            margin-left: 73px;
            margin-right: 10px;
            background: #f5a623;
            border-color: #f5a623;
            color: #fff;
          }
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
  .submitComment {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding: 0;
        padding-bottom: 28px;
      }
      .btn {
        .ant-btn {
          &:first-child {
            background: #f5a623;
            border-radius: 3px;
            font-size: 12px;
            color: #ffffff;
            font-weight: 600;
            border: 1px solid #f5a623;
            margin-left: 131px;
            margin-right: 7px;
            margin-top: 24px;
          }
        }
      }
    }
  }
  .submitPay {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding-top: 40px;
      }
      .alertContent {
        display: flex;
        justify-content: center;
        margin-bottom: 11px;
        /deep/.uploadImg {
          width: 142px;
          height: 142px;
          .avatar-uploader {
            width: 100%;
            height: 100%;
            .ant-upload {
              &.ant-upload-select-picture-card {
                width: 142px;
                height: 142px;
                .icon {
                  width: 24px;
                  height: 24px;
                  margin-bottom: 15px;
                }
                .ant-upload-text {
                  font-size: 15px;
                }
                .uploadPreview {
                  width: 142px;
                  height: 142px;
                }
              }
            }
          }
        }
      }
      p {
        display: flex;
        justify-content: center;
        font-size: 13px;
        color: #cccccc;
        margin-bottom: 46px;
      }
      .btn {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
        .ant-btn {
          width: 115px;
          font-size: 15px;
          border-radius: 3px;
          height: 42px;
          &:first-child {
            background: #f5a623;
            color: #ffffff;
            font-weight: 600;
            border: 1px solid #f5a623;
            margin-right: 12px;
          }
          &:last-child {
            color: #666;
            border: 1px solid #ddd;
          }
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
  .deleteOrder {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding-top: 40px;
      }
      .alertContent {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #333333;
        font-weight: 600;
        margin-bottom: 40px;
        .icon {
          width: 33.5px;
          height: 33.5px;
          margin-right: 13px;
        }
      }

      .btn {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
        .ant-btn {
          width: 115px;
          font-size: 15px;
          border-radius: 3px;
          height: 42px;
          &:first-child {
            background: #f10215;
            color: #ffffff;
            font-weight: 600;
            border: 1px solid #f10215;
            margin-right: 12px;
          }
          &:last-child {
            color: #666;
            border: 1px solid #ddd;
          }
        }
      }
    }
  }
  .confirmReceipt {
    .ant-modal {
      width: 696px !important;
      .ant-modal-body {
        padding-top: 40px;
      }
      .alertContent {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #333333;
        font-weight: 600;
        margin-bottom: 40px;
      }

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        .ant-btn {
          width: 115px;
          font-size: 15px;
          border-radius: 3px;
          height: 42px;
          &:first-child {
            background: #f5a623;
            color: #ffffff;
            font-weight: 600;
            border: 1px solid #f5a623;
            margin-right: 12px;
          }
          &:last-child {
            color: #666;
            border: 1px solid #ddd;
          }
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
</style>
