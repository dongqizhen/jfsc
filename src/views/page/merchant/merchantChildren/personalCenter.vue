<template>
  <div class="personalCenter">
    <div class="commonBoxStyle">
      <commonTitle title="个人中心"></commonTitle>
      <div class="informationContent">
        <div class="common productName">
          <div class="left-box"><span class="red">*</span>单位名称</div>
          <div class="right-box">
            <a-input placeholder="请输入单位名称" />
          </div>
        </div>
        <div class="common">
          <div class="left-box">所在地址</div>
          <div class="right-box">
            <a-cascader
              :options="options"
              @change="onChange"
              placeholder="请选择省/市/区"
              :defaultValue="defaultCascaderValue"
              style="width: 390px"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box">详细地址</div>
          <div class="right-box">
            <a-input placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="common">
          <div class="left-box">手机号码</div>
          <div class="right-box">
            <a-input placeholder="请输入手机号码" />
          </div>
        </div>
        <div class="common">
          <div class="left-box">座机</div>
          <div class="right-box">
            <a-input placeholder="请输入座机" />
          </div>
        </div>
        <div class="common">
          <div class="left-box">微信</div>
          <div class="right-box">
            <a-input placeholder="请输入微信号" />
          </div>
        </div>
        <div class="common">
          <div class="left-box">性别</div>
          <div class="right-box">
            <a-radio-group @change="onChange" v-model="value">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="submit">
          <a-button class="save">保存</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  export default {
    data() {
      return {
        value: 1,
        defaultCascaderValue: [],
        loading: false,
        imageUrl: "",
        introduce: "",
        options: [
          {
            label: "北京",
            value: "Zhejiang",
            title: "北京 010",
            key: "010"
          },
          {
            label: "上海",
            value: "Jiangsu",
            key: "021"
          },
          {
            label: "杭州",
            value: "hangzhou",
            key: "0571",
            disabled: true
          }
        ]
      };
    },
    methods: {
      onChange(e) {
        console.log(`checked = ${e.target.checked}`);
      },
      handleProductTypeChange(value) {
        console.log(`selected ${value}`);
      }
    },
    components: {
      commonTitle
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .personalCenter {
    .commonBoxStyle {
      padding: 4px 20px;
      background: #ffffff;
      box-shadow: $base-box-shadow;
      margin-bottom: 10px;
      min-height: 693px;
      .informationContent {
        margin-top: 24px;
        .common {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          .left-box {
            width: 84px;
            font-family: PingFangSC-Medium;
            font-weight: 600;
            font-size: 14px;
            color: #333;
            .red {
              color: $theme-color;
              margin-left: -6.8px;
            }
          }
          .right-box {
            @include placeholderStyle;
            .ant-input {
              width: 390px;
              height: 34px;
              line-height: 34px;
              border: 1px solid #cccccc;
              border-radius: 3px;
            }
          }
        }
      }
    }
    .ant-btn {
      background: #f5a623;
      height: 33px;
      border-radius: 3px;
      border: none;
      box-shadow: none;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #fff;
      margin-top: 40px;
      margin-bottom: 54px;
      margin-left: 108px;
      padding: 0 24px;
      letter-spacing: 0;
    }
  }
</style>
