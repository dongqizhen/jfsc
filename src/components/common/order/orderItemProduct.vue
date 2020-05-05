<template>
  <div class="productInfoBox">
    <div class="productInfo">
      <div
        class="itemProduct"
        v-for="product in data.goodsList"
        :key="product.id"
        @click="
          turnToProductDetail(
            product.goods_id,
            data.storeId,
            product.is_on_sale
          )
        "
      >
        <span><img :src="product.list_pic_url"/></span>
        <span>{{ product.goods_name }}</span>
        <span>
          ￥{{
            product.retail_price ? product.retail_price.toFixed(2) : "0.00"
          }}
        </span>
        <span>{{ product.number }}</span>
      </div>
    </div>
    <div class="actualPrice">
      ￥{{ data.actual_price ? data.actual_price.toFixed(2) : "0.00" }}
    </div>
    <div class="operating">
      <div class="lookPay" ref="lookPay" @click="addModal(data.id)">
        {{
          data.order_status == 1
            ? ""
            : data.isPayProve == 0
            ? isShowInfo.isMerchant
              ? isShowInfo.isDetail
                ? data.order_status != 6
                  ? "--"
                  : ""
                : ""
              : data.order_status == 6 || data.order_status == 7
              ? isShowInfo.isDetail
                ? "--"
                : ""
              : "提交支付证明"
            : "查看支付证明"
        }}
      </div>
      <div
        class="sure"
        @click="confirmOrder(data.id)"
        v-if="data.order_status == 1 && isShowInfo.isMerchant"
      >
        确认接单
      </div>
      <div
        class="lookOrderDetail"
        v-if="
          !isShowInfo.isMerchant &&
            (data.order_status == 1 || data.order_status == 2)
        "
        @click="cancelOrder(data.id)"
      >
        取消订单
      </div>
      <div
        class="sure"
        @click="confirmDelivery(data.id)"
        v-if="data.order_status == 2 && isShowInfo.isMerchant"
      >
        确认发货
      </div>
      <div
        class="sure"
        @click="confirmReceipt(data.id)"
        v-if="data.order_status == 3 && !isShowInfo.isMerchant"
      >
        确认收货
      </div>
      <div
        class="sure"
        v-if="data.order_status == 4 && !isShowInfo.isMerchant"
        @click="toComment(data.id)"
      >
        评价
      </div>
      <div
        class="sure"
        @click="confirmReturn(data.id)"
        v-if="data.order_status == 6 && isShowInfo.isMerchant"
      >
        确认退货
      </div>
      <div
        class="sure"
        @click="applicationReturn"
        v-if="
          (data.order_status == 3 ||
            data.order_status == 4 ||
            data.order_status == 5) &&
            !isShowInfo.isMerchant &&
            isShowInfo.isDetail
        "
      >
        申请退货
      </div>
      <div class="lookOrderDetail" v-if="!isShowInfo.isDetail">
        <router-link
          tag="a"
          target="_blank"
          :to="{
            path: `orderDetail/${data.id}`,
            query: {
              keyId: isShowInfo.isMerchant ? '7' : '3',
              topTitle: isShowInfo.isMerchant ? 'sub2' : 'sub1'
            }
          }"
        >
          查看订单详情
        </router-link>
      </div>
      <div
        class="deleteOrder"
        v-if="
          !isShowInfo.isDetail &&
            (data.order_status == 5 || data.order_status == 7)
        "
        @click="deleteModal(data.id)"
      >
        删除
      </div>
    </div>
    <pay-img-modal
      :Visible="visible"
      :type="type"
      :imgUrl="data.payProve"
    ></pay-img-modal>
    <confirm-delivery
      :Visible="sureVisible"
      :type="type"
      :orderId="orderId"
      v-on:returnValue="getReturnStatus"
    ></confirm-delivery>
    <submit-comment
      :Visible="commentVisible"
      :type="type"
      :data="data.goodsList"
    ></submit-comment>
    <submit-pay
      :Visible="payVisible"
      :type="type"
      :orderId="orderId"
    ></submit-pay>
    <delete-order
      :Visible="deleteVisible"
      :type="type"
      :deleteObj="deleteObj"
    ></delete-order>
    <confirm-receipt
      :Visible="confirmVisible"
      :type="type"
      :orderId="orderId"
      @returnValue="getReturnStatus"
    ></confirm-receipt>
  </div>
