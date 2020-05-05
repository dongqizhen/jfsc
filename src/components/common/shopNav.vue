<template>
  <div class="shop-nav">
    <div class="nav">
      <a-tabs
        :defaultActiveKey="defaultActiveKey"
        @change="callback"
        @tabClick="tabClick"
        v-model="val"
      >
        <a-tab-pane
          :tab="item"
          v-for="(item, i) in navArr"
          :key="i"
        ></a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        val: 0
      };
    },
    props: {
      navArr: {
        type: Array,
        required: true
      },
      defaultActiveKey: {
        type: Number,
        default: 0
      }
    },
    methods: {
      callback(key) {},
      tabClick(key, val) {
        this.$emit("tabClick", key, val);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .nav {
    height: 54px;
    background: #fff;
    box-shadow: $base-box-shadow;
    margin-bottom: 20px;
    /deep/ .ant-tabs {
      height: 100%;
      .ant-tabs-bar {
        margin-bottom: 0;
        .ant-tabs-nav-container {
          margin-bottom: 0;
          height: 54px;
          .ant-tabs-nav-wrap {
            .ant-tabs-nav-scroll {
              .ant-tabs-nav {
                padding-left: 40px;
                > div {
                  display: flex;
                  justify-content: flex-start;
                  .ant-tabs-tab {
                    height: 54px;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 60px;
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
                  bottom: 0;
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