<template>
  <div class="editQuote">
    <common-title title="产品报价单"></common-title>
    <div class="quoteOrderInfo">
      <div class="infoBar">
        <span>
          报价公司
          <a-input
            placeholder="请输入报价公司"
            v-model="offerCompany"
          ></a-input>
        </span>
        <span>
          客户名称
          <a-input
            placeholder="请输入客户名称"
            v-model="clienteleName"
          ></a-input>
        </span>
      </div>
      <list-title :titleArr="titleArr"></list-title>
      <div class="listContent">
        <ul>
          <li v-for="item in data.goodList" :key="item.id">
            <span><img :src="item.goodsImage"/></span>
            <span>{{ item.goodsName }}</span>
            <span>{{ item.goodsBrand }}/{{ item.goodsModel }}</span>
            <span>{{ item.number }}</span>
            <span>¥{{ item.number * item.unitPrice }}</span>
            <!-- <span>
              {{ item.arrivalTime ? item.arrivalTime.substring(0, 16) : "" }}
            </span> -->
            <span>{{
              item.remark
                ? item.remark.length > 40
                  ? item.remark.substring(0, 40) + "..."
                  : item.remark
                : ""
            }}</span>
            <span>
              <div @click="addCarSuccess(item.id)">编辑</div>
              <div @click="deleteProduct(item.id)">删除</div>
            </span>
          </li>
        </ul>
      </div>
      <div class="addProduct" @click="addCarSuccess">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icontianjiashangpin"></use>
        </svg>
        添加商品
      </div>
      <div class="remark">
        <span>报价备注</span>
        <span>
          <a-textarea
            placeholder="请输入报价备注"
            v-model="remark"
          ></a-textarea>
        </span>
      </div>
      <div class="totalInfo">
        <span class="totalPrice">
          报价总金额：<i>¥{{ sumPrice }}</i>
        </span>
        <a-button type="primary" :loading="loading" class="save" @click="save">
          保存
        </a-button>
      </div>
    </div>
    <edit-quote-modal
      :Visible="visible"
      :type="type"
      :editId="editId"
      v-on:getIsUpdate="getIsUpdate"
    ></edit-quote-modal>
  </div>
