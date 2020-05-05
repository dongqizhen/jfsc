<template>
  <div class="no-data">
    <img
      src="../../assets/images/no_data/no-content.png"
      alt=""
      v-if="type == 'no-content'"
    />
    <img
      src="../../assets/images/no_data/no-comment.png"
      alt=""
      v-else-if="type == 'no-comment'"
    />
    <img
      src="../../assets/images/no_data/no-search.png"
      v-else-if="type == 'no-search'"
    />
    <img
      src="../../assets/images/no_data/no-message.png"
      v-else-if="type == 'no-message'"
    />
    <img
      src="../../assets/images/no_data/no-order.png"
      v-else-if="type == 'no-order'"
    />
    <img
      src="../../assets/images/no_data/no-collect.png"
      v-else-if="type == 'no-collect'"
    />
    <span>{{ text }}</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      type: {
        type: String,
        default: "no-content"
      },
      text: {
        type: String,
        default: ""
      }
    }
  };
</script>

<style lang="scss" scoped>
  .no-data {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: rgba($color: #fff, $alpha: 0);
    flex-direction: column;
    img {
      width: 124px * 1.5;
      margin-bottom: 16px;
    }
    span {
      color: #999;
      font-size: 14px;
    }
  }
</style>