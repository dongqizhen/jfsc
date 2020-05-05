<template>
  <div class="brand-category">
    <div class="brand">
      <div class="commonWidth">
        <h2>
          <span class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconchanpinfenlei"></use>
            </svg>
            品牌分类
          </span>
          <span class="btn" @click="handleClick" v-if="isShow && isLogin">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconguanlichangyongfenlei"></use>
            </svg>
            管理常用品牌
          </span>
        </h2>
        <div class="product_container">
          <div class="swiper-container nav_slide">
            <div class="swiper-wrapper" ref="nav">
              <div
                class="swiper-slide"
                v-for="(item, i) in navArr"
                :key="item.id"
                :class="i == defaultsVal && 'active'"
                @click="navHandleClick(item, i, $event)"
                @mouseenter="activeVal = i"
                @mouseleave="activeVal = null"
              >
                <svg class="icon" aria-hidden="true">
                  <use
                    :xlink:href="
                      i == defaultsVal || activeVal == i
                        ? item.iconActive
                        : item.icon
                    "
                  ></use>
                </svg>
                {{ item.name }}
              </div>

              <div class="bar"><i></i></div>
            </div>
          </div>
          <div class="swiper-container page">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div v-if="pageArr.length == 0" @click="handleClick">
                  <no-data
                    type="no-collect"
                    class="noData"
                    text="暂无常用品牌，请去管理常用品牌"
                  ></no-data>
                </div>
                <ul v-else>
                  <router-link
                    :to="{
                      path: '/lookingProduct',
                      query: {
                        nav_index: 2,
                        brandId: item.id,
                        brandName: item.name
                      }
                    }"
                    tag="li"
                    v-for="(item, index) in pageArr"
                    :key="item.id"
                  >
                    <a target="_blank">
                      <div class="img_box">
                        <img :src="item.app_list_pic_url" />
                        <img
                          v-if="name == '一线品牌'"
                          :src="
                            '../../assets/images/o-0' +
                              ((index + 1) % 12) +
                              '.png'
                          "
                          class="over"
                        />
                      </div>
                      {{ item.name }}
                    </a>
                  </router-link>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <common-brands-modal-vue
          :brandVisible="brandVisible"
          v-on:success="success"
        ></common-brands-modal-vue>
      </div>
    </div>
  </div>
</template>

