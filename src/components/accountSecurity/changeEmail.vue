<template>
  <div class="commonEmail">
    <commonTitle title="账号安全">
      <div class="infoPath" slot="infoPath">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconxiangqianfan"></use>
        </svg>
        <span>更改邮箱</span>
      </div>
    </commonTitle>
    <div class="contentBox">
      <div class="common">
        <div class="left-box">{{ isNew ? "新邮箱账号" : "原邮箱账号" }}</div>
        <div class="right-box">
          <a-input placeholder="请输入邮箱账号"></a-input>
        </div>
      </div>
      <div class="common">
        <div class="left-box">验证码</div>
        <div class="right-box getCodeBox">
          <a-input placeholder="请输入验证码"></a-input>
          <div class="getCode">发送验证邮件</div>
        </div>
      </div>
      <div class="common btnBox">
        <div class="left-box"></div>
        <div class="right-box">
          <div class="btn submit" @click="sure">
            {{ isNew ? "完成" : "下一步" }}
          </div>
          <div class="btn cancel" @click="$router.go(-1)">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import commonTitle from "../common/merchantRightCommonTitle";
  export default {
    data() {
      return {
        isNew: false
      };
    },
    methods: {
      sure() {
        this.isNew = true;
      }
    },
    components: {
      commonTitle
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .commonEmail {
    padding: 0 20px;
    background-color: #fff;
    min-height: 693px;
    box-shadow: $base-box-shadow;
    /deep/ .common-title {
      .titleText {
        display: flex;

        .icon {
          width: 16px;
          height: 14px;
          margin: 0 3px;
        }
      }
    }
    .contentBox {
      margin-top: 24px;
      .common {
        display: flex;
        margin-bottom: 30px;
        align-items: center;
        .left-box {
          width: 90px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
        }
        .right-box {
          height: 34px;
          @include placeholderStyle();
          input {
            width: 389px;
          }
        }
        .getCodeBox {
          display: flex;
          input {
            width: 243px;
          }
          .getCode {
            text-align: center;
            width: 126px;
            margin-left: 20px;
            background: #f5f5f5;
            border-radius: 3px;
            font-size: 14px;
            color: #666666;
            height: 34px;
            line-height: 34px;
            cursor: pointer;
          }
        }
      }
      .btnBox {
        .right-box {
          display: flex;
          .btn {
            padding: 0 18px;
            height: 33px;
            line-height: 33px;
            margin-right: 15px;
            font-size: 14px;
            cursor: pointer;
          }
          .submit {
            background: #f5a623;
            border-radius: 3px;
            color: #fff;
          }
          .cancel {
            border: 1px solid #cccccc;
            border-radius: 3px;
          }
        }
      }
    }
  }
</style>


