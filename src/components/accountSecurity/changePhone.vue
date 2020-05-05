<template>
  <div class="commonPhone">
    <commonTitle title="账号安全">
      <div class="infoPath" slot="infoPath">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconxiangqianfan"></use>
        </svg>
        <span>更改手机号</span>
      </div>
    </commonTitle>
    <div class="contentBox">
      <a-form :form="form" @submit="handleSubmit">
        <div class="common">
          <div class="left-box">{{ isNew ? "新手机号" : "原手机号" }}</div>
          <div class="right-box">
            <a-form-item
              :validate-status="Error('phone1') ? 'error' : ''"
              :help="Error('phone1') || ''"
              ref="phone1"
            >
              <transition name="slide-fade">
                <span v-if="phone1_success" class="extra">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconzhengque"></use>
                  </svg>
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
              ></a-input>
            </a-form-item>
          </div>
        </div>
        <div class="common">
          <div class="left-box">验证码</div>
          <div class="right-box getCodeBox">
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
                @change="seccodeChange"
                autocomplete="off"
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
                <span slot="suffix" @click="gainCodeHandler(6)">{{
                  content
                }}</span>
              </a-input>
            </a-form-item>
            <!-- <div class="getCode">点击获取</div> -->
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
              @click="sure"
            >
              {{ isNew ? "完成" : "下一步" }}
            </a-button>
            <!-- <div class="btn submit" >
              {{ isNew ? "完成" : "下一步" }}
            </div> -->
            <div class="btn cancel" @click="$router.go(-1)">取消</div>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
  import commonTitle from "../common/merchantRightCommonTitle";
  import { FormValidator, timer } from "../../components/mixin/mixin";
  export default {
    data() {
      return {
        isNew: false,
        seccode_err: false,
        phone1_success: false,
        iconLoading: false
      };
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    mixins: [timer],
    mounted() {
      this.form.validateFields();
    },
    methods: {
      sure() {
        this.isNew = true;
      },
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

        _getData(`user/password`, {
          password: oldPassword,
          newPassword: confirmPassword
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
  .commonPhone {
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
          width: 76px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
          line-height: 34px;
        }
        .right-box {
          height: 34px;
          @include placeholderStyle();
          /deep/ .ant-form-item-control {
            line-height: 34px;
            display: flex;
            /deep/ input {
              width: 389px;
            }
            .ant-form-item-children {
              .ant-input-affix-wrapper {
                &:hover {
                  input:not(.ant-input-disabled) {
                    border-color: #f10215 !important;
                  }
                }
                /deep/ .ant-input-suffix {
                  cursor: pointer !important;
                  font-size: 13px;
                  color: #999999;
                  z-index: 1000;
                  &:hover {
                    opacity: 0.7;
                  }
                }
              }
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
        .getCodeBox {
          display: flex;
          input {
            width: 243px;
          }
          .getCode {
            width: 126px;
            padding: 0 34px;
            margin-left: 20px;
            background: #f5f5f5;
            border-radius: 3px;
            font-size: 14px;
            color: #666666;
            height: 34px;
            line-height: 34px;
            cursor: pointer;
            &:hover {
              opacity: 0.7;
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
            width: 78px;
            border: none;
            &:disabled {
              opacity: 0.32;
              cursor: not-allowed;
            }
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


