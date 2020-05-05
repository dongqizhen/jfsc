<template>
  <div class="guideRight">
    <common-title :title="title"></common-title>
    <div class="content">
      <slot name="contentInfo"></slot>
    </div>
  </div>
</template>
<script>
  import commonTitle from "./merchantRightCommonTitle";
  export default {
    data() {
      return {};
    },
    props: {
      title: {
        type: String
      }
    },
    components: {
      commonTitle
    }
  };
</script>
<style lang="scss" scoped>
  .guideRight {
    width: 100%;
    min-height: 962px;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    .content {
      margin: 24px 0;
    }
  }
</style>
