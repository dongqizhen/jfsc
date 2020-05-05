<template>
  <div class="bread-crumb">
    <a-breadcrumb :routes="routes">
      <span slot="separator">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconwangyelujing"></use>
        </svg>
      </span>

      <template slot="itemRender" slot-scope="{ route, params, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.name }}
        </span>
        <router-link v-else :to="{ path: route.path }" replace>
          {{ route.name }}
        </router-link>
      </template>
    </a-breadcrumb>

    <slot name="search-type"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // routes: [
        //   {
        //     path: "/",
        //     name: "首页"
        //   },
        //   {
        //     path: "/detaile",
        //     name: "文章详情"
        //   }
        // ]
      };
    },
    props: {
      routes: {
        type: Array
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  .bread-crumb {
    display: flex;
    align-items: center;
    /deep/ .ant-breadcrumb {
      height: 57px;
      padding-top: 8px;
      display: flex;
      align-items: center;
      > span {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        height: 17px;

        .ant-breadcrumb-link {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          height: 17px;
          > a {
            text-decoration: none;
            &:hover {
              color: $theme-color;
            }
          }
        }
        .ant-breadcrumb-separator {
          margin: 0 10px;
          > span {
            display: flex;
            align-items: center;
          }
          .icon {
            width: 10px;
            height: 18px;
          }
        }
      }
    }
    .search-type {
      display: flex;
      align-items: center;
      height: 57px;
      padding-top: 8px;
      .search-type-item {
        font-size: 12px;
        color: #666666;
        height: 25px;
        display: flex;
        align-items: center;
        > .icon {
          width: 10px;
          height: 18px;
          margin: 0 10px;
        }
        span {
          height: 100%;
          padding: 0 10px;
          border: 1px solid #999999;
          display: flex;
          align-items: center;
          line-height: 23px;
          border-radius: 4px;
          .icon {
            width: 8px;
            height: 8px;
            cursor: pointer;
            margin-left: 18px;
            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
</style>