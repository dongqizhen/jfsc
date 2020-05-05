<template>
  <div class="orderSure">
    <common-title title="订单确认"></common-title>
    <div class="receiptAddress">
      <div class="addAddress">
        <span>收货地址:</span>
        <span class="addNewAddress" @click="addCarSuccess">使用新地址</span>
      </div>
      <div class="addressInfo">
        <ul class="clearfix">
          <li
            v-for="item in userAddressList"
            :key="item.id"
            @click="selectAddress(item.id)"
            :class="current == item.id ? 'active' : ''"
          >
            <div class="receiptName">
              <span>{{ item.userLocation }}</span>
              <span>（{{ item.userName }} 收）</span>
            </div>
            <div class="addressDetail">
              <span class="detailAddress">
                {{
                  item.address.length > 25
                    ? item.address.substring(0, 25) + "..."
                    : item.address
                }}
              </span>
              <span>{{ item.phone }}</span>
            </div>
            <div class="defaultAddress" v-if="item.status == 1">默认地址</div>
            <div
              class="editAddress"
              v-show="current == item.id"
              @click="addCarSuccess(item.id)"
            >
              修改
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="listContainer">
      <list-title :titleArr="titleArr"></list-title>
      <div class="listContent">
        <order-sure-item
          v-for="item in data"
          :data="item"
          :key="item.storeId"
        ></order-sure-item>
      </div>
      <div class="totalInfo">
        <span>
          共计
          <i>{{ amount }}</i>
          件商品
        </span>
        <span>
          总额<i>￥{{ sumPrice }}</i>
        </span>
        <a-button type="primary" :loading="loading" @click="sureSubmit">
          确认
        </a-button>
      </div>
    </div>
    <add-address-modal
      :Visible="visible"
      :type="type"
      :editId="editId"
    ></add-address-modal>
  </div>
</template>