</template>
<script>
  import payImgModal from "../../modal/payImgModal";
  import confirmDelivery from "../../modal/confirmDelivery";
  import submitComment from "../../modal/submitComment";
  import submitPay from "../../modal/submitPayImg";
  import deleteOrder from "../../modal/deleteOrderModal";
  import confirmReceipt from "../../modal/confirmReceipt";

  import { mapState } from "vuex";
  import { _getData } from "../../../config/getData";
  export default {
    data() {
      return {
        sureOrderLoading: false,
        visible: false,
        sureVisible: false,
        commentVisible: false,
        payVisible: false,
        deleteVisible: false,
        confirmVisible: false,
        type: "",
        deleteObj: {
          isOrder: true,
          deleteId: ""
        },
        orderId: -1
      };
    },
    props: {
      data: {
        type: Object
      },
      isShowInfo: {
        type: Object
      }
    },
    watch: {
      deleteVisible(newVal) {
        if (!newVal) {
          this.$emit("deleteOperation", true);
        }
      }
    },
    methods: {
      toComment(orderId) {
        _getData("/order/orderDetails", { id: orderId }).then(data => {
          console.log("获取订单详情：", data);
          if (data.order_status == 5) {
            this.$message.warning("此订单已经评价，无需在评价");
            this.$emit("returnValue", 4);
          } else {
            const { href } = this.$router.resolve({
              path: `/userCenter/comment/${orderId}`,
              query: { keyId: "3", topTitle: "sub1" }
            });
            window.open(href, "_blank");
          }
        });
      },
      turnToProductDetail(id, storeId, isOnSale) {
        if (isOnSale == 1) {
          let { href } = this.$router.resolve({
            path: `/details/productDetails/${id}`,
            query: { shopId: storeId }
          });
          window.open(href, "_blank");
        } else {
          this.$message.warning("此产品已下架");
          return;
        }
      },
      //确认订单
      confirmOrder(orderId) {
        if (!this.sureOrderLoading) {
          console.log(orderId);
          this.sureOrderLoading = true;
          _getData("/order/updateOrderStatus", {
            orderId: orderId,
            orderStatus: "connect"
          }).then(data => {
            console.log(data);
            this.sureOrderLoading = false;
            if (this.$route.name == "订单详情") {
              this.$router.replace({
                path: "/merchant/orderManage",
                query: { keyId: "7", status: 2 }
              });
            } else {
              this.$emit("returnValue", 2); //2表示已经接单，进入待发货状态
            }
          });
        }
      },
      //取消订单
      cancelOrder(orderId) {
        _getData("/order/updateOrderStatus", {
          orderId: orderId,
          orderStatus: "cancel"
        }).then(data => {
          console.log(data);
          if (this.$route.name == "我的订单详情") {
            this.$router.replace({
              path: "/userCenter/myOrder",
              query: { keyId: "3", status: 7 }
            });
          } else {
            this.$emit("returnValue", 7); //7表示关闭接单
          }
        });
      },
      //确认收货
      confirmReceipt(orderId) {
        if (!this.isLogin) {
          this.type = "login";
        } else {
          this.confirmVisible = true;
          this.orderId = orderId;
        }
      },
      //申请退货
      applicationReturn() {
        _getData("/order/updateOrderStatus", {
          orderId: this.$route.params.id,
          orderStatus: "retreat"
        }).then(data => {
          console.log(data);
          this.$message.success("申请成功", 1);
          if (this.$route.name == "我的订单详情") {
            this.$router.replace({
              path: "/userCenter/myOrder",
              query: { keyId: "3", status: 6 }
            });
          } else {
            this.data.order_status = 6;
          }
        });
      },
      //确认退货
      confirmReturn(orderId) {
        _getData("/order/updateOrderStatus", {
          orderId: orderId,
          orderStatus: "refundConfirm"
        }).then(data => {
          console.log(data);
          if (data.code != 500) {
            this.$message.success("操作成功", 1);
            if (this.$route.name == "订单详情") {
              this.$router.replace({
                path: "/merchant/orderManage",
                query: { keyId: "7", status: 7 }
              });
            } else {
              this.$emit("returnValue", 7); //7表示关闭
            }
          }
        });
      },
      getReturnStatus(val) {
        console.log(val);
        this.$emit("returnValue", val);
      },
      //支付证明弹框
      addModal(id) {
        if (this.$refs.lookPay.innerText != "--") {
          if (!this.isLogin) {
            this.type = "login";
          } else {
            if (this.data.isPayProve == 1) {
              this.visible = true;
            } else {
              this.payVisible = true;
              this.orderId = id;
            }
          }
        }
      },
      //确认发货弹框
      confirmDelivery(id) {
        if (!this.isLogin) {
          this.type = "login";
        } else {
          this.sureVisible = true;
          this.orderId = id;
        }
      },
      //评论弹框
      commentModal() {
        if (!this.isLogin) {
          this.type = "login";
        } else {
          this.commentVisible = true;
        }
      },
      //删除弹框
      deleteModal(id) {
        if (!this.isLogin) {
          this.type = "login";
        } else {
          this.deleteVisible = true;
          this.deleteObj.deleteId = id;
          this.deleteObj.isMerchant = this.isShowInfo.isMerchant;
        }
      }
    },
    computed: {
      ...mapState(["isLogin"])
    },
    components: {
      payImgModal,
      confirmDelivery,
      submitComment,
      submitPay,
      deleteOrder,
      confirmReceipt
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .productInfoBox {
    display: flex;
    border: $border-style;
    .productInfo {
      width: 598px;
      .itemProduct {
        display: flex;
        height: 90px;
        padding: 10px 0;
        border-bottom: $border-style;
        &:hover {
          cursor: pointer;
        }
        &:last-child {
          border-bottom: none;
        }
        span {
          margin-right: 30px;
          &:first-child {
            width: 70px;
            margin-left: 20px;
            margin-right: 12px;
            img {
              width: 70px;
              height: 70px;
            }
          }
          &:nth-child(2) {
            width: 155px;
          }
          &:nth-child(3) {
            width: 100px;
          }
        }
      }
    }
    .actualPrice {
      width: 190px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: $border-style;
      color: $theme-color;
      font-size: 16px;
      font-weight: 600;
    }
    .operating {
      width: 175px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: $border-style;
      padding-top: 10px;
      div {
        margin-bottom: 10px;
        font-size: 12px;
        color: #333;
        &:hover {
          color: $theme-color;
          cursor: pointer;
        }
        a {
          color: #333;
          &:hover {
            color: $theme-color;
          }
        }
      }
    }
  }
</style>
