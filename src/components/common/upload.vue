<template>
  <div class="uploadImg">
    <a-upload
      listType="picture-card"
      class="avatar-uploader"
      :showUploadList="false"
      :action="actionURL"
      :headers="{ 'X-Nideshop-Token': `${userInfo.token}` }"
      :beforeUpload="beforeUpload"
      @change="handleChange"
    >
      <div
        v-for="(item, index) in uploadList"
        :key="index"
        class="uploadPreview"
      >
        <img :src="item" />
        <svg
          class="icon"
          aria-hidden="true"
          @click.stop="handleRemove(item)"
          v-if="uploadList.length > 0"
        >
          <use xlink:href="#iconshangchuanshangpinguanbi"></use>
        </svg>
      </div>
      <div v-if="uploadList.length < 1">
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
</template>
<script>
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        uploadList: [],
        actionURL: this.$API_URL.HYGFILEURL + "/api/upload/imageUpload",
        loading: false
      };
    },
    computed: {
      ...mapState(["userInfo"])
    },
    props: {
      imgUrl: {}
    },
    watch: {
      imgUrl(newVal) {
        console.log(newVal);
        if (newVal == "initial") {
          this.uploadList = [];
        } else {
          if (typeof newVal == "string" && newVal) {
            console.log(newVal);
            this.uploadList = [];
            this.uploadList.push(newVal);
          }
        }
      }
    },
    methods: {
      handleRemove(file) {
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
        this.$emit("getVal", this.uploadList);
      },
      handleChange({ fileList }) {
        console.log(fileList);
        fileList.splice(0, fileList.length - 1);
        if (fileList[0].status == "done") {
          this.loading = false;
          this.uploadList = [];
          this.uploadList.push(fileList[0].response.result.imageList[0].imageurl);
          this.$emit("getVal", this.uploadList);
        } else {
          this.loading = true;
        }
      },
      beforeUpload(file) {
        // const isJPG = file.type === "image/jpeg";
        // if (!isJPG) {
        //   this.$message.error("You can only upload JPG file!");
        // }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("图片大小不能超过2MB!");
        }
        return isLt2M;
        // return isJPG && isLt2M;
      }
    }
  };
</script>
<style lang="scss" scoped>
  /deep/.avatar-uploader {
    display: flex;
    position: relative;
    .ant-upload-list-item {
      width: 118px;
      height: 118px;
      border: none;
      background-color: #f5f5f5;
      margin-right: 0;
      margin-bottom: 0;
    }
    .ant-upload.ant-upload-select-picture-card {
      width: 118px;
      height: 118px;
      border: none;
      background-color: #f5f5f5;
      margin: 0;
      > .ant-upload {
        padding: 0;
      }
      .ant-upload-text {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ccc;
      }
      .uploadPreview {
        width: 118px;
        height: 118px;
        position: relative;
        &:hover {
          .icon {
            display: block;
          }
        }
        .icon {
          width: 23px;
          height: 23px;
          position: absolute;
          right: 4px;
          top: 4px;
          display: none;
        }
      }
      .imgLoading {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }
      .anticon {
        width: 18px;
        height: 18px;
        svg {
          width: 100%;
          height: 100%;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
