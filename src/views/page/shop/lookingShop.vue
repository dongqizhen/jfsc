
<template>
  <div class="looking-shop">
    <Header></Header>
    <search></search>
    <Nav :defaultNav="defaultNav"></Nav>
    <div class="container">
      <div class="commonWidth">
        <breadcrumb-vue :routes="routes">
          <ul slot="search-type" class="search-type">
            <li
              v-for="(item, i) in searchParamas"
              :key="`key-${i}`"
              class="search-type-item"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconwangyelujing"></use>
              </svg>
              <span>
                {{ item.name }}

                <svg
                  class="icon del"
                  aria-hidden="true"
                  v-if="i != 0"
                  @click="delHandleClick(i, item.key)"
                >
                  <use xlink:href="#icontianjiaduibichanpinshanchu"></use>
                </svg>
              </span>
            </li></ul
        ></breadcrumb-vue>
        <div class="select-area">
          选择销售地区：
          <span @click="selectArea">
            <svg class="icon area" aria-hidden="true">
              <use xlink:href="#iconzhaodianpuweizhi"></use>
            </svg>
            {{ selectMainArea }}

            <svg
              class="icon"
              aria-hidden="true"
              :class="areaIsShow && 'active'"
            >
              <use xlink:href="#iconxuanweizhixialajiantou"></use>
            </svg>
          </span>
          <transition name="slide-fade">
            <div class="area-container" v-if="areaIsShow">
              <h2>
                <span
                  :class="isActive == 0 && 'active'"
                  @click="provinceClick"
                  >{{ province }}</span
                >
                <span :class="isActive != 0 && 'active'" v-if="isActive != 0">{{
                  city
                }}</span>
              </h2>
              <i></i>
              <ul v-if="isActive == 0">
                <li
                  v-for="(item, i) in area"
                  :key="item.id"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </li>
              </ul>
              <ul v-else>
                <li
                  v-for="(item, i) in cityArr"
                  :key="`city-${i}`"
                  @click="cityItemClick(item)"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div v-if="!isAllLoading">
          <div v-show="showContent">
            <product-category-vue
              v-if="provinceName"
              ref="productCategory"
              :canSkip="false"
              v-on:categoryClick="categoryClick"
              :currentPosition="{ provinceName, cityName }"
            ></product-category-vue>
            <div class="main-content">
              <div class="left">
                <shop-left-side-vue
                  :categoryId="categoryId"
                  v-if="provinceName"
                  ref="shopLeftSide"
                  :currentPosition="{ provinceName, cityName }"
                  v-on:brandClick="brandClick"
                ></shop-left-side-vue>
              </div>
              <div class="right">
                <shop-nav-vue
                  :navArr="['发布时间', '按点击量', '按好评']"
                  v-on:tabClick="tabClick"
                  ref="shopNav"
                ></shop-nav-vue>
                <div v-if="!isLoading">
                  <div v-if="arr.length">
                    <ul class="shopItem">
                      <shop-item-vue
                        v-for="item in arr"
                        :key="item.id"
                        :item="item"
                      ></shop-item-vue>
                    </ul>
                  </div>

                  <no-data v-else text="暂无店铺"></no-data>
                </div>
                <loading v-else></loading>
                <pagination
                  :data="data"
                  v-on:onPaginationChange="onPaginationChange"
                  ref="pagination"
                  v-if="data != '' && arr.length"
                ></pagination>
              </div>
            </div>
          </div>
          <no-data
            class="no-content"
            v-show="!showContent"
            text="暂无数据"
          ></no-data>
        </div>
        <loading v-else></loading>
      </div>
    </div>
    <Footer></Footer>
    <side-bar></side-bar>
  </div>
</template>

