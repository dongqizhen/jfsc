<template>
  <div class="itemProductComment">
    <div class="productInfo">
      <img :src="data.list_pic_url" />
      <div class="productName">{{ data.goods_name }}</div>
    </div>
    <div class="common">
      <div class="left-box commentProduct">评价商品</div>
      <div class="right-box">
        <a-textarea
          placeholder="其他买家需要你的建议哦！"
          v-model="submitData.content"
        ></a-textarea>
      </div>
    </div>
    <div class="common">
      <div class="left-box">上传图片</div>
      <div class="right-box">
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
            ref="upload"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :headers="{ 'X-Nideshop-Token': `${userInfo.token}` }"
            :action="actionURL"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            v-show="uploadList.length < 6"
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
    </div>
    <div class="common" v-show="paramList.length > 0">
      <div class="left-box">商品打分</div>
      <div class="right-box">
        <div
          class="commentItem"
          v-for="item in paramList"
          :key="item.commentNameId"
        >
          <span>{{ item.commentName }}</span>
          <span>
            <a-rate v-model="item.attributeCategoryName"> </a-rate>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import { _getData } from "../../../config/getData";
  import _ from "lodash";
  export default {
    data() {
      return {
        actionURL: this.$API_URL.HYGFILEURL + "/api/upload/imageUpload",
        loading: false,
        productId: this.data.goods_id,
        uploadList: [],
        tempUploadList: [],
        submitData: {
          content: ""
        },
        paramList: []
      };
    },
    computed: {
      ...mapState(["userInfo"])
    },
    props: {
      data: {
        type: Object
      }
    },
    methods: {
      handleRemove(file) {
        const fileList = this.$refs.upload.sFileList;
        console.log(fileList);
        if (fileList.indexOf(file) != -1) {
          this.$refs.upload.sFileList.splice(fileList.indexOf(file), 1);
        } else {
          this.tempUploadList.splice(this.tempUploadList.indexOf(file), 1);
        }
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
      },
      handleChange(info) {
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
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          this.$message.error("Image must smaller than 1MB!");
        }
        return isLt2M;
      }
    },
    mounted() {
      console.log(this.data);
      _getData("/commentPlus/commentName", { goodsId: this.data.goods_id }).then(
        data => {
          console.log("评论字段：：：", data);
          this.paramList = data.list[0].commentNameList;
          _.each(this.paramList, o => {
            return (o.attributeCategoryName = 3);
          });
        }
      );
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/_input";
  .itemProductComment {
    border-bottom: 1px solid #ddd;
    .productInfo {
      height: 58px;
      padding-left: 10px;
      background: rgba(245, 166, 35, 0.05);
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      img {
        width: 30px;
        height: 30px;
      }
      .productName {
        font-size: 15px;
        color: #333333;
        font-weight: 600;
        margin-left: 8px;
      }
    }
    .common {
      display: flex;
      margin-bottom: 24px;
      padding-left: 10px;
      .left-box {
        width: 88px;
        font-size: 14px;
        color: #666666;
      }
      .commentProduct {
        margin-top: 4px;
      }
      .right-box {
        // width: 530px;
        .ant-input {
          width: 520px;
          height: 109px;
          line-height: 20px;
          font-size: 14px;
          color: #333;
          resize: none;
        }
        .pictureContent {
          // height: 118px;
          margin-bottom: 18px;
          display: flex;
          flex-wrap: wrap;
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
            margin-right: 14px;
            margin-bottom: 10px;
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
        .commentItem {
          height: 20px;
          margin-bottom: 13px;
          display: flex;
          span {
            display: flex;
            &:first-child {
              margin-right: 13px;
            }
            &:last-child {
              height: 20px;
              /deep/ul {
                height: 100%;
                color: #f10215;
                li {
                  font-size: 20px;
                  &.ant-rate-star {
                    top: -8px;
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
