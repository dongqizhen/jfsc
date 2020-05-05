<template>
  <div class="manageNumberNav">
    <div class="nav">
      <a-tabs
        v-if="typeof navArr[0] === 'object'"
        :defaultActiveKey="defaultActiveKey"
        @change="callBack"
        v-model="activeKey"
      >
        <a-tab-pane
          v-for="item in navArr"
          :tab="`${item.name}(${item.amount})`"
          :key="item.id"
        ></a-tab-pane>
      </a-tabs>
      <a-tabs :defaultActiveKey="0" @change="callBack" v-else>
        <a-tab-pane
          v-for="(item, i) in navArr"
          :tab="item"
          :key="i"
        ></a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return { activeKey: this.defaultActiveKey };
    },
    props: {
      navArr: {
        type: Array,
        required: true
      },
      defaultActiveKey: {}
    },
    watch: {
      defaultActiveKey(newVal) {
        // console.log(newVal);
        this.activeKey = newVal;
      }
    },
    methods: {
      callBack(key) {
        // console.log(key);
        this.$emit("tab", key);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .nav {
    height: 54px;
    background: #fff;
    border-bottom: $border_style;
    /deep/.ant-tabs {
      height: 100%;
      .ant-tabs-bar {
        margin-bottom: 0;
        .ant-tabs-nav-container {
          margin-bottom: 0;
          height: 54px;
          .ant-tabs-nav-wrap {
            .ant-tabs-nav-scroll {
              .ant-tabs-nav {
                > div {
                  display: flex;
                  justify-content: flex-start;
                  .ant-tabs-tab {
                    height: 54px;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 30px;
                    font-size: 15px;
                    color: #666666;
                    &.ant-tabs-tab-active {
                      color: $theme-color;
                    }
                    &:hover {
                      color: $theme-color;
                    }
                  }
                }
                .ant-tabs-ink-bar {
                  bottom: 1px;
                  height: 2px;
                  background: $theme-color;
                }
              }
            }
          }
        }
      }
      .ant-tabs-content {
        display: none;
      }
    }
  }
</style>
