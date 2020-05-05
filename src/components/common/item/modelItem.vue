<template>
  <router-link
    class="model-item"
    tag="li"
    :to="{
      path: '/lookingProduct/model',
      query: {
        nav_index: $route.query.nav_index,
        categoryId: $route.query.categoryId || item.category_id,
        categoryName: $route.query.categoryName || item.category_name,
        brandId: $route.query.brandId || item.brand_id,
        brandName: $route.query.brandName || item.brand_name,
        modelId: item.id,
        modelName: item.name
      }
    }"
  >
    <a>
      <div
        class="img_box"
        v-lazy-container="{
          selector: 'img'
        }"
      >
        <img :data-src="item.pic_url" alt="" v-if="item.pic_url" />
      </div>
      <div class="introduce">
        <h2>{{ item.name }}</h2>
        <!-- <p>参考价格：<span>10～100万</span></p> -->
        <span>
          {{ item.brand_name }}/{{ item.category_name }}
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconxinghaoliebiaoliulanliang"></use>
            </svg>
            {{ item.hit }}
          </span>
        </span>
      </div>
    </a>
  </router-link>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ["item"]
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  li {
    padding: 16px;
    background: #fff;
    cursor: pointer;
    margin-bottom: 12px;
    box-shadow: $base-box-shadow;
    /deep/ img[lazy="loading"] {
      /*your style here*/
      background: url("../../../assets/images/loading.gif") no-repeat center;
      background-size: 70px;
      background-color: #f7f9fa;
    }
    /deep/ img[lazy="error"] {
      /*your style here*/
      background: url("../../../assets/images/default.png") no-repeat center;
      background-size: 100% 100%;
      //display: none;
      // background-color: #f7f9fa;
    }
    a {
      text-decoration: none;
      display: flex;
      justify-content: flex-start;
      .img_box {
        height: 130px;
        width: 130px;
        background: $base-background;
        margin-right: 20px;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
          transition: transform 0.5s ease;
        }
      }
      &:hover {
        img {
          transform: scale(1.1);
        }
      }
      .introduce {
        padding: 6px 0;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        h2 {
          font-size: 18px;
          color: #333333;
          font-weight: 600;
        }
        p {
          font-size: 14px;
          color: #999999;
          span {
            font-size: 16px;
            color: #f10215;
            font-weight: 600;
          }
        }
        > span {
          display: flex;
          font-size: 14px;
          color: #666666;
          span {
            font-size: 12px;
            color: #999999;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .icon {
              width: 15px;
              height: 10px;
              margin-right: 4px;
              margin-left: 12px;
            }
          }
        }
      }
    }
    &:hover {
      a {
        h2 {
          color: $theme-color;
        }
      }
    }
  }
</style>