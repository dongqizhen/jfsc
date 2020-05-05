<template>
  <div class="nav">
    <div class="top_nav">
      <div class="commonWidth">
        <ul>
          <li v-for="(item, i) in nav_title" :key="`nav-${i}`">
            <a
              :class="i == defaultNav && 'active'"
              @click="nav_change(item, i)"
              >{{ item.name }}</a
            >
          </li>
          <!-- <router-link
          v-for="(item, i) in nav_title"
          :key="`nav-${i}`"
          tag="li"
          :to="{
            path: item.path,
            query: { nav_index: i }
          }"
          @click.native="nav_change(i)"
        >
          <a target="_blank" :class="i == defaultNav ? 'active' : ''">
            {{
            item.name
          }}</a>
        </router-link> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const nav_title = [
    {
      name: "首页",
      path: "/"
    }
  ];
  export default {
    data() {
      return {
        nav_title
      };
    },
    props: {
      defaultNav: {
        type: [Number, String],
        default: 0
      }
    },
    methods: {
      nav_change(item, i) {
        console.log(i);
        const { href } = this.$router.resolve({
          path: item.path,
          query: { nav_index: i }
        });
        window.open(href, "_blank");

        // this.$router.push({
        //   path: item.path,
        //   query: { nav_index: i }
        // });
      }
    },
    created() {}
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/_commonScss";

  .top_nav {
    height: 60px;
    border-bottom: 2px solid $theme-color;
    > .commonWidth {
      display: flex;
      justify-content: space-between;
      align-items: center;
      ul {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 58px;
          font-weight: 600;
          font-size: 18px;
          color: #333333;
          cursor: pointer;
          a {
            color: #333333;
            text-decoration: none;
            display: flex;
            width: 120px;
            height: 100%;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.06);
            &.active {
              background: $theme-color;
              color: #ffffff;
            }
            &:not(.active):hover {
              color: $theme-color;
            }
          }
        }
      }
      > span {
        padding: 0 14px;

        height: 35px;
        // position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        border: 1px solid #f5a623;
        font-size: 18px;
        color: #f5a623;
        font-weight: 600;
        // right: -135px;
        // top: 28px;
        line-height: 33px;
        width: 170px;
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        span {
          flex: 1;
          display: flex;
          height: 100%;
          justify-content: center;
        }
      }
    }
  }
</style>