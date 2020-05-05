<template>
  <div class="Common-Categories-Modal">
    <modal :isShow="visible" :options="options">
      <div slot="content">
        <div class="common_brand">
          <h2>常用分类<span>鼠标拖拽可排序，点击“x”取消</span></h2>
          <draggable
            class="list-group"
            v-model="myArray2"
            v-bind="dragOptions"
            @start="drag = true"
            @end="end"
          >
            <transition-group
              tag="ul"
              class="common"
              type="transition"
              :name="!drag ? 'flip-list' : null"
            >
              <li v-for="(item, i) in myArray2" :key="`key-${i}`">
                <span>
                  {{ item.name }}
                  <i @click="delHandleClick(item)">
                    <svg class="icon" aria-hidden="true">
                      <use
                        xlink:href="#iconguanlichangyongfenleiquxiaochahao"
                      ></use>
                    </svg>
                  </i>
                </span>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="all_brand">
          <h2>全部分类<span>点击即可设为常用分类</span></h2>
          <div class="word_nav swiper-container">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, i) in myArr"
                :key="`item-${i}`"
                @click="getSecond(item.id)"
              >
                {{ item.name }}
              </div>
              <div class="bar"><i></i></div>
            </div>
          </div>

          <!-- <draggable
            v-model="myArray"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group
              tag="ul"
              class="common"
              type="transition"
              :name="!drag ? 'flip-list' : null"
            > -->
          <div class="common">
            <ul>
              <li
                v-for="item in myArray"
                :key="item.id"
                @click="handleClick(item)"
              >
                <span>
                  {{ item.name }}
                  <i>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#iconguanlichangyongfenleijiahao"></use>
                    </svg>
                  </i>
                </span>
              </li>
            </ul>
          </div>

          <!-- </transition-group>
          </draggable> -->
        </div>
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="false"
        >
          完成
        </a-button>
      </div>
    </modal>
  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import modal from "./modal.vue";
  import Swiper from "swiper/dist/js/swiper.js";
  import { _getData } from "../../config/getData";
  import _ from "lodash";
  import { mapState } from "vuex";

  export default {
    data() {
      return {
        visible: false,
        options: {
          title: "管理常用分类",
          closable: true,
          maskClosable: true,
          wrapClassName: "commonBrand commonType",
          centered: false,
          getContainer: () => document.querySelector(".Common-Categories-Modal")
        },
        drag: false,
        myArray: [], //二级分类
        myArray2: [], //常用分类
        myArr: [] //一级分类
      };
    },
    props: {
      Visible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(["isLogin"])
    },
    updated() {
      this.$nextTick().then(() => {
        new Swiper(".swiper-container.word_nav", {
          slidesPerView: "auto",
          // freeMode: true,
          direction: "horizontal",
          slideToClickedSlide: true,
          touchRatio: 0,
          on: {
            init: function() {
              if (this.slides[0] == undefined) return;
              this.navSlideWidth = this.slides[0].clientWidth; //导航字数需要统一,每个导航宽度一致
              console.log(this.navSlideWidth);
              this.bar = this.$el.find(".bar");

              this.bar.transition(300);
              this.navSum = this.slides[this.slides.length - 1].offsetLeft; //最后一个slide的位置

              this.clientWidth = parseInt(this.$wrapperEl[0].clientWidth); //Nav的可视宽度

              this.navWidth = this.navSlideWidth * this.slides.length;
            },
            touchStart: function() {
              this.updateSlides();
            },
            tap: function(e) {
              console.log(this);
              if (this.clickedIndex == undefined) return;
              // mySwiper.slideTo(this.clickIndex, 0);
              const activeSlidePosition = this.slides[this.clickedIndex]
                .offsetLeft;

              this.bar.transform("translateX(" + activeSlidePosition + "px)");

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
                this.setTranslate(this.clientWidth - this.navWidth);
              } else {
                this.setTranslate(
                  (this.clientWidth - parseInt(this.navSlideWidth)) / 2 -
                    activeSlidePosition +
                    parseInt(this.marginLeft)
                );
              }
            }
          }
        });
      });
    },
    mounted() {
      //获取常用分类

      _getData("ucatalog/list", {}).then(data => {
        console.log("常用分类", data);
        this.myArray2 = data.userCategoryList;
      });

      //获取一级分类
      _getData("catalog/first", {})
        .then(data => {
          console.log("data", data);
          this.myArr = data.categoryList;
        })
        .then(() => {
          this.getSecond(this.myArr[0].id);
        });
    },
    components: {
      modal,
      draggable
    },
    methods: {
      end(e) {
        this.drag = false;
        this.saveCategory();
      },
      handleOk() {
        this.visible = false;
      },
      //删除常用品牌
      delHandleClick(item) {
        this.myArray2 = _.without(this.myArray2, item);
        console.log(this.myArray2);
        this.saveCategory();
      },
      handleClick(item) {
        console.log(item);
        let commonArr = _.intersectionBy(this.myArray2, [item], "name");
        if (commonArr.length) {
          this.$message.warning("已添加至常用分类", 1);
          return;
        } else {
          if (this.myArray2.length < 8) {
            this.myArray2.push(item);
            this.saveCategory();
          } else {
            this.$message.warning("最多添加8个常用分类", 1);
          }
        }
      },
      //保存常用分类
      async saveCategory() {
        return await _getData("ucatalog/custom", {
          categoryStr: _.join(_.map(this.myArray2, "id"), ",")
        }).then(data => {
          this.$emit("success");
        });
      },

      async getSecond(id) {
        //获取二级分类
        await _getData("catalog/second", {
          id
        }).then(data => {
          this.myArray = data.subCategory;
        });
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
    watch: {
      Visible(newVal) {
        this.visible = newVal;
      },
      visible(newVal) {
        if (!newVal) {
          this.$parent.visible = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/_commonScss";

  .commonBrand {
    .ant-modal {
      width: 873px !important;

      padding-bottom: 0;
      .ant-modal-header {
        margin-bottom: 15px;
      }
      .ant-modal-body {
        padding: 0 23px;
        h2 {
          height: 57px;
          display: flex;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #000000;
          justify-content: flex-start;
          align-items: center;
          line-height: 18px;
          font-weight: 500;
          span {
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #999999;
            margin-left: 8px;
            line-height: 15px;
            margin-top: 2px;
          }
        }
      }
    }
    &.commonType {
      .ant-modal {
        .ant-modal-body {
          .common {
            min-height: 40px;

            padding: 0 5px;
            padding-top: 6px;

            li {
              margin-bottom: 9px;
              font-size: 14px;
              color: #333333;
              height: 28px;
              width: auto;
              background: #ffffff;
              border: 1px solid #cccccc;
              border-radius: 14px;
              padding: 0 10px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              line-height: 26px;
              margin-right: 12px;
              position: relative;
              min-width: 98px;
              span {
                display: flex;
                justify-content: space-between;
                width: 100%;
              }
              i {
                position: static;
                display: flex;
                align-items: center;
                padding-left: 8px;
                &:hover {
                  opacity: 0.7;
                }
                .icon {
                  height: 9px;
                  width: 9px;
                }
              }
              &::before {
                content: "添加至常用品牌";
                display: flex;
                align-items: center;
                white-space: pre;
                height: 100%;
                width: 100%;
                position: absolute;
                background: #fdefd9;
                text-align: center;
                display: none;
                font-family: PingFangSC-Semibold;
                font-size: 12px;
                color: #f5a623;
                justify-content: center;
              }
              &:hover {
                border-color: #fdefd9;
                &::before {
                  display: flex;
                }
              }
            }
          }
          .list-group {
            .common {
              > li:hover {
                border: 1px solid #cccccc;
                cursor: pointer;
                &::before {
                  display: none;
                }
              }
            }
          }
          .all_brand {
            .word_nav {
              height: 40px;
              border-bottom: 1px solid #cccccc;
              .swiper-wrapper {
                position: relative;
                .swiper-slide {
                  width: 90px;
                  font-size: 15px;
                  line-height: 40px;
                  color: #666666;
                  cursor: pointer;
                  text-align: center;
                  &:hover {
                    color: $theme-color;
                  }
                }
                .bar {
                  width: 90px;
                  height: 2px;
                  background: $theme-color;
                  position: absolute;
                  bottom: 0px;
                  left: 0;
                }
              }
            }
            .common {
              background: #fff;
              padding-left: 0;
              padding-right: 0;
              height: 260px;
              overflow: auto;
              ul {
                width: 100%;
                // display: flex;
                // justify-content: flex-start;
                // flex-wrap: wrap;
                height: auto;
                overflow: hidden;
                li {
                  background: #ffffff;
                  margin-bottom: 9px;
                  border-radius: 1px;
                  float: left;
                  span {
                    font-size: 13px;
                    color: #666666;
                    i {
                      .icon {
                        height: 12px;
                        width: 12px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>