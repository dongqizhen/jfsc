<template>
  <div class="invoiceManage">
    <common-title title="消息中心"></common-title>
    <div class="tabBar">
      <div class="left-box">
        <manage-number-nav :navArr="tabs" v-on:tab="getTab"></manage-number-nav>
      </div>
      <div class="right-box">
        <div :class="current == 1 ? 'active' : ''" @click="system(1)">
          系统通知(24)
        </div>
        <div :class="current == 2 ? 'active' : ''" @click="system(2)">
          私信消息(12)
        </div>
      </div>
    </div>
    <div class="listContainer">
      <div class="listContent">
        <ul v-if="current == 1">
          <router-link
            tag="li"
            v-for="item in data"
            :key="item.id"
            :to="{
              path: 'messageDetail',
              query: { id: item.id }
            }"
          >
            <system-notice
              :data="item"
              :checkedList="checkedList"
              v-on:getChecked="getChecked"
              :unRead="unRead"
            ></system-notice>
          </router-link>
        </ul>
        <ul v-else>
          <router-link
            class="messageBox"
            tag="li"
            v-for="item in data"
            :key="item.id"
            :to="{
              path: 'messageDetail',
              query: { id: item.id }
            }"
          >
            <private-message
              :data="item"
              :checkedList="checkedList"
              v-on:getChecked="getChecked"
              :unRead="unRead"
            ></private-message>
          </router-link>
        </ul>
      </div>
      <div class="tfooter">
        <check-all
          :amount="checkedList.length"
          :checkAll="checkAll"
          v-on:isCheckAll="isCheckAllMethod"
        >
          <div slot="right-box">
            <div
              v-bind:class="['remark', checkedList.length > 0 ? 'active' : '']"
              @click="remarkRead"
            >
              标记已读
            </div>
          </div>
        </check-all>
      </div>
    </div>
    <pagination></pagination>
  </div>
</template>

<script>
  import _ from "lodash";
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import manageNumberNav from "../../../../components/common/manageNumberNav";
  import systemNotice from "../../../../components/messageCenter/systemNoticeItem";
  import privateMessage from "../../../../components/messageCenter/privateMessageItem";
  import checkAll from "../../../../components/common/checkAll";
  import pagination from "../../../../components/common/pagination";
  export default {
    data() {
      return {
        data: [
          {
            id: 1,
            title: "卖家申请店铺审核通过提示",
            createOn: "2018-11-18",
            introduce:
              "您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发…您好，您在积分商城的开店，您在积分商城的开店申请已通过，快去发…您好..."
          },
          {
            id: 2,
            title: "卖家申请店铺审核未通过提示",
            createOn: "2018-11-19",
            introduce:
              "您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发布商品吧您好，您在积分商城的开店申请已通过，快去发…您好，您在积分商城的开店，您在积分商城的开店申请已通过，快去发…您好..."
          }
        ],
        tabs: [],
        checkAll: false,
        checkedList: [],
        current: 1,
        unRead: true
      };
    },
    beforeMount() {
      this.tabs = [
        {
          id: 2,
          name: "未读消息",
          amount: 24
        },
        {
          id: 3,
          name: "已读消息",
          amount: 12
        }
      ];
    },
    methods: {
      getTab(val) {
        if (this.tabs[0].id == val) {
          this.unRead = true;
        } else {
          this.unRead = false;
        }
      },
      system(val) {
        this.current = val;
        this.checkedList = [];
        this.checkAll = false;
      },
      getChecked(val) {
        if (typeof val == "object") {
          this.checkedList = val;
        } else {
          if (_.indexOf(this.checkedList, val) != -1) {
            this.checkedList = _.without(this.checkedList, val);
          }
        }
        if (this.checkedList.length == this.data.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      isCheckAllMethod(val) {
        if (val) {
          this.checkAll = true;
          this.checkedList = [];
          for (const val of this.data) {
            this.checkedList.push(val.id);
          }
        } else {
          this.checkAll = false;
          this.checkedList = [];
        }
      },
      remarkRead() {
        if (this.checkedList.length > 0) {
          //向后台发送请求，标记为已读，成功后将刷新数据
        }
      },
      onPaginationChange() {}
    },
    components: {
      commonTitle,
      manageNumberNav,
      systemNotice,
      privateMessage,
      checkAll,
      pagination
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .invoiceManage {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 10px;
    .tabBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: $border-style;
      margin-top: 3px;
      /deep/.nav {
        border-bottom: none;
        .ant-tabs {
          .ant-tabs-ink-bar {
            bottom: 0 !important;
          }
        }
      }
      .right-box {
        display: flex;
        align-items: center;
        height: 27px;
        div {
          width: 95px;
          height: 27px;
          line-height: 27px;
          border: $border-style;
          text-align: center;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          &:first-child {
            border-right: none;
          }
          &.active {
            background: #ffdfaa;
            border: 1px solid #f5a623;
          }
        }
      }
    }
    .listContainer {
      margin-top: 12px;
      .tfooter {
        .remark {
          width: 104px;
          height: 42px;
          background-color: #ccc;
          color: #fff;
          font-size: 14px;
          line-height: 42px;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          &.active {
            background-color: #f5a623;
          }
        }
      }
    }
  }
</style>
