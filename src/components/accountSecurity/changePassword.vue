<template>
  <div class="commonPassword">
    <commonTitle title="账号安全">
      <div class="infoPath" slot="infoPath">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconxiangqianfan"></use>
        </svg>
        <span>更改密码</span>
      </div>
    </commonTitle>
    <div class="contentBox">
      <a-form :form="form" @submit="handleSubmit">
        <div class="common">
          <div class="left-box">原密码</div>
          <div class="right-box">
            <a-form-item
              :validate-status="Error('oldPassword') ? 'error' : ''"
              :help="Error('oldPassword') || ''"
            >
              <transition name="slide-fade">
                <span v-if="password_err" class="extra password_err">
                  密码错误
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconxingzhuang2"></use>
                  </svg>
                </span>
              </transition>
              <a-input
                placeholder="请输入密码"
                type="password"
                autocomplete="off"
                @change="passwordChange"
                v-decorator="[
                  'oldPassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入原始密码'
                      }
                    ]
                  }
                ]"
              >
                <!-- <span slot="suffix">获取验证码</span> -->
              </a-input>
            </a-form-item>
          </div>
        </div>
        <div class="common">
          <div class="left-box">新密码</div>
          <div class="right-box">
            <a-form-item
              :validate-status="Error('newPassword') ? 'error' : ''"
              :help="Error('newPassword') || ''"
            >
              <a-input
                placeholder="请输入新密码，长度不少于6位"
                autocomplete="off"
                type="password"
                v-decorator="[
                  'newPassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码'
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
          </div>
        </div>
        <div class="common">
          <div class="left-box">确认密码</div>
          <div class="right-box">
            <a-form-item
              :validate-status="Error('confirmPassword') ? 'error' : ''"
              :help="Error('confirmPassword') || ''"
            >
              <a-input
                placeholder="请再次输入密码"
                autocomplete="off"
                type="password"
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
          </div>
        </div>
        <div class="common btnBox">
          <div class="left-box"></div>
          <div class="right-box">
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button btn submit"
              :loading="iconLoading"
              :disabled="hasErrors(form.getFieldsError())"
            >
              确定
            </a-button>
            <!-- <div class="btn submit" @click="sure">确定</div> -->
            <a-button
              type="primary"
              class="login-form-button btn cancel"
              @click="$router.go(-1)"
            >
              取消
            </a-button>
            <!-- <div class="btn cancel" @click="cancel">取消</div> -->
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
  import { FormValidator } from "../../components/mixin/mixin";
  import commonTitle from "../common/merchantRightCommonTitle";
  import { _getData } from "../../config/getData";
  export default {
    data() {
      return {
        password_err: false,
        submitData: {
          oldPassword: "",
          newPassword: "",
          moreNewPassword: ""
        },
        iconLoading: false
      };
    },
    // mixins: [FormValidator],
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    mounted() {
      this.form.validateFields();
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.iconLoading = true;
        // this.form.validateFieldsAndScroll((err, values) => {
        //   if (!err) {
        //     console.log("Received values of form: ", values);
        //   }
        // });
        let {
          oldPassword,
          newPassword,
          confirmPassword
        } = this.form.getFieldsValue();

        _getData(`${this.$API_URL.HYGLOGINURL}/server/user!request.action`, {
          method: "updatePassword",
          userid: this.$userid,
          token: "",
          params: {
            password: oldPassword,
            newPassword: confirmPassword
          }
        })
          .then(data => {
            setTimeout(() => {
              this.iconLoading = false;
            }, 300);
            //this.$message.success("注册成功", 1);
          })
          .then(() => {
            this.$router.go(-1);
          });
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue("newPassword")) {
          callback("两次输入密码不一致");
        } else {
          callback();
        }
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => {
          return fieldsError[field];
        });
      },
      Error(field) {
        const {
          getFieldError,
          isFieldTouched,
          getFieldValue,
          setFieldsValue
        } = this.form;
        const val = getFieldValue(field);

        // switch (field) {
        //   case "phone1":
        //     this.phone1_success =
        //       val && getFieldError(field) == undefined ? true : false;
        //     if (!this.phone1_success) {
        //       this.phone1isRegister = false;
        //     }
        //     break;
        //   case "phone2":
        //     this.phone2_success =
        //       val != "" && getFieldError(field) == undefined ? true : false;
        //     if (!this.phone2_success) {
        //       this.phone2isRegister = true;
        //     }
        // }
        return isFieldTouched(field) && getFieldError(field);
      },
      passwordChange() {
        this.password_err = false;
      }
    },
    components: {
      commonTitle
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  @import "../../assets/scss/_input";
  .commonPassword {
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
        justify-content: flex-start;
        .left-box {
          width: 76px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
          height: 100%;
          line-height: 34px;
        }
        .right-box {
          height: 34px;
          @include placeholderStyle;
          input {
            width: 389px;
            padding-left: 16px;
            line-height: 32px;
          }
          /deep/ .ant-form-item {
            height: 100%;

            .ant-form-item-control {
              display: flex;
              .ant-form-item-children {
                display: flex;
              }
              .ant-form-explain {
                padding-right: 18px;
                display: flex;
                height: 34px;
                color: $theme-color;
                align-items: center;
                background: url("../../assets/images/err.svg") no-repeat right
                  center;
                background-size: 15px 15px;
                //position: absolute;
                left: 100%;
                margin-left: 14px;
                width: auto;
              }
            }
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
            border: 0;
            &:hover {
              opacity: 0.7;
            }
            &::after {
              display: none;
            }
          }
          .submit {
            background: #f5a623;
            border-radius: 3px;
            color: #fff;
            &:disabled {
              opacity: 0.32;
              cursor: not-allowed;
            }
          }
          .cancel {
            border: 1px solid #cccccc;
            border-radius: 3px;
            background: #fff;
            font-size: 14px;
            color: #666666;
          }
        }
      }
    }
  }
</style>


