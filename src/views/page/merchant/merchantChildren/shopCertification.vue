<template>
  <div class="shopCertification">
    <div class="basicInformation">
      <commonTitle title="认证材料">
        <span slot="titleRight" class="certificationStatus" v-if="!isOpenShop">
          <svg class="icon" aria-hidden="true">
            <use
              xlink:href="#iconbaojiazhong"
              v-if="certificationStatus == 1"
            ></use>
            <use
              xlink:href="#iconyibaojia"
              v-else-if="certificationStatus == 2"
            ></use>
            <use xlink:href="#iconbaojiazhong" v-else></use>
          </svg>
          认证状态：{{
            certificationStatus == 1
              ? "认证中"
              : certificationStatus == 2
              ? "已认证"
              : certificationStatus == 3
              ? "审核未通过"
              : "未认证"
          }}
        </span>
      </commonTitle>
      <div class="informationContent">
        <div class="title">基本信息</div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>公司名称</div>
          <div class="right-box">
            <a-input
              ref="companyName"
              placeholder="请输入公司名称"
              v-model="submitData.companyName"
            />
            <div class="warning" v-show="companyNameFlag">
              请输入公司名称
            </div>
          </div>
        </div>
        <div class="common companyAddress">
          <div class="left-box"><span class="red">*</span>公司地址</div>
          <div class="right-box">
            <el-cascader
              :options="options"
              v-model="submitData.address"
              placeholder="请选择省/市/区"
              style="width: 390px"
            ></el-cascader>
            <div class="warning" v-show="addressFlag">请选择省/市/区</div>
          </div>
        </div>
        <div class="common companyIntroduce">
          <div class="left-box"><span class="red">*</span>公司介绍</div>
          <div class="right-box">
            <a-textarea
              ref="companyIntroduction"
              placeholder="请在这里对公司做一个介绍"
              type="textarea"
              v-model="submitData.companyIntroduction"
              class="noInput"
            />
            <div class="warning" v-show="companyIntroductionFlag">
              请输入公司介绍
            </div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box">法定代表人</div>
          <div class="right-box">
            <a-input
              placeholder="请输入法定代表人"
              v-model="submitData.checking"
            />
          </div>
        </div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>联系人</div>
          <div class="right-box">
            <a-input
              ref="linkName"
              placeholder="请输入联系人"
              v-model="submitData.linkName"
            />
            <div class="warning" v-show="linkNameFlag">请输入联系人</div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>手机号</div>
          <div class="right-box">
            <a-input
              ref="mobile"
              placeholder="请输入手机号"
              v-model="submitData.mobile"
            />
            <div class="warning" v-show="mobileFlag">请输入正确的手机号</div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>办公室电话</div>
          <div class="right-box">
            <a-input
              ref="workPhone"
              placeholder="请输入办公室电话"
              v-model="submitData.workPhone"
            />
            <div class="warning" v-show="workPhoneFlag">
              请输入正确的办公室电话
            </div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>企业邮箱</div>
          <div class="right-box">
            <a-input
              ref="email"
              placeholder="请输入企业邮箱"
              v-model="submitData.email"
            />
            <div class="warning" v-show="emailFlag">请输入正确的企业邮箱</div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box">传真</div>
          <div class="right-box">
            <a-input placeholder="请输入传真" v-model="submitData.fax" />
          </div>
        </div>
        <div class="common ">
          <div class="left-box">QQ号</div>
          <div class="right-box">
            <a-input
              ref="qqCode"
              placeholder="请输入QQ号"
              v-model="submitData.qqCode"
            />
            <div class="warning" v-show="qqCodeFlag">请输入正确的QQ号</div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box">微信号</div>
          <div class="right-box">
            <a-input
              placeholder="请输入微信号"
              v-model="submitData.weiXinCode"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="identityInformation">
      <div class="title">证件信息</div>
      <div class="identityContent">
        <div class="common companyBusinessLicense">
          <div class="left-box">
            <span class="red">*</span>营业执照<i>(三合一)</i>
          </div>
          <div class="right-box">
            <upload
              v-on:getVal="getLicenseUrl"
              :imgUrl="submitData.yyimage"
            ></upload>
          </div>
        </div>
        <div class="common companyTaxRegistration">
          <div class="left-box">税务登记证</div>
          <div class="right-box">
            <upload
              v-on:getVal="getTaxRegistrationUrl"
              :imgUrl="submitData.swimage"
            ></upload>
          </div>
        </div>
        <div class="common companyProductionLicense">
          <div class="left-box">
            <span class="red">*</span>医疗器械经营或生产许可证
          </div>
          <div class="right-box">
            <upload
              v-on:getVal="getProductionLicenseUrl"
              :imgUrl="submitData.zzjgimage"
            ></upload>
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <a-button @click="cancel" v-if="isOpenShop" class="cancel">
        上一步
      </a-button>
      <a-button @click="submit">{{
        certificationStatus == 2 ? "重新认证" : "提交审核"
      }}</a-button>
    </div>
    <submit-success-modal
      :Visible="visible"
      :type="type"
      :submitData="submitData"
    ></submit-success-modal>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import upload from "../../../../components/common/upload";
  import submitSuccessModal from "../../../../components/modal/submitSuccessModal";
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "../../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        type: "",
        visible: false,
        options: [],
        certificationStatus: 1,
        companyNameFlag: false,
        addressFlag: false,
        companyIntroductionFlag: false,
        linkNameFlag: false,
        mobileFlag: false,
        workPhoneFlag: false,
        emailFlag: false,
        qqCodeFlag: false,
        submitData: {
          sid: "",
          companyName: "",
          address: [],
          provinceId: "",
          cityId: "",
          countryId: "",
          companyIntroduction: "",
          checking: "",
          linkName: "",
          mobile: "",
          workPhone: "",
          email: "",
          fax: "",
          qqCode: "",
          weiXinCode: "",
          yyimage: "",
          swimage: "",
          zzjgimage: ""
        }
      };
    },
    props: {
      isOpenShop: {
        type: Boolean
      },
      current: {
        type: Number
      },
      shopInfo: {
        type: Object
      }
    },
    computed: {
      ...mapState(["isLogin", "userShopInfo"])
    },
    methods: {
      ...mapMutations(["changeUserShopInfoState"]),
      submit() {
        console.log(this.shopInfo);
        if (!this.submitData.companyName) {
          this.companyNameFlag = true;
          this.$refs.companyName.focus();
          return;
        } else {
          this.companyNameFlag = false;
        }
        if (this.submitData.address.length == 0) {
          this.addressFlag = true;
          return;
        } else {
          this.submitData.provinceId = this.submitData.address[0];
          this.submitData.cityId = this.submitData.address[1];
          this.submitData.countryId = this.submitData.address[2];
          this.addressFlag = false;
        }
        if (!this.submitData.companyIntroduction) {
          this.companyIntroductionFlag = true;
          this.$refs.companyIntroduction.focus();
          return;
        } else {
          this.companyIntroductionFlag = false;
        }
        if (!this.submitData.linkName) {
          this.linkNameFlag = true;
          this.$refs.linkName.focus();
          return;
        } else {
          this.linkNameFlag = false;
        }
        if (!this.submitData.mobile) {
          this.mobileFlag = true;
          this.$refs.mobile.focus();
          return;
        } else {
          if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.submitData.mobile)) {
            this.mobileFlag = true;
            this.$refs.mobile.focus();
            return;
          } else {
            this.mobileFlag = false;
          }
        }
        if (!this.submitData.workPhone) {
          this.workPhoneFlag = true;
          this.$refs.workPhone.focus();
          return;
        } else {
          if (
            !/((\d{3})?-?\d{8}|(\d{4})?-?\{7,8})|(^[1][3,4,5,7,8][0-9]{9}$)/.test(
              this.submitData.workPhone
            )
          ) {
            this.workPhoneFlag = true;
            this.$refs.workPhone.focus();
            return;
          } else {
            this.workPhoneFlag = false;
          }
        }
        if (!this.submitData.email) {
          this.emailFlag = true;
          this.$refs.email.focus();
          return;
        } else {
          if (
            !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
              this.submitData.email
            )
          ) {
            this.emailFlag = true;
            this.$refs.email.focus();
            return;
          } else {
            this.emailFlag = false;
          }
        }
        if (this.submitData.qqCode) {
          if (!/^[1-9][0-9]{4,}$/.test(this.submitData.qqCode)) {
            this.qqCodeFlag = true;
            this.$refs.qqCode.focus();
            return;
          } else {
            this.qqCodeFlag = false;
          }
        } else {
          this.qqCodeFlag = false;
        }
        if (!this.submitData.yyimage) {
          this.$message.warning("请上传营业执照", 1);
          return;
        }
        if (!this.submitData.zzjgimage) {
          this.$message.warning("请上传医疗器械经营或生产许可证", 1);
          return;
        }
        if (this.isOpenShop) {
          console.log(this.shopInfo);
          this.submitData.sid = this.shopInfo.sid;
          _getData("/store/updateShopCertification", this.submitData).then(
            data => {
              console.log(data);
              if (data.code == 1) {
                return;
              } else {
                if (this.isOpenShop) {
                  this.$emit("sure", 1);
                }
              }
            }
          );
        } else {
          this.addCarSuccess();
        }
      },
      cancel() {
        this.$emit("cancel", this.current);
      },
      addCarSuccess() {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
      },
      onChange(val) {
        console.log(val);
        this.submitData.address = val;
      },
      getLicenseUrl(val) {
        if (val.length) {
          this.submitData.yyimage = val[0];
        } else {
          this.submitData.yyimage = "";
        }
      },
      getTaxRegistrationUrl(val) {
        if (val.length) {
          this.submitData.swimage = val[0];
        } else {
          this.submitData.swimage = "";
        }
      },
      getProductionLicenseUrl(val) {
        if (val.length) {
          this.submitData.zzjgimage = val[0];
        } else {
          this.submitData.zzjgimage = "";
        }
      },
      getProvince() {
        _getData("/address/getAddress", {}).then(data => {
          console.log("获取省市区：", data);
          _.map(data, val => {
            val.value = val.id;
            val.label = val.name;
            val.children = val.defaultCityData;
            _.map(val.children, value => {
              value.value = value.id;
              value.label = value.name;
              value.children = value.defaultCountyData;
              _.map(value.children, item => {
                item.value = item.id;
                item.label = item.name;
              });
            });
          });
          data.shift();
          this.options = data;
        });
      }
    },

    components: {
      upload,
      commonTitle,
      submitSuccessModal
    },
    mounted() {
      console.log("用户的店铺的id值：：：", this.userShopInfo.store_id);
      if (this.userShopInfo.store_id) {
        _getData("/store/selectAllStore", {})
          .then(data => {
            console.log("获取已填写的店铺信息：", data);
            this.certificationStatus = data.auditStatus;
            this.submitData = {
              sid: data.sid,
              companyName: data.companyName,
              address: [data.provinceId, data.cityId, data.countryId],
              provinceId: data.provinceId,
              cityId: data.cityId,
              countryId: data.countryId,
              companyIntroduction: data.companyIntroduction,
              checking: data.checking,
              linkName: data.linkName,
              mobile: data.mobile,
              workPhone: data.workPhone,
              email: data.email,
              fax: data.fax,
              qqCode: data.qqCode,
              weiXinCode: data.weiXinCode,
              yyimage: data.yyimage,
              swimage: data.swimage,
              zzjgimage: data.zzjgimage
            };
            console.log(this.submitData);
          })
          .then(() => {
            this.getProvince();
          });
      } else {
        this.getProvince();
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  @import "../../../../assets/scss/_input";
  .shopCertification {
    %title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #f5a623;
      border-bottom: 1px solid #ddd;
      padding-left: 10px;
      padding-bottom: 11px;
      margin-bottom: 28px;
      margin-top: 24px;
    }
    .common {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .left-box {
        width: 84px;
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 14px;
        color: #333;
        .red {
          color: $theme-color;
          margin-left: -6.8px;
        }
      }
      .right-box {
        @include placeholderStyle;
        display: flex;
        align-items: center;
        .ant-input {
          width: 390px;
          height: 34px;
          line-height: 34px;
          border: 1px solid #cccccc;
          border-radius: 3px;
        }
        .noInput {
          height: 109px;
          outline: none;
          resize: none;
          line-height: 22px;
        }
        .warning {
          margin-left: 20px;
          font-size: 14px;
          color: $theme-color;
        }
      }
    }
    .basicInformation {
      background-color: #fff;
      padding: 4px 20px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      margin-bottom: 10px;
      /deep/.common-title {
        justify-content: flex-start;
      }
      .certificationStatus {
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        margin-left: 40px;
        background: rgba(245, 166, 35, 0.08);
        border-radius: 17.5px;
        padding: 0 20px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          margin-right: 6px;
        }
      }
      .informationContent {
        margin-bottom: 10px;
        .title {
          @extend %title;
        }
        .companyIntroduce {
          align-items: flex-start;
          .left-box {
            margin-top: 6px;
          }
        }
      }
    }
    .identityInformation {
      padding: 4px 20px;
      background: #ffffff;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      .title {
        @extend %title;
      }
      .identityContent {
        display: flex;
        .common {
          display: block;
          margin-right: 40px;
          .left-box {
            width: auto;
            margin-bottom: 12px;
            color: #333;
            .red {
              color: $theme-color;
              margin-left: 0;
            }
            i {
              font-style: normal;
              color: #666;
              margin-left: 3px;
            }
          }
        }
      }
    }
    .ant-btn {
      height: 33px;
      background: #f5a623;
      border-radius: 3px;
      border: none;
      box-shadow: none;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #fff;
      margin-top: 34px;
      margin-bottom: 111px;
      margin-left: 30px;
      &.cancel {
        background-color: #9b9b9b;
      }
    }
  }
</style>
