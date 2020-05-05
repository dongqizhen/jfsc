<template>
  <div class="login-modal">
    <modal :isShow="visible" :options="options">
      <div slot="content" v-if="type != 'login'">
        <div class="alertContent">
          <div class="common name">
            <div class="left-box">收货人姓名</div>
            <div class="right-box">
              <a-input
                placeholder="请输入收货人姓名"
                v-model="submitData.userName"
              ></a-input>
              <span class="testTrue" v-if="nameIsShow">
                <i>*</i>
                请输入收货人姓名
              </span>
            </div>
          </div>
          <div class="common name">
            <div class="left-box">联系方式</div>
            <div class="right-box">
              <a-input
                placeholder="请输入联系方式"
                v-model="submitData.phone"
              ></a-input>
              <span class="testTrue" v-if="isShow">
                <i>*</i>
                请输入正确的联系方式
              </span>
            </div>
          </div>
          <div class="common name">
            <div class="left-box">所在地区</div>
            <div class="right-box">
              <div class="select-area">
                <span @click="selectArea">
                  <span :class="isSpace ? 'space' : ''">
                    {{ selectMainArea }}
                  </span>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="areaIsShow && 'active'"
                  >
                    <use xlink:href="#icontianjiaduibichanpinxiala"></use>
                  </svg>
                </span>
                <transition name="slide-fade">
                  <div class="area-container" v-if="areaIsShow">
                    <h2>
                      <span
                        :class="isActive == 0 && 'active'"
                        @click="provinceClick"
                        >{{ province }}</span
                      >
                      <span
                        :class="isActive != 0 && 'active'"
                        v-if="isActive != 0"
                        >{{ city }}</span
                      >
                    </h2>
                    <i></i>
                    <ul v-if="isActive == 0">
                      <li
                        v-for="(item, i) in area"
                        :key="item.id"
                        @click="handleClick(item)"
                      >
                        {{ item.name }}
                      </li>
                    </ul>
                    <ul v-else>
                      <li
                        v-for="(item, i) in cityArr"
                        :key="`city-${i}`"
                        @click="cityItemClick(item)"
                      >
                        {{ item.name }}
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <span class="testTrue" v-if="selectAreaIsShow">
                <i>*</i>
                请选择地区
              </span>
            </div>
          </div>
          <div class="common name">
            <div class="left-box">详细地址</div>
            <div class="right-box">
              <a-input
                placeholder="请输入详细地址"
                v-model="submitData.address"
              ></a-input>
              <span class="testTrue" v-if="addressDetailIsShow">
                <i>*</i>
                请输入详细地址
              </span>
            </div>
          </div>
          <div class="common">
            <div class="left-box">邮政编码</div>
            <div class="right-box">
              <a-input
                placeholder="请输入邮政编码"
                v-model="submitData.postalCode"
              ></a-input>
              <span class="testTrue" v-if="codeIsShow">
                <i>*</i>
                请输入正确的邮政编码
              </span>
            </div>
          </div>
          <div class="common">
            <div class="left-box"></div>
            <div class="right-box">
              <a-checkbox @change="onChange" :checked="submitData.status != 0">
                设为默认地址
              </a-checkbox>
            </div>
          </div>
        </div>
        <div class="btn">
          <a-button @click="saveAddress">保存收货地址</a-button>
          <a-button @click="visible = false">取消</a-button>
        </div>
      </div>
      <div slot="content" v-else>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconweidenglugantanhao"></use>
          </svg>
          你还没登录
        </p>
        <div class="btn">
          <a-button @click="toLogin">去登录</a-button>
          <a-button @click="visible = false">取消</a-button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import modal from "./modal.vue";
  import { _getData } from "../../config/getData";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        visible: false,
        options: {
          title: "新增收货地址",
          closable: true,
          maskClosable: false,
          wrapClassName: "addAddress",
          centered: false
        },
        submitData: {
          userName: "",
          phone: "",
          address: "",
          userLocation: "",
          postalCode: "",
          status: ""
        },
        isShow: false,
        areaIsShow: false, //控制选择地区弹层是否显示
        area: [], //省份列表
        cityArr: [], //市列表
        province: "选择省/直辖市", //省头部显示名称
        city: "选择市",
        isActive: 0, //是否显示市弹出层
        selectMainArea: "请选择省/市", //默认显示地址
        provinceName: "",
        cityName: "",
        isSpace: false,
        selectAreaIsShow: false,
        addressDetailIsShow: false,
        nameIsShow: false,
        codeIsShow: false
      };
    },
    props: {
      Visible: {
        type: Boolean,
        default: false,
        required: true
      },
      type: {
        type: String,
        required: false
      },
      title: {
        type: String,
        default: "提交成功",
        required: false
      },
      editId: {}
    },
    computed: {
      ...mapState(["userInfo"])
    },
    components: {
      modal
    },
    methods: {
      selectArea() {
        this.areaIsShow = !this.areaIsShow;
        this.isActive = 0;
        this.province = "选择省/直辖市";
      },
      handleClick(val) {
        console.log(val);
        this.province = val.name;

        _getData("address/getCity", { provinceId: val.id })
          .then(data => {
            console.log(data);
            this.cityArr = data;
          })
          .then(() => {
            this.isActive = 1;
          });
      },
      provinceClick() {
        this.isActive = 0;
        this.province = "选择省/直辖市";
      },
      cityItemClick(item) {
        this.selectMainArea = this.province + item.name;
        this.areaIsShow = false;
        this.isSpace = false;
      },
      onChange(e) {
        if (e.target.checked) {
          this.submitData.status = 1;
        } else {
          this.submitData.status = 0;
        }
      },
      toLogin() {
        const { href } = this.$router.resolve({
          path: "/login"
        });
        this.visible = false;
        this.areaIsShow = false;
        window.open(href, "_blank");
      },
      saveAddress() {
        console.log(this.submitData);
        if (!this.submitData.userName) {
          this.nameIsShow = true;
          return;
        } else {
          this.nameIsShow = false;
        }
        if (!this.submitData.phone) {
          this.isShow = true;
          return;
        } else {
          if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.submitData.phone)) {
            this.isShow = true;
            return;
          } else {
            this.isShow = false;
          }
        }
        if (this.selectMainArea == "请选择省/市") {
          this.selectAreaIsShow = true;
          return;
        } else {
          this.selectAreaIsShow = false;
          this.submitData.userLocation = this.selectMainArea;
        }
        if (!this.submitData.address) {
          this.addressDetailIsShow = true;
          return;
        } else {
          this.addressDetailIsShow = false;
        }
        if (!this.submitData.postalCode) {
          this.codeIsShow = true;
          return;
        } else {
          if (!/[1-9]\d{5}(?!\d)/.test(this.submitData.postalCode)) {
            this.codeIsShow = true;
            return;
          } else {
            this.codeIsShow = false;
          }
        }
        if (this.submitData.id) {
          _getData(
            `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
            {
              method: "updateUserAddress",
              userid: this.userInfo.id,
              token: "",
              params: this.submitData
            }
          ).then(data => {
            console.log(data);
            this.visible = false;
            this.$parent.visible = false;
          });
        } else {
          _getData(
            `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
            {
              method: "addUserAddress",
              userid: this.userInfo.id,
              token: "",
              params: this.submitData
            }
          ).then(data => {
            console.log(data);
            this.visible = false;
          });
        }
      }
    },
    mounted() {
      _getData("address/getProvince", {}).then(data => {
        console.log("data", data);
        this.area = data;
      });
    },
    watch: {
      Visible(newVal) {
        this.visible = newVal;
      },
      visible(newVal) {
        if (!newVal) {
          this.$parent.visible = false;
          this.areaIsShow = false;
          this.isSpace = true;
          this.selectAreaIsShow = false;
          this.addressDetailIsShow = false;
          this.nameIsShow = false;
          this.isShow = false;
          this.codeIsShow = false;
        }
      },
      editId(newVal) {
        console.log(newVal);
        if (typeof newVal == "number") {
          _getData(
            `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
            {
              method: "getUserAddressById",
              userid: this.userInfo.id,
              token: "",
              params: { userAddressId: newVal }
            }
          ).then(data => {
            console.log(data);
            this.submitData = data.result;
            this.selectMainArea = data.result.userLocation;
            this.submitData.id = newVal;
            this.isSpace = false;
          });
        } else {
          this.submitData = {
            userName: "",
            phone: "",
            address: "",
            userLocation: "",
            postalCode: "",
            status: ""
          };
          this.selectMainArea = "请选择省/市";
          this.isSpace = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
</style>