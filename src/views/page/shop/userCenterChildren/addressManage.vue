<template>
  <div class="addressManage">
    <common-title title="地址管理">
      <span slot="titleRight" class="addAddress" @click="addCarSuccess">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icontianjiatupian1"></use>
        </svg>
        新增地址
      </span>
    </common-title>
    <div class="listContainer">
      <ul v-if="userAddressList.length > 0">
        <li v-for="item in userAddressList" :key="item.id">
          <div class="left-box">
            <div class="itemTr">{{ item.userName }}<span>收</span></div>
            <div class="itemTr">{{ item.address }}</div>
            <div class="itemTr">{{ item.phone }}</div>
          </div>
          <div class="right-box">
            <div class="edit" @click="addCarSuccess(item.id)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconbianjidizhi"></use>
              </svg>
              编辑
            </div>
            <div class="delete" @click="deleteModal(item.id)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconShape1"></use>
              </svg>
              删除
            </div>
          </div>
        </li>
      </ul>
      <no-data v-else text="暂无数据"></no-data>
    </div>
    <add-address-modal
      :Visible="visible"
      :type="type"
      :editId="editId"
    ></add-address-modal>
    <delete-order-modal
      :Visible="deleteVisible"
      :type="type"
      :deleteObj="deleteObj"
    ></delete-order-modal>
  </div>
</template>

<script>
  import _ from "lodash";
  import { mapState } from "vuex";
  import { _getData } from "../../../../config/getData";
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import addAddressModal from "../../../../components/modal/addAddressModal";
  import deleteOrderModal from "../../../../components/modal/deleteOrderModal";
  export default {
    data() {
      return {
        visible: false,
        deleteVisible: false,
        type: "",
        userAddressList: [],
        editId: 0,
        deleteObj: {
          deleteId: 0,
          isOrder: false
        }
      };
    },
    computed: {
      ...mapState(["isLogin", "userInfo"])
    },
    methods: {
      onChange(id) {
        console.log(id);
        _.each(this.userAddressList, (val, index) => {
          if (val.id == id) {
            if (val.status == 0) {
              _.each(this.userAddressList, (val, index) => {
                val.status = 0;
              });
              val.status = 1;
            } else {
              val.status = 0;
            }
          }
        });
      },
      addCarSuccess(id) {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
        this.editId = id;
      },
      deleteModal(id) {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.deleteVisible = true;
        this.deleteObj.deleteId = id;
      },
      getAddressList() {
        _getData(
          `${this.$API_URL.HYGLOGINURL}/server/userAddress!request.action`,
          {
            method: "appPageList",
            userid: this.userInfo.id,
            token: "",
            params: { currentPage: 1, countPerPage: 10 }
          }
        ).then(data => {
          console.log(data);
          this.userAddressList = data.result.UserAddressList;
        });
      }
    },
    mounted() {
      console.log(this.userInfo);
      this.getAddressList();
    },
    components: {
      commonTitle,
      addAddressModal,
      deleteOrderModal
    },
    watch: {
      visible(newVal) {
        if (!newVal) {
          this.getAddressList();
        }
      },
      deleteVisible(newVal) {
        if (!newVal) {
          this.getAddressList();
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .addressManage {
    min-height: 460px;
    background-color: #fff;
    padding: 4px 20px 20px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 100px;
    .addAddress {
      cursor: pointer;
    }
    .listContainer {
      margin-top: 12px;
      ul {
        li {
          width: 100%;
          height: 130px;
          border: $border-style;
          display: flex;
          margin-bottom: 10px;
          .left-box {
            width: 814px;
            padding: 20px 40px;
            .itemTr {
              margin-bottom: 10px;
              color: #333;
              font-size: 16px;
              font-weight: 600;
              &:last-child {
                margin-bottom: none;
                font-weight: normal;
              }
              span {
                font-size: 12px;
                color: #666666;
                margin-left: 8px;
                font-weight: normal;
              }
            }
          }
          .right-box {
            width: 152px;
            height: 100%;
            border-left: $border-style;
            background-color: #fbfbfb;
            padding-left: 28px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 12px;
            color: #666666;
            > div {
              &:hover {
                cursor: pointer;
                color: $theme-color;
              }
            }
            .edit {
              margin-bottom: 10px;
            }
            /deep/.ant-checkbox-wrapper {
              .ant-checkbox-inner {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                &:after {
                  width: 4px;
                  height: 8px;
                  left: 3.8px;
                  top: 0.65px;
                }
              }
              span {
                &:last-child {
                  padding-left: 5px;
                  font-size: 12px;
                  color: #666666;
                }
              }
            }
          }
        }
      }
      /deep/.no-data {
        height: 500px;
      }
    }
  }
</style>
