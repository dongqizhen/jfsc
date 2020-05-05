<template>
  <div class="inquiryProductItem" :class="addClass(itemData.id)">
    <span style="visibility:hidden">
      <label>
        <a-checkbox
          @change="onChange(itemData.id)"
          :checked="checkedChange(itemData.id)"
        ></a-checkbox
      ></label>
    </span>
    <span @click="turnToProductDetail(itemData)">
      <img :src="itemData.goodsImage" />
    </span>
    <span @click="turnToProductDetail(itemData)">{{ itemData.goodsName }}</span>
    <span>{{ itemData.goodsBrand }}/{{ itemData.goodsModel }}</span>
    <span>
      <a-input
        ref="unitPrice"
        placeholder="输入单价"
        v-model="itemData.unitPrice"
        @change="inputChange"
      ></a-input>
    </span>
    <span>{{ itemData.number }}</span>
    <span>
      <a-date-picker
        :format="'YYYY-MM-DD'"
        @change="onDateChange"
        :defaultValue="
          moment(
            `${itemData.arrival ? itemData.arrival : initialArrivalTime}`,
            'YYYY-MM-DD'
          )
        "
      />
    </span>
    <span>{{ itemData.userRemark }}</span>
    <span>
      <a-textarea
        placeholder="输入备注"
        v-model="itemData.shopRemark"
        @change="remarkChange"
      ></a-textarea>
    </span>
  </div>
</template>
<script>
  import moment from "moment";
  const initialArrivalTime = new Date().toLocaleDateString().replace(/\//g, "-");
  export default {
    data() {
      return { list: this.checkedList, initialArrivalTime: initialArrivalTime };
    },
    props: {
      itemData: {
        type: Object
      },
      checkedList: {
        type: Array
      },
      checkAll: {
        type: Boolean
      }
    },
    watch: {
      checkedList(newVal) {
        this.list = newVal;
      },
      checkAll(newVal) {
        console.log(newVal);
        if (newVal) {
          for (const val of this.list) {
            if (val == this.itemData.id) {
              this.$emit("getData", {
                data: this.itemData
              });
            }
          }
        }
      }
    },
    mounted() {
      if (this.itemData.isEnquiry == 1) {
        this.itemData.unitPrice = "";
      }
      this.itemData.arrivalTime = this.initialArrivalTime;
    },
    methods: {
      moment,
      onDateChange(date, dataString) {
        console.log(date, dataString);
        this.itemData.arrivalTime = dataString;
        this.$emit("getData", { data: this.itemData });
      },
      turnToProductDetail(itemData) {
        if(itemData.isOnSale==1){
let { href } = this.$router.resolve({
          path: `/details/productDetails/${itemData.goodsId}`,
          query: { shopId: itemData.storeId }
        });
        window.open(href, "_blank");
        }else{
          this.$message.warning("此产品已下架");
          return;
        }
        
      },
      onChange(id) {
        if (_.indexOf(this.list, id) == -1) {
          this.list.push(id);
          this.$emit("getChecked", this.list);
          this.$emit("getData", { data: this.itemData });
        } else {
          this.list = _.without(this.list, id);
          this.$emit("getChecked", id);
          this.$emit("getData", id);
        }
      },
      checkedChange(id) {
        for (const val of this.list) {
          if (val == id) {
            return true;
          }
        }
      },
      addClass(id) {
        for (const val of this.list) {
          if (val == id) {
            return "active";
          }
        }
      },
      inputChange(e) {
        const { value } = e.target;
        const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if (!isNaN(value) && reg.test(value)) {
        } else {
          this.itemData.unitPrice = this.itemData.unitPrice.slice(
            0,
            this.itemData.unitPrice.indexOf(value)
          );
        }
        this.$emit("getData", { data: this.itemData });
      },
      remarkChange() {
        this.$emit("getData", { data: this.itemData });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  @import "../../../assets/scss/_input";
  .inquiryProductItem {
    display: flex;
    height: 90px;
    border: $border-style;
    padding-top: 10px;
    &.active {
      background: rgba(245, 166, 35, 0.06);
    }
    span {
      font-size: 12px;
      color: #666;
      margin-right: 20px;
      img {
        width: 70px;
        height: 70px;
      }
      &:first-child {
        width: 14px;
        margin-left: 20px;
        margin-right: 12px;
      }
      &:nth-child(2) {
        width: 70px;
        margin-right: 12px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(3) {
        width: 138px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(4) {
        width: 98px;
        margin-right: 10px;
      }
      &:nth-child(5) {
        width: 98px;
        .ant-input {
          width: 98px;
          height: 21px;
          font-size: 12px;
        }
      }
      &:nth-child(6) {
        width: 50px;
      }
      &:nth-child(7) {
        width: 100px;
        margin-right: 20px;
        /deep/.ant-calendar-picker {
          width: 100px;
          height: 21px;
          margin-left: 0;
          > div {
            height: 21px;
          }
          .ant-input {
            height: 21px;
            line-height: 21px;
            padding: 4px;
          }
          .ant-calendar-picker-clear,
          .ant-calendar-picker-icon {
            right: 6px;
          }
        }
      }
      &:nth-child(8) {
        width: 98px;
        word-break: break-word;
        overflow: hidden;
      }
      &:nth-child(9) {
        width: 135px;
        margin-right: 10px;
        .ant-input {
          width: 135px;
          height: 66px;
          resize: none;
          font-size: 12px;
          padding: 4px 6px;
        }
      }
    }
  }
</style>