<script>
  import _ from "lodash";
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import listTitle from "../../../../components/common/listTitle";
  import orderSureItem from "../../../../components/common/order/orderSureItem";
  import { _getData } from "../../../../config/getData";
  import addAddressModal from "../../../../components/modal/addAddressModal";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        loading: false,
        visible: false,
        type: "",
        editId: 0,
        data: {},
        userAddressList: [],
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "小计",
          "报价日期"
        ],
        current: -1,
        submitAddressData: {},
        submitData: {
          storeList: []
        },
        amount: 0, //总共产品数量
        sumPrice: 0 //总额
      };
    },
    computed: {
      ...mapState(["isLogin", "userInfo"])
    },
    watch: {
      visible(newVal) {
        if (!newVal) {
          this.getAddress(this.current);
        }
      }
    },
    methods: {
      sureSubmit() {
        this.loading = true;
        _.map(this.userAddressList, val => {
          if (this.current == val.id) {
            this.submitAddressData.consignee = val.userName;
            this.submitAddressData.mobile = val.phone;
            this.submitAddressData.address = val.address;
            this.submitAddressData.postCode = val.postalCode;
          }
        });
        if (!this.submitAddressData.mobile) {
          this.$message.warning("请选择地址", 1);
          this.loading = false;
          return;
        }
        _.map(this.data, o => {
          let goods = [];
          _.map(o.goodsList, val => {
            goods.push({
              id: val.id,
              number: val.number,
              retailPrice: val.unitPrice,
              enquirySn: val.goodsEnquirySn
            });
          });
          this.submitData.storeList.push({
            storeId: o.storeId,
            goodsList: goods
          });
        });
        console.log(this.submitData.storeList);
        this.submitData = {
          ...this.submitAddressData,
          storeList: this.submitData.storeList
        };
        console.log(this.submitData);
        _getData("/order/addOrder", { param: this.submitData }).then(data => {
          console.log(data);
          this.loading = false;
          if (data.code != 500) {
            this.$router.replace({
              path: "/userCenter/myOrder",
              query: { keyId: "3" }
            });
          }
        });
      },
      addCarSuccess(id) {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
        this.editId = id;
        if (typeof id != "number") {
          this.current = -2;
        }
      },
      selectAddress(id) {
        this.current = id;
      },
      sortNumber(a, b) {
        return b - a;
      },
      getAddress(current) {
        _getData(
          `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
          {
            method: "appPageList",
            userid: this.userInfo.id,
            token: "",
            params: { currentPage: 1, countPerPage: "" }
          }
        ).then(data => {
          console.log(data);
          this.userAddressList = data.result.UserAddressList;
          let ids = [];
          _.map(data.result.UserAddressList, val => {
            if (current == -1 || !current) {
              if (val.status == 1) {
                this.current = val.id;
              }
            } else if (current == -2) {
              ids.push(val.id);
              ids.sort(this.sortNumber);
              this.current = ids[0];
            } else {
              this.current = current;
            }
          });
        });
      }
    },
    mounted() {
      this.getAddress();
      _getData("/order/submitOrder", {
        ids: this.$route.params.id
      }).then(data => {
        console.log("获取询价单详情：", data);
        this.data = data;
        _.map(this.data, o => {
          _.map(o.goodsList, value => {
            this.amount = this.amount + value.number;
            this.sumPrice = this.sumPrice + value.number * value.unitPrice;
          });
        });
      });
    },
    components: {
      commonTitle,
      listTitle,
      orderSureItem,
      addAddressModal
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .orderSure {
    min-height: 666px;
    background-color: #fff;
    padding: 4px 20px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 110px;
    .receiptAddress {
      margin-top: 24px;
      .addAddress {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        span {
          font-size: 14px;
          color: #333;
        }
        .addNewAddress {
          width: 95px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border: $border-style;
          border-radius: 2px;
          font-size: 12px;
          color: #666666;
          cursor: pointer;
        }
      }
      .addressInfo {
        ul {
          width: 105%;
          li {
            position: relative;
            width: 237px;
            height: 106px;
            background: url("../../../../assets/images/address-bgc.png") no-repeat
              center center / 100% 100%;
            padding: 10px 20px;
            font-size: 12px;
            color: #666666;
            cursor: pointer;
            margin-right: 10px;
            float: left;
            margin-bottom: 30px;
            &.active {
              background: url("../../../../assets/images/address-active.png")
                no-repeat center center / 100% 100%;
            }
            .receiptName {
              width: 100%;
              padding-bottom: 4px;
              border-bottom: $border-style;
              height: 24px;
              overflow: hidden;
              display: flex;
              span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-child {
                  width: 114px;
                  margin-right: 7px;
                }
                &:last-child {
                  flex: 1;
                }
              }
            }
            .addressDetail {
              padding-top: 7px;
              .detailAddress {
              }
            }
            .defaultAddress {
              width: 57px;
              height: 17px;
              line-height: 17px;
              background: rgba(1, 157, 221, 0.61);
              border-radius: 0 4px 0 0;
              text-align: center;
              font-size: 12px;
              color: #ffffff;
              position: absolute;
              right: 0;
              top: 0;
            }
            .editAddress {
              font-size: 12px;
              color: #f5a623;
            }
          }
        }
      }
    }
    .listContainer {
      /deep/.listTitle {
        ul {
          li {
            &:first-child {
              width: 70px;
              margin-left: 30px;
              margin-right: 30px;
            }
            &:nth-child(2) {
              width: 155px;
            }
            &:nth-child(3) {
              width: 125px;
              margin-right: 60px;
            }
            &:nth-child(4) {
              width: 80px;
              margin-right: 30px;
            }
            &:nth-child(5) {
              width: 70px;
            }
            &:nth-child(6) {
              width: 100px;
            }
          }
        }
      }
      .listContent {
        margin-top: 24px;
      }
      .totalInfo {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border: $border-style;
        span {
          margin-right: 40px;
          font-size: 12px;
          color: #666666;
          i {
            color: $theme-color;
            font-style: normal;
            font-size: 16px;
            font-weight: 600;
          }
        }
        .ant-btn {
          width: 76px;
          border: none;
          border-radius: 0;
          height: 40px;
          background: #f5a623;
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          &:hover {
            cursor: pointer;
            opacity: 0.7;
          }
        }
        [ant-click-animating-without-extra-node]:after {
          display: none;
        }
      }
    }
  }
</style>
