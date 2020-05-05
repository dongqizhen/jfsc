<template>
  <div class="systemNotice">
    <div class="checkBox">
      <label @click.stop="stopChange">
        <a-checkbox
          @change="onChange(data.id)"
          :checked="checkedChange(data.id)"
        ></a-checkbox>
      </label>
    </div>
    <div class="introduceBox">
      <div class="title">
        <svg class="icon" aria-hidden="true" v-if="unRead">
          <use xlink:href="#iconxingzhuang1"></use>
        </svg>
        <span class="titleText">{{ data.title }}</span>
        <span class="createOn">
          {{ data.createdOn ? data.createdOn.substring(0, 10) : "" }}
        </span>
      </div>
      <div class="introduce">
        {{
          data.detail
            ? data.detail.length > 130
              ? data.detail.substr(0, 130) + "......"
              : data.detail
            : ""
        }}
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
  .systemNotice {
    padding: 12px 20px;
    border: $border-style;
    margin-bottom: 10px;
    display: flex;
    .checkBox {
      margin-right: 16px;
    }
    .introduceBox {
      .title {
        font-size: 15px;
        color: #333333;
        font-weight: 600;
        height: 21px;
        line-height: 21px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .icon {
          width: 18px;
          height: 13px;
          margin-right: 6px;
        }
        .createOn {
          font-size: 12px;
          color: #666666;
          font-weight: normal;
          margin-left: 9px;
        }
      }
      .introduce {
        font-size: 13px;
        color: #666666;
        line-height: 21px;
        a {
          color: #019ddd;
          height: 17px;
          line-height: 17px;
          .icon {
            width: 9px;
            height: 5px;
            margin-left: 3px;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
