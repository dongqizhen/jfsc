<template>
  <div class="shopIndex">
    <common-title title="店铺首页"></common-title>
    <div v-if="!isLoading">
      <div class="container-box">
        <div class="header">
          <ul>
            <li v-for="data in amountData" :key="data.id">
              <div class="textName">{{ data.name }}</div>
              <div class="number">{{ data.amount }}</div>
              <div class="increase">
                <svg class="icon" aria-hidden="true" v-if="data.rate != '--'">
                  <use
                    xlink:href="#icontongbizengchang"
                    v-if="data.increase"
                  ></use>
                  <use xlink:href="#icontongbixiajiang" v-else></use>
                </svg>
                {{
                  data.rate == "--"
                    ? ""
                    : data.increase
                    ? "同比增长"
                    : "同比下降"
                }}{{ data.rate }}
              </div>
            </li>
          </ul>
        </div>
        <div class="nav-box">
          <manage-number-nav
            :navArr="tabs"
            v-on:tab="getTab"
          ></manage-number-nav>
          <div class="trend">
            <div class="time">
              <ul>
                <li
                  v-for="time in timesTab"
                  :key="time.id"
                  :class="{ active: currentTab == time.id }"
                  @click="triggleTab(time.id, time.tabValue)"
                >
                  {{ time.name }}
                </li>
              </ul>
              <calendar-range
                :dateRange="dataChange"
                v-on:getDateRange="getDateRange"
              ></calendar-range>
            </div>
            <e-chart :options="polar" :init-options="initOptions"></e-chart>
          </div>
          <div class="statisticalTable">
            <div class="table">
              <div class="thead">
                <tr>
                  <th
                    v-for="item in tableArr"
                    :key="item.id"
                    @click="sortChange(item.id, item.flag, item.sortField)"
                  >
                    <span>{{ item.name }}</span>
                    <span>
                      <svg class="icon" aria-hidden="true">
                        <use v-bind:xlink:href="item.icon"></use>
                      </svg>
                    </span>
                  </th>
                </tr>
              </div>

              <div class="tbody">
                <ul>
                  <li v-for="item in sortDataArr" :key="item.id">
                    <span>{{ item.time }}</span>
                    <span>{{ item.newVisit }}</span>
                    <span>{{ item.newStore }}</span>
                    <span>{{ item.newInquiry }}</span>
                    <span>{{ item.newOrder }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import manageNumberNav from "../../../../components/common/manageNumberNav";
  import calendarRange from "../../../../components/common/calendarRange";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import _ from "lodash";
  import EChart from "vue-echarts";
  import "zrender/lib/svg/svg";

  // 手动引入 ECharts 各模块来减小打包体积
  import "echarts/lib/chart/bar";
  import "echarts/lib/chart/line";
  import "echarts/lib/chart/pie";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/title";
  import "echarts/lib/component/visualMap";
  import "echarts/lib/component/legend";

  export default {
    data() {
      return {
        isLoading: true,
        currentTab: 7,
        currentTitleTab: 0,
        dataChange: [], //选择的日期范围
        timeArr: [], //日期
        sortDataArr: [], //底部排序数据集合
        newVisitNumber: [], //新增访问店铺数
        newStoreNumber: [], //新增收藏店铺数
        newInquiryNumber: [], //新增询价单数
        newOrderNumber: [], //新增订单数
        amountData: [],
        getSelectData: {
          startTime: "",
          endTime: "",
          order: "",
          dateTime: "aWeek"
        },
        tabs: [
          "全部",
          "新增访问店铺数",
          "新增收藏店铺数",
          "新增询价单数",
          "新增订单数"
        ],
        timesTab: [
          { id: 7, name: "最近一周", tabValue: "aWeek" },
          { id: 15, name: "最近半个月", tabValue: "halfAMonth" },
          { id: 30, name: "最近一个月", tabValue: "aJan" }
        ],
        tableArr: [
          {
            id: 1,
            name: "时间",
            icon: "#iconpaixu",
            flag: -1,
            sortField: "time"
          },
          {
            id: 2,
            name: "新增访问店铺数",
            icon: "#iconpaixucopy",
            flag: -1,
            sortField: "newVisit"
          },
          {
            id: 3,
            name: "新增收藏店铺数",
            icon: "#iconpaixucopy",
            flag: -1,
            sortField: "newStore"
          },
          {
            id: 4,
            name: "新增询价单数",
            icon: "#iconpaixucopy",
            flag: -1,
            sortField: "newInquiry"
          },
          {
            id: 5,
            name: "新增订单数",
            icon: "#iconpaixucopy",
            flag: -1,
            sortField: "newOrder"
          }
        ],
        //echart配置
        initOptions: {
          renderer: "svg"
        },
        polar: {
          title: {
            text: "趋势图",
            padding: [5, 0, 0, 15]
          },
          tooltip: {},
          legend: {
            icon: "square",
            left: "16%",
            selectedMode: false,
            itemGap: 40,
            itemWidth: 16,
            data: [],
            textStyle: {
              fontSize: 14,
              color: "#666"
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ddd"
              }
            },
            axisLine: {
              // 坐标轴
              lineStyle: {
                width: "2",
                color: "#ddd"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#666",
                fontSize: "12"
              }
            },
            data: []
          },
          yAxis: {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ddd"
              }
            },
            axisLine: {
              // 坐标轴
              lineStyle: {
                width: "2",
                color: "#ddd"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#666",
                fontSize: "12"
              }
            }
          },
          series: [
            {
              name: "新增访问店铺数",
              type: "line",
              data: [],
              itemStyle: {
                color: "#0283FF"
              }
            },
            {
              name: "新增收藏店铺数",
              type: "line",
              data: [],
              itemStyle: {
                color: "#37B2AC"
              }
            },
            {
              name: "新增询价单数",
              type: "line",
              data: [],
              itemStyle: {
                color: "#FD94A7"
              }
            },
            {
              name: "新增订单数",
              type: "line",
              data: [],
              itemStyle: {
                color: "#F5A623"
              }
            }
          ]
        }
      };
    },

    mounted() {
      _getDataAll([this.getShopCountInfo(), this.getShopSelectInfo()]).then(
        () => {
          this.isLoading = false;
        }
      );
      this.polar.legend.data = this.tabs.slice(0);
      this.polar.xAxis.data = this.getTimeRange(7);
    },
    methods: {
      sortChange(id, flag, sortField) {
        _.map(this.tableArr, o => {
          if (o.id == id) {
            o.flag = flag + 1;
            if (o.flag % 2) {
              o.icon = "#iconpaixu1";
              this.sortDataArr = _.sortBy(this.sortDataArr, sortField, () => {
                return sortField;
              });
            } else {
              o.icon = "#iconpaixu";
              this.sortDataArr = _.sortBy(this.sortDataArr, sortField, () => {
                return sortField;
              }).reverse();
            }
          } else {
            o.flag = -1;
            o.icon = "#iconpaixucopy";
          }
        });
      },
      getTab(val) {
        this.currentTitleTab = val;
        this.polar.series[0].data = [];
        this.polar.series[1].data = [];
        this.polar.series[2].data = [];
        this.polar.series[3].data = [];
        if (val == 0) {
          this.polar.legend.data = this.tabs.slice(0);
          this.polar.series[0].data = this.newVisitNumber;
          this.polar.series[1].data = this.newStoreNumber;
          this.polar.series[2].data = this.newInquiryNumber;
          this.polar.series[3].data = this.newOrderNumber;
        } else if (val == 1) {
          this.polar.legend.data = ["新增访问店铺数"];
          this.polar.series[0].data = this.newVisitNumber;
        } else if (val == 2) {
          this.polar.legend.data = ["新增收藏店铺数"];
          this.polar.series[1].data = this.newStoreNumber;
        } else if (val == 3) {
          this.polar.legend.data = ["新增询价单数"];
          this.polar.series[2].data = this.newInquiryNumber;
        } else {
          this.polar.legend.data = ["新增订单数"];
          this.polar.series[3].data = this.newOrderNumber;
        }
      },
      triggleTab(currentTabId, currentTabValue) {
        this.currentTab = currentTabId;
        this.getSelectData.dateTime = currentTabValue;
        this.getSelectData.startTime = "";
        this.getSelectData.endTime = "";
        this.dataChange = [];
        this.timeArr = this.getTimeRange(currentTabId);
        this.getShopSelectInfo().then(() => {
          this.getTab(this.currentTitleTab);
        });
      },
      getDateRange(val) {
        console.log(val);
        this.currentTab = -1;
        this.dataChange = val;
        this.getSelectData.dateTime = "";
        this.getSelectData.startTime = val[0];
        this.getSelectData.endTime = val[1];
        this.timeArr = this.getDiffDate(val[0], val[1]);
        this.getShopSelectInfo().then(() => {
          this.getTab(this.currentTitleTab);
        });
      },
      async getShopCountInfo() {
        return await _getData("/store/sjHomeStore", {}).then(data => {
          //console.log("头部的统计信息:::", data);
          this.amountData = [
            {
              id: 1,
              name: "新增访问店铺数",
              amount: data.recordsNCount,
              rate:
                typeof data.recordsGrowth == "number"
                  ? Math.abs(data.recordsGrowth).toFixed(2) + "%"
                  : data.recordsGrowth,
              increase: data.recordsGrowth >= 0
            },
            {
              id: 2,
              name: "新增收藏店铺数",
              amount: data.collectNCount,
              rate:
                typeof data.collectGrowth == "number"
                  ? Math.abs(data.collectGrowth).toFixed(2) + "%"
                  : data.collectGrowth,
              increase: data.collectGrowth >= 0
            },
            {
              id: 3,
              name: "新增询价单数",
              amount: data.enquiryNCount,
              rate:
                typeof data.enquiryGrowth == "number"
                  ? Math.abs(data.enquiryGrowth).toFixed(2) + "%"
                  : data.enquiryGrowth,
              increase: data.enquiryGrowth >= 0
            },
            {
              id: 4,
              name: "新增订单数",
              amount: data.orderNCount,
              rate:
                typeof data.orderGrowth == "number"
                  ? Math.abs(data.orderGrowth).toFixed(2) + "%"
                  : data.orderGrowth,
              increase: data.orderGrowth >= 0
            }
          ];
        });
      },
      async getShopSelectInfo() {
        return await _getData("/store/homeStoreCount", this.getSelectData).then(
          data => {
            //console.log("selectInfo:::", data);
            this.polar.xAxis.data = this.timeArr;
            this.newVisitNumber = [];
            this.newStoreNumber = [];
            this.newInquiryNumber = [];
            this.newOrderNumber = [];
            _.map(this.timeArr, o => {
              if (
                _.find(data.recordsList, v => {
                  return o == v.createOn.substring(0, 10);
                })
              ) {
                this.newVisitNumber.push(
                  _.find(data.recordsList, v => {
                    return o == v.createOn.substring(0, 10);
                  }).nCount
                );
              } else {
                this.newVisitNumber.push(0);
              }
              if (
                _.find(data.orderList, v => {
                  return o == v.createOn.substring(0, 10);
                })
              ) {
                this.newOrderNumber.push(
                  _.find(data.orderList, v => {
                    return o == v.createOn.substring(0, 10);
                  }).nCount
                );
              } else {
                this.newOrderNumber.push(0);
              }
              if (
                _.find(data.enquiryList, v => {
                  return o == v.createOn.substring(0, 10);
                })
              ) {
                this.newInquiryNumber.push(
                  _.find(data.enquiryList, v => {
                    return o == v.createOn.substring(0, 10);
                  }).nCount
                );
              } else {
                this.newInquiryNumber.push(0);
              }
              if (
                _.find(data.collectList, v => {
                  return o == v.createOn.substring(0, 10);
                })
              ) {
                this.newStoreNumber.push(
                  _.find(data.collectList, v => {
                    return o == v.createOn.substring(0, 10);
                  }).nCount
                );
              } else {
                this.newStoreNumber.push(0);
              }
            });
            this.polar.series[0].data = this.newVisitNumber;
            this.polar.series[1].data = this.newStoreNumber;
            this.polar.series[2].data = this.newInquiryNumber;
            this.polar.series[3].data = this.newOrderNumber;
            const items = [];
            _.map(this.timeArr, (o, i) => {
              items.push({
                id: i,
                time: o,
                newVisit: this.newVisitNumber[i],
                newStore: this.newStoreNumber[i],
                newInquiry: this.newInquiryNumber[i],
                newOrder: this.newOrderNumber[i]
              });
            });
            this.sortDataArr = items.reverse();
          }
        );
      },
      getTimeRange(val) {
        this.timeArr = [];
        for (var i = -val; i < 0; i++) {
          this.timeArr.push(this.getCurrentTime(i));
        }
        return this.timeArr;
      },
      getCurrentTime(value) {
        var date = new Date();
        var targetDay_ms = date.getTime() + 1000 * 60 * 60 * 24 * value;
        date.setTime(targetDay_ms);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        month = this.handleMonthOrDay(month + 1);
        day = this.handleMonthOrDay(day);
        return year + "-" + month + "-" + day;
      },
      handleMonthOrDay(val) {
        var v = val;
        if (v.toString().length == 1) {
          v = "0" + val;
        }
        return v;
      },
      getDiffDate(startTime, endTime) {
        var diffDateArr = [];
        var i = 0;
        while (startTime <= endTime) {
          diffDateArr[i] = startTime;
          //获取开始日期时间戳
          var startMs = new Date(startTime).getTime();
          //增加一天时间戳后的日期
          var nextDate = startMs + 24 * 60 * 60 * 1000;
          var nextDateYear = new Date(nextDate).getFullYear() + "-";
          var nextDateMonth =
            new Date(nextDate).getMonth() + 1 < 10
              ? "0" + (new Date(nextDate).getMonth() + 1) + "-"
              : new Date(nextDate).getMonth() + 1 + "-";
          var nextDateDay =
            new Date(nextDate).getDate() < 10
              ? "0" + new Date(nextDate).getDate()
              : new Date(nextDate).getDate();
          startTime = nextDateYear + nextDateMonth + nextDateDay;
          i++;
        }
        return diffDateArr;
      }
    },
    components: {
      EChart,
      manageNumberNav,
      calendarRange,
      commonTitle
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .shopIndex {
    .common-title {
      background-color: #fff;
      padding-left: 20px;
      margin-bottom: 12px;
      border-bottom: none;
    }
    .container-box {
      .header {
        margin-bottom: 16px;
        ul {
          display: flex;
          li {
            width: 237.5px;
            height: 130px;
            margin-right: 20px;
            background-color: #fff;
            text-align: center;
            &:last-child {
              margin-right: 0;
            }
            .textName {
              margin-top: 15px;
              font-size: 14px;
              color: #666;
            }
            .number {
              font-family: PingFangSC-Semibold;
              font-weight: 600;
              font-size: 30px;
              color: #000;
              height: 42px;
              margin: 10px 0;
            }
            .increase {
              height: 22px;
              line-height: 22px;
              vertical-align: middle;
              font-size: 14px;
              color: #999;
              font-weight: 600;
              .icon {
                width: 22px;
                height: 22px;
                margin-right: 8px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .nav-box {
        .trend {
          background-color: #fff;
          height: 484px;
          padding-top: 21px;
          padding-left: 20px;
          margin-top: 1px;
          border-bottom: $border-style;
          .time {
            margin-bottom: 30px;
            display: flex;
            ul {
              display: flex;
              align-items: center;
              li {
                padding: 0 18px;
                height: 31px;
                line-height: 31px;
                text-align: center;
                color: #999;
                font-size: 14px;
                margin-right: 20px;
                cursor: pointer;
                &.active {
                  background: rgba(241, 2, 21, 0.03);
                  border-radius: 15.5px;
                  color: $theme-color;
                  font-weight: 600;
                }
              }
            }
            /deep/.ant-calendar-picker-input {
              padding: 0;
              height: 27px;
              line-height: 27px;
              .ant-calendar-range-picker-input {
                height: 100%;
              }
              .ant-calendar-picker-clear {
                right: 6px;
              }
            }
          }
          .echarts {
            width: 900px;
            height: 397px;
          }
        }
        /deep/.ant-tabs {
          .ant-tabs-bar {
            padding-left: 27px;
          }
        }
        .statisticalTable {
          padding: 34px 20px;
          background-color: #fff;
          margin-top: 1px;
          margin-bottom: 130px;
          .table {
            .thead {
              tr {
                display: flex;
                align-items: center;
                height: 48px;
                font-size: 14px;
                color: #333;
                font-weight: 600;
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                th {
                  flex: 1;
                  text-align: center;
                  span {
                    &:first-child {
                      margin-right: 4px;
                    }
                  }
                }
              }
            }
          }
          ul {
            border: $border-style;
            border-top: none;
            li {
              display: flex;
              height: 48px;
              align-items: center;
              border-bottom: 0.5px solid #ddd;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #666666;
              span {
                flex: 1;
                text-align: center;
              }
              &:last-child {
                border-bottom: none;
              }
            }
          }
        }
      }
    }
  }
</style>


