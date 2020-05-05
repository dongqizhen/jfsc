<template>
  <div class="loading">
    <div v-if="loading != undefined" class="loadingimg">
      <img src="../../assets/images/loading.gif" alt="" />
      <span>{{ text }}</span>
    </div>
    <div v-else class="skeleton">
      <div v-for="i in rowNumber" :key="i">
        <a-skeleton :avatar="avatar" active :paragraph="{ rows: rows }" />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rowNumber: []
      };
    },
    created() {
      //console.log(this.loading != undefined);
      this.rowNumber = Array(this.number);
    },
    props: {
      text: {
        //加载文案
        type: String,
        default: "加载中,请稍后..."
      },
      loading: {
        type: String
      },
      number: {
        //显示数量
        type: Number,
        default: 4
      },
      rows: {
        //段落行数
        type: Number,
        default: 3
      },
      avatar: {} //是否显示头像
    }
  };
</script>

<style lang="scss" scoped>
  .loading {
    flex: 1;
    display: flex;
    justify-content: center;
    //align-items: center;

    .loadingimg {
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 100px;
      }
      span {
        font-size: 15px;
        color: #666666;
      }
    }
    .skeleton {
      width: 100%;
      display: flex;
      flex-direction: column;
      /deep/ .ant-skeleton {
        .ant-skeleton-header {
          padding-top: 10px;
        }
      }
    }
  }
</style>