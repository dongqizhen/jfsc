<template>
  <div class="messageDetail">
    <message-detail-common :detailId="$route.params.id"></message-detail-common>
  </div>
</template>
<script>
  import messageDetailCommon from "../../../../components/messageCenter/messageDetailCommon";
  export default {
    data() {
      return {};
    },
    components: {
      messageDetailCommon
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .messageDetail {
    min-height: 693px;
    background-color: #fff;
    padding: 20px 70px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .content {
      .title {
        text-align: center;
        font-size: 20px;
        color: #333333;
        font-weight: 600;
        margin-bottom: 5px;
      }
      .subTitle {
        text-align: center;
        font-size: 14px;
        color: #999999;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: $border-style;
      }
      .introduce {
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        line-height: 32px;
      }
    }
  }
</style>
