<template>
  <div class="shopInfo">
    <div class="container-box">
      <common-title title="店铺信息"></common-title>
      <div class="content">
        <div class="common">
          <div class="left-box"><span class="red">*</span>店铺名称</div>
          <div class="right-box">
            <a-input
              ref="shopName"
              placeholder="请输入店铺名称"
              v-model.trim="submitData.shopName"
            />
            <div class="warning" v-show="shopNameFlag">
              {{ shopNameWarnMessage }}
            </div>
          </div>
        </div>
        <div class="common shopType">
          <div class="left-box"><span class="red">*</span>店铺类型</div>
          <div class="right-box">
            <el-select
              v-model="submitData.type"
              placeholder="请选择经营模式"
              @change="handleShopTypeChange"
              style="width:222px;"
            >
              <el-option
                v-for="item in shopTypeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div class="warning" v-show="typeFlag">请选择经营模式</div>
          </div>
        </div>
        <div class="common shopIndexPicture">
          <div class="left-box"><span class="red">*</span>店铺首页图片</div>
          <div class="right-box">
            <upload v-on:getVal="getImgUrl" :imgUrl="submitData.image"></upload>
            <div class="warning" v-show="imageFlag">请上传图片</div>
          </div>
        </div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>经营范围</div>
          <div class="right-box">
            <a-input
              placeholder="请输入店铺经营范围"
              v-model.trim="submitData.shopScope"
            />
            <div class="warning" v-show="shopScopeFlag">请输入店铺经营范围</div>
          </div>
        </div>
        <div class="common shopSaleArea">
          <div class="left-box"><span class="red">*</span>销售地区</div>
          <div class="right-box saleArea" @click="showSelectBox">
            <cascade-select
              :isShow="isShow"
              :defaultData="submitData.defaultProvinceData"
              v-on:getSaleArea="getSaleArea"
            ></cascade-select>
            <div class="warning" v-show="saleAreaFlag">请选择销售地区</div>
          </div>
        </div>
        <div class="common shopIntroduce">
          <div class="left-box">店铺介绍</div>
          <div class="right-box">
            <ueditor
              :value="submitData.introduce"
              :config="UEConfig"
              ref="introduce"
            ></ueditor>
          </div>
        </div>
        <div class="common submit">
          <div class="left-box"></div>
          <div class="right-box">
            <a-button @click="save">
              {{ isOpenShop ? "下一步" : "重新认证" }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div :class="['modal-box', { active: isShow }]" @click="isShowModal"></div>
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
  import cascadeSelect from "../../../../components/common/casadeSelect/cascadeSelect";
  import submitSuccessModal from "../../../../components/modal/submitSuccessModal";
  import ueditor from "../../../../components/common/ueditor";
  import { _getData } from "../../../../config/getData";
  import { mapState, mapMutations } from "vuex";
  export default {
    data() {
      return {
        visible: false,
        type: "",
        isShow: false,
        shopNameFlag: false,
        shopNameWarnMessage: "请输入店铺名称",
        typeFlag: false,
        imageFlag: false,
        shopScopeFlag: false,
        saleAreaFlag: false,
        shopTypeData: [],
        submitData: {
          shopName: "",
          type: "",
          image: "",
          shopScope: "",
          defaultProvinceData: [],
          introduce: ""
        },
        UEConfig: {
          zIndex: 1,
          autoFloatEnabled: false,
          initialFrameWidth: "100%",
          initialFrameHeight: 350,
          initialContent: "请输入商品描述"
        }
      };
    },
    props: {
      isOpenShop: {
        type: Boolean
      },
      current: {
        type: Number
      }
    },
    computed: {
      ...mapState(["isLogin", "userShopInfo"])
    },
    methods: {
      ...mapMutations(["changeUserShopInfoState"]),
      save() {
        console.log(this.$refs.introduce);
        if (!this.submitData.shopName) {
          this.shopNameFlag = true;
          this.$refs.shopName.focus();
          return;
        } else {
          this.shopNameFlag = false;
        }
        if (!this.submitData.type) {
          this.typeFlag = true;
          return;
        } else {
          this.typeFlag = false;
        }
        if (!this.submitData.image) {
          this.imageFlag = true;
          return;
        } else {
          this.imageFlag = false;
        }
        if (!this.submitData.shopScope) {
          this.shopScopeFlag = true;
          return;
        } else {
          this.shopScopeFlag = false;
        }
        if (this.submitData.defaultProvinceData.length == 0) {
          this.saleAreaFlag = true;
          return;
        } else {
          this.saleAreaFlag = false;
        }
        this.submitData.introduce = this.$refs.introduce.getUEContent();
        this.submitData.introduceTxt = this.$refs.introduce.getUEContentTxt();
        this.submitData = {
          ...this.submitData,
          current: this.current,
          sid: this.$store.state.userShopInfo.store_id
        };
        console.log(this.submitData);
        if (this.isOpenShop) {
          _getData("/store/insertOrUpdateStore", this.submitData).then(data => {
            console.log(data);
            if (data.code == 1) {
              this.shopNameFlag = true;
              this.$refs.shopName.focus();
              this.shopNameWarnMessage = data.msg;
              return;
            } else {
              this.shopNameFlag = false;
              _getData("/user/getUser", {})
                .then(data => {
                  console.log("获取用户的店铺开店信息：", data);
                  this.changeUserShopInfoState(data);
                  this.submitData.sid = data.store_id;
                })
                .then(() => {
                  if (this.isOpenShop) {
                    this.$emit("getShopInfo", this.submitData);
                  }
                });
            }
          });
        } else {
          this.addCarSuccess();
        }
      },
      addCarSuccess() {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
      },
      getImgUrl(val) {
        console.log(val);
        if (val.length == 0) {
          this.submitData.image = "";
        } else {
          this.submitData.image = val[0];
        }
      },
      handleShopTypeChange(value) {
        console.log(`selected ${value}`);
        this.submitData.type = value;
      },
      isShowModal() {
        this.isShow = false;
      },
      showSelectBox() {
        this.isShow = true;
      },
      getSaleArea(val) {
        console.log(val);
        this.submitData.defaultProvinceData = val;
      }
    },
    components: {
      commonTitle,
      upload,
      cascadeSelect,
      submitSuccessModal,
      ueditor
    },
    mounted() {
      _getData("/storeType/queryStoreType", {})
        .then(data => {
          console.log("店铺类型", data);
          _.each(data, val => {
            val.label = val.name;
            val.value = val.id;
          });
          this.shopTypeData = data;
        })
        .then(() => {
          if (this.userShopInfo.store_id) {
            _getData("/store/selectAllStore", {}).then(data => {
              console.log("获取已填写的店铺信息：", data);
              _.each(data.defaultProvinceData, val => {
                val.id = val.provinceId;
              });
              this.submitData = {
                shopName: data.shopName,
                type: data.type,
                image: data.image,
                shopScope: data.shopScope,
                defaultProvinceData: data.defaultProvinceData,
                introduce: data.introduce,
                sid: this.userShopInfo.store_id
              };
            });
          }
        });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  @import "../../../../assets/scss/_input";
  .shopInfo {
    margin-bottom: 50px;
    .container-box {
      background-color: #fff;
      min-height: 693px;
      padding: 4px 20px;
      box-shadow: $base-box-shadow;
      .content {
        margin-top: 24px;
        .common {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          &:nth-last-child(2),
          &:nth-last-child(3) {
            align-items: flex-start;
            .left-box {
              margin-top: 6px;
            }
          }
          .left-box {
            margin-right: 24px;
            font-family: PingFangSC-Medium;
            font-weight: 600;
            font-size: 14px;
            color: #151515;
            .red {
              color: $theme-color;
              margin-left: -6.8px;
            }
          }
          .right-box {
            display: flex;
            align-items: center;
            @include placeholderStyle;
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
            /deep/.ant-select {
              .ant-select-arrow {
                right: 20px;
              }
            }
            .warning {
              margin-left: 20px;
              font-size: 14px;
              color: $theme-color;
            }
          }
          .saleArea {
            /deep/.selectText {
              &:hover {
                cursor: pointer;
                border: 1px solid $theme-color !important;
              }
            }
          }
        }
        .shopIndexPicture {
          .right-box {
            height: 118px;
          }
        }
        .shopIntroduce {
          .right-box {
            width: 666px;
          }
        }
        .ant-btn {
          // width: 65px;
          height: 33px;
          background: #f5a623;
          border-radius: 3px;
          border: 1px solid #f5a623;
          box-shadow: none;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #fff;
          margin-left: 58px;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
  .modal-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0);
    display: none;
    &.active {
      display: block;
    }
  }
</style>
