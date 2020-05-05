<template>
  <a-range-picker @change="changeDate" v-model="dateValue">
    <svg class="icon" aria-hidden="true" slot="suffixIcon">
      <use xlink:href="#iconriqi1"></use>
    </svg>
  </a-range-picker>
</template>
<script>
  export default {
    data() {
      return {
        dateValue: this.dateRange
      };
    },
    props: {
      dateRange: {
        type: Array
      }
    },
    watch: {
      dateRange(newVal) {
        console.log(newVal);
        // this.dateValue = newVal;
        if (newVal.length == 0) {
          this.dateValue = newVal;
        }
      }
    },
    methods: {
      changeDate(date, dateString) {
        console.log(date, dateString);
        this.$emit("getDateRange", dateString);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .ant-calendar-picker {
    width: 200px;
    height: 27px;
    line-height: 27px;
    .ant-input {
      height: 27px;
      line-height: 27px;
      padding: 4px;
      display: flex;
      align-items: center;
      .ant-calendar-range-picker-input {
        width: 43%;
      }
      .ant-calendar-range-picker-separator {
        height: 17px;
        line-height: 17px;
      }
      .ant-calendar-picker-clear,
      .ant-calendar-picker-icon {
        right: 6px;
      }
    }
  }
</style>
