<template>
  <div class="bid-info-details">
    <div class="base-info">
      <h2><span></span>基本信息</h2>
      <ul>
        <li>
          <span>
            产品名称
          </span>
          {{ bidData.productName }}
        </li>
        <li>
          <span>
            品牌
          </span>
          {{ bidData.brandName }}
        </li>
        <li>
          <span>
            型号
          </span>
          {{ bidData.modelName }}
        </li>
        <li>
          <span>
            开标时间
          </span>
          {{ bidData.bidDate }}
        </li>
        <li>
          <span>
            中标金额
          </span>
          <img
            src="../../../../assets/images/diamond.png"
            v-if="userInfo.memberGrade != 4"
            alt=""
          />
          {{ userInfo.memberGrade == 4 ? bidData.bidAmount + "万元" : "" }}
        </li>
        <li>
          <span>
            采购单位
          </span>
          {{ bidData.hospitalName }}
          <span class="grade">{{ bidData.level }}</span>
        </li>
        <li>
          <span>
            中标单位
          </span>
          {{ bidData.bider }}
        </li>
      </ul>
    </div>
    <div class="comparison-info">
      <h2>
        <span></span>
        对比信息
        <ul>
          <li @click="moreInfoClick(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconchakanquanbu"></use>
            </svg>
            采购了本产品的医院
          </li>
          <li @click="moreInfoClick(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconchakanquanbu"></use>
            </svg>
            查看各省价格情况
          </li>
        </ul>
      </h2>
      <ul>
        <li>
          <span>
            本型号产品全省平均价
          </span>
          <img
            src="../../../../assets/images/platinum.png"
            v-if="bidData.pAvgPrice == '铂金会员可见'"
            alt=""
          />
          {{
            bidData.pAvgPrice != "铂金会员可见"
              ? bidData.pAvgPrice + "万元"
              : ""
          }}
        </li>
        <li>
          <span>
            本型号产品全省最低价
          </span>
          <img
            src="../../../../assets/images/diamond.png"
            v-if="bidData.pMinPrice == '钻石会员可见'"
            alt=""
          />
          {{
            bidData.pMinPrice != "钻石会员可见"
              ? bidData.pMinPrice + "万元"
              : ""
          }}
        </li>
        <li>
          <span>
            本型号产品全国平均价
          </span>
          <img
            src="../../../../assets/images/platinum.png"
            v-if="bidData.avgPrice == '铂金会员可见'"
            alt=""
          />
          {{
            bidData.avgPrice != "铂金会员可见" ? bidData.avgPrice + "万元" : ""
          }}
        </li>
        <li>
          <span>
            本型号产品全国最低价
          </span>
          <img
            src="../../../../assets/images/diamond.png"
            v-if="bidData.minPrice == '钻石会员可见'"
            alt=""
          />
          {{
            bidData.minPrice != "钻石会员可见" ? bidData.minPrice + "万元" : ""
          }}
        </li>
      </ul>
      <modal-vue :isShow="visible" :options="options">
        <div slot="content">
          <h3>{{ defaultVal == 1 ? "医院信息" : "各省中标信息" }}</h3>
          <ul v-if="defaultVal == 1" class="hospital-info">
            <li>
              <span>采购单位</span>
              <span>地区</span>
              <span>总台数</span>
              <span>总价格</span>
              <span>平均价格</span>
            </li>
            <li>
              <ul>
                <li
                  v-for="(item, i) in proviceHospital.getBidInfoList"
                  :key="`item-${i}`"
                >
                  <span>{{ item.HospitalName }}</span>
                  <span>{{ item.provinceName }}</span>
                  <span>{{ item.sumTS }}</span>
                  <span>{{ item.sumJG }}万元</span>
                  <span>{{ item.avgJG }}万元</span>
                </li>
              </ul>
            </li>
          </ul>

          <ul v-if="defaultVal == 2" class="provice-bid-info">
            <li>
              <span>地区</span>
              <span>总台数</span>
              <span>总价格</span>
              <span>平均价格</span>
              <span>最低价格</span>
            </li>
            <li>
              <ul>
                <li
                  v-for="item in provicePrice.provinceBidInfoList"
                  :key="item.provinceId"
                >
                  <span>{{ item.provinceName }}</span>
                  <span>{{ item.sumTS }}</span>
                  <span>{{ item.sumJG }}万元</span>
                  <span>{{ item.avgJG }}万元</span>
                  <span>{{ item.minJG }}万元</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </modal-vue>
    </div>
  </div>
</template>

