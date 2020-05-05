<template>
  <div class="forget-password">
    <h2>忘记密码</h2>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item
        :validate-status="Error('phone1') ? 'error' : ''"
        :help="Error('phone1') || ''"
      >
        <transition name="slide-fade">
          <span v-if="phone1_success" class="extra">
            <svg v-if="!phone1isRegister" class="icon" aria-hidden="true">
              <use xlink:href="#iconzhengque"></use>
            </svg>
            <span v-else>
              用户未注册
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconxingzhuang2"></use>
              </svg>
            </span>
          </span>
        </transition>
        <a-input
          placeholder="请输入手机号"
          maxlength="11"
          autocomplete="off"
          v-decorator="[
            'phone1',
            {
              rules: [
                {
                  required: true,
                  message: '请输入手机号'
                },
                {
                  pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                  message: '请输入正确的手机号'
                }
              ],
              validateTrigger: 'change'
            }
          ]"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :validate-status="Error('password') ? 'error' : ''"
        :help="Error('password') || ''"
      >
        <a-input
          placeholder="请输入新密码，长度不少于6位"
          type="password"
          autocomplete="off"
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: '请输入密码'
                },
                {
                  pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
                  message: '由字母和数字组成，长度不少于6位'
                }
              ]
            }
          ]"
        >
          <!-- <span slot="suffix">获取验证码</span> -->
        </a-input>
      </a-form-item>
      <a-form-item
        :validate-status="Error('seccode') ? 'error' : ''"
        :help="Error('seccode') || ''"
      >
        <transition name="slide-fade">
          <span v-if="seccode_err" class="extra seccode">
            验证码错误
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconxingzhuang2"></use>
            </svg>
          </span>
        </transition>
        <a-input
          placeholder="请输入验证码"
          maxlength="6"
          autocomplete="off"
          @change="seccodeChange"
          v-decorator="[
            'seccode',
            {
              rules: [
                {
                  required: true,
                  message: '请输入验证码'
                }
              ]
            }
          ]"
        >
          <span slot="suffix" @click="gainCodeHandler(2)">{{ content }}</span>
        </a-input>
      </a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        class="login-form-button"
        :disabled="hasErrors(form.getFieldsError())"
        :loading="iconLoading"
      >
        确定
      </a-button>
    </a-form>
  </div>
</template>

<script>
  import { timer, FormValidator } from "../../../../components/mixin/mixin";
  import { _getData } from "../../../../config/getData";

  export default {
    data() {
      return {
        iconLoading: false
      };
    },
    mixins: [timer, FormValidator],
    methods: {
      callback() {},
      handleSubmit(e) {
        e.preventDefault();
        this.iconLoading = true;
        let { phone1, seccode, password } = this.form.getFieldsValue();

        _getData(`${this.$API_URL.HYGLOGINURL}/server/user!request.action`, {
          method: "findPassword",
          userid: "",
          token: "",
          params: {
            accountNo: phone1,
            password: password,
            code: seccode
          }
        })
          .then(data => {
            setTimeout(() => {
              this.iconLoading = false;
            }, 300);
            this.$message.success("密码已重置", 1);
          })
          .then(() => {
            this.$router.go(-1);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }
  .forget-password {
    width: 100%;
    height: 100%;
    padding: 0 71px;
    padding-top: 85px;
    > h2 {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #333333;
      margin-bottom: 34px;
    }
    /deep/ .ant-form {
      .ant-row {
        margin-bottom: 40px;
        &:last-child {
          margin-bottom: 20px;
        }

        .ant-form-item-control-wrapper {
          .ant-form-item-control {
            position: relative;
            .ant-form-explain {
              height: 30px;
              position: absolute;
              right: 0;
              top: 1px;
              display: flex;
              align-items: center;
              pointer-events: none;
              font-size: 14px;
              color: #f11f1f;
            }
            .ant-form-item-children {
              height: 30px;
              align-items: center;
              display: flex;
              input::-webkit-input-placeholder {
                color: #ccc;
                font-size: 15px !important;
                //line-height: 30px;
                line-height: normal;
              }
              input {
                border: none;
                padding-left: 0;
                border-bottom: 1px solid #cccccc;
                border-radius: 0;
                // height: 30px;
                color: #333333;
                font-size: 18px;
                padding: 0;
                line-height: 30px;
                display: flex;
                align-items: center;
                &:focus {
                  box-shadow: none;
                }
              }
              .ant-input-suffix {
                right: 0;
                cursor: pointer;
                font-size: 13px;
                color: #999999;
              }
            }
            .extra {
              position: absolute;
              right: 0;
              top: -5px;
              opacity: 1;
              z-index: 100;
              color: #f11f1f;
              font-size: 14px;
              &.seccode,
              &.password_err {
                top: -26px;
                color: #f11f1f;
                font-size: 14px;
              }
              &.password_err {
                top: -5px;
              }
              .icon {
                width: 15px;
                height: 15px;
              }
            }
            .slide-fade-enter-active {
              transition: all 0.4s ease;
            }
            .slide-fade-leave-active {
              transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
            }
            .slide-fade-enter,
            .slide-fade-leave-to {
              transform: translateY(10px);
              opacity: 0;
            }
            .ant-form-explain {
              padding-right: 18px;
              background: url("../../../../assets/images/err.svg") no-repeat right
                center;
              background-size: 15px 15px;
            }
          }
        }
        &:nth-child(3) {
          .ant-form-item-control-wrapper {
            .ant-form-item-control {
              .ant-form-explain {
                top: -20px !important;
              }
            }
          }
        }
      }
      .register-box {
        display: flex;
        justify-content: flex-end;
        a {
          text-decoration: none;
          display: flex;
          justify-content: flex-end;
          font-size: 14px;
          color: #666666;
          text-decoration: none;
          &:hover {
            opacity: 0.7;
          }
        }
      }

      .login-form-button {
        width: 100%;
        height: 50px;
        //margin-top: 20px;
        background-image: linear-gradient(270deg, #ff4e1a 0%, #f10000 100%);
        border-radius: 6px;
        border: 0;
        font-size: 18px;
        color: #ffffff;

        font-weight: 600;
        &:disabled {
          opacity: 0.32;
        }
      }
    }
    &:last-child {
      .ant-row {
        &:nth-child(2) {
          .ant-form-item-control-wrapper {
            .ant-form-item-control {
              .ant-form-explain {
                top: 0px !important;
              }
            }
          }
        }
      }
      .register-box {
        justify-content: space-between;
      }
    }
  }
</style>