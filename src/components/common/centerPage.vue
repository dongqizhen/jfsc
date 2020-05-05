<template>
  <div class="centerPageCommon">
    <a-layout>
      <a-layout-header>
        <slot name="header"></slot>
      </a-layout-header>
      <a-layout>
        <a-layout-sider v-show="!(shopStatus == 0 || shopStatus == 3)">
          <div class="title">
            <slot name="Icon"></slot>
            {{ titleText }}
          </div>
          <a-menu
            mode="inline"
            :openKeys="openKeys"
            style="width: 170px"
            :defaultSelectedKeys="defaultSelectedKeys"
            :selectedKeys="[current]"
            @click="handleClick"
          >
            <a-sub-menu v-for="itemObj in dataArr" :key="itemObj.key">
              <span slot="title">
                <svg class="icon" aria-hidden="true" v-if="itemObj.icon">
                  <use v-bind:xlink:href="itemObj.icon"></use>
                </svg>
                <img :src="itemObj.pic_url" v-else />
                <span>{{ itemObj.name }}</span>
              </span>
              <a-menu-item
                v-for="menuItem in itemObj.menus"
                :key="menuItem.key"
              >
                <router-link
                  :to="{
                    path: menuItem.href,
                    query: { keyId: menuItem.key, topTitle: itemObj.key }
                  }"
                  replace
                >
                  {{ menuItem.name }}
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <div class="right-content">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-footer>
        <Footer></Footer>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
  import Footer from "../footer/footer";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        defaultKey: [],
        current: "0"
      };
    },
    props: {
      titleText: {
        type: String,
        required: true
      },
      dataArr: {
        type: Array,
        required: true
      },
      openKeys: {
        type: Array,
        default: []
      },
      defaultSelectedKeys: {
        type: Array
      },
      shopStatus: {
        type: Number
      },
      currentSelectedKeys: {
        type: String
      }
    },
    watch: {
      currentSelectedKeys(newVal) {
        console.log(newVal);
        this.current = newVal;
      }
    },
    methods: {
      handleClick(e) {
        console.log(e);
        this.current = e.key;
      }
    },
    components: {
      Footer
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .centerPageCommon {
    /deep/.ant-layout {
      background: $base-background;
      .ant-layout-header {
        padding: 0;
      }
      .ant-layout-sider {
        background: $base-background;
        width: 170px !important;
        min-width: 170px !important;
        flex: 0 !important;
        margin-right: 20px;
        margin-bottom: 111px;
        .ant-layout-sider-children {
          height: auto;
          background-color: #fff;
          .title {
            width: 100%;
            height: 69px;
            line-height: 69px;
            padding-left: 16px;
            color: #333;
            font-size: 20px;
            font-weight: 600;
            font-family: PingFangSC-Semibold;
            border-bottom: 0.2px solid #ddd;
          }
          .ant-menu-inline {
            border-right: none;
            .ant-menu-submenu {
              .ant-menu-submenu-title {
                padding-left: 20px !important;
                margin: 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
                height: 48px;
                line-height: 48px;
                .ant-menu-submenu-arrow {
                  display: none;
                }
                .icon {
                  margin-right: 7px;
                }
                > span {
                  display: flex;
                  align-items: center;
                  img {
                    width: 14px;
                    height: 14px;
                    margin-right: 7px;
                  }
                }
              }
              .ant-menu-sub {
                .ant-menu-item {
                  color: #333;
                  margin: 0;
                  height: 48px;
                  line-height: 48px;
                  padding-left: 43px !important;
                  -webkit-transition: color 0.3s
                      cubic-bezier(0.645, 0.045, 0.355, 1),
                    border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
                    background 0s cubic-bezier(0.645, 0.045, 0.355, 1),
                    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
                  transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
                    border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
                    background 0s cubic-bezier(0.645, 0.045, 0.355, 1),
                    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
                  &:hover {
                    background: #fafafa;
                    a {
                      color: $theme-color;
                    }
                  }
                  &.ant-menu-item-selected {
                    padding-right: 20px;
                    background: rgba(241, 2, 21, 0.03)
                      url("../../assets/images/redRightArrow.svg") no-repeat 140px
                      center / 14px 26px;
                    a {
                      color: $theme-color;
                    }
                  }
                  &::after {
                    border-right: none;
                  }
                }
              }
            }
          }
        }
      }
      .ant-layout-footer {
        padding: 0;
      }
    }
    .ant-layout-has-sider {
      width: 1200px;
      margin: 0 auto;
      margin-top: 24px;
    }
  }
</style>
