<template>
  <div class="itemType">
    <div class="typeName">
      <a-input placeholder="请输入参数类型"></a-input>
    </div>
    <div class="typeValue">
      <param-item></param-item>
    </div>
  </div>
</template>
<script>
  import paramItem from "./paramItem";
  export default {
    data() {
      return {};
    },
    components: {
      paramItem
    }
  };
</script>
<style lang="scss" scoped>
  .itemType {
    display: flex;
    .typeName {
      width: 145px;
      padding: 14px 16px;
    }
  }
</style>
