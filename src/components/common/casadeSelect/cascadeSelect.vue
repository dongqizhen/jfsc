<template>
  <div class="cascadeSelectBox">
    <div :class="['selectText', isShow ? 'active' : 'unactive']">
      <span>
        <div v-if="defaultProvinceData.length == 0">请选择省/市</div>
        <div v-else>
          <i v-for="(item, index) in defaultProvinceData" :key="item.id">
            {{ item.provinceName }}
            {{ item.provinceName == "全国" ? "" : `(${item.count})` }}
            {{ index == defaultProvinceData.length - 1 ? "" : "/" }}
          </i>
        </div>
      </span>
      <span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icontianjiaduibichanpinxiala"></use>
        </svg>
      </span>
    </div>
    <div class="selectValBox" v-show="isShow">
      <div class="left-box">
        <ul>
          <li
            v-for="item in provinceData"
            :key="item.id"
            :class="[addClass(item.id), currentId == item.id ? 'active' : '']"
            @click="activeEvent(item.id, item)"
          >
            <i></i>
            {{ item.name }}
            <span v-for="dataItem in defaultProvinceData" :key="dataItem.id">
              <span v-show="dataItem.id == item.id">
                {{
                  dataItem.provinceName == "全国" ? "" : `(${dataItem.count})`
                }}
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div class="right-box">
        <cascade-right
          :data="cityData"
          :defaultCityData="defaultCityData"
          v-on:getSelectArr="getSelectArr"
          v-on:getCheckAll="getCheckAllMethod"
          :isCheckAll="isCheckAll"
        ></cascade-right>
      </div>
    </div>
  </div>
</template>
<script>
  import cascadeRight from "./cascadeSelectRight";
  import { _getData } from "../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        provinceData: [],
        cityData: [],
        defaultCityData: [],
        currentId: -1,
        activeProvinceName: "",
        selectArr: [],
        provinceId: -1,
        isCheckAll: false,
        defaultProvinceData: this.defaultData
      };
    },
    props: {
      isShow: {
        type: Boolean,
        required: true
      },
      defaultData: {
        type: Array,
        required: true
      }
    },
    watch: {
      defaultData() {
        this.defaultProvinceData = this.defaultData;
      }
    },
    methods: {
      addClass(id) {
        for (const val of this.defaultProvinceData) {
          if (id == val.id) {
            return "select-active";
          }
        }
      },
      activeEvent(id, item) {
        this.currentId = id;
        this.getCityData(id);
        this.activeProvinceName = item.name;
      },
      getCityData(id) {
        _getData("address/getCity", { provinceId: id }).then(data => {
          console.log(data);
          this.cityData = data;
          if (
            _.filter(this.defaultProvinceData, value => {
              return id == value.id;
            }).length != 0
          ) {
            this.defaultCityData = _.filter(this.defaultProvinceData, value => {
              return id == value.id;
            })[0].defaultCityData;
          } else {
            this.defaultCityData = [];
          }
          if (this.defaultCityData.length == data.length) {
            this.isCheckAll = true;
          } else {
            this.isCheckAll = false;
          }
        });
      },
      getSelectArr(arr) {
        console.log("选择的值：", arr);
        if (arr.length != 0 && arr[0].name == "全国") {
          this.defaultProvinceData = [];
          this.defaultProvinceData.push({
            id: this.currentId,
            provinceName: this.activeProvinceName,
            count: "",
            defaultCityData: arr
          });
        } else {
          if (
            this.defaultProvinceData.length == 1 &&
            this.defaultProvinceData[0].provinceName == "全国"
          ) {
            this.defaultProvinceData = [];
          }
          _.forEach(this.defaultProvinceData, value => {
            if (value.id == this.currentId) {
              this.defaultProvinceData = _.without(
                this.defaultProvinceData,
                value
              );
            }
          });
          if (arr.length != 0) {
            this.defaultProvinceData.push({
              id: this.currentId,
              provinceName: this.activeProvinceName,
              count: arr.length == this.cityData.length ? "全部" : arr.length,
              defaultCityData: arr
            });
          }
        }

        // console.log(this.defaultProvinceData);
        this.$emit("getSaleArea", this.defaultProvinceData);
      },
      getCheckAllMethod(val) {
        console.log(val);
        this.isCheckAll = val;
      }
    },
    components: {
      cascadeRight
    },
    mounted() {
      _getData("address/getProvince", {}).then(data => {
        console.log(data);
        this.provinceData = data;
        this.activeProvinceName = data[0].name;
        _getData("address/getCity", { provinceId: data[0].id }).then(data => {
          console.log(data);
          this.cityData = data;
          this.currentId = data[0].id;
          // _.each(this.defaultProvinceData, val => {
          //   val.id = val.provinceId;
          // });
          _.forEach(this.defaultProvinceData, value => {
            if (data[0].id == value.id) {
              this.defaultCityData = value.defaultCityData;
            }
          });
          if (data.length == this.defaultCityData.length) {
            this.isCheckAll = true;
          }
        });
      });
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .cascadeSelectBox {
    .selectText {
      width: 390px;
      min-height: 33px;
      padding-left: 10px;
      padding-right: 20px;
      border: $border-style;
      border-radius: 3px;
      color: #ccc;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      &.active {
        border-color: $theme-color;
        box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
        .icon {
          transform: rotate(180deg);
          transition: all 0.3s;
        }
      }
      &.unactive {
        .icon {
          transform: rotate(0deg);
          transition: all 0.3s;
        }
      }
      span {
        &:first-child {
          min-height: 100%;
          div {
            min-height: 30px;
            line-height: 30px;
            i {
              font-style: normal;
              color: #333;
            }
          }
        }
        &:last-child {
          display: flex;
          margin-top: 13px;
          .icon {
            width: 13px;
            height: 7px;
            vertical-align: middle;
          }
        }
      }
    }
    .selectValBox {
      width: 797px;
      height: 472px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      position: absolute;
      background-color: #fff;
      z-index: 111;
      display: flex;
      .left-box {
        width: 175px;
        height: 100%;
        ul {
          height: 100%;
          overflow-y: scroll;
          padding: 16.5px 0;
          -ms-overflow-style: none;
          overflow: -moz-scrollbars-none;
          &::-webkit-scrollbar {
            width: 0 !important;
          }
          li {
            padding-left: 25px;
            height: 20px;
            margin-bottom: 16.5px;
            font-size: 14px;
            position: relative;
            display: flex;
            align-items: center;
            cursor: pointer;
            &.active {
              color: #019ddd;
              i {
                display: block;
              }
            }
            &.select-active {
              color: #019ddd;
              span {
                display: block;
              }
            }
            i {
              width: 3px;
              height: 15px;
              position: absolute;
              left: 0;
              top: center;
              background: #019ddd;
              display: none;
            }
            span {
              display: none;
            }
          }
        }
      }
    }
  }
</style>