<template>
  <div class="paginationBox">
    <a-pagination
      ref="page"
      showQuickJumper
      :total="data.amount || data.count"
      @change="onPaginationChange"
      :defaultPageSize="defaultPageSize"
      :pageSize="data.pageSize || data.countPerPage || data.numsPerPage"
      v-model="current"
    />
    <div class="sureBtn" @click="sureFun($event)">确定</div>
  </div>
</template>
<script>
  /**
   * @name 分页组件
   *
   * @description 依赖 Ant Design Vue 中 Pagination 组件，实现分页的功能，加入点击确定按钮跳转页面的功能
   *
   * 网址= https://vue.ant.design/components/pagination-cn/
   *
   * @props 父组件传入的数据
   * data 分页数据信息，必须包含 *总共页数-当前页-每页条数* 等信息 //!必须
   * defaultPageSize 每页的条数 默认每页20条 //?非必须
   *
   * @events 传递事件函数
   * 通过 _vm.$emit 向父组件抛出 @onPaginationChange 事件函数，父组件通过v-on:onPaginationChange接受此事件，并传入当前需要跳转的页数（page）参数
   */

  import _ from "lodash";
  export default {
    data() {
      return {
        current: 1
      };
    },
    created() {
      //this.current = this.data.currentPage;
      console.log(this.data);
    },
    props: {
      data: {
        type: [Object]
      },
      defaultPageSize: {
        type: Number,
        default: 20
      }
    },
    methods: {
      onPaginationChange(page, pageSize) {
        this.current = page;
        this.$emit("onPaginationChange", page);
      },
      isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
          return true;
        } else {
          return false;
        }
      },
      sureFun(e) {
        let childrenNodeArr = this.$refs.page.$children[0].$children[0].$children;
        console.log(childrenNodeArr);
        let index = _.findIndex(
          childrenNodeArr,
          o => o.$el.classList == "ant-pagination-options"
        );
        let inputChildNode = childrenNodeArr[index];
        let val = inputChildNode.goInputText;

        inputChildNode.go(e);
      }
    },
    mounted() {
      console.log(this.data);
      this.current = this.data.currentPage;
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .paginationBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    margin-top: 40px;
    margin-bottom: 88px;
    /deep/ul.ant-pagination {
      li {
        &:hover {
          border-color: $theme-color;
          a {
            color: $theme-color;
          }
          // border-color: $theme-color;
          // background-color: $theme-color;
          // a {
          //   color: #fff;
          // }
        }
        &.ant-pagination-item-active {
          border-color: $theme-color;
          background-color: $theme-color;
          a {
            color: #fff;
          }
        }
        &:focus {
          border-color: $theme-color;
          color: $theme-color;
        }
        .ant-pagination-options-quick-jumper input:hover {
          border-color: $theme-color;
          border-right-width: 1px !important;
        }
        .ant-pagination-options-quick-jumper input:focus {
          border-color: $theme-color;
          outline: 0;
          -webkit-box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
          box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2);
          border-right-width: 1px !important;
        }
      }
      .ant-pagination-next:focus,
      .ant-pagination-prev:focus,
      .ant-pagination-next:hover,
      .ant-pagination-prev:hover {
        .ant-pagination-item-link {
          border-color: $theme-color;
          color: $theme-color;
        }
      }
    }
    .sureBtn {
      width: 44px;
      height: 21px;
      border: 1px solid #e9e9e9;
      font-size: 12px;
      color: #666666;
      text-align: center;
      margin-left: 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
</style>
