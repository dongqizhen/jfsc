<template>
  <div class="login-up">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="密码登录" key="2" forceRender>
        <a-form :form="form" @submit="handleSubmitTwo">
          <a-form-item
            :validate-status="Error('phone2') ? 'error' : ''"
            :help="Error('phone2') || ''"
          >
            <transition name="slide-fade">
              <span v-if="phone2_success" class="extra">
                <svg v-if="phone2isRegister" class="icon" aria-hidden="true">
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
                'phone2',
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
          <a-form-item
            :validate-status="Error('password') ? 'error' : ''"
            :help="Error('password') || ''"
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
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    },
                    {
                      min: 6,
                      message: '密码长度应不少于6位'
                    }
                  ]
                }
              ]"
            >
              <!-- <span slot="suffix">获取验证码</span> -->
            </a-input>
          </a-form-item>
          <div class="register-box">
            <router-link to="forgetPassword" class="forget-password">
              忘记密码
            </router-link>
            <router-link to="register" class="register">
              立即注册
            </router-link>
          </div>

          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            :disabled="hasErrors(form.getFieldsError(['phone2', 'password']))"
            @click="passwordLogin"
            :loading="iconLoading2"
          >
            登录
          </a-button>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { mapMutations } from "vuex";
  import { timer, FormValidator } from "../../../../components/mixin/mixin";
  import { _getData } from "../../../../config/getData";
  import Vue from "vue";
  export default {
    data() {
      return {
        phone1_success: false,
        phone2_success: false,
        password_err: false,
        seccode_err: false,
        iconLoading: false,
        iconLoading2: false
      };
    },
    mixins: [timer, FormValidator],
    methods: {
      ...mapMutations([
        "changeLoginState",
        "changeUserInfoState",
        "changeUserShopInfoState"
      ]),
      callback() {},
      passwordLogin() {},
      handleSubmitOne(e) {
        e.preventDefault();
        this.iconLoading = true;
        let { phone1, seccode } = this.form.getFieldsValue(["phone1", "seccode"]);

        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log("Received values of form: ", values);
          }
        });
        _getData(`${this.$API_URL.HYGLOGINURL}/server/user!request.action`, {
          userid: "",
          method: "loginAppByCode",
          params: {
            accountNo: phone1,
            code: seccode,
            platform: ""
          },
          token: ""
        }).then(data => {
          setTimeout(() => {
            this.iconLoading = false;
          }, 300);
          if (data.code == 200) {
            //成功
            this.$userid = data.result.id;
            this.changeLoginState(true);
            this.changeUserInfoState(data.result);
            _getData("/user/getUser", {})
              .then(data => {
                console.log("获取用户的店铺开店信息：", data);
                this.changeUserShopInfoState(data);
              })
              .then(() => {
                this.$router.back();
              });
          } else if (data.code == 1116) {
            this.seccode_err = true;
          }
        });
      },
      handleSubmitTwo(e) {
        e.preventDefault();
        this.iconLoading2 = true;
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log("Received values of form: ", values);
          }
        });

        const { phone2, password } = this.form.getFieldsValue();
        _getData(`api/user/login`, {
          phone: phone2,
          password
        }).then(data => {
          setTimeout(() => {
            this.iconLoading2 = false;
          }, 300);

          if (data.code == 1106) {
            //密码错误
            this.password_err = true;
            return;
          } else if (data.code == 200) {
            //成功
            console.log(Vue.prototype);
            Vue.prototype.$userid = data.data.user_id;
            this.changeLoginState(true);
            this.changeUserInfoState(data.data);
            _getData("/user/getUser", {})
              .then(data => {
                console.log("获取用户的店铺开店信息：", data);
                this.changeUserShopInfoState(data);
              })
              .then(() => {
                this.$router.back();
              });
          } else if (data.code == 1102) {
            this.phone2isRegister = false;
          } else {
            // this.$message.error(data.data.status.message);
          }
        });
      },

      passwordChange() {
        this.password_err = false;
      }
    },
    computed: {},
    mounted() {
      //this.text = this.form.validateFields();
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }
  .login-up {
    height: 100%;
    width: 100%;
    padding: 87px 71px 0;
    /deep/ .ant-tabs-top {
      .ant-tabs-bar {
        border-bottom: 0;
        margin-bottom: 0;
        margin-bottom: 60px;
        .ant-tabs-nav-container {
          .ant-tabs-nav-wrap {
            .ant-tabs-nav {
              width: 100%;
              > div:not(.ant-tabs-ink-bar) {
                display: flex;
                justify-content: center;
                .ant-tabs-tab {
                  padding: 0;
                  margin: 0;
                  font-size: 18px;
                  color: #999999;
                  &:not(.ant-tabs-tab-active):hover {
                    opacity: 0.7;
                  }
                  &:first-child {
                    //margin-right: 100px;
                  }
                  &.ant-tabs-tab-active {
                    font-size: 18px;
                    color: #000000;
                    font-weight: 600;
                  }
                }
              }
              .ant-tabs-ink-bar {
                display: none !important;
              }
            }
          }
        }
      }
      .ant-tabs-content {
        .ant-tabs-tabpane {
          .ant-form {
            .ant-row {
              margin-bottom: 20px;
              &:first-child {
                margin-bottom: 40px;
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
                    background: url("../../../../assets/images/err.svg") no-repeat
                      right center;
                    background-size: 15px 15px;
                  }
                }
              }
              &:nth-child(2) {
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
          }
          &:last-child {
            .ant-row {
              &:nth-child(2) {
                .ant-form-item-control-wrapper {
                  .ant-form-item-control {
                    .ant-form-explain {
                      top: 0 !important;
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
      }
    }
  }
</style>