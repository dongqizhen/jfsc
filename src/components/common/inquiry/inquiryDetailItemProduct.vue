<template>
  <div class="inquiryProductItem" :class="addClass(itemData.id)">
    <span>
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
    <span>{{ itemData.goodsBrand }}/{{ itemData.goodsModel }}</span>
    <span>{{ itemData.showPrice }}</span>
    <span>{{ itemData.number }}</span>
    <span>
      {{ itemData.arrivalTime ? itemData.arrivalTime.substring(0, 10) : "" }}
    </span>
    <span :style="isShowInfo.current == 2 ? 'width:83px' : ''">
      {{ itemData.userRemark ? itemData.userRemark : "暂无备注" }}
    </span>
    <span
      v-if="isShowInfo.current == 2"
      style="width:83px;overflow: hidden;
        word-break: break-word;"
    >
      {{ itemData.shopRemark ? itemData.shopRemark : "暂无备注" }}
    </span>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: this.checkedList
      };
    },
    props: {
      itemData: {
        type: Object
      },
      checkedList: {
        type: Array
      },
      isShowInfo: {}
    },
    watch: {
      checkedList(newVal) {
        this.list = newVal;
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
        if (_.indexOf(this.list, id) == -1) {
          this.list.push(id);
          this.$emit("getChecked", this.list);
        } else {
          this.list = _.without(this.list, id);
          this.$emit("getChecked", id);
        }
      },
      checkedChange(id) {
        for (const val of this.list) {
          if (val == id) {
            return true;
          }
        }
      },
      addClass(id) {
        for (const val of this.list) {
          if (val == id) {
            return "active";
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .inquiryProductItem {
    display: flex;
    height: 90px;
    border: $border-style;
    padding: 10px 0;

    &.active {
      background: rgba(245, 166, 35, 0.06);
    }
    span {
      font-size: 12px;
      color: #666;
      margin-right: 30px;
      img {
        width: 70px;
        height: 70px;
      }
      &:first-child {
        width: 14px;
        margin-left: 20px;
        margin-right: 12px;
        visibility: hidden;
      }
      &:nth-child(2) {
        width: 70px;
        margin-right: 12px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(3) {
        width: 155px;
        &:hover {
          cursor: pointer;
        }
      }
      &:nth-child(4) {
        width: 98px;
      }
      &:nth-child(5) {
        width: 78px;
        overflow: hidden;
        word-break: break-word;
      }
      &:nth-child(6) {
        width: 60px;
      }
      &:nth-child(7) {
        width: 68px;
        margin-right: 20px;
      }
      &:nth-child(8) {
        width: 120px;
        overflow: hidden;
        word-break: break-word;
      }
    }
  }
</style>