<script>
  import CommonBrandsModalVue from "../modal/CommonBrandsModal.vue";
  import Swiper from "swiper/dist/js/swiper.js";
  import { mapState, mapMutations } from "vuex";
  import { _getData } from "../../config/getData";

  export default {
    data() {
      return {
        arr: "", //全部类型的品牌
        navArr: [
          {
            name: "一线品牌",
            id: "yixian",
            iconActive: "#iconyixianpinpai",
            icon: "#iconyixianpinpai-copy"
          }
        ],
        pageArr: [],
        activeVal: 0,
        isShow: true, //是否显示管理常用分类按钮
        name: "",
        defaultsVal: 0, //默认高量nav下标
        brandVisible: false //控制modal层弹出
      };
    },
    methods: {
      //控制弹出层显示
      handleClick() {
        this.brandVisible = true;
      },
      success() {
        this.getCommonBrand();
      },
      //点击nav
      navHandleClick(item, i, e) {
        //点击nav
        if (item.id) {
          this.isShow = false;
          this.pageArr = this.arr.firstLineList;
        } else {
          this.isShow = true;
          this.getCommonBrand();
        }
        this.defaultsVal = i;
        this.name = item.name;
        this.tap(i);
      },
      init() {
        this.nav = this.$refs.nav;
        //获取第一个slide的宽
        let navSlideWidth = this.nav.firstChild.clientWidth;
        //获取bar元素
        console.log(this.nav);
        this.bar = this.nav.querySelector(".bar");
        //初始化bar的宽度
        this.bar.style.width = navSlideWidth + "px";
      },
      tap(i) {
        this.bar.style.width =
          this.nav.querySelectorAll(".swiper-slide")[i].clientWidth + "px";
        this.bar.style.transform =
          "translateX(" +
          this.nav.querySelectorAll(".swiper-slide")[i].offsetLeft +
          "px)";
      },
      async getCommonBrand() {
        return await _getData("ubrand/list", {})
          .then(data => {
            this.pageArr = data.userBrandList;
          })
          .then(() => {});
      },
      //获取常用分类
      async getCommonBrandCategory() {
        _getData("brand/merge", {}).then(data => {
          console.log("品牌分类", data);
          if (this.isLogin) {
            // this.pageArr = data.userbrandList;
          } else {
            this.pageArr = data.firstLineList;
          }

          this.arr = data;
        });
      }
    },
    computed: {
      ...mapState(["isLogin"])
    },
    created() {
      //如果登录 则显示常用分类
      if (this.isLogin) {
        this.name = "常用品牌";
        this.navArr.unshift({
          name: "常用品牌",
          id: "",
          iconActive: "#iconpingjiashixinwujiaoxing",
          icon: "#iconchangyong"
        });
      } else {
        this.name = "一线品牌";
      }
    },
    components: { CommonBrandsModalVue },
    mounted() {
      if (this.isLogin) {
        this.getCommonBrand();
      }
      this.getCommonBrandCategory();
      this.$nextTick().then(() => {
        this.init();
        new Swiper(".brand-category .swiper-container.nav_slide", {
          slidesPerView: "auto",
          // freeMode: true,
          direction: "horizontal",
          slideToClickedSlide: true,
          on: {
            init: function() {
              this.navSlideWidth = this.slides[0].clientWidth; //导航字数需要统一,每个导航宽度一致

              // this.bar = this.$el.find(".bar");

              // this.bar.transition(300);
              this.navSum = this.slides[this.slides.length - 1].offsetLeft; //最后一个slide的位置

              this.clientWidth = parseInt(this.$wrapperEl[0].clientWidth); //Nav的可视宽度

              this.navWidth = this.navSlideWidth * this.slides.length;
            },
            touchStart: function() {
              this.updateSlides();
            },
            tap: function(e) {
              //console.log(this);
              if (this.clickedIndex == undefined) return;
              // mySwiper.slideTo(this.clickIndex, 0);
              const activeSlidePosition = this.slides[this.clickedIndex]
                .offsetLeft;

              // this.bar.transform("translateX(" + activeSlidePosition + "px)");

              // console.log(this.slides[this.clickedIndex]);
              // this.slides[this.clickedIndex].classList.add("active");
              //导航居中
              // let navActiveSlideLeft = this.slides[this.clickedIndex].offsetLeft; //activeSlide距左边的距离
              this.setTransition(300);

              if (this.navWidth <= this.clientWidth) {
                this.setTranslate(0);
                return;
              }

              if (
                activeSlidePosition <
                (this.clientWidth - parseInt(this.navSlideWidth)) / 2
              ) {
                this.setTranslate(0);
              } else if (
                activeSlidePosition >
                this.navWidth -
                  (parseInt(this.navSlideWidth) + this.clientWidth) / 2
              ) {
                console.log(
                  activeSlidePosition,
                  this.navSlideWidth,
                  this.clientWidth
                );
                this.setTranslate(this.clientWidth - this.navWidth);
              } else {
                this.setTranslate(
                  (this.clientWidth - parseInt(this.navSlideWidth)) / 2 -
                    activeSlidePosition
                );
              }
            }
          }
        });
      });
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";
  %h2 {
    height: 42px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    span {
      display: flex;
      align-items: center;
    }
    span.title {
      font-weight: 600;
      font-size: 16px;
      color: #333333;
      line-height: 16px;

      .icon {
        width: 19px;
        height: 13px;
        margin-right: 7px;
      }
    }
    span.btn {
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      cursor: pointer;
      .icon {
        width: 13px;
        height: 14px;
        margin-right: 5px;
        margin-top: 1px;
      }
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .brand {
    margin-bottom: 25px;
    /deep/ img[lazy="loading"] {
      /*your style here*/
      background: url("../../assets/images/loading.gif") no-repeat center;
      background-size: 100px;
      background-color: #f7f9fa;
    }
    /deep/ img[lazy="error"] {
      /*your style here*/
      background: url("../../assets/images/loading.gif") no-repeat center;
      background-size: 100px;
      display: none;
      // background-color: #f7f9fa;
    }
    .commonWidth {
      h2 {
        @extend %h2;
      }
      .product_container {
        background: #ffffff;
        box-shadow: $base-box-shadow;
        .swiper-container.nav_slide {
          height: 63px;
          border-bottom: 0.5px solid #e6e6e6;
          // overflow-y: auto;
          .swiper-wrapper {
            position: relative;
            height: 62px;

            .swiper-slide {
              width: 180px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              font-weight: 600;
              font-size: 18px;
              color: #666;
              .icon {
                height: 22px;
                width: 22px;
                margin-right: 8px;
              }
              img {
                height: 22px;
                width: 22px;
                margin-right: 8px;
              }
              &.active {
                color: $theme-color;
              }
              &:hover {
                color: $theme-color;
              }
            }
            .bar {
              position: absolute;
              height: 3px;
              width: 180px;
              background: $theme-color;
              bottom: -0.5px;
              left: 0;
              transition: transform 0.3s;
              i {
                display: flex;
                position: absolute;
                bottom: 1px;
                width: 0px;
                left: 50%;
                margin-left: -5.5px;
                height: 0px;
                border-left: 5.5px solid transparent;
                border-right: 5.5px solid transparent;

                border-bottom: 6px solid $theme-color;
              }
            }
          }
        }
        .page {
          //min-height: 200px;
          .noData {
            margin: 20px 0;
            cursor: pointer;
          }
          ul {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-right: -12px;
            padding: 18px 35px;
            padding-bottom: 0;
            li {
              margin-right: 19px;
              margin-bottom: 30px;
              a {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 15px;
                color: #333333;
                text-decoration: none;
                width: 144px;
                cursor: pointer;
                flex-wrap: wrap;
                text-align: center;
                word-break: break-all;
                .img_box {
                  width: 144px;
                  height: 104px;
                  background: #fff;
                  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
                  margin-bottom: 8px;
                  position: relative;
                  img {
                    height: 100%;
                    width: 100%;
                  }
                  .over {
                    position: absolute;
                    left: 0;
                  }
                }
                &:hover {
                  color: $theme-color;
                }
              }
            }
          }
        }
      }
    }
  }
</style>