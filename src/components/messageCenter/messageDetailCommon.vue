<template>
  <div class="messageDetailCommon">
    <div class="content">
      <div class="title">{{ data.title }}</div>
      <div class="subTitle">
        {{ data.createdOn ? data.createdOn.substring(0, 16) : "" }}
      </div>
      <div class="introduce">
        {{ data.detail ? data.detail.split("sn")[0] : "" }}
        <router-link
          target="_blank"
          v-if="data.messageModule ? data.messageModule.type == 1 : 'true'"
          :to="{
            path:
              userType == 'user'
                ? '/userCenter/myOrder'
                : '/merchant/orderManage',
            query: {
              keyId: userType == 'user' ? '3' : '7',
              status: data.messageModule ? data.messageModule.status : 0,
              orderNumber: data.messageModule ? data.messageModule.orderSn : 0
            }
          }"
        >
          {{ data.detail ? "sn" + data.detail.split("sn")[1] : "" }}
        </router-link>
        <router-link
          target="_blank"
          v-else-if="data.messageModule ? data.messageModule.type == 2 : 'true'"
          :to="{
            path:
              userType == 'user'
                ? '/userCenter/myInquiry'
                : '/merchant/inquiryManage',
            query: {
              keyId: userType == 'user' ? '2' : '6',
              status: data.messageModule ? data.messageModule.status : 0,
              inquiryNumber: data.messageModule ? data.messageModule.orderSn : 0
            }
          }"
        >
          {{ data.detail ? "sn" + data.detail.split("sn")[1] : "" }}
        </router-link>
        <span v-else>{{ data.detail }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { _getData } from "../../config/getData";
  export default {
    data() {
      return {
        data: {},
        userType: "user"
      };
    },
    props: {
      detailId: {}
    },
    mounted() {
      //根据id获取相应的信息内容
      if (this.$route.path.indexOf("userCenter") != -1) {
        this.userType = "user";
      } else {
        this.userType = "store";
      }
      _getData("/message/detail", {
        id: this.$route.params.id,
        storeId: this.$route.query.storeId
      }).then(data => {
        console.log(data);
        this.data = data;
      });
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .messageDetailCommon {
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
        a {
          font-size: 18px;
          font-weight: 600;
          border-bottom: 1px solid #1890ff;
        }
      }
    }
  }
</style>
