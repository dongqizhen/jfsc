<template>
  <div class="publishGoods">
    <div class="commonBoxStyle basicInformation">
      <commonTitle :title="title"></commonTitle>
      <div class="informationContent">
        <div class="title">基本信息</div>
        <div class="common ">
          <div class="left-box"><span class="red">*</span>产品名称</div>
          <div class="right-box">
            <a-input
              ref="name"
              placeholder="请输入产品名称"
              v-model="submitData.name"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box">批准文号</div>
          <div class="right-box">
            <a-input
              placeholder="请输入批准文号"
              v-model="submitData.goodsSn"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box"><span class="red">*</span>产品分类</div>
          <div class="right-box">
            <el-select
              style="width: 190px;margin-right:10px;"
              v-model="submitData.bigCategoryId"
              placeholder="请选择大类"
              @change="handleProductBigTypeChange"
            >
              <el-option
                v-for="item in bigOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select
              style="width: 190px;margin-right:10px;"
              v-model="submitData.categoryId"
              placeholder="请选择小类"
              @change="handleProductSmallTypeChange"
            >
              <el-option
                v-for="item in smallOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="left-box"><span class="red">*</span>产品类型</div>
          <div class="right-box">
            <el-select
              style="width: 190px;margin-right:10px;"
              v-model="submitData.attribute_category"
              placeholder="请选择类型"
              @change="handleProductTypeChange"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="left-box"><span class="red">*</span>品牌</div>
          <div class="right-box">
            <el-select
              style="width: 190px;margin-right:10px;"
              v-model="submitData.brandId"
              placeholder="请选择品牌"
              @change="handleBrandChange"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common">
          <div class="left-box"><span class="red">*</span>型号</div>
          <div class="right-box">
            <el-select
              style="width: 190px;margin-right:10px;"
              v-model="submitData.modelId"
              placeholder="请选择型号"
              @change="handleModelChange"
            >
              <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="common guidePrice">
          <div class="left-box">指导价</div>
          <div class="right-box">
            <a-input
              ref="min"
              placeholder="区间最低"
              class="priceMin"
              v-model="submitData.minPrice"
            />
            <div class="joiner">一</div>
            <a-input
              ref="max"
              placeholder="区间最高"
              class="priceMax"
              v-model="submitData.maxPrice"
            />
            <div class="alertText">不填写指导价默认为询价</div>
            <!-- <a-checkbox @change="onChange" :checked="isEnquiry">
              询价
            </a-checkbox> -->
          </div>
        </div>
        <div class="common" v-if="isSparePart">
          <div class="left-box">备件号</div>
          <div class="right-box">
            <a-input
              ref="sparePart"
              placeholder="请输入备件号"
              v-model="submitData.sparePart"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box"><span class="red">*</span>库存数量</div>
          <div class="right-box">
            <a-input
              ref="goodsNumber"
              placeholder="请输入库存数量"
              v-model="submitData.goodsNumber"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box">保修期</div>
          <div class="right-box">
            <a-input
              placeholder="请输入保修期"
              v-model="submitData.warrantyPeriodTime"
            />
          </div>
        </div>
        <div class="common">
          <div class="left-box">产地</div>
          <div class="right-box">
            <a-input placeholder="请输入产地" v-model="submitData.origin" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="commonBoxStyle specification"
      v-show="specificationParams.length > 0"
    >
      <div class="title">产品规格参数</div>
      <div class="specificationContent">
        <list-title :titleArr="titleArr"></list-title>
        <div class="table-body">
          <ul>
            <li v-for="item in specificationParams" :key="item.id">
              <span>{{ item.specificationName }}</span>
              <span
                @click="editParam(item.id)"
                :class="current == item.id ? 'focusStyle' : ''"
              >
                <a-textarea
                  ref="ipt"
                  :iptId="item.id"
                  :class="current == item.id ? 'borderStyle' : ''"
                  placeholder="请输入参数值"
                  v-model="item.value"
                  @blur="saveEditValue"
                  @focus="focusChange(item.id)"
                  autosize
                ></a-textarea>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconbianji"></use>
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="commonBoxStyle productPicture">
      <div class="title">
        商品图片
        <span>
          (图片尺寸为800*800，单张大小不超过1M。)
        </span>
      </div>
      <div class="pictureContent">
        <div
          v-for="file in uploadList"
          :key="file.uid"
          class="uploadItem"
          :data-id="file.uid"
        >
          <img :src="file.url" />
          <div class="demo-upload-list-cover">
            <svg class="icon" aria-hidden="true" @click="handleRemove(file)">
              <use xlink:href="#iconshangchuanshangpinguanbi"></use>
            </svg>
          </div>
        </div>
        <a-upload
          v-show="uploadList.length < 6"
          ref="upload"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :headers="{ 'X-Nideshop-Token': `${userInfo.token}` }"
          :action="actionURL"
          :beforeUpload="beforeUpload"
          @change="handleChange"
        >
          <div v-show="!loading">
            <a-icon class="icon">
              <use xlink:href="#icontianjiatupian1"></use>
            </a-icon>
            <div class="ant-upload-text">点击添加图片</div>
          </div>
          <div class="imgLoading" v-show="loading">
            <a-icon type="loading" class="icon"></a-icon>
          </div>
        </a-upload>
      </div>
    </div>
    <div class="commonBoxStyle productIntroduce">
      <div class="title"><i>*</i>商品介绍</div>
      <div class="introduceContent">
        <ueditor
          :value="submitData.goodsDesc"
          :config="UEConfig"
          ref="goodDesc"
        ></ueditor>
      </div>
    </div>
    <div class="submit">
      <a-button class="release" @click="release" :loading="releaseLoading">
        直接发布并上架
      </a-button>
      <a-button class="save" @click="save" :loading="saveLoading">
        保存
      </a-button>
      <a-button class="reset" @click="reset">重置</a-button>
    </div>
    <publish-goods-success
      :Visible="visible"
      :type="type"
      :title="saveAlert"
    ></publish-goods-success>
  </div>
