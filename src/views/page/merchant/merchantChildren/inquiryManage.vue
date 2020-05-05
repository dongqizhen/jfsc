<template>
  <div class="inquiryManage">
    <div class="inquiryContainer">
      <commonTitle title="询价管理">
        <div slot="titleRight" class="right-box">
          <ul>
            <li
              :class="isShowInfo.current == 1 ? 'active' : ''"
              @click="tab(1)"
            >
              报价中({{ quoting }})
            </li>
            <li
              :class="isShowInfo.current == 2 ? 'active' : ''"
              @click="tab(2)"
            >
              已报价({{ quoted }})
            </li>
            <li
              :class="isShowInfo.current == 3 ? 'active' : ''"
              @click="tab(3)"
            >
              已关闭({{ closed }})
            </li>
          </ul>
        </div>
      </commonTitle>
      <div v-if="!isLoading">
        <div class="listContainer">
          <div class="selectInfoBox">
            <div class="selectInfo">
              <div class="common productName">
                <div class="left-box">询价单号</div>
                <div class="right-box">
                  <a-input
                    placeholder="请输入询价单号"
                    v-model="getInquiryListParams.enquirySn"
                    @pressEnter="searchData"
                  />
                </div>
              </div>
              <div class="common productStatus">
                <div class="left-box">产品名称</div>
                <div class="right-box">
                  <a-input
                    placeholder="请输入产品名称"
                    v-model="getInquiryListParams.goodsName"
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
          <div v-if="!isInQuiryLoading">
            <div class="listContent">
              <div class="tbody">
                <ul v-if="data.length != 0">
                  <li v-for="item in data" :key="item.id">
                    <inquiry-manage-item
                      :data="item"
                      :checkedList="checkedList"
                      v-on:getChecked="getChecked"
                      :isShowInfo="isShowInfo"
                      v-on:getIsDelete="getIsDelete"
                    ></inquiry-manage-item>
                  </li>
                </ul>
                <no-data v-else text="暂无数据"></no-data>
              </div>
              <checkAll
                :amount="checkedList.length"
                :checkAll="checkAll"
                v-on:isCheckAll="isCheckAllMethod"
                v-on:isDelete="getCheckDelete"
                v-if="isShowInfo.current != 1 && data.length > 0"
              ></checkAll>
            </div>
          </div>
          <loading v-else></loading>
          <pagination
            :data="paginationData"
            v-on:onPaginationChange="getPaginationChange"
            ref="pagination"
            v-if="paginationData.count != 0"
          ></pagination>
        </div>
      </div>
      <loading v-else></loading>
    </div>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import listTitle from "../../../../components/common/listTitle";
  import inquiryManageItem from "../../../../components/common/inquiry/inquiryManageItem";
  import calendarRange from "../../../../components/common/calendarRange";
  import checkAll from "../../../../components/common/checkAll";
  import pagination from "../../../../components/common/pagination";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        isLoading: true,
        isInQuiryLoading: true,
        isShowInfo: {
          isDetail: false,
          current: 1,
          isTrue: true,
          isMerchant: true,
          isOrder: false
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
        getInquiryListParams: {
          page: 1, //当前页
          size: 5, //每页显示条数
          status: 1, //询价状态:1：报价中，2：已报价，3：已关闭。',
          goodsName: "",
          enquirySn: "", //询价单号
          storeId: "" //商铺id，商铺id为空时，查询当前用户的询价单。
        },
        paginationData: {},
        quoting: 0,
        quoted: 0,
        closed: 0
      };
    },
    computed: {
      ...mapState(["userShopInfo"])
    },
    methods: {
      searchData() {
        this.getInquiryListParams.page = 1;
        this.getInquiryList().then(() => {
          this.$nextTick(() => {
            if (this.$refs.pagination) {
              this.$refs.pagination.$data.current = 1;
            }
          });
        });
      },
      clearData() {
        this.getInquiryListParams.enquirySn = "";
        this.getInquiryListParams.goodsName = "";
        this.dateRange = [];
      },
      getDateTime(val) {
        console.log(val);
        this.getInquiryListParams.startTime = val[0];
        this.getInquiryListParams.endTime = val[1];
      },
      //批量删除
      getCheckDelete(val) {
        console.log(this.checkedList);
        if (this.checkedList.length > 0) {
          _getData("/enquiryPlus/deleteEnquiry", {
            ids: this.checkedList.join(","),
            flag: "shop"
          }).then(data => {
            console.log("批量删除询价单：", data);
            this.$message.success("批量删除询价单成功", 1);
            this.getInquiryList();
            this.getInquiryNumber();
          });
        } else {
          this.$message.warning("请选择询价单", 1);
          return;
        }
      },
      getIsDelete(val) {
        console.log(val);
        this.getInquiryList();
        this.getInquiryNumber();
      },
      tab(tabVal) {
        this.isShowInfo.current = tabVal;
        this.getInquiryListParams.status = tabVal;
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
        this.getInquiryListParams.page = 1;
        this.getInquiryList().then(() => {
          this.$nextTick(() => {
            if (this.$refs.pagination) {
              this.$refs.pagination.$data.current = 1;
            }
          });
        });
      },
      getChecked(val) {
        if (typeof val == "object") {
          this.checkedList = val;
        } else {
          if (_.indexOf(this.checkedList, val) != -1) {
            this.checkedList = _.without(this.checkedList, val);
          }
        }
        if (this.checkedList.length == this.data.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      isCheckAllMethod(val) {
        if (val) {
          this.checkAll = true;
          this.checkedList = [];
          for (const val of this.data) {
            this.checkedList.push(val.id);
          }
        } else {
          this.checkAll = false;
          this.checkedList = [];
        }
      },
      getPaginationChange(val) {
        console.log(val);
        this.getInquiryListParams.page = val;
        this.getInquiryList();
      },
      async getInquiryList() {
        this.isInQuiryLoading = true;
        this.getInquiryListParams.storeId = this.userShopInfo.store_id;
        return await _getData(
          "/enquiryPlus/enquiryList",
          this.getInquiryListParams
        )
          .then(data => {
            console.log("获取询价管理的列表：", data);
            this.checkedList = [];
            this.checkAll = false;
            this.data = data.data;
            this.paginationData = data;
            console.log(this.paginationData);
          })
          .then(() => {
            this.isInQuiryLoading = false;
          });
      },
      async getInquiryNumber() {
        return await _getData("/enquiryPlus/enquiryCount", {
          param: { storeId: this.userShopInfo.store_id }
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
        this.getInquiryListParams.status = this.$route.query.status;
        this.isShowInfo.current = this.$route.query.status;
        if (this.$route.query.inquiryNumber) {
          this.getInquiryListParams.enquirySn = this.$route.query.inquiryNumber;
        }
      }
      _getDataAll([this.getInquiryNumber(), this.getInquiryList()]).then(() => {
        this.isLoading = false;
      });
    },
    components: {
      commonTitle,
      checkAll,
      listTitle,
      inquiryManageItem,
      calendarRange,
      pagination
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .inquiryManage {
    .inquiryContainer {
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
        margin-top: 24px;
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
              cursor: pointer;
              border-radius: 0;
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
        /deep/.listTitle {
          margin-bottom: 12px;
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
                &:nth-child(8) {
                  width: 88px;
                  margin-right: 22px;
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
                &:last-child {
                  width: 96px;
                }
              }
            }
          }
        }
        .listContent {
          .tbody {
            /deep/.no-data {
              height: 552px;
            }
            > ul {
              > li {
                margin-bottom: 12px;
              }
            }
          }
        }
      }
    }
  }
</style>
