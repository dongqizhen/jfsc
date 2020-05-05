<template>
  <div class="message">
    <common-title title="消息中心"></common-title>
    <div v-if="!isLoading">
      <div class="right-box">
        <manage-number-nav
          :navArr="mainTabs"
          v-on:tab="getTab"
          :defaultActiveKey="defaultActiveKey"
        >
        </manage-number-nav>
      </div>
      <div class="tabBar">
        <div class="right-box">
          <div :class="{ active: current == 0 }" @click="read(0)">
            未读消息({{ unReadNumber }})
          </div>
          <div :class="{ active: current == 1 }" @click="read(1)">
            已读消息({{ readNumber }})
          </div>
        </div>
      </div>

      <div v-if="!isMessageLoading">
        <div class="listContainer">
          <div class="listContent" v-if="data.length > 0">
            <ul v-if="pageType == 'system'">
              <router-link
                tag="li"
                v-for="item in data"
                :key="item.id"
                :to="{
                  path: `messageDetail/${item.id}`,
                  query: { keyId: '9' }
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
                  path: `/userCenter/myMessage/contactService`,
                  query: {
                    keyId: '9',
                    topTitle: 'sub1',
                    id: item.id,
                    shopId: item.storeId,
                    sender: 'user'
                  }
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
          <no-data type="no-message" v-else text="暂无消息"></no-data>
        </div>
        <div class="tfooter">
          <check-all
            :amount="checkedList.length"
            :checkAll="checkAll"
            v-on:isCheckAll="isCheckAllMethod"
            @isDelete="batchDeleteData"
            v-show="data.length > 0"
          >
            <div slot="right-box">
              <div
                :class="['remark', checkedList.length > 0 && 'active']"
                @click="remarkRead"
                v-if="!readType"
              >
                标记已读
              </div>
            </div>
          </check-all>
        </div>
        <pagination
          ref="pagination"
          :data="paginationData"
          v-on:onPaginationChange="getPaginationChange"
          v-if="paginationData.count != 0"
        ></pagination>
      </div>

      <loading v-else :number="2"></loading>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import _ from "lodash";
  import commonTitle from "../../../../../components/common/merchantRightCommonTitle";
  import manageNumberNav from "../../../../../components/common/manageNumberNav";
  import systemNotice from "../../../../../components/messageCenter/systemNoticeItem";
  import privateMessage from "../../../../../components/messageCenter/privateMessageItem";
  import checkAll from "../../../../../components/common/checkAll";
  import pagination from "../../../../../components/common/pagination";
  import { _getData, _getDataAll } from "../../../../../config/getData";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        systemNumber: 0,
        personalNumber: 0,
        defaultActiveKey: 0,
        pageType: "system", //页面类型
        messageNumber: "",
        unReadNumber: 0,
        readNumber: 0,
        data: [],
        mainTabs: [
          {
            id: 0,
            name: "系统通知",
            amount: 0
          },
          {
            id: 1,
            name: "私信消息",
            amount: 0
          }
        ],
        isLoading: true,
        isMessageLoading: true,
        checkAll: false,
        checkedList: [],
        current: 0,
        unRead: true,
        readType: 0,
        paginationData: {}
      };
    },
    computed: { ...mapState(["userShopInfo"]) },
    methods: {
      getTab(val) {
        if (val == 0) {
          this.pageType = "system";
        } else {
          this.pageType = "private";
        }
        this.getMessageAll().then(() => {
          if (val) {
            this.unReadNumber = this.messageNumber.personalUnread;
            this.readNumber = this.messageNumber.personalRead;
          } else {
            this.unReadNumber = this.messageNumber.systemUnread;
            this.readNumber = this.messageNumber.systemRead;
          }
        });
        this.defaultActiveKey = val;
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },
      read(val) {
        this.current = val;
        this.readType = val;
        if (val == 0) {
          this.unRead = true;
        } else {
          this.unRead = false;
        }
        this.getMessageAll();
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
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
        this.checkedList = [];
        if (val) {
          this.checkAll = true;
          for (const val of this.data) {
            this.checkedList.push(val.id);
          }
        } else {
          this.checkAll = false;
        }
      },
      //批量删除
      batchDeleteData() {
        if (this.checkedList.length > 0) {
          if (this.pageType == "system") {
            _getData("/message/updateStatus", {
              ids: this.checkedList.join(","),
              flag: "delete",
              storeId: ""
            }).then(data => {
              console.log(data);
              this.$message.success("批量删除成功", 1);
              this.getMessageAll();
            });
          } else {
            _getData("/message/deleteChat", {
              ids: this.checkedList.join(","),
              flag: "user"
            }).then(data => {
              this.$message.success("批量删除成功", 1);
              this.getMessageAll();
            });
          }
        } else {
          this.$message.warning("请选择信息", 1);
          return;
        }
      }, //批量已读
      remarkRead() {
        if (this.checkedList.length > 0) {
          if (this.pageType == "system") {
            _getData("/message/updateStatus", {
              ids: this.checkedList.join(","),
              flag: "read",
              storeId: ""
            }).then(data => {
              console.log(data);
              //移动到已读列表
              this.unRead = false;
              this.current = 1;
              this.readType = 1;
              this.getMessageAll();
            });
          } else {
            _getData("/message/setChatRead", {
              ids: this.checkedList.join(","),
              storeId: ""
            }).then(data => {
              console.log(data);
              //移动到已读列表
              this.unRead = false;
              this.current = 1;
              this.readType = 1;
              this.getMessageAll();
            });
          }
        } else {
          this.$message.warning("请选择信息", 1);
          return;
        }
      },
      getPaginationChange(val) {
        if (this.pageType == "system") {
          this.getSystemMessageList(val);
        } else {
          this.getPrivateMessageList(val);
        }
      },
      //获取系统消息列表
      async getSystemMessageList(page = 1) {
        this.isMessageLoading = true;
        return await _getData("/message/list", {
          currentPage: page, //当前页
          countPerPage: "6", //每页显示条数
          storeId: "",
          readType: this.readType //消息状态 0未读，1已读，空字符串查询全部
        })
          .then(data => {
            console.log("系统信息列表：", data);
            this.checkedList = [];
            this.checkAll = false;
            this.data = data.data;
            this.paginationData = data;
          })
          .then(() => {
            this.isMessageLoading = false;
          });
      },
      //获取私信消息列表
      async getPrivateMessageList(page = 1) {
        this.isMessageLoading = true;
        return await _getData("/message/chatList", {
          currentPage: page, //当前页
          countPerPage: "6", //每页显示条数
          storeId: "",
          readType: this.readType //消息状态 0未读，1已读，空字符串查询全部
        })
          .then(data => {
            console.log("私信信息列表：", data);
            this.checkedList = [];
            this.checkAll = false;
            this.data = data.data;
            this.paginationData = data;
          })
          .then(() => {
            this.isMessageLoading = false;
          });
      },
      //获取系统消息跟私信消息的数量
      async getMessageNumber() {
        return await _getData("/message/messageNum", { storeId: "" }).then(
          data => {
            console.log("消息数量：", data);
            this.messageNumber = data;
            this.mainTabs[0].amount = data.system;
            this.mainTabs[1].amount = data.personal;
            if (this.pageType == "system") {
              this.unReadNumber = data.systemUnread;
              this.readNumber = data.systemRead;
            } else {
              this.unReadNumber = data.personalUnread;
              this.readNumber = data.personalRead;
            }
          }
        );
      },
      async getMessageAll() {
        this.isLoading = true;
        return await _getDataAll([
          this.getMessageNumber(),
          this.pageType == "system"
            ? this.getSystemMessageList()
            : this.getPrivateMessageList()
        ]).then(() => {
          this.isLoading = false;
        });
      }
    },
    created() {
      //点击头部进入页面的显示信息

      this.pageType = this.$route.query.type || "system";

      if (this.$route.query.type == "system") {
        //系统消息
        this.defaultActiveKey = 0;
        this.getSystemMessageList();
      } else if (this.$route.query.type == "private") {
        //已读消息
        this.defaultActiveKey = 1;
        this.getPrivateMessageList();
      }
    },
    mounted() {
      this.getMessageAll();
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
  @import "../../../../../assets/scss/_commonScss";
  .message {
    min-height: 693px;
    background-color: #fff;
    padding: 4px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .tabBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;
      .right-box {
        display: flex;
        align-items: center;
        height: 27px;
        div {
          width: 95px;
          height: 27px;
          // line-height: 27px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: $border-style;
          text-align: center;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
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
  }
  .listContainer {
    margin-top: 12px;
    /deep/.no-data {
      height: 500px;
    }
  }
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
      &:hover {
        opacity: 0.7;
      }
      &.active {
        background-color: #f5a623;
      }
    }
  }
</style>