<template>
  <div class="listTitle">
    <ul>
      <li v-for="item in titleArr" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      titleArr: {
        type: Array,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .listTitle {
    width: 100%;
    height: 40px;
    background-color: #f8f8f8;
    border: $border-style;
    ul {
      display: flex;
      align-items: center;
      height: 40px;
      li {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        &:first-child {
          width: 70px;
          margin-left: 46px;
          margin-right: 12px;
        }
        &:nth-child(2) {
          width: 155px;
          margin-right: 30px;
        }
        &:nth-child(3) {
          width: 100px;
          margin-right: 30px;
        }
        &:nth-child(4) {
          width: 83px;
          margin-right: 30px;
        }
        &:nth-child(5) {
          width: 113px;
          margin-right: 30px;
        }
        &:nth-child(6) {
          width: 137px;
          margin-right: 30px;
        }
      }
    }
  }
</style>
