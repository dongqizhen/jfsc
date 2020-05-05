<template>
  <div class="paymentMethod">
    <guide-right :title="guideTitle">
      <div class="info" slot="contentInfo" v-html="htmlData"></div>
    </guide-right>
  </div>
</template>
<script>
  import guideRight from "../../../../components/common/guideRight";
  import { _getData } from "../../../../config/getData";
  export default {
    metaInfo() {
      return {
        title: this.title,
        meta: []
      };
    },
    data() {
      return {
        htmlData: "",
        title:
          "积分商城-全国领先的医疗设备、医疗器械、医疗备件、医疗配件交易平台",
        guideTitle: ""
      };
    },
    created() {
      _getData("/topic/queryTopicObject", {
        topicCategoryId: this.$route.query.topTitle.substring(3),
        topicId: this.$route.query.keyId
      }).then(data => {
        this.htmlData = data.topicVoList[0].content;
        this.title = data.topicVoList[0].title + "-积分商城";
        this.guideTitle = data.topicVoList[0].title;
      });
    },
    components: {
      guideRight
    }
  };
</script>
<style lang="scss" scoped>
</style>
