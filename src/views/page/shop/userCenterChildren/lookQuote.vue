<template>
  <div class="lookQuote">
    <common-title title="产品报价单"></common-title>
    <div class="quoteOrderInfo">
      <div class="infoBar">
        <span>报价公司：{{ data.offerCompany }}</span>
        <span>客户名称：{{ data.clienteleName }}</span>
      </div>
      <list-title :titleArr="titleArr"></list-title>
      <div class="listContent">
        <ul>
          <li v-for="item in data.goodList" :key="item.id">
            <span><img :src="item.goodsImage"/></span>
            <span>{{ item.goodsName }}</span>
            <span>{{ item.goodsBrand }}/{{ item.goodsModel }}</span>
            <span>¥{{ item.unitPrice }}</span>
            <span>{{ item.number }}</span>
            <span>¥{{ item.number * item.unitPrice }}</span>
            <span>{{
              item.remark
                ? item.remark.length > 33
                  ? item.remark.substring(0, 30) + "..."
                  : item.remark
                : ""
            }}</span>
          </li>
        </ul>
      </div>
      <div class="remark">
        <span>报价备注</span>
        <span>{{ data.remark }}</span>
      </div>
      <div class="totalInfo">
        <span class="totalPrice">
          报价总金额：<i>¥{{ sumPrice }}</i>
        </span>
        <span class="download" @click="download(`${$route.params.id}`)">
          下载报价
        </span>
        <span class="edit">
          <router-link
            target="_blank"
            :to="{
              path: `/userCenter/editQuote/${$route.params.id}`,
              query: { keyId: '4' }
            }"
          >
            修改报价
          </router-link>
        </span>
      </div>
    </div>
    <download-quote
      :Visible="visible"
      :type="type"
      :quoteId="quoteId"
    ></download-quote>
  </div>
</template>
<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import listTitle from "../../../../components/common/listTitle";
  import { _getData } from "../../../../config/getData";
  import downloadQuote from "../../../../components/modal/downloadQuote";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        titleArr: [
          "产品图片",
          "产品名称",
          "品牌型号",
          "单价",
          "数量",
          "总额",
          "备注"
        ],
        data: [],
        sumPrice: 0,
        visible: false,
        quoteId: -1,
        type: ""
      };
    },
    computed: {
      ...mapState(["isLogin"])
    },
    methods: {
      download(id) {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
        this.quoteId = id;
      }
    },
    components: {
      commonTitle,
      listTitle,
      downloadQuote
    },
    mounted() {
      _getData("/quotation/detail", {
        param: {
          id: this.$route.params.id //类型：String  必有字段  备注：报价单id
        }
      }).then(data => {
        console.log("获取的商品报价单详情：", data);
        this.data = data;
        _.map(data.goodList, value => {
          this.sumPrice = this.sumPrice + value.number * value.unitPrice;
        });
      });
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .lookQuote {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .quoteOrderInfo {
      .infoBar {
        border: $border-style;
        background: rgba(245, 166, 35, 0.05);
        height: 40px;
        line-height: 40px;
        padding-left: 22px;
        margin-top: 10px;
        margin-bottom: 24px;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
        span {
          margin-right: 45px;
        }
      }
      /deep/.listTitle {
        ul {
          li {
            &:first-child {
              margin-left: 20px;
            }
            &:nth-child(3) {
              width: 130px;
            }
            &:nth-child(4) {
              width: 95px;
            }
            &:nth-child(5) {
              width: 53px;
              margin-right: 30px;
            }
            &:nth-child(6) {
              width: 100px;
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
                width: 130px;
              }
              &:nth-child(4) {
                width: 95px;
              }
              &:nth-child(5) {
                width: 53px;
                margin-right: 30px;
              }
              &:nth-child(6) {
                width: 100px;
                overflow: hidden;
                word-wrap: break-word;
              }
              &:nth-child(7) {
                width: 168px;
                margin-right: 10px;
                overflow: hidden;
                word-wrap: break-word;
              }
            }
          }
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
            padding-left: 20px;
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
        .download {
          width: 104px;
          height: 100%;
          line-height: 40px;
          text-align: center;
          background-image: linear-gradient(90deg, #ff4e1a 100%, #f10000 0%);
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }
        .edit {
          width: 104px;
          height: 100%;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          background: #f5a623;
          cursor: pointer;
          a {
            color: #fff;
          }
        }
      }
    }
  }
</style>
