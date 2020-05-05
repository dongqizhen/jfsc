<template>
  <div class="comparison-of-parameters" @click.stop.prevent="hideClick">
    <Header></Header>
    <search></search>
    <Nav :defaultNav="defaultNav"></Nav>
    <div class="container">
      <div class="commonWidth">
        <h2>
          <span></span>参数对比
          <p>
            (注：参数对比必须为同类型号，如更换对比分类请选择“更换分类”后添加型号，更换分类后原有添加型号则清空)
          </p>
        </h2>

        <div class="currentCategory">
          当前分类：
          <div class="select-box" @click.stop="categoryBoxClick">
            {{ currentCategory }}
            <svg
              class="icon"
              aria-hidden="true"
              :class="categoryShow && 'active'"
            >
              <use xlink:href="#icontianjiaduibichanpinxiala"></use>
            </svg>
            <transition name="slide-fade">
              <div class="modal-content" @click.stop="" v-if="categoryShow">
                <h2>
                  <span @click.stop="categoryTitleClick">大类</span>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    v-if="isShowSmallCategory"
                  >
                    <use xlink:href="#iconwangyelujing"></use>
                  </svg>
                  <span v-if="isShowSmallCategory">小类</span>
                </h2>
                <div>
                  <ul class="index-list" v-if="!isShowSmallCategory">
                    <li
                      v-for="item in categoryList"
                      :key="item.id"
                      @click="categoryListClick(item)"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                  <ul class="index-list" v-else>
                    <li
                      v-for="item in smallCategory"
                      :key="item.id"
                      @click="smallCategoryClick(item)"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- <transition-group name="list-complete" tag="div" class="content"> -->
        <div class="content">
          <div class="col" key="first">
            <a-affix :offsetTop="0" class="affix">
              <div class="header">
                <p>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconcanshuduibi"></use>
                  </svg>
                  参数名称
                </p>
              </div>
            </a-affix>

            <ul>
              <li v-for="(item, i) in paramas" :key="`${i}-item`">
                {{ item.specificationName || "--" }}
              </li>
            </ul>
          </div>
          <div
            class="col"
            v-for="(item, i) in arr"
            :key="`${item.categoryId}-${i}`"
          >
            <a-affix :offsetTop="0" class="affix">
              <div class="header">
                <p :class="item.modelName ? '' : 'no-data'">
                  {{
                    item.modelName
                      ? item.categoryName +
                        "&nbsp;&nbsp;" +
                        item.brandName +
                        "&nbsp;&nbsp;" +
                        item.modelName
                      : "暂无型号"
                  }}
                </p>

                <span
                  class="del-btn"
                  v-if="item.modelName && $route.query.modelId != 'undefined'"
                  @click="delbtnClick(i)"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icontianjiaduibichanpinshanchu"></use>
                  </svg>
                </span>
                <a-button type="primary" @click.self.stop="changeModel(i)">
                  {{ item.modelName ? "更改" : "选择" }}型号
                </a-button>
                <transition name="slide-fade">
                  <div
                    class="modal-content"
                    v-if="defaultShowIndex == i"
                    @click.stop=""
                  >
                    <h2>
                      <span @click.stop="brandTitleClick">品牌</span>
                      <svg class="icon" aria-hidden="true" v-if="isShowModel">
                        <use xlink:href="#iconwangyelujing"></use>
                      </svg>
                      <span v-if="isShowModel">型号</span>
                    </h2>
                    <div>
                      <ul class="index-list" v-if="!isShowModel">
                        <li v-for="(v, key) in brandList" :key="key">
                          <h3>{{ key }}</h3>
                          <ul>
                            <li
                              v-for="value in v"
                              :key="value.id"
                              @click.stop="selectBrand(value)"
                            >
                              <div class="img_box">
                                <img
                                  :src="value.app_list_pic_url"
                                  alt=""
                                  v-if="value.app_list_pic_url"
                                />
                              </div>
                              <p>{{ value.name }}</p>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul class="index-list" v-else>
                        <li>
                          <ul v-if="!isModelLoading">
                            <li
                              v-for="v in modelList"
                              :key="v.id"
                              @click="selectModel(v)"
                            >
                              {{ v.name }}
                            </li>
                          </ul>
                          <loading v-else loading text=""></loading>
                        </li>
                      </ul>
                    </div>
                  </div>
                </transition>
              </div>
            </a-affix>

            <ul
              v-if="
                item.modelSpecificationInfo &&
                  item.modelSpecificationInfo.length
              "
            >
              <li v-for="val in item.modelSpecificationInfo" :key="val.id">
                <p>{{ val.value || "--" }}</p>
              </li>
            </ul>
            <ul v-else>
              <li v-for="val in paramas" :key="val.id">--</li>
            </ul>
          </div>
        </div>

        <!-- </transition-group> -->
        <a-button type="primary" @click="addbtnClick" v-if="arr.length < 6">
          添加型号
        </a-button>
        <div class="prompt">
          <i></i>如参数不准确，请联系客服沟通。电话：<span>4000-121-211</span>
        </div>
      </div>
    </div>

    <Footer></Footer>
    <side-bar />
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import search from "../../../components/common/search.vue";
  import Nav from "../../../components/common/nav.vue";
  import sideBar from "../../../components/sideBar/sideBar.vue";
  import { mixin } from "../../../components/mixin/mixin";
  import _ from "lodash";
  import { _getData } from "../../../config/getData";
  import { async } from "q";

  export default {
    data() {
      return {
        arr: [],
        currentCategory: "",
        categoryId: "",
        modelIdArr: new Array(6),
        paramas: [1, 2],
        brandList: [], //全部品牌
        defaultShowIndex: null, //显示的modal层index
        isShowModel: false, //是否展示型号层
        modelList: [], //型号列表
        isModelLoading: false,
        categoryShow: false, //是否分类层
        isShowSmallCategory: false,
        categoryList: [], //大类
        smallCategory: [], //小类
        modelLoading: false
      };
    },
    mixins: [mixin],
    components: {
      Header,
      Footer,
      search,
      Nav,
      sideBar
    },
    created() {
      //默认四个对比框
      this.arr = _.fill(Array(4), {
        categoryId: this.$route.query.categoryId,
        categoryName: this.$route.query.categoryName
      });

      this.currentCategory = this.$route.query.categoryName;
      this.categoryId = this.$route.query.categoryId;
      if (this.$route.query.modelId) {
        this.modelIdArr.splice(0, 1, Number(this.$route.query.modelId));
      }
    },
    mounted() {
      //参数对比
      if (this.$route.query.modelId) {
        this.getModelspecification(this.$route.query.modelId);
      }

      //获取当前分类
      _getData("catalog/listAll", {}).then(data => {
        console.log("分类", data);
        //this.navArr = [...this.navArr, ...data.currentCategory];
        this.categoryList = data.currentCategory;
      });

      this.getBrandByCategory();
    },
    methods: {
      //点击选择分类
      categoryBoxClick() {
        this.categoryShow = !this.categoryShow;
        this.defaultShowIndex = null;
        this.isShowSmallCategory = false;
      },
      async getBrandByCategory() {
        //根据分类获取品牌
        return await _getData("brand/merge", { id: this.categoryId })
          .then(data => {
            this.brandList = _.groupBy(
              _.orderBy(
                data.listAll,
                val => {
                  return _.upperFirst(val.pinyin).substring(0, 1);
                },
                ["asc"]
              ),
              val => {
                return _.upperFirst(val.pinyin).substring(0, 1);
              }
            );

            console.log(this.brandList);
          })
          .then(() => {
            // console.log(this.navArr);
            // this.arr = this.navArr.listAll;
            // this.letterArr = _.groupBy(this.arr, val => {
            //   return _.upperFirst(val.pinyin).substring(0, 1);
            // });
            // //console.log(this.letterArr, _.keys(this.letterArr));
            // this.letter = _.orderBy(_.keys(this.letterArr), val => val, ["asc"]);
          });
      },
      //参数对比
      async getModelspecification(modelId) {
        return await _getData("modelspecification/query", {
          modelId
        }).then(data => {
          console.log(data);
          if (data.modelSpecificationInfo.length) {
            this.paramas = data.modelSpecificationInfo;
          } else {
            this.paramas = [1, 2];
          }

          // this.arr = [data, ..._.drop(this.arr)];
          console.log(this.defaultShowIndex);
          this.arr.splice(this.defaultShowIndex || 0, 1, data);
          console.log(this.arr);
        });
      },
      //点击大类
      categoryListClick(item) {
        this.isShowSmallCategory = true;
        _getData("catalog/second", {
          id: item.id
        }).then(data => {
          this.smallCategory = data.subCategory;
        });
      },
      //点击小类
      smallCategoryClick(item) {
        this.categoryShow = false;

        if (this.categoryId != item.id) {
          this.currentCategory = item.name;

          this.categoryId = item.id;
          this.arr = _.fill(Array(4), {
            categoryId: this.$route.query.categoryId,
            categoryName: this.$route.query.categoryName
          });
          this.getBrandByCategory();
          this.paramas = [1, 2];
        }
      },
      //选择品牌
      selectBrand(val) {
        console.log(val);
        this.isShowModel = true;
        console.log(this.arr[this.defaultShowIndex]);
        this.modelIdArr.splice(this.defaultShowIndex, 1, "");
        this.arr.splice(this.defaultShowIndex, 1, {
          categoryId: this.$route.query.categoryId,
          categoryName: this.$route.query.categoryName,
          brandName: val.name
        });
        // this.arr[this.defaultShowIndex]["brandName"] = val.name;
        console.log(this.defaultShowIndex, this.arr);
        console.log(this.categoryId);
        this.getModelListByBrand(val.id);
      },
      //选择型号
      selectModel(val) {
        console.log(val);

        if (_.indexOf(this.modelIdArr, val.id) != -1) {
          this.$message.warning("该型号已添加");
          return;
        }
        this.modelIdArr.splice(this.defaultShowIndex, 1, val.id);
        console.log(this.modelIdArr);
        this.arr[this.defaultShowIndex]["modelName"] = val.name;
        //;

        this.getModelspecification(val.id).then(data => {
          this.defaultShowIndex = null;
        });
      },
      //点击品牌按钮
      brandTitleClick() {
        this.isShowModel = false;
      },
      //点击大类按钮
      categoryTitleClick() {
        this.isShowSmallCategory = false;
      },
      //点击删除按钮
      delbtnClick(i) {
        console.log(i);
        window.scrollTo(0, 0);
        this.modelIdArr.splice(i, 1, "");
        console.log(this.modelIdArr);
        if (this.arr.length > 4) {
          this.arr.splice(i, 1);

          return;
        }
        // this.arr = _.flatMap(this.arr, (n, ind) => {
        //   if (ind == i) {
        //     n.name = "";
        //   }
        //   return [n];
        // });
        this.arr.splice(i, 1, {
          categoryId: this.$route.query.categoryId,
          categoryName: this.$route.query.categoryName
        });
      },
      //获取品牌下型号列表
      async getModelListByBrand(id) {
        this.isModelLoading = true;
        return await _getData("brandmodel/list", {
          categoryId: this.categoryId,
          brandId: id
        })
          .then(data => {
            this.modelList = data.brandModelList;
          })
          .then(() => {
            setTimeout(() => {
              this.isModelLoading = false;
            }, 100);
          });
      },
      //点击添加型号按钮
      addbtnClick() {
        window.scrollTo(0, 0);
        this.arr.push({
          categoryId: this.$route.query.categoryId,
          categoryName: this.$route.query.categoryName
        });
      },
      changeModel(i, e) {
        // e.stopPropagation();
        if (i != this.defaultShowIndex) {
          this.isShowModel = false;
        }
        this.defaultShowIndex = i;
      },
      hideClick() {
        this.defaultShowIndex = null;
        this.isShowModel = false;
        this.categoryShow = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .slide-fade-enter-active {
    transition: all 0.3s;
  }
  .slide-fade-leave-active {
    transition: all 0.3s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(2px);
    opacity: 0;
  }

  .container {
    .commonWidth {
      position: relative;
      > .btn {
        border: 1px solid #f10215;
        border-radius: 4px;
        width: 108px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        color: #f10215;
        font-weight: 600;
        position: absolute;
        right: 0;
        top: 35px;
        cursor: pointer;
        &:hover {
          background: #f10215;
          color: #fff;
        }
      }
      > h2 {
        height: 66px;
        padding-top: 9px;
        font-size: 20px;
        color: #2b3e50;
        font-weight: 600;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // margin-bottom: 8px;
        span {
          display: flex;
          height: 20px;
          width: 4px;
          background: #f5a623;
          margin-right: 8px;
        }
        p {
          font-size: 14px;
          color: #999999;
          font-weight: normal;
          height: 66px;
          display: flex;
          align-items: center;
          margin-left: 8px;
        }
      }
      .currentCategory {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        margin-top: 10px;
        font-size: 14px;
        color: #222222;
        font-weight: 600;
        .select-box {
          height: 35px;
          width: 240px;
          background: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 3px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #333333;
          padding-left: 12px;
          padding-right: 10px;
          justify-content: space-between;
          font-weight: normal;
          cursor: pointer;
          position: relative;
          > .icon {
            width: 13px;
            height: 7px;
            transition: transform 0.3s;
            &.active {
              transform: rotate(180deg);
            }
          }
          &:hover {
            > .icon {
              opacity: 0.7;
            }
          }
          .modal-content {
            position: absolute;
            top: 34px;
            width: 100%;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 3px;
            left: 0;
            z-index: 1000;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            h2 {
              height: 30px;
              border-bottom: 1px solid #dddddd;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: 12px;
              color: #666666;
              padding-left: 12px;
              font-weight: 600;
              .icon {
                height: 8px;
                width: 8px;
                margin: 0 7px;
                margin-top: 2px;
              }
              span {
                &:first-child {
                  cursor: pointer;
                  &:hover {
                    color: $theme-color;
                  }
                }
              }
            }
            > div {
              background: #fff;
              flex: 1;
              ul {
                display: flex;
                flex-direction: column;
                li {
                  height: 36px;
                  display: flex;
                  align-items: center;
                  font-size: 12px;
                  color: #999999;
                  padding-left: 15px;
                  border-bottom: 1px solid #dddddd;
                  &:last-child {
                    border-bottom: 0;
                  }
                  &:hover {
                    color: $theme-color;
                    background: rgba(245, 166, 35, 0.03);
                  }
                }
              }
            }
          }
        }
      }
      .content {
        background: #ffffff;
        box-shadow: $base-box-shadow;
        display: flex;
        .col {
          display: flex;
          flex-direction: column;
          flex: 1;
          transition: all 0.5s;
          /deep/ .ant-affix {
            background: #fff;
            // border-left: 1px solid #e0e7ea;
            border-bottom: 1px solid #e0e7ea;
          }
          &:first-child {
            ul {
              li {
                font-weight: 600;
              }
            }
          }
          .header {
            position: relative;
            height: 133px;
            border-right: 1px solid #e0e7ea;
            display: flex;

            justify-content: center;
            font-size: 14px;
            color: #666666;
            flex-wrap: wrap;
            font-weight: 600;
            padding: 0 10px;
            > p {
              display: flex;
              align-items: flex-start;
              text-align: center;
              padding-top: 25px;
              &.no-data {
                font-size: 14px;
                color: #999999;
                font-weight: normal;
              }
              .icon {
                margin-right: 5px;
              }
            }

            .del-btn {
              position: absolute;
              top: 8px;
              right: 8px;
              cursor: pointer;
              .icon {
                height: 12px;
                width: 12px;
              }
              &:hover {
                opacity: 0.7;
              }
            }
            /deep/ .ant-btn-primary {
              height: 30px;
              width: 101px;
              background: #f5f5f5;
              border-radius: 16px;
              border: #f5f5f5 1px solid;
              text-shadow: 0 -0.5px 0 #f5a623;
              position: absolute;
              bottom: 14.5px;
              span {
                font-size: 13px;
                color: #f5a623;
                display: flex;
                line-height: 30px;
                text-align: center;
                justify-content: center;
                align-items: center;
              }
              &:hover {
                opacity: 0.7;
              }
              &::after {
                border-color: #f5f5f5;
              }
            }
            .modal-content {
              width: 100%;
              width: 241px;
              height: 405px;
              background: #fff;
              box-shadow: $base-box-shadow;
              position: absolute;
              top: 133px;
              left: 50%;
              z-index: 9999;
              border-radius: 3px;
              display: flex;
              flex-direction: column;
              border: 1px solid #dddddd;
              h2 {
                height: 30px;
                border-bottom: 1px solid #dddddd;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 12px;
                color: #666666;
                padding-left: 12px;
                font-weight: 600;
                .icon {
                  height: 8px;
                  width: 8px;
                  margin: 0 7px;
                  margin-top: 2px;
                }
                span {
                  &:first-child {
                    cursor: pointer;
                    &:hover {
                      color: $theme-color;
                    }
                  }
                }
              }
              > div > ul {
                flex: 1;
                overflow: auto;
                &::-webkit-scrollbar {
                  width: 2px;
                  height: 2px;

                  background-color: #b5b1b1;
                }
                &::-webkit-scrollbar-track {
                  background: #f6f6f6;
                  border-radius: 2px;
                }
                &::-webkit-scrollbar-thumb {
                  background: #aaa;
                  border-radius: 2px;
                }
                > li {
                  h3 {
                    height: 23px;
                    background: #f5f5f5;
                    font-size: 12px;
                    color: #999999;
                    font-weight: 600;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding-left: 12px;
                  }
                  ul {
                    li {
                      padding-left: 12px;
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;
                      height: 34px;
                      border-bottom: 1px solid #dddddd;
                      cursor: pointer;
                      font-size: 12px;
                      color: #999999;
                      &:hover {
                        color: $theme-color;
                        background: rgba(245, 166, 35, 0.03);
                      }
                      .img_box {
                        height: 18px;
                        width: 25px;
                        background: $base-background;
                        margin-right: 6px;
                        img {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      p {
                        display: flex;
                        line-height: 34px;
                      }
                      &:last-child {
                        border: 0;
                      }
                    }
                  }
                  /deep/.loading {
                    height: 375px;
                  }
                }
              }
            }
            .fix-box {
              position: fixed;
              height: 100%;
              width: 100%;
              top: 0;
              left: 0;
              z-index: 0;
            }
          }
          > ul {
            li {
              border-top: 1px solid #e0e7ea;
              border-right: 1px solid #e0e7ea;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #666666;
              padding: 0px 14px;
              overflow: hidden;
              &:nth-child(2n) {
                background: rgba(245, 166, 35, 0.03);
              }
              &:last-child {
                border-bottom: 0;
              }
              p {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                // margin: 4px 0px;
                overflow: auto;
                &::-webkit-scrollbar {
                  width: 2px;
                  height: 2px;

                  background-color: #b5b1b1;
                }
                &::-webkit-scrollbar-track {
                  background: #f6f6f6;
                  border-radius: 2px;
                }
                &::-webkit-scrollbar-thumb {
                  background: #aaa;
                  border-radius: 2px;
                }
              }
            }
          }
          &:first-child {
            .header {
              align-items: center;
              p {
                padding: 0;
                align-items: center !important;
              }
            }
          }
          &:last-child {
            .header {
              border-right: 0;
            }
            ul {
              li {
                border-right: 0;
              }
            }
          }
        }
      }
      .prompt {
        margin-top: 24px;
        color: #333;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #f10215;
          margin-right: 8px;
        }
        span {
          color: #f5a623;
          font-size: 18px;
        }
      }
      /deep/ & > .ant-btn-primary {
        height: 90px;
        width: 32px;
        background: #f5a623;
        border-radius: 0 9px 9px 0;
        border: #f5a623 solid 1px;
        position: fixed;
        left: 50%;
        top: 400px;
        margin-left: 600px;
        padding: 0;
        cursor: pointer;
        display: flex;
        z-index: 2;
        span {
          font-size: 14px;
          color: #ffffff;
          display: flex;
          width: 30px;
          height: 90px;
          text-align: center;
          justify-content: center;
          align-items: center;
          line-height: 30px;
          word-break: break-all;
          writing-mode: tb-rl;
          margin-right: 2px;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
    // transform: translateY(30px);
  }
  .list-complete-leave-active {
    // position: absolute;
  }
</style>