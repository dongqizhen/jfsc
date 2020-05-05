<template>
  <div class="register">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item
        :validate-status="Error('phone1') ? 'error' : ''"
        :help="Error('phone1') || ''"
        ref="phone1"
      >
        <transition name="slide-fade">
          <span v-if="phone1_success" class="extra">
            <svg v-if="!phone1isRegister" class="icon" aria-hidden="true">
              <use xlink:href="#iconzhengque"></use>
            </svg>
            <span v-else>
              用户已注册
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
      <div class="hidden-input">
        <!--让浏览器自动填充到这个input-->
        <input type="text" class="form-control" />
      </div>
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
          <span slot="suffix" @click="gainCodeHandler(1)">{{ content }}</span>
        </a-input>
      </a-form-item>
      <div class="hidden-input">
        <!--让浏览器自动填充到这个input-->
        <input type="text" class="form-control" />
      </div>
      <a-form-item
        :validate-status="Error('password') ? 'error' : ''"
        :help="Error('password') || ''"
      >
        <a-input
          placeholder="请输入新密码，长度不少于6位"
          autocomplete="off"
          type="password"
          readonly
          onfocus="this.removeAttribute('readonly');"
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
              ],
              validateTrigger: 'change'
            }
          ]"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :validate-status="Error('confirmPassword') ? 'error' : ''"
        :help="Error('confirmPassword') || ''"
      >
        <a-input
          placeholder="请再次输入密码"
          autocomplete="off"
          type="password"
          readonly
          onfocus="this.removeAttribute('readonly');"
          v-decorator="[
            'confirmPassword',
            {
              rules: [
                {
                  required: true,
                  message: '请确认密码'
                },
                {
                  validator: compareToFirstPassword
                }
              ],
              validateTrigger: 'change'
            }
          ]"
        >
        </a-input>
      </a-form-item>
      <div class="agreement">
        <a-form-item
          :validate-status="Error('checkedBox') ? 'error' : ''"
          :help="Error('checkedBox') || ''"
        >
          <a-checkbox
            :checked="checkNick"
            @change="handleChange"
            v-decorator="[
              'checkedBox',
              {
                rules: [
                  {
                    required: true,
                    message: '未接受协议'
                  },
                  {
                    validator: isChecked
                  }
                ]
              }
            ]"
          >
            我已经阅读并接受
          </a-checkbox>
          <router-link to="agreement" append>《好医工服务协议》</router-link>
        </a-form-item>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        class="login-form-button"
        :disabled="hasErrors(form.getFieldsError())"
        @click="passwordLogin"
        :loading="iconLoading"
      >
        注册
      </a-button>
      <span>
        已有账号，
        <router-link to="/login" replace>
          马上登录
        </router-link>
      </span>
    </a-form>
  </div>
</template>

<script>
  import { timer, FormValidator } from "../../../../components/mixin/mixin";
  import { _getData } from "../../../../config/getData";

  export default {
    data() {
      return {
        checkNick: false,
        iconLoading: false
      };
    },
    mixins: [timer, FormValidator],
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    mounted() {},
    methods: {
      callback() {},
      passwordLogin() {
        //this.seccode_err = true;
      },
      handleSubmit(e) {
        e.preventDefault();
        this.iconLoading = true;
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log("Received values of form: ", values);
          }
        });
        let { phone1, seccode, confirmPassword } = this.form.getFieldsValue();

        _getData(`${this.$API_URL.HYGLOGINURL}/server/user!request.action`, {
          method: "register",
          userid: "",
          token: "",
          params: {
            accountNo: phone1,
            password: confirmPassword,
            code: seccode,
            pleaseCode: ""
          }
        })
          .then(data => {
            setTimeout(() => {
              this.iconLoading = false;
            }, 300);
            console.log(data);
            if (data.code == 1116) {
              this.seccode_err = true;
            } else if (data.code == 200) {
              this.$message.success("注册成功", 1);
              this.$router.go(-1);
            }
          })
          .then(() => {
            //
          });
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      isChecked(rule, value, callback) {
        console.log(rule, value);
        if (!value && value != "undefined") {
          callback("未接受协议");
        } else {
          callback();
        }
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue("password")) {
          callback("两次输入密码不一致");
        } else {
          callback();
        }
      },
      handleChange(e) {
        this.checkNick = e.target.checked;
        this.$nextTick(() => {
          console.log(this.form.validateFields(["checkedBox"]));
          this.form.validateFields(["checkedBox"], { force: true });
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
  .hidden-input {
    position: relative;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .hidden-input .form-control {
    position: absolute;
    left: -1000px;
  }
  .register {
    height: 100%;
    padding: 0 71px;
    padding-top: 50px;
    width: 100%;
    /deep/ .ant-form {
      .ant-row {
        margin-bottom: 38px;
        &:nth-child(4) {
          margin-bottom: 24px;
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
              font-size: 14px;
              color: #f11f1f;
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
      .register {
        display: flex;
        justify-content: flex-end;
        font-size: 14px;
        color: #666666;
        text-decoration: none;
      }
      .agreement {
        display: flex;
        .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .ant-checkbox:hover .ant-checkbox-inner,
        .ant-checkbox-input:focus + .ant-checkbox-inner {
          border-color: #fb752b;
        }
        .ant-row {
          margin-bottom: 0;
          width: 100%;
        }
        .ant-checkbox-wrapper {
          span:not(.ant-checkbox) {
            padding: 0 5px;
            padding-right: 0;
          }

          .ant-checkbox {
            .ant-checkbox-inner {
              width: 15px;
              height: 15px;
            }
            &.ant-checkbox-checked {
              .ant-checkbox-inner {
                background-color: #fb752b;
                border-color: #fb752b;
              }
            }
          }
        }
        a {
          display: flex;
          color: #3f3f3f;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      .login-form-button {
        width: 100%;
        height: 50px;
        margin-top: 20px;
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
      > span {
        display: flex;
        justify-content: center;
        font-size: 15px;
        color: #cccccc;
        margin-top: 22px;
        a {
          text-decoration: none;
          color: #019ddd;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
</style>