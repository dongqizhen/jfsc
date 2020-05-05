<template>
  <div class="myInquiry">
    <common-title title="我的询价">
      <div slot="titleRight" class="right-box">
        <ul>
          <li :class="{ active: isShowInfo.current == 1 }" @click="tab(1)">
            报价中({{ quoting }})
          </li>
          <li :class="{ active: isShowInfo.current == 2 }" @click="tab(2)">
            已报价({{ quoted }})
          </li>
          <li :class="{ active: isShowInfo.current == 3 }" @click="tab(3)">
            已关闭({{ closed }})
          </li>
        </ul>
      </div>
    </common-title>
    <div v-if="!isLoading">
      <div class="listContainer">
        <div class="selectInfoBox">
          <div class="selectInfo">
            <div class="common productName">
              <div class="left-box">询价单号</div>
              <div class="right-box">
                <a-input
                  placeholder="请输入询价单号"
                  v-model="searchParams.enquirySn"
                  @pressEnter="searchData"
                />
              </div>
            </div>
            <div class="common productStatus">
              <div class="left-box">产品名称</div>
              <div class="right-box">
                <a-input
                  placeholder="请输入产品名称"
                  v-model="searchParams.goodsName"
                  @pressEnter="searchData"
                />
              </div>
            </div>
          </div>
          <div class="selectBtn">
            <div class="common">
              <div class="left-box">询价日期</div>
              <div class="right-box">
                <calendar-range
                  v-on:getDateRange="getDateTime"
                  :dateRange="dateRange"
                ></calendar-range>
              </div>
            </div>
            <a-button class="search" @click="searchData">搜索</a-button>
            <a-button class="clear" @click="clearData">清除</a-button>
          </div>
        </div>
        <list-title
          :titleArr="titleArr"
          :class="{ addClass: isShowInfo.current == 2 }"
        ></list-title>
        <div v-if="!isInquiryLoading">
          <div class="listContent">
            <ul v-if="data.length > 0">
              <li v-for="item in data" :key="item.id">
                <inquiry-item
                  :data="item"
                  :checkedList="selectDatas"
                  v-on:getChecked="getChecked"
                  :isShowInfo="isShowInfo"
                  v-on:getIsDelete="getIsDelete"
                ></inquiry-item>
              </li>
            </ul>
            <no-data v-else text="暂无数据"></no-data>
          </div>
          <div class="tfooter">
            <check-all
              :amount="selectArr.length"
              :checkAll="checkAll"
              :deleteText="isShowInfo.current"
              v-on:isCheckAll="isCheckAllMethod"
              v-on:isDelete="getCheckDelete"
              v-if="data.length > 0"
              :class="{ checkAllStyle: isShowInfo.current != 1 }"
            >
              <div slot="right-box" class="right-box">
                <a-button
                  type="primary"
                  :loading="quoteLoading"
                  class="turnMyQuote"
                  v-if="isShowInfo.current == 2"
                  @click="turnMyQuote"
                >
                  转为我的报价
                </a-button>
                <a-button
                  type="primary"
                  :loading="orderLoading"
                  class="submitOrder"
                  v-if="isShowInfo.current == 2"
                  @click="submitOrder"
                >
                  提交订单
                </a-button>
                <a-button
                  type="primary"
                  :loading="loading"
                  :class="['submit', products.length > 0 ? 'active' : '']"
                  v-if="isShowInfo.current == 3"
                  @click="getQuote"
                >
                  一键获取报价
                </a-button>
              </div>
            </check-all>
          </div>
          <pagination
            :data="paginationData"
            v-on:onPaginationChange="getPaginationChange"
            v-if="paginationData.count != 0"
            ref="pagination"
          ></pagination>
        </div>
        <loading v-else></loading>
      </div>
      <side-bar v-show="isShowInfo.current == 1" />
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import listTitle from "../../../../components/common/listTitle";
  import inquiryItem from "../../../../components/common/inquiry/inquiryItem";
  import checkAll from "../../../../components/common/checkAll";
  import calendarRange from "../../../../components/common/calendarRange";
  import pagination from "../../../../components/common/pagination";
  import sideBar from "../../../../components/sideBar/sideBar";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        loading: false,
        quoteLoading: false,
        orderLoading: false,
        isLoading: true,
        isInquiryLoading: true,
        isShowInfo: {
          isDetail: false,
          isShow: false,
          current: 1,
          isOrder: false,
          isTrue: true
        },
        data: [],
        dateRange: [],
        checkAll: false,
        checkedList: [],
        titleArr: [
          "产品图片",
          "产品名称",
          "单价",
          "数量",
          "到货时间",
          "询价备注",
          "",
          "操作"
        ],
        searchParams: {
          page: 1,
          size: 5,
          status: 1,
          enquirySn: "",
          startTime: "",
          endTime: "",
          storeId: ""
        },
        products: [],
        allProducts: [],
        selectDatas: [],
        selectArr: [],
        paginationData: {},
        quoting: 0,
        quoted: 0,
        closed: 0
      };
    },
    watch: {
      selectDatas(newVal) {
        console.log("监控选择的值：：：：", newVal);
      }
    },
    methods: {
      getCheckDelete(val) {
        console.log(val);
        console.log(this.selectArr);
        if (this.selectArr.length > 0) {
          if (this.isShowInfo.current == 1) {
            //批量关闭
            _getData("/enquiryPlus/enquiryClose", {
              ids: this.selectArr.join(",")
            }).then(data => {
              console.log("批量关闭询价单：", data);
              if (data.code != 500 && data.code != 1) {
                this.$message.success("批量关闭询价单成功", 1);
                this.getInquiryList();
                this.getInquiryNumber();
              }
            });
          }
        } else {
          this.$message.warning("请选择询价单");
          return;
        }
      },
      //转为我的报价
      turnMyQuote() {
        console.log(this.products);
        if (this.products.length > 0) {
          this.quoteLoading = true;
          _getData("/quotation/toMyQuotation", {
            param: {
              ids: this.products.join(",")
            }
          }).then(data => {
            console.log(data);
            this.quoteLoading = false;
            if (data.code != 500) {
              let { href } = this.$router.resolve({
                path: `editQuote/${data.id}`,
                query: { keyId: "2" }
              });
              window.open(href, "_blank");
            }
          });
        } else {
          this.$message.warning("请选择产品", 1);
          return;
        }
      },
      //一键获取报价
      getQuote() {
        console.log(this.selectDatas);
        if (this.selectDatas.length == 0) {
          this.$message.warning("请选择产品", 1);
          return;
        } else {
          this.loading = true;
          let params = [];
          _.map(this.selectDatas, o => {
            let selectProducts = [];
            let storeId = "";
            _.map(this.data, item => {
              if (item.id == o.id) {
                _.map(o.goodList, value => {
                  _.map(o.productInfo, val => {
                    if (value == val.id) {
                      selectProducts.push({
                        goodsId: val.goodsId,
                        number: val.number,
                        buyerDescription: val.introduce ? val.introduce : ""
                      });
                    }
                  });
                });
                storeId = item.storeId;
              }
            });
            params.push({ storeId: storeId, goodsList: selectProducts });
          });
          console.log(params);
          console.log(this.selectDatas);
          _getData("/enquiryPlus/addEnquiry", { param: params }).then(data => {
            console.log("一键获取报价：", data);
            this.loading = false;
            if (data.code != 500) {
              this.isShowInfo.current = 1;
              this.searchParams.status = 1;
              this.searchParams.page = 1;
              this.getInquiryList().then(() => {
                this.$nextTick(() => {
                  if (this.$refs.pagination) {
                    this.$refs.pagination.$data.current = 1;
                  }
                });
              });
            }
          });
        }
      },
      getPaginationChange(val) {
        console.log(val);
        this.searchParams.page = val;
        this.getInquiryList();
      },
      //单个删除
      getIsDelete(val) {
        console.log(val);
        this.getInquiryList();
        this.getInquiryNumber();
      },
      //提交订单（已报价）
      submitOrder() {
        console.log(this.products);
        this.orderLoading = true;
        if (this.products.length > 0) {
          let { href } = this.$router.resolve({
            path: `submitOrder/${this.products.join(",")}`,
            query: { keyId: "2" }
          });
          this.orderLoading = false;
          window.open(href, "_blank");
        } else {
          this.$message.warning("请选择产品", 1);
          this.orderLoading = false;
          return;
        }
      },
      searchData() {
        console.log(this.searchParams);
        this.searchParams.page = 1;
        this.getInquiryList().then(() => {
          this.$nextTick(() => {
            if (this.$refs.pagination) {
              this.$refs.pagination.$data.current = 1;
            }
          });
        });
      },
      clearData() {
        this.searchParams.enquirySn = "";
        this.searchParams.goodsName = "";
        this.dateRange = [];
      },
      getDateTime(val) {
        console.log(val);
        this.searchParams.startTime = val[0];
        this.searchParams.endTime = val[1];
      },
      tab(tabVal) {
        this.searchParams.page = 1;
        this.isShowInfo.current = tabVal;
        this.searchParams.status = tabVal;
        if (tabVal == 2) {
          this.titleArr = [
            "产品图片",
            "产品名称",
            "单价",
            "数量",
            "到货时间",
            "询价备注",
            "报价备注",
            "合计",
            "操作"
          ];
        } else {
          this.titleArr = [
            "产品图片",
            "产品名称",
            "单价",
            "数量",
            "到货时间",
            "询价备注",
            "",
            "操作"
          ];
        }
        this.getInquiryList().then(() => {
          this.$nextTick(() => {
            if (this.$refs.pagination) {
              this.$refs.pagination.$data.current = 1;
            }
          });
        });
      },
      getChecked(val) {
        console.log("订单复选框做选择的值：", val);
        this.selectDatas = val;
        this.products = [];
        this.selectArr = [];
        _.map(val, o => {
          _.map(o.goodList, value => {
            this.products.push(value);
          });
        });
        if (this.products.length == this.allProducts.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
        if (this.isShowInfo.current == 1) {
          _.map(val, o => {
            this.selectArr.push(o.id);
          });
        } else if (this.isShowInfo.current == 2) {
          this.selectArr = this.products;
        }
      },
      isCheckAllMethod(val) {
        this.products = [];
        this.selectDatas = [];
        this.selectArr = [];
        if (val) {
          this.checkAll = true;
          this.products = this.allProducts;
          _.map(this.data, o => {
            let goodsIds = [];
            let productInfo = [];
            for (const item of o.goodList) {
              goodsIds.push(item.id);
              productInfo.push(item);
            }
            this.selectDatas.push({
              id: o.id,
              goodList: goodsIds,
              isCheckAll: true,
              productInfo: productInfo
            });
            if (this.isShowInfo.current == 1) {
              this.selectArr.push(o.id);
            } else if (this.isShowInfo.current == 2) {
              this.selectArr = this.products;
            }
          });
          //console.log(this.selectDatas);
        } else {
          this.checkAll = false;
        }
      },
      async getInquiryList() {
        this.isInquiryLoading = true;
        return await _getData("/enquiryPlus/enquiryList", this.searchParams)
          .then(data => {
            console.log("获取询价管理的列表：", data);
            this.products = [];
            this.allProducts = [];
            this.selectDatas = [];
            this.checkAll = false;
            this.data = data.data;
            this.paginationData = data;
            _.map(this.data, o => {
              for (const val of o.goodList) {
                this.allProducts.push(val.id);
              }
            });
          })
          .then(() => {
            this.isInquiryLoading = false;
          });
      },
      async getInquiryNumber() {
        return await _getData("/enquiryPlus/enquiryCount", {
          param: { storeId: "" }
        }).then(data => {
          console.log("获取的询价数：：：", data);
          _.map(data.data, o => {
            if (o.status == 1) {
              this.quoting = o.num;
            } else if (o.status == 2) {
              this.quoted = o.num;
            } else {
              this.closed = o.num;
            }
          });
        });
      }
    },
    mounted() {
      if (this.$route.query.status) {
        if (this.$route.query.status == 1) {
          this.titleArr = [
            "产品图片",
            "产品名称",
            "单价",
            "数量",
            "到货时间",
            "询价备注",
            "",
            "操作"
          ];
        } else if (this.$route.query.status == 2) {
          this.titleArr = [
            "产品图片",
            "产品名称",
            "单价",
            "数量",
            "到货时间",
            "询价备注",
            "报价备注",
            "合计",
            "操作"
          ];
        }
        this.searchParams.status = this.$route.query.status;
        this.isShowInfo.current = this.$route.query.status;
        if (this.$route.query.inquiryNumber) {
          this.searchParams.enquirySn = this.$route.query.inquiryNumber;
        }
      }
      _getDataAll([this.getInquiryList(), this.getInquiryNumber()]).then(() => {
        this.isLoading = false;
      });
    },
    components: {
      commonTitle,
      checkAll,
      calendarRange,
      listTitle,
      inquiryItem,
      pagination,
      sideBar
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .myInquiry {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .common-title {
      .right-box {
        ul {
          display: flex;
          align-items: center;
          li {
            width: 76px;
            height: 27px;
            line-height: 27px;
            border: 1px solid #dddddd;
            font-size: 12px;
            color: #333;
            text-align: center;
            font-weight: normal;
            border-right: none;
            cursor: pointer;
            &:last-child {
              border-right: 1px solid #dddddd;
            }
            &.active {
              background: #ffdfaa;
              border: 1px solid #f5a623;
            }
          }
        }
      }
    }
    .listContainer {
      margin-top: 12px;
      .selectInfoBox {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        padding-bottom: 12px;
        margin-bottom: 16px;
        border-bottom: $border-style;
        .selectInfo {
          display: flex;
        }
        .common {
          display: flex;
          align-items: center;
          height: 27px;
          margin-right: 30px;
          .left-box {
            font-size: 12px;
            color: #333333;
            margin-right: 6px;
          }
          .right-box {
            @include placeholderStyle(12px);
            .ant-input {
              width: 180px;
              height: 27px;
              line-height: 27px;
              font-size: 12px;
              font-weight: 400;
              &:hover {
                border-color: $theme-color;
              }
              &:focus {
                border-color: $theme-color;
                box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
              }
            }
            /deep/.el-select {
              height: 27px;
              line-height: 27px;
              .el-input {
                .el-input__inner {
                  font-size: 12px;
                }
                .el-input__suffix {
                  .el-input__suffix-inner {
                    .el-input__icon {
                      line-height: 27px;
                    }
                  }
                }
              }
            }
          }
        }
        .selectBtn {
          display: flex;
          /deep/.ant-calendar-picker-input {
            padding: 0;
            height: 27px;
            line-height: 27px;
            font-weight: 400;
            .ant-calendar-range-picker-input {
              height: 100%;
            }
            .ant-calendar-picker-clear {
              right: 6px;
            }
          }
          .ant-btn {
            outline: none;
            color: #fff;
            font-size: 12px;
            margin-right: 10px;
            padding: 0 18px;
            height: 27px;
            border-radius: 0;
            cursor: pointer;
            &:last-child {
              margin-right: 0;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          .search {
            border-color: $theme-color;
            background-color: $theme-color;
          }
          .clear {
            border-color: #999;
            background-color: #999;
          }
        }
      }
      ul {
        margin-top: 12px;
      }
      /deep/.listTitle {
        ul {
          li {
            &:nth-child(2) {
              width: 145px;
            }
            &:nth-child(3) {
              width: 88px;
            }
            &:nth-child(4) {
              width: 80px;
            }
            &:nth-child(5) {
              width: 98px;
            }
            &:nth-child(6) {
              width: 90px;
              margin-right: 15px;
            }
            &:nth-child(7) {
              width: 91px;
              margin-right: 15px;
            }
            &:last-child {
              width: 96px;
            }
          }
        }
        &.addClass {
          ul {
            li {
              &:nth-child(3) {
                width: 60px;
              }
              &:nth-child(4) {
                width: 30px;
              }
              &:nth-child(5) {
                width: 68px;
                margin-right: 30px;
              }
              &:nth-child(6) {
                width: 90px;
                margin-right: 15px;
              }
              &:nth-child(7) {
                width: 90px;
                margin-right: 15px;
              }
              &:nth-child(8) {
                width: 88px;
                margin-right: 22px;
              }
              &:last-child {
                width: 96px;
              }
            }
          }
        }
      }
      /deep/.no-data {
        height: 500px;
      }
      .checkAllStyle {
        /deep/.left-box {
          visibility: hidden;
        }
      }
      .right-box {
        display: flex;
        font-weight: 600;
        font-size: 14px;
        .ant-btn {
          border: none;
          border-radius: 0;
          color: #ffffff;
          &:hover {
            opacity: 0.7;
          }
        }
        [ant-click-animating-without-extra-node]::after {
          display: none;
        }
        .turnMyQuote {
          width: 132px;
          height: 42px;
          line-height: 42px;
          text-align: center;
          background-image: linear-gradient(-90deg, #ff4e1a 0%, #f10000 100%);
          cursor: pointer;
        }
        .submitOrder {
          width: 104px;
          height: 42px;
          line-height: 42px;
          text-align: center;
          background: #f5a623;
          cursor: pointer;
        }
      }
      .submit {
        height: 42px;
        line-height: 42px;
        text-align: center;
        background: #ccc;
        font-size: 600;
        font-size: 14px;
        color: #ffffff;
        &.active {
          background: #f5a623;
        }
      }
    }
  }
</style>
