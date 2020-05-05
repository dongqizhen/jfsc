<template>
  <div class="share-menu share" id="shareMenu">
    分享到：
    <!-- <vshare :vshareConfig="vshareConfig"> </vshare> -->
    <div class="social-share" data-initialized="true">
      <a v-for="item in shareArr" :key="item.icon" :class="`icon-${item.name}`">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>{{ item.title }}</span>
          </template>
          <svg class="icon" aria-hidden="true">
            <use v-bind:xlink:href="`#${item.icon}`"></use>
          </svg>
        </a-tooltip>
      </a>
    </div>
    <!-- <ul>
      <li v-for="item in shareArr" :key="item.icon">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>{{ item.title }}</span>
          </template>
          <svg class="icon" aria-hidden="true">
            <use v-bind:xlink:href="`#${item.icon}`"></use>
          </svg>
        </a-tooltip>
      </li>
    </ul> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        config: {},
        shareArr: [
          {
            icon: "iconweixinfenxiang",
            title: "分享到微信",
            name: "wechat"
          },
          {
            icon: "iconweibofenxiang",
            title: "分享到微博",
            name: "weibo"
          },
          {
            icon: "iconqqkongjianfenxiang",
            title: "分享到QQ空间",
            name: "qzone"
          },
          {
            icon: "iconqqfenxiang",
            title: "分享到QQ",
            name: "qq"
          }
        ]
      };
    },
    components: {},
    props: ["data", "url"],
    methods: {
      getShareOffsetTop() {
        let top = this.$refs.share.offsetTop;
      }
    },
    mounted() {
      // url                 : '', // 网址，默认使用 window.location.href
      // source              : '', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
      // title               : '', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
      // origin              : '', // 分享 @ 相关 twitter 账号
      // description         : '', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
      // image               : '', // 图片, 默认取网页中第一个img标签
      // sites               : ['qzone', 'qq', 'weibo','wechat', 'douban'], // 启用的站点
      // disabled            : ['google', 'facebook', 'twitter'], // 禁用的站点
      // wechatQrcodeTitle   : '微信扫一扫：分享', // 微信二维码提示文字
      // wechatQrcodeHelper  : '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'

      console.log(this.data);

      let $config = {
        title: this.data.name || this.data.title || this.data.topic || "",
        image: this.data.image || (this.data.cover && this.data.cover[0]) || "",
        description: "",
        wechatQrcodeTitle: "微信扫一扫：分享", // 微信二维码提示文字
        wechatQrcodeHelper:
          "<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>"
      };

      socialShare(".social-share", $config);
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/scss/_commonScss";
  .share {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 83px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #666666;
    .social-share {
      display: flex;
      justify-content: flex-start;
      margin-left: 14px;
      a {
        margin-right: 16px;
        cursor: pointer;
        opacity: 0.5;
        width: 29px;
        height: 29px;
        border-radius: 15px;
        &::before {
          display: none;
        }
        > div::after {
          display: none;
        }
        &:hover {
          opacity: 1;
        }
        .icon {
          width: 29px;
          height: 29px;
          &.ant-tooltip-open {
            background: none;
          }
        }
      }
    }
  }
</style>