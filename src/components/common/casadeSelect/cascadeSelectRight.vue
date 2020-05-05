<template>
  <div class="cascadeSelectRight">
    <div class="upBox">
      <span>
        <a-checkbox @change="checkAll" :checked="isCheckAll"></a-checkbox>全选
      </span>
    </div>
    <div class="downBox">
      <span v-for="item in data" :key="item.id">
        <a-checkbox
          @change="checkedChange(item)"
          :checked="checkedVal(item.id)"
        ></a-checkbox>
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
<script>
  import _ from "lodash";
  export default {
    data() {
      return {
        selectArr: this.defaultCityData,
        checkedAll: this.isCheckAll
      };
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      defaultCityData: {
        type: Array,
        required: true
      },
      isCheckAll: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      defaultCityData() {
        this.selectArr = this.defaultCityData;
      },
      isCheckAll() {
        this.checkedAll = this.isCheckAll;
      }
    },
    methods: {
      checkAll(e) {
        this.selectArr = [];
        if (e.target.checked) {
          for (const val of this.data) {
            this.selectArr.push(val);
          }
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
        this.$emit("getSelectArr", this.selectArr);
        this.$emit("getCheckAll", this.checkedAll);
      },
      checkedChange(item) {
        if (_.indexOf(this.selectArr, item) == -1) {
          this.selectArr.push(item);
        } else {
          this.selectArr = _.without(this.selectArr, item);
        }

        if (this.selectArr.length == this.data.length) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
        this.$emit("getSelectArr", this.selectArr);
        this.$emit("getCheckAll", this.checkedAll);
      },
      checkedVal(id) {
        for (const val of this.selectArr) {
          if (val.id == id) {
            return true;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .cascadeSelectRight {
    width: 622px;
    height: 100%;
    overflow: auto;
    background: #f7f7f7;
    padding: 20px 14px 14px 26px;
    .upBox {
      span {
        /deep/.ant-checkbox-wrapper {
          margin-right: 3.5px;
        }
      }
    }
    .downBox {
      margin-top: 20px;
      span {
        display: inline-block;
        width: 134.5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 13px;
        color: #666;
        margin-right: 10px;
        margin-bottom: 20px;
      }
    }
  }
</style>