</template>

<script>
  import commonTitle from "../../../../components/common/merchantRightCommonTitle";
  import listTitle from "../../../../components/common/listTitle";
  import addBtn from "../../../../components/common/productParams/addBtn";
  import paramItem from "../../../../components/common/productParams/paramItem";
  import newParam from "../../../../components/common/productParams/newParam";
  import publishGoodsSuccess from "../../../../components/modal/publishGoodsSuccess";
  import ueditor from "../../../../components/common/ueditor";
  import { _getData, _getDataAll } from "../../../../config/getData";
  import { mapState, mapMutations } from "vuex";
  export default {
    data() {
      return {
        type: "",
        visible: false,
        UEConfig: {
          zIndex: 1,
          autoFloatEnabled: false,
          initialFrameWidth: "100%",
          initialFrameHeight: 450,
          initialContent: "请输入商品描述"
        },
        title: "发布商品",
        saveAlert: "产品发布成功",
        loading: false,
        releaseLoading: false,
        saveLoading: false,
        resetLoading: false,
        actionURL: this.$API_URL.HYGFILEURL + "/api/upload/imageUpload",
        titleArr: [
          "参数名称",
          "参数值（默认为系统参数，可根据实际产品修改参数）"
        ],
        specificationParams: [],
        defaultCascaderValue: [],
        bigOptions: [],
        smallOptions: [],
        typeOptions: [],
        brandOptions: [],
        modelOptions: [],
        categoryId: -1,
        brandId: -1,
        isSparePart: 0,
        uploadList: [],
        tempUploadList: [],
        isEnquiry: false,
        current: -1,
        submitData: {
          name: "",
          goodsSn: "",
          bigCategoryId: "", //大类
          categoryId: "", //小类
          attribute_category: "", //产品类型
          brandId: "",
          modelId: "",
          minPrice: "",
          maxPrice: "",
          sparePart: "", //备件号
          goodsNumber: 1000, //库存
          warrantyPeriodTime: "", //保修期
          origin: "", //产地
          goodsDesc: "",
          goodsDescText: "",
          isOnSale: "1",
          isEnquiry: 1,
          listPicUrl: [] //商品图片
        }
      };
    },
    computed: {
      ...mapState(["isLogin", "userInfo"])
    },
    methods: {
      ...mapMutations(["changeUserShopInfoState"]),
      release() {
        this.releaseLoading = true;
        _getData("/user/getUser", {}).then(data => {
          console.log("获取用户的店铺开店信息：", data);
          this.changeUserShopInfoState(data);
          if (data.store_id && data.audit_status == 2) {
            if (this.infoJudge() !== false) {
              this.submitData.isOnSale = 1;
              if (this.submitData.goodsId) {
                _getData("/goods/updateGoods", this.submitData).then(data => {
                  this.releaseLoading = false;
                  if (data.code != 500) {
                    this.$message.success("产品编辑成功", 1);
                    this.$router.replace({
                      path: "/merchant/productManage",
                      query: { keyId: "5" }
                    });
                  }
                });
              } else {
                _getData("/goods/addGoods", this.submitData).then(data => {
                  this.releaseLoading = false;
                  if (data.code != 500) {
                    this.saveAlert = "产品发布成功";
                    this.addCarSuccess();
                    this.reset();
                  }
                });
              }
            }
          } else {
            if (data.audit_status == 1) {
              this.$message.warning(
                "您的店铺正在审核中，暂不能提交商品，请联系管理员！"
              );
            } else if (data.audit_status == 3) {
              this.$message.warning(
                "您的店铺未通过审核，暂不能提交商品，请联系管理员！"
              );
            }
            this.releaseLoading = false;
            return;
          }
        });
      },
      save() {
        this.saveLoading = true;
        if (this.infoJudge() !== false) {
          this.submitData.isOnSale = 0;
          if (this.submitData.goodsId) {
            _getData("/goods/updateGoods", this.submitData).then(data => {
              this.saveLoading = false;
              this.$message.success("产品保存成功", 1);
              this.$router.replace({
                path: "/merchant/productManage",
                query: { keyId: "5" }
              });
            });
          } else {
            _getData("/goods/addGoods", this.submitData).then(data => {
              this.saveLoading = false;
              this.saveAlert = "产品保存成功";
              this.addCarSuccess();
            });
          }
        }
      },
      reset() {
        this.submitData = {
          name: "",
          goodsSn: "",
          bigCategoryId: "", //大类
          categoryId: "", //小类
          attribute_category: "", //产品类型
          brandId: "",
          modelId: "",
          minPrice: "",
          maxPrice: "",
          sparePart: "", //备件号
          goodsNumber: 1000, //库存
          warrantyPeriodTime: "", //保修期
          origin: "", //产地
          goodsDesc: "",
          goodsDescText: "",
          isOnSale: "1",
          isEnquiry: 1,
          listPicUrl: [] //商品图片
        };
        this.specificationParams = [];
        this.uploadList = [];
        this.current = -1;
        this.tempUploadList = [];
        this.isSparePart = 0;
        this.$refs.goodDesc.setUEContent("");
        this.$refs.upload.sFileList = [];
      },
      addCarSuccess() {
        if (!this.isLogin) {
          this.type = "login";
        }
        this.visible = true;
      },
      infoJudge() {
        if (!this.submitData.name) {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请输入商品名称", 1);
          this.$refs.name.focus();
          return false;
        }
        if (this.submitData.bigCategoryId == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请选择大类", 1);
          return false;
        }
        if (this.submitData.categoryId == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请选择小类", 1);
          return false;
        }
        if (this.submitData.attribute_category == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请选择类型", 1);
          return false;
        }
        if (this.submitData.brandId == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请选择品牌", 1);
          return false;
        }
        if (this.submitData.modelId == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请选择型号", 1);
          return false;
        }
        if (this.submitData.minPrice) {
          if (
            !/^[1-9]\d*\.?\d*|0\.?\d*[1-9]\d*$/.test(this.submitData.minPrice)
          ) {
            this.releaseLoading = false;
            this.saveLoading = false;
            this.$message.warning("指导价只能为数字", 1);
            this.$refs.min.focus();
            return false;
          }
        }
        if (this.submitData.maxPrice) {
          if (
            !/^[1-9]\d*\.?\d*|0\.?\d*[1-9]\d*$/.test(this.submitData.maxPrice)
          ) {
            this.releaseLoading = false;
            this.saveLoading = false;
            this.$message.warning("指导价只能为数字", 1);
            this.$refs.max.focus();
            return false;
          }
        }
        if (this.submitData.minPrice && this.submitData.maxPrice) {
          if (
            Number(this.submitData.minPrice) > Number(this.submitData.maxPrice)
          ) {
            this.releaseLoading = false;
            this.saveLoading = false;
            this.$message.warning("指导价最小值不能高于最大值", 1);
            this.$refs.max.focus();
            return false;
          }
        }
        // if (this.isSparePart) {
        //   if (!this.submitData.sparePart) {
        //     this.releaseLoading = false;
        //     this.saveLoading = false;
        //     this.$message.warning("请输入备件号", 1);
        //     this.$refs.sparePart.focus();
        //     return false;
        //   }
        // }
        if (this.submitData.goodsNumber == "") {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("库存数量不能为空", 1);
          this.$refs.goodsNumber.focus();
          return false;
        } else {
          if (this.submitData.goodsNumber) {
            if (!/^[1-9]\d*$/.test(this.submitData.goodsNumber)) {
              this.releaseLoading = false;
              this.saveLoading = false;
              this.$message.warning("库存数量只能为数字", 1);
              this.$refs.goodsNumber.focus();
              return false;
            }
          }
        }

        this.submitData.goodsDesc = this.$refs.goodDesc.getUEContent();
        this.submitData.goodsDescText = this.$refs.goodDesc.getUEContentTxt();

        if (!this.submitData.goodsDesc) {
          this.releaseLoading = false;
          this.saveLoading = false;
          this.$message.warning("请输入商品描述", 1);
          return false;
        } else {
          if (this.$refs.goodDesc.getUEContentTxt().length > 5000) {
            this.$message.warning("商品描述不能超过5000字符", 1);
            return false;
          }
        }
        if (this.uploadList.length > 0) {
          this.submitData.listPicUrl = [];
          _.map(this.uploadList, val => {
            this.submitData.listPicUrl.push(val.url);
          });
        } else {
          this.submitData.listPicUrl = [];
        }
        this.submitData.specificationInfo = this.specificationParams;
      },
      editParam(id) {
        _.map(this.$refs.ipt, (o, index) => {
          if (o.$attrs.iptId == id) {
            this.$refs.ipt[index].focus();
          }
        });
      },
      saveEditValue() {
        this.current = -1;
      },
      focusChange(id) {
        this.current = id;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.sFileList;
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
        if (fileList.indexOf(file) != -1) {
          this.$refs.upload.sFileList.splice(fileList.indexOf(file), 1);
        } else {
          this.tempUploadList.splice(this.tempUploadList.indexOf(file), 1);
        }
      },
      handleChange(info) {
        // console.log(info);
        if (info.file.status == "done") {
          this.loading = false;
          for (const val of info.fileList) {
            val.url = val.response.result.imageList[0].imageurl;
          }
          this.uploadList = this.tempUploadList.concat(info.fileList);
        } else {
          this.loading = true;
        }
      },
      onChange(e) {
        // console.log(`checked = ${e.target.checked}`);
        if (e.target.checked) {
          this.submitData.minPrice = "";
          this.submitData.maxPrice = "";
          this.submitData.isEnquiry = 1;
          this.isEnquiry = true;
        } else {
          this.submitData.isEnquiry = 0;
          this.isEnquiry = false;
        }
      },
      handleProductBigTypeChange(value) {
        // console.log(`selected ${value}`);
        this.submitData.bigCategoryId = value;
        this.submitData.categoryId = "";
        this.submitData.brandId = "";
        this.submitData.modelId = "";
        this.getSmallType(value);
      },
      handleProductSmallTypeChange(value) {
        // console.log(`selected ${value}`);
        this.submitData.categoryId = value;
        this.submitData.brandId = "";
        this.submitData.modelId = "";
        this.getModelData(value);
      },
      handleProductTypeChange(value) {
        // console.log(`selected ${value}`);
        this.submitData.attribute_category = value;
        _.map(this.typeOptions, val => {
          if (val.id == value) {
            this.isSparePart = val.isSparePart;
          }
        });
      },
      handleBrandChange(value) {
        // console.log(`selected ${value}`);
        this.submitData.brandId = value;
        this.submitData.modelId = "";
        this.getModelData(this.submitData.categoryId, value);
      },
      handleModelChange(value) {
        // console.log(`selected ${value}`);
        this.submitData.modelId = value;
        this.getSpecificationParam(value);
      },
      beforeUpload(file) {
        // const isLt2M = file.size / 1024 / 1024 < 1;
        // if (!isLt2M) {
        //   this.$message.error("图片大小不能超过1MB!");
        // }
        // return isLt2M;
      },
      getSmallType(id) {
        _getData("/catalog/secondForWeb", { id: id }).then(data => {
          // console.log(data);
          _.each(data.subCategory, val => {
            val.label = val.name;
            val.value = val.id;
          });
          this.smallOptions = data.subCategory;
        });
      },
      getModelData(categoryId, brandId) {
        _getData("/brandmodel/listForAdd", {
          categoryId: categoryId,
          brandId: brandId
        }).then(data => {
          console.log(data);
          _.each(data.brandModelList, val => {
            val.label = val.name;
            val.value = val.id;
          });
          this.modelOptions = data.brandModelList;
        });
      },
      getSpecificationParam(modelId) {
        _getData("/modelspecification/query", { modelId: modelId }).then(data => {
          console.log("规格参数：：：", data);
          this.specificationParams = data.modelSpecificationInfo;
        });
      }
    },

    mounted() {
      _getData("/catalog/firstForWeb", {}).then(data => {
        console.log("一级", data);
        _.each(data.categoryList, val => {
          val.label = val.name;
          val.value = val.id;
        });
        this.bigOptions = data.categoryList;
      });
      _getData("/goods/getGoodsType", {}).then(data => {
        console.log("产品类型：", data);
        _.each(data, val => {
          val.label = val.name;
          val.value = val.id;
        });
        this.typeOptions = data;
      });
      _getData("/brand/queryListALL", { firstLine: null }).then(data => {
        console.log("产品品牌：", data);
        _.each(data.brandList, val => {
          val.label = val.name;
          val.value = val.id;
        });
        this.brandOptions = data.brandList;
      });
      if (this.$route.query.id) {
        this.title = "编辑商品";
        _getData("/goods/gooddetail", { id: this.$route.query.id }).then(data => {
          console.log("获取产品详情：", data);
          this.submitData.goodsId = data.productInfo.id;
          this.getSmallType(data.productInfo.big_category_id);
          this.getModelData(
            data.productInfo.category_id,
            data.productInfo.brand_id
          );
          this.submitData.name = data.productInfo.name;
          this.submitData.goodsSn = data.productInfo.goods_sn;
          this.submitData.bigCategoryId = data.productInfo.big_category_id;
          this.submitData.categoryId = data.productInfo.category_id;
          this.submitData.attribute_category =
            data.productInfo.attribute_category;
          this.submitData.brandId = data.productInfo.brand_id;
          this.submitData.modelId = data.productInfo.model_id;

          this.submitData.sparePart = data.productInfo.spare_part;
          this.isSparePart = data.productInfo.spare_part ? 1 : 0;
          this.submitData.goodsNumber = data.productInfo.goods_number;
          this.submitData.warrantyPeriodTime =
            data.productInfo.warranty_period_time;
          this.submitData.origin = data.productInfo.origin;
          this.specificationParams = data.specificationInfo;
          this.submitData.specificationInfo = this.specificationParams;

          this.submitData.goodsDesc = data.productInfo.goods_desc;
          this.submitData.isOnSale = data.productInfo.is_on_sale;
          if (data.productInfo.isEnquiry) {
            this.isEnquiry = true;
            this.submitData.minPrice = "";
            this.submitData.maxPrice = "";
          } else {
            this.isEnquiry = false;
            this.submitData.minPrice = data.productInfo.min_price;
            this.submitData.maxPrice = data.productInfo.max_price;
          }
          let imgArr = JSON.parse(data.productInfo.list_pic_url);
          _.map(imgArr, (val, index) => {
            this.tempUploadList.push({ uid: index + 1, url: val });
          });
          this.uploadList = [...this.tempUploadList];
        });
      }
    },
    components: {
      commonTitle,
      listTitle,
      addBtn,
      newParam,
      paramItem,
      ueditor,
      publishGoodsSuccess
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .publishGoods {
    .commonBoxStyle {
      padding: 4px 20px;
      background: #ffffff;
      box-shadow: $base-box-shadow;
      margin-bottom: 10px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #f5a623;
        border-bottom: 1px solid #ddd;
        padding-left: 10px;
        padding-bottom: 11px;
        margin-bottom: 28px;
        margin-top: 24px;
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          margin-left: 9px;
        }
        i {
          font-style: normal;
          color: $theme-color;
          // font-size: 14px;
        }
      }
    }
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
          &:hover {
            border-color: $theme-color !important;
          }

          &:focus {
            border-color: $theme-color !important;
            box-shadow: 0 0 0 2px rgba(241, 2, 21, 0.2) !important;
          }
        }
        .bigType {
          margin-right: 10px;
        }
        .alertText {
          margin-left: 20px;
          color: $theme-color;
        }
      }
    }
    .basicInformation {
      .certificationStatus {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
      }
      .informationContent {
        margin-bottom: 10px;
        .companyIntroduce {
          align-items: flex-start;
          .left-box {
            margin-top: 6px;
          }
        }
        .guidePrice {
          .right-box {
            display: flex;
            align-items: center;
            .ant-input {
              width: 88px;
            }
            .priceMin {
              margin-right: 10px;
            }
            .joiner {
              color: #cccccc;
            }
            .priceMax {
              margin-left: 10px;
              margin-right: 46px;
            }
            /deep/.ant-checkbox {
              .ant-checkbox-inner {
                border-radius: 50%;
              }
            }
            /deep/.ant-checkbox-wrapper:hover,
            .ant-checkbox:hover,
            .ant-checkbox-input:focus {
              .ant-checkbox-inner {
                border-color: $theme-color;
              }
            }
            /deep/.ant-checkbox-checked {
              .ant-checkbox-inner {
                background-color: $theme-color;
                border-color: $theme-color;
              }
            }
          }
        }
      }
    }
    .specification {
      padding-bottom: 24px;
      .specificationContent {
        /deep/.listTitle {
          ul {
            li {
              height: 100%;
              justify-content: center;
              margin: 0;
              &:first-child {
                width: 234px;
                border-right: $border-style;
              }
              &:nth-child(2) {
                flex: 1;
              }
            }
          }
        }
        .table-body {
          border: $border-style;
          border-top: none;
          ul {
            li {
              display: flex;
              border-bottom: $border-style;
              &:last-child {
                border-bottom: none;
              }
              span {
                text-align: center;
                padding: 16px 20px;
                color: #333;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                &:first-child {
                  width: 234px;
                  border-right: $border-style;
                }
                &:nth-child(2) {
                  flex: 1;
                  position: relative;
                  i {
                    font-style: normal;
                  }
                  .icon {
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    display: none;
                  }
                  /deep/.ant-input {
                    text-align: center;
                    resize: none;
                    border: none;
                    background-color: rgba(245, 166, 35, 0.01);
                    &:focus {
                      background-color: #fff;
                      border: $border-style !important;
                      text-align: left;
                      box-shadow: none !important;
                    }
                  }
                  &:hover {
                    cursor: pointer;
                    background-color: rgba(245, 166, 35, 0.06);
                    .icon {
                      display: block;
                    }
                  }
                  &.focusStyle {
                    background-color: #fff;
                    .icon {
                      display: none;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .productPicture {
      .pictureContent {
        height: 118px;
        margin-bottom: 18px;
        display: flex;
        .demo-upload-list {
          width: 118px;
          height: 118px;
          margin-right: 30px;
          border: 1px dashed #ccc;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          &:hover {
            cursor: pointer;
            .demo-upload-list-cover {
              display: block;
            }
          }
        }
        .demo-upload-list-cover {
          display: none;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .icon {
            width: 23px;
            height: 23px;
            position: absolute;
            right: 4px;
            top: 4px;
          }
        }
        .uploadItem {
          width: 118px;
          height: 118px;
          margin-right: 30px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          &:hover {
            cursor: pointer;
            .demo-upload-list-cover {
              display: block;
            }
          }
        }
        /deep/.avatar-uploader {
          position: relative;
          .ant-upload.ant-upload-select-picture-card {
            width: 118px;
            height: 118px;
            border: none;
            .anticon {
              width: 18px;
              height: 18px;
              svg {
                width: 100%;
                height: 100%;
              }
            }
            .imgLoading {
              width: 118px;
              height: 118px;
              background-color: rgba(0, 0, 0, 0.5);
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 100;
            }
            .ant-upload-text {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #ccc;
            }
            img {
              width: 100%;
            }
          }
          .ant-upload-list {
            .ant-upload-list-item {
              width: 118px;
              height: 118px;
              margin-right: 30px;
              padding: 0;
              img {
                width: 100%;
              }
            }
          }
        }
      }
    }
    .productIntroduce {
      .introduceContent {
        margin-bottom: 56px;
      }
    }
    .ant-btn {
      height: 33px;
      border-radius: 3px;
      border: none;
      box-shadow: none;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #fff;
      margin-top: 34px;
      margin-bottom: 111px;
      margin-left: 30px;
      padding: 0 24px;
      letter-spacing: 0;
      &:hover {
        opacity: 0.7;
      }
    }
    .release {
      border: 1px solid $theme-color;
      background-image: linear-gradient(90deg, #f10000 0%, #ff4e1a 100%);
    }
    .save {
      border: 1px solid #f5a623;
      background: #f5a623;
    }
    .reset {
      background: #999;
    }
  }
</style>
