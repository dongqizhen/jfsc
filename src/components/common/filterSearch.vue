<template>
  <div class="filter">
    <div class="selectInfo">
      <div class="common">
        <div class="left-box">关键词</div>
        <div class="right-box">
          <a-input
            placeholder="请输入关键词"
            v-model="submitData.value"
            @pressEnter="searchData"
            @change="changeData"
          />
        </div>
      </div>
      <div class="common">
        <div class="left-box">下单日期</div>
        <div class="right-box">
          <calendar-range
            :dateRange="submitData.dateRange"
            v-on:getDateRange="getDateRange"
          ></calendar-range>
        </div>
      </div>
    </div>
    <div class="selectBtn">
      <a-button type="primary" class="search" @click="searchData">
        搜索
      </a-button>
      <a-button type="primary" class="clear" @click="clearData">
        清空
      </a-button>
    </div>
  </div>
</template>
<script>
  import calendarRange from "./calendarRange";
  import { StringDecoder } from "string_decoder";
  export default {
    data() {
      return {
        submitData: {
          value: this.defaultName,
          dateRange: []
        }
      };
    },
    props: {
      defaultName: {
        type: String
      }
    },
    methods: {
      searchData() {
        this.$emit("getSearchData", this.submitData);
      },
      clearData() {
        this.submitData = {
          value: "",
          dateRange: []
        };
        this.$emit("onlyGetData", this.submitData);
      },
      getDateRange(val) {
        console.log(val);
        this.submitData.dateRange = val;
        this.$emit("onlyGetData", this.submitData);
      },
      changeData() {
        console.log(111);
        this.$emit("onlyGetData", this.submitData);
      }
    },
    components: {
      calendarRange
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  @import "../../assets/scss/_input";
  .filter {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 24px;
    .selectInfo {
      display: flex;
      .common {
        display: flex;
        align-items: center;
        height: 27px;
        margin-right: 30px;
        .left-box {
          font-family: PingFangSC-Regular;
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
      }
    }
    .selectBtn {
      button {
        border: 0;
        color: #fff;
        font-size: 12px;
        margin-right: 10px;
        padding: 0 18px;
        height: 27px;
        line-height: 27px;
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
        background-color: $theme-color;
        border-color: $theme-color;
      }
      .clear {
        background-color: #999;
        border-color: #999;
      }
    }
  }
</style>
