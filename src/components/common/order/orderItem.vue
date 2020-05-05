<template>
    <div class="orderItem">
        <order-title
            :isShowInfo="isShowInfo"
            :checkedList="checkedList"
            v-on:getChecked="getChecked"
            :data="data"
        ></order-title>
        <order-item-product
            :data="data"
            :isShowInfo="isShowInfo"
            v-on:returnValue="getReturnValue"
            v-on:deleteOperation="getDelete"
        ></order-item-product>
        <delivery-info :data="data"></delivery-info>
    </div>
</template>
<script>
import orderTitle from "./orderTitle";
import deliveryInfo from "./deliveryInformation";
import orderItemProduct from "./orderItemProduct";
export default {
    data() {
        return {};
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        checkedList: {
            type: Array,
            required: true
        },
        isShowInfo: {
            tyep: Object
        }
    },
    methods: {
        getChecked(val) {
            this.$emit("getChecked", val);
        },
        getReturnValue(val) {
            this.$emit("returnValue", val);
        },
        getDelete(val) {
            this.$emit("deleteOrder", val);
        }
    },
    components: {
        orderTitle,
        deliveryInfo,
        orderItemProduct
    }
};
</script>

<style lang="scss" scoped>
.orderItem {
    .productInfoBox {
        border-top: none;
    }
    .shippingAddress {
        border-top: none;
    }
}
</style>