<script>
  import modalVue from "../../../../components/modal/modal.vue";
  import { _getData } from "../../../../config/getData";
  import { mapState } from "vuex";

  export default {
    data() {
      return {
        visible: false,
        defaultVal: 0,
        bidData: "",
        proviceHospital: "",
        provicePrice: "",
        options: {
          title: "医院信息",
          destroyOnClose: true,
          wrapClassName: "bid-info",
          getContainer: () => document.querySelector(".comparison-info")
        }
      };
    },
    methods: {
      moreInfoClick(i) {
        if (i == 1) {
          if (this.userInfo.memberGrade == 4) {
            this.visible = true;
            this.defaultVal = i;
          } else {
            this.$message.warning("钻石会员可见");
          }
        } else {
          if (this.userInfo.memberGrade == 4 || this.userInfo.memberGrade == 3) {
            this.visible = true;
            this.defaultVal = i;
          } else {
            this.$message.warning("铂金或钻石会员可见");
          }
        }
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    mounted() {
      _getData(`${this.$API_URL.HYGLOGINURL}/server/bidInfo!request.action`, {
        method: "getBidInfoById_V27",
        userid: this.$userid || "",
        token: "",
        params: {
          id: this.$route.query.id
        }
      })
        .then(data => {
          console.log("中标", data);
          this.bidData = data.result;
        })
        .then(() => {
          if (!this.$userid) return;
          _getData(`${this.$API_URL.HYGLOGINURL}/server/bidInfo!request.action`, {
            userid: this.$userid || "",
            method: "getAllProvinceBidInfoV27",
            params: {
              currentPage: 1,
              countPerPage: 100,
              modelId: this.bidData.modelId
            }
          }).then(data => {
            console.log("各省信息", data);
            this.provicePrice = data.result;
          });

          _getData(`${this.$API_URL.HYGLOGINURL}/server/bidInfo!request.action`, {
            userid: this.$userid || "",
            method: "getHospitalListByModelV27",
            params: {
              currentPage: 1,
              countPerPage: 1000,
              modelId: this.bidData.modelId
            }
          }).then(data => {
            console.log("医院", data);
            this.proviceHospital = data.result;
          });
        });
    },
    components: {
      modalVue
    },
    watch: {
      defaultVal(newVal) {
        this.options.title = newVal == 1 ? "医院信息" : "各省中标信息";
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../../assets/scss/_commonScss";
  .bid-info-details {
    width: 100%;
    h2 {
      height: 50px;

      font-size: 17px;
      color: #333333;
      font-weight: 600;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #dddddd;
      padding-left: 16px;
      span {
        display: flex;
        height: 16px;
        width: 4px;
        background: #f5a623;
        margin-right: 8px;
      }
      ul {
        font-size: 14px;
        color: #333333;
        font-weight: normal;
        padding-right: 20px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        li {
          display: flex;
          align-items: center;
          cursor: pointer;
          .icon {
            margin-right: 7px;
            height: 14px;
            width: 14px;
          }
          &:first-child {
            margin-right: 50px;
          }
          &:hover {
            // opacity: 0.7;
            color: $theme-color;
          }
        }
      }
    }

    .base-info,
    .comparison-info {
      background: #fff;
      box-shadow: $base-box-shadow;
      display: flex;
      flex-direction: column;
      > ul {
        flex: 1;
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        li {
          padding-left: 18px;
          font-size: 14px;
          color: #333333;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 24px;
          span {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 93px;
            font-size: 14px;
            color: #999999;
            .icon {
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
            &.grade {
              background: rgba(245, 166, 35, 0.08);
              padding: 0 4px;
              height: 16px;
              display: flex;
              align-items: center;
              font-size: 11px;
              color: #f5a623;
              width: auto;
              margin-left: 4px;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .comparison-info {
      margin-top: 20px;
      > ul {
        li {
          > span {
            width: 140px;
            margin-right: 20px;
          }
        }
      }
    }
    /deep/ .modal {
      width: 701px !important;
      min-height: 489px;
      .ant-modal-content {
        height: 100%;
        min-height: 489px;
      }
      .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
        h3 {
          font-size: 18px;
          color: #000000;
          font-weight: 600;

          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 30px;
        }
        > div > ul {
          > li {
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            padding: 0 34px;
            // margin-bottom: 24px;
            span {
              &:first-child {
                width: 200px;
              }
              &:nth-child(2) {
                width: 140px;
              }
              &:nth-child(3) {
                width: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 50px;
              }
              &:nth-child(4) {
                width: 115px;
              }
            }
            &:first-child {
              background: rgba(245, 166, 35, 0.05);
              color: #666666;
              margin-bottom: 0px;
              height: 40px;
              > span {
                &:first-child {
                  width: 200px;
                }
                &:nth-child(2) {
                  width: 140px;
                }
                &:nth-child(3) {
                  width: 42px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 50px;
                }
                &:nth-child(4) {
                  width: 115px;
                }
              }
            }
            > ul {
              width: 100%;
              height: 378px;
              overflow: auto;
              padding-top: 18px;
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
              li {
                font-size: 14px;
                color: #333;
                display: flex;
                align-items: center;
                // padding: 0 34px;
                margin-bottom: 24px;
                > span {
                  &:first-child {
                    width: 200px;
                  }
                  &:nth-child(2) {
                    width: 140px;
                  }
                  &:nth-child(3) {
                    width: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 50px;
                  }
                  &:nth-child(4) {
                    width: 115px;
                  }
                }
              }
            }
          }
          &.provice-bid-info {
            > li {
              span {
                &:first-child {
                  width: 180px;
                }
                &:nth-child(3) {
                  width: 120px;
                  justify-content: flex-start;
                  margin-right: 0;
                }
                &:nth-child(2) {
                  width: 42px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 72px;
                }
                &:nth-child(4) {
                  width: 130px;
                }
              }
              ul {
                li {
                }
              }
            }
          }
        }
      }
    }
  }
</style>