<template>
  <div class="privateLetter">
    <div class="checkBox">
      <label @click.stop="stopChange">
        <a-checkbox
          @change="onChange(data.id)"
          :checked="checkedChange(data.id)"
        ></a-checkbox>
      </label>
    </div>
    <div class="introduceBox">
      <div class="avatar">
        <img :src="data.senderImage" v-if="data.senderImage" />
        <svg class="icon" aria-hidden="true" v-else>
          <use xlink:href="#iconweidenglutouxiang"></use>
        </svg>
      </div>
      <div class="messageContent">
        <div class="userName">
          <span class="name">{{ data.senderName }}</span>
          <span>
            {{ data.createdOn ? data.createdOn.substring(0, 10) : "" }}
          </span>
        </div>
        <div class="info">
          <span>
            {{ data.content }}
          </span>
          <span class="unRead" v-if="unRead">1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";
  export default {
    data() {
      return { list: this.checkedList };
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
      unRead: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      checkedList() {
        this.list = this.checkedList;
      }
    },
    methods: {
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
      stopChange() {}
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";
  .privateLetter {
    padding: 12px 20px;
    border: $border-style;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .checkBox {
      margin-right: 16px;
    }
    .introduceBox {
      display: flex;
      flex: 1;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 13px;
        background: #cbcbcb;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          height: 25px;
          width: 25px;
        }
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
      .messageContent {
        flex: 1;
        .userName {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          span {
            font-size: 12px;
            color: #666666;
          }
          .name {
            font-size: 15px;
            color: #333333;
            font-weight: 600;
          }
        }
        .info {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #666666;
          .unRead {
            margin-left: 28px;
            width: 22px;
            height: 13px;
            line-height: 13px;
            background: $theme-color;
            border-radius: 2px;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
          }
        }
      }
    }
  }
</style>
