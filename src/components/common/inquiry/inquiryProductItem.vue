<template>
  <div :class="['inquiryProductItem', { addClass: isShowInfo.current == 2 }]">
    <span
      :class="
        isShowInfo.isMerchant || isShowInfo.current == 1 ? 'boxHidden' : ''
      "
    >
      <label>
        <a-checkbox
          @change="onChange(itemData.id)"
          :checked="checkedChange(itemData.id)"
        ></a-checkbox
      ></label>
    </span>
    <span
      @click="
        turnToProductDetail(
          itemData.goodsId,
          itemData.storeId,
          itemData.isOnSale
        )
      "
    >
      <img :src="itemData.goodsImage" />
    </span>
    <span
      @click="
        turnToProductDetail(
          itemData.goodsId,
          itemData.storeId,
          itemData.isOnSale
        )
      "
    >
      {{ itemData.goodsName }}
    </span>
    <span>{{ itemData.showPrice }}</span>
    <span
      v-if="
        isShowInfo.current != 3 ||
          (isShowInfo.current == 3 && isShowInfo.isMerchant)
      "
    >
      {{ itemData.number }}
    </span>

    <span v-if="isShowInfo.current == 3 && !isShowInfo.isMerchant">
      <van-stepper v-model="itemData.number" :max="itemData.repertoryNum" />
      <i class="stockNumber">库存{{ itemData.repertoryNum }}件</i>
    </span>
    <span>
      {{
        itemData.arrivalTime ? itemData.arrivalTime.substring(0, 16) : "暂无"
      }}
    </span>
    <span
      v-if="
        isShowInfo.current != 3 ||
          (isShowInfo.current == 3 && isShowInfo.isMerchant)
      "
      style="overflow: hidden;
        word-break: break-word;"
    >
      {{ itemData.userRemark ? itemData.userRemark : "暂无备注" }}
    </span>
    <span
      v-if="isShowInfo.current == 2"
      style="overflow: hidden;
        word-break: break-word;"
    >
      {{ itemData.shopRemark ? itemData.shopRemark : "暂无备注" }}
    </span>
    <span
      v-if="isShowInfo.current == 3 && !isShowInfo.isMerchant"
      style="width:157px"
    >
      <a-textarea
        style="width:157px"
        placeholder="请输入备注"
        v-model="itemData.introduce"
      ></a-textarea>
    </span>
    <!-- <span v-if="isShowInfo.current == 2">
      ¥{{ (itemData.unitPrice * itemData.number).toFixed(2) }}
    </span> -->
  </div>
</template>
<script>
  import _ from "lodash";
  export default {
    data() {
      return {
        goodList: this.checkedList,
        checkedProductInfo: this.checkProductInfo
      };
    },
    props: {
      itemData: {
        type: Object
      },
      isShowInfo: {
        type: Object
      },
      checkedList: {
        type: Array
      },
      checkProductInfo: { type: Array }
    },
    watch: {
      checkedList(newVal) {
        this.goodList = newVal;
      }
    },
    methods: {
      turnToProductDetail(id, storeId, isOnSale) {
        if (isOnSale == 1) {
          let { href } = this.$router.resolve({
            path: `/details/productDetails/${id}`,
            query: { shopId: storeId }
          });
          window.open(href, "_blank");
        } else {
          this.$message.warning("此商品已下架");
          return;
        }
      },
      onChange(id) {
        if (_.indexOf(this.goodList, id) == -1) {
          this.goodList.push(id);
          this.checkedProductInfo.push(this.itemData);
        } else {
          this.goodList = _.without(this.goodList, id);
          this.checkedProductInfo = _.without(
            this.checkedProductInfo,
            this.itemData
          );
        }
        this.$emit("getCheckedList", {
          goodList: this.goodList,
          productInfo: this.checkedProductInfo
        });
      },
      checkedChange(id) {
        for (const val of this.goodList) {
          if (val == id) {
            return true;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  @import "../../../assets/scss/_input";
  .inquiryProductItem {
    display: flex;
    height: 90px;
    border: $border-style;
    padding: 10px 0;
    > span {
      font-size: 12px;
      color: #666;
      margin-right: 30px;
      &.boxHidden {
        visibility: hidden;
      }
      img {
        width: 70px;
        height: 70px;
      }
      &:first-child {
        width: 14px;
        margin-left: 20px;
        margin-right: 12px;
      }
      &:nth-child(2) {
        width: 70px;
        margin-right: 12px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(3) {
        width: 145px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(4) {
        width: 88px;
        word-wrap: break-word;
        overflow: hidden;
      }
      &:nth-child(5) {
        width: 80px;
        /deep/.van-stepper {
          .van-stepper__minus,
          .van-stepper__plus {
            width: 20px;
            height: 20px;
            border-radius: 0;
            border: $border-style;
            background: #f6f6f6;
            margin: 0;
            &:hover {
              cursor: pointer;
            }
          }
          .van-stepper__input {
            width: 38px;
            height: 16px;
            margin: 0;
            background-color: #fff;
            border-top: $border-style;
            border-bottom: $border-style;
          }
        }
        .stockNumber {
          font-style: normal;
          font-size: 10px;
          color: #ccc;
          margin-top: 4px;
        }
      }
      &:nth-child(6) {
        width: 68px;
        margin-right: 60px;
      }
      &:nth-child(7) {
        width: 90px;
        margin-right: 15px;
        .ant-input {
          font-size: 12px;
          resize: none;
          height: 65px;
        }
      }
      &:nth-child(8) {
        width: 91px;
        margin-right: 15px;
      }
    }
    &.addClass {
      width: 762px;
      > span {
        &:nth-child(4) {
          width: 60px;
          word-wrap: break-word;
          overflow: hidden;
        }
        &:nth-child(5) {
          width: 30px;
          /deep/.van-stepper {
            .van-stepper__minus,
            .van-stepper__plus {
              width: 20px;
              height: 20px;
              border-radius: 0;
              border: $border-style;
              background: #f6f6f6;
              margin: 0;
              &:hover {
                cursor: pointer;
              }
            }
            .van-stepper__input {
              width: 38px;
              height: 16px;
              margin: 0;
              background-color: #fff;
              border-top: $border-style;
              border-bottom: $border-style;
            }
          }
          .stockNumber {
            font-style: normal;
            font-size: 10px;
            color: #ccc;
            margin-top: 4px;
          }
        }
        &:nth-child(9) {
          width: 88px;
          margin-right: 22px;
          overflow: hidden;
          word-wrap: break-word;
        }
        &:nth-child(6) {
          width: 68px;
          margin-right: 30px;
        }
        &:nth-child(7) {
          width: 90px;
          margin-right: 15px;
          overflow: hidden;
          word-wrap: break-word;
          .ant-input {
            font-size: 12px;
            resize: none;
            height: 65px;
          }
        }
        &:nth-child(8) {
          width: 91px;
          margin-right: 15px;
          overflow: hidden;
          word-wrap: break-word;
        }
      }
    }
  }
</style>
