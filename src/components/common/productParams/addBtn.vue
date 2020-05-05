<template>
  <div class="itemBox" @click="addItemType">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icontianjiashangpin"></use>
    </svg>
    添加产品规格参数
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      addItemType() {
        this.$emit("getParams");
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .itemBox {
    width: 148px;
    height: 29px;
    padding: 0 14px;
    margin: 10px;
    background-color: #f5f5f5;
    border-radius: 14.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #f5a623;
    .icon {
      width: 10px;
      height: 10px;
      margin-right: 3px;
    }
  }
</style>