</template>
<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import editQuoteModal from "../../../../components/modal/editQuoteModal";
  import listTitle from "../../../../components/common/listTitle";
  import { _getData } from "../../../../config/getData";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        loading: false,
        visible: false,
        type: "",
        editId: 0,
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "数量",
          "总额",
          "备注",
          "操作"
        ],
        data: {},
        sumPrice: 0,
        clienteleName: "",
        offerCompany: "",
        remark: ""
      };
    },
    computed: {
      ...mapState(["isLogin"])
    },
    methods: {
      save() {
        if (this.data.goodList.length > 0) {
          this.loading = true;
          _getData("/quotation/save", {
            param: {
              id: this.$route.params.id,
              clienteleName: this.clienteleName,
              offerCompany: this.offerCompany,
              remark: this.remark
            }
          }).then(data => {
            console.log(data);
            this.loading = false;
            if (data.code != 500) {
              this.$router.replace({
                path: "/userCenter/myQuote",
                query: { keyId: "4" }
              });
            }
          });
        } else {
          this.$message.warning("请添加商品");
          return;
        }
      },
      addCarSuccess(id) {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
        if (typeof id == "number") {
          this.editId = id;
        } else {
          this.editId = "";
        }
      },
      deleteProduct(id) {
        _getData("/quotation/deleteGoods", { param: { id: id } }).then(data => {
          console.log(data);
          this.getQuoteOrderDetail();
        });
      },
      getIsUpdate(val) {
        this.getQuoteOrderDetail();
      },
      async getQuoteOrderDetail() {
        return await _getData("/quotation/detail", {
          param: {
            id: this.$route.params.id
          }
        }).then(data => {
          console.log("获取的商品报价单详情：", data);
          this.sumPrice = 0;
          this.data = data;
          _.map(data.goodList, value => {
            this.sumPrice = this.sumPrice + value.number * value.unitPrice;
          });
        });
      }
    },
    mounted() {
      this.getQuoteOrderDetail().then(() => {
        this.clienteleName = this.data.clienteleName;
        this.offerCompany = this.data.offerCompany;
        this.remark = this.data.remark;
      });
    },
    components: {
      commonTitle,
      listTitle,
      editQuoteModal
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .editQuote {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .quoteOrderInfo {
      .infoBar {
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        margin-bottom: 24px;
        font-size: 12px;
        color: #333333;
        span {
          margin-right: 30px;
          .ant-input {
            width: 160px;
            height: 27px;
            line-height: 27px;
            font-size: 12px;
            border-radius: 0%;
            margin-left: 6px;
            &:hover {
              border-color: $theme-color !important;
            }
            &:focus {
              border-color: $theme-color !important;
              box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2) !important;
            }
          }
        }
      }
      /deep/.listTitle {
        ul {
          li {
            &:first-child {
              margin-left: 20px;
            }
            &:nth-child(3) {
              width: 117px;
            }
            &:nth-child(4) {
              width: 79px;
            }
            &:nth-child(5) {
              width: 99px;
            }
            &:nth-child(6) {
              width: 188px;
            }
          }
        }
      }
      .listContent {
        margin-top: 12px;
        ul {
          li {
            border: $border-style;
            height: 90px;
            padding: 10px 0;
            display: flex;
            border-top: none;
            &:first-child {
              border-top: $border-style;
            }
            span {
              margin-right: 30px;
              font-size: 12px;
              color: #333333;
              &:nth-child(1) {
                width: 70px;
                margin-left: 20px;
                margin-right: 12px;
                img {
                  width: 70px;
                  height: 70px;
                }
              }
              &:nth-child(2) {
                width: 155px;
              }
              &:nth-child(3) {
                width: 117px;
              }
              &:nth-child(4) {
                width: 79px;
              }
              &:nth-child(5) {
                width: 99px;
              }
              &:nth-child(6) {
                width: 188px;
                overflow: hidden;
                word-wrap: break-word;
              }
              &:nth-child(7) {
                width: 76px;
                margin-right: 0;
                > div {
                  cursor: pointer;
                  margin-bottom: 10px;
                  &:hover {
                    color: $theme-color;
                  }
                }
              }
            }
          }
        }
      }
      .addProduct {
        height: 46px;
        border: $border-style;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #f5a623;
        margin-top: 10px;
        cursor: pointer;
        .icon {
          width: 12px;
          height: 12px;
          margin-right: 5px;
        }
      }
      .remark {
        border: $border-style;
        height: 71px;
        display: flex;
        margin: 12px 0;
        span {
          display: flex;
          height: 71px;
          align-items: center;
          font-size: 12px;
          color: #333333;
          &:first-child {
            width: 89px;
            border-right: $border-style;
            justify-content: center;
          }
          &:last-child {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            /deep/.ant-input {
              width: 100%;
              height: 100%;
              outline: none;
              resize: none;
              border: none;
              &:focus {
                border: none;
                box-shadow: none;
              }
            }
          }
        }
      }
      .totalInfo {
        height: 42px;
        border: $border-style;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .totalPrice {
          font-size: 12px;
          color: #666666;
          margin-right: 40px;
          i {
            font-size: 16px;
            color: $theme-color;
            font-style: normal;
            font-weight: 600;
          }
        }
        .save {
          border: none;
          border-radius: 0;
          width: 76px;
          height: 100%;
          line-height: 40px;
          text-align: center;
          background-image: linear-gradient(90deg, #ff4e1a 100%, #f10000 0%);
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          &:hover {
            opacity: 0.7;
            cursor: pointer;
          }
        }
        [ant-click-animating-without-extra-node]:after {
          display: none;
        }
      }
    }
  }
</style>