<script>
  import Header from "../../../components/header/header.vue";
  import Footer from "../../../components/footer/footer.vue";
  import search from "../../../components/common/search.vue";
  import Nav from "../../../components/common/nav.vue";
  import sideBar from "../../../components/sideBar/sideBar.vue";
  import breadcrumbVue from "../../../components/common/breadcrumb.vue";
  import productCategoryVue from "../../../components/common/productCategory.vue";
  import shopItemVue from "../../../components/common/item/shopItem.vue";
  import shopLeftSideVue from "../../../components/common/shopLeftSide.vue";
  import shopNavVue from "../../../components/common/shopNav.vue";
  import { mixin } from "../../../components/mixin/mixin";
  import { _getData } from "../../../config/getData";
  import pagination from "../../../components/common/pagination";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        data: "",
        createTime: "create_time DESC", //创建时间排序：createTime DESC
        accessNum: "", //访问量排序：accessNum DESC
        highPraiseNum: "", //好评率排序：highPraiseNum DESC
        arr: [], //店铺列表
        areaIsShow: false, //控制选择地区弹层是否显示
        area: [], //省份列表
        cityArr: [], //市列表
        province: "选择省/直辖市", //省头部显示名称
        city: "选择市",
        isActive: 0, //是否显示市弹出层
        selectMainArea: "", //默认显示地址
        provinceName: "",
        cityName: "",
        categoryId: "", //分类id
        isAllLoading: true,
        isLoading: true,
        brandId: "",
        showContent: true,
        searchParamas: [], //搜素条件集合
        routes: [
          {
            name: "首页",
            path: "/"
          },
          {
            name: "找店铺",
            path: "/lookingShop"
          }
        ]
      };
    },
    mixins: [mixin],
    components: {
      Header,
      Footer,
      search,
      Nav,
      breadcrumbVue,
      productCategoryVue,
      shopItemVue,
      sideBar,
      shopLeftSideVue,
      shopNavVue,
      pagination
    },
    computed: { ...mapState(["currentCityIp"]) },
    created() {
      //this.routes = JSON.parse(this.$route.query.routes);
      this.searchParamas.push({
        name: "销售地区：" + "",
        key: "keyword"
      });
      var myCity = new BMap.LocalCity();
      myCity.get(result => {
        this.cityName = result.name;
        _getData("/address/getAddress", {})
          .then(data => {
            console.log("data1111::", data);
            _.map(data, o => {
              _.map(o.defaultCityData, v => {
                if (this.cityName == v.name) {
                  this.provinceName = o.name;
                  this.selectMainArea = this.provinceName + this.cityName;
                  this.searchParamas.splice(0, 1, {
                    name: "销售地区：" + this.selectMainArea,
                    key: "keyword"
                  });
                }
              });
            });
          })
          .then(() => {
            // this.$nextTick().then(() => {

            // });
            setTimeout(() => {
              this.isAllLoading = false;
            }, 100);
          })
          .then(() => {
            this.getShop();
          });
      });
    },
    mounted() {
      _getData("address/getAllArea", {}).then(data => {
        console.log("data", data);
        this.area = data;
      });
    },
    methods: {
      //点击产品分类
      categoryClick(item, val) {
        console.log(item);
        this.categoryId = item.id;
        this.brandId = "";
        this.searchParamas = _.take(this.searchParamas, 1);
        this.searchParamas.push({
          name: val.name + "：" + item.name,
          key: "category"
        });
        this.getShop().then(data => {
          // console.log(data);
        });
      },
      onPaginationChange(page) {
        this.getShop(page);
      },
      tabClick(i, val) {
        if (i == 0) {
          this.createTime = "create_time DESC";
          this.accessNum = "";
          this.highPraiseNum = "";
        } else if (i == 1) {
          this.createTime = "";
          this.accessNum = "accessNum DESC";
          this.highPraiseNum = "";
        } else {
          this.createTime = "";
          this.accessNum = "";
          this.highPraiseNum = "highPraiseNum DESC";
        }
        this.getShop();
        this.$nextTick(() => {
          if (this.$refs.pagination) {
            this.$refs.pagination.$data.current = 1;
          }
        });
      },
      brandClick(item) {
        console.log(item);
        this.brandId = item.id;
        this.categoryId = "";
        let obj = _.keyBy(this.searchParamas, "key");
        this.searchParamas.splice(1, 1);
        if (!_.has(obj, "brand")) {
          //this.searchParamas = _.dropRight(this.searchParamas);
          this.searchParamas.push({
            name: "品牌：" + item.name,
            key: "brand"
          });
        } else {
          let index = _.indexOf(_.keys(obj), "brand");

          this.searchParamas.splice(index, 1, {
            name: "品牌：" + item.name,
            key: "brand"
          });
        }
        this.getShop();
      },
      selectArea() {
        this.areaIsShow = !this.areaIsShow;
        this.isActive = 0;
        this.province = "选择省/直辖市";
      },
      //异步获取店铺
      async getShop(page = 1) {
        this.isLoading = true;
        return await _getData("queryByBrandOrCategoryStore", {
          brandId: this.brandId,
          provinceName: this.provinceName,
          name: this.cityName,
          categoryId: this.categoryId,
          createTime: this.createTime,
          accessNum: this.accessNum,
          highPraiseNum: this.highPraiseNum,
          page,
          size: 20
        })
          .then(data => {
            console.log("店铺列表", data);
            this.data = data;
            this.arr = data.data;
          })
          .then(() => {
            this.$nextTick().then(() => {
              this.isLoading = false;
            });
          });
      },
      //点击省
      handleClick(val) {
        console.log(val);
        if (val.name == "全国") {
          this.selectMainArea = val.name;
          this.areaIsShow = false;
          this.provinceName = "全国";
          this.cityName = "全国";
          this.searchParamas.splice(0, 1, {
            name: "销售地区：" + this.selectMainArea,
            key: "keyword"
          });
          setTimeout(() => {
            this.$refs.productCategory.reload();
            this.$refs.shopLeftSide.init();
          }, 0);
          this.getShop();
          return;
        }
        this.province = val.name;
        this.provinceName = val.name;
        _getData("address/getCity", { provinceId: val.id })
          .then(data => {
            console.log(data);
            this.cityArr = data;
          })
          .then(() => {
            this.isActive = 1;
          });
      },
      provinceClick() {
        this.isActive = 0;
        this.province = "选择省/直辖市";
      },
      delHandleClick(i, key) {
        this.searchParamas.splice(i, 1);
        if (key == "brand") {
          this.brandId = "";
        } else if (key == "category") {
          this.categoryId = "";
        }
        this.getShop();
      },
      cityItemClick(item) {
        this.selectMainArea = this.province + item.name;
        this.searchParamas.splice(0, 1, {
          name: "销售地区：" + this.selectMainArea,
          key: "keyword"
        });
        this.areaIsShow = false;
        this.cityName = item.name;
        setTimeout(() => {
          this.$refs.productCategory.reload();
          this.$refs.shopLeftSide.init();
        }, 0);

        this.getShop();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/_commonScss";
  .container {
    background: $base-background;
    .no-content {
      height: 500px;
      background: #fff;
    }
    .select-area {
      font-size: 14px;
      color: #999999;
      margin-top: 3px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 30px;
      position: relative;

      span {
        font-size: 18px;
        color: #333333;
        font-weight: 600;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;

        .area {
          height: 24px;
          width: 18px;
          margin-right: 6px;
        }
        .icon:not(.area) {
          width: 12px;
          height: 6px;
          margin-left: 3px;
          transition: all 0.3s;
          &.active {
            transform: rotate(180deg);
          }
        }
      }
      .area-container {
        position: absolute;
        background: #fff;
        box-shadow: $base-box-shadow;
        padding: 18px 20px;
        width: 785px;
        top: 40px;
        z-index: 100;
        opacity: 1;
        h2 {
          border-bottom: 1px solid #dddddd;
          display: flex;
          justify-content: flex-start;
          span {
            display: flex;
            width: 126px;
            height: 38px;
            font-weight: 600;
            font-size: 15px;

            align-items: center;
            justify-content: center;
            color: #333333;
            &.active {
              background: #019ddd;
              color: #ffffff;
            }
          }
        }
        i {
          display: flex;
          position: absolute;
          top: -6px;
          width: 0px;
          left: 200px;
          margin-left: -5.5px;
          height: 0px;

          border-left: 25px solid transparent;
          border-right: 25px solid transparent;

          border-bottom: 12px solid #fff;
        }
        ul {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          padding-top: 20px;
          li {
            width: 25%;
            display: flex;
            justify-content: center;
            line-height: 36px;
            cursor: pointer;
            &:hover {
              color: #019ddd;
            }
          }
        }
      }
      .slide-fade-enter-active {
        transition: all 0.3s ease;
      }
      .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
      }
      .slide-fade-enter,
      .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
      }
    }
    /deep/ .product-category {
      .product {
        h2 {
          .btn {
            display: none;
          }
        }
      }
    }
    .main-content {
      display: flex;
      justify-content: flex-start;
      .left {
        width: 254px;
        margin-right: 25px;
        background: #fff;
        box-shadow: $base-box-shadow;
        height: auto;
        //position: absolute;
        align-self: flex-start;
      }
      .right {
        display: flex;
        flex: 1;
        flex-direction: column;

        .shopItem {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-right: -25px;
        }
        .no-data {
          height: 600px;
          background: #fff;
        }
      }
    }
  }
</style>