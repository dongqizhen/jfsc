<template>
  <div class="video-details">
    <div class="left">
      <div v-if="!isLoading">
        <div class="video_box">
          <h2>
            {{ detail.course.title }}
            <p>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconxinghaoliebiaoliulanliang"></use>
                </svg>
                {{ detail.course.watchAmount }}
              </span>
              <span>{{ detail.createdOn }}</span>
              <span>课程总时长：{{ detail.course.totalTime }}</span>
            </p>
          </h2>
          <div class="video">
            <video-player
              v-if="detail && detail.videoSubList.length"
              class="video-player-box vjs-custom-skin"
              :style="{ 'background-image': detail.image }"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              @ready="playerReadied"
              @pause="onPlayerPause($event)"
              @play="onPlayerPlay($event)"
              @canplay="onPlayerCanplay($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              customEventName="customstatechangedeventname"
              @statechanged="playerStateChanged($event)"
            >
            </video-player>
            <!-- <img :src="detail.image" alt="" /> -->
            <!-- <span class="video_menu">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconshipinxiangqingyebofangjian"></use>
            </svg>
          </span> -->
            <modal-vue :isShow="visible" :options="options">
              <div slot="content" class="content">
                <h2>此课程为付费课程，请前往好医工App购买观看</h2>
                <img src="../../../../assets/images/code.png" alt="" />
                <span>扫码下载好医工APP</span>
              </div>
            </modal-vue>
          </div>
          <ul>
            <li v-for="label in detail.course.labelList" :key="label.id">
              {{ label.name }}
            </li>
          </ul>
          <div class="lecturer">
            <h3>
              <i></i>
              讲师介绍
            </h3>
            <div class="photo">
              <div v-for="item in detail.course.lecturerList" :key="item.id">
                <div class="img_box">
                  <img :src="item.image" v-if="item.image" alt="" />
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#iconweidenglutouxiang"></use>
                  </svg>
                </div>
                <p>
                  {{ item.name }}
                  <span>{{ item.company }}{{ item.post }} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="introduce">
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="课件介绍" key="1" :forceRender="true">
              <div class="introduce-content" v-html="detail.course.introduce">
                <!-- <h2>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconkejianjieshaoziseyuandian"></use>
                </svg>
                术式
              </h2>
              <span>程序化、隧道法原味腹腔镜脾切除术</span>
              <h2>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconkejianjieshaoziseyuandian"></use>
                </svg>
                术者
              </h2>
              <span>徐杰、刘作金</span>
              <h2>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconkejianjieshaoziseyuandian"></use>
                </svg>
                单位
              </h2>
              <span>
                重庆医科大学附属第二医院肝胆外科<br />
                重庆市“龚建平”肝胆外科首席专家工作室<br />
                重庆市肝胆外科联盟理事长单位<br />
                重庆市肝病治疗中心外科部
              </span>
              <h2>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconkejianjieshaoziseyuandian"></use>
                </svg>
                手术特点
              </h2>
              <span>
                利用百克钳可靠的止血效果，不仅能让手术视野更加干净，而且明显减少止血钳的使用，避免了对最后使用切割闭合器的干扰。手术全程在百克钳辅助下完成，只在脾动脉处使用了止血钳。切除手术
              </span> -->
              </div>
            </a-tab-pane>
            <a-tab-pane
              :tab="`课件目录(${detail.videoSubList.length})`"
              key="2"
              :forceRender="true"
            >
              <ul class="videoList">
                <li
                  v-for="(item, i) in detail.videoSubList"
                  :key="item.id"
                  @click="videoPlay(item, i)"
                  :class="defaultVideo == i && 'active'"
                >
                  <div>
                    <span>课时{{ i + 1 }}</span>
                    <p>{{ item.title }}</p>
                    <div>
                      <svg class="icon" aria-hidden="true">
                        <use
                          v-if="!isPlay || (isPlay && defaultVideo != i)"
                          xlink:href="#iconbofangsanjiao"
                        ></use>
                        <use v-else xlink:href="#iconbofangsanjiao-copy"></use>
                      </svg>
                      {{
                        !isPlay || (isPlay && defaultVideo != i)
                          ? "播放"
                          : "正在播放"
                      }}
                      <span>{{ item.longtime }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </a-tab-pane>
          </a-tabs>
          <share-menu-vue :data="detail.course"></share-menu-vue>
        </div>
        <comment-vue
          :isLogin="$store.state.isLogin"
          :commentData="commentData"
          v-if="commentData"
          type="video"
        ></comment-vue>

        <menu-vue :item="detail" type="video"></menu-vue>
      </div>
      <loading v-else></loading>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
  import shareMenuVue from "../../../../components/common/share/shareMenu.vue";
  import commentVue from "../../../../components/common/comment/comment.vue";
  import menuVue from "../../../../components/common/share/menu.vue";
  import { _getData } from "../../../../config/getData";
  import "video.js/dist/video-js.css";
  import "vue-video-player/src/custom-theme.css";
  import { videoPlayer } from "vue-video-player";
  import modalVue from "../../../../components/modal/modal.vue";
  import { mapState } from "vuex";

  export default {
    metaInfo() {
      return {
        title: this.title,
        meta: []
      };
    },
    data() {
      return {
        detail: "",
        isLoading: true,
        playerOptions: {
          // videojs options
          muted: false,
          languages: {
            en: {
              Play: "播放",
              Pause: "暂停",
              Loaded: "加载",
              Unmute: "取消静音",
              Mute: "静音",
              Fullscreen: "全屏",
              Replay: "重新播放",
              "Non-Fullscreen": "退出全屏",
              "Play Video": "点击播放",
              "Playback Rate": "播放速度"
            }
          },
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          preload: true,
          fluid: true,
          sources: [
            {
              type: "video/mp4",
              src: ""
            }
          ],
          poster: ""
        },
        title:
          "积分商城-全国领先的医疗设备、医疗器械、医疗备件、医疗配件交易平台",
        defaultVideo: 0,
        globalOptions: {},
        commentData: "",
        loading: false,
        isPlay: false,
        isReady: false,
        visible: false,
        trySee: "",
        options: {
          title: "提示",
          getContainer: () => document.querySelector(".video"),
          wrapClassName: "videoModal"
        }
      };
    },
    components: {
      shareMenuVue,
      commentVue,
      menuVue,
      modalVue,
      videoPlayer
    },
    computed: {
      ...mapState(["isLogin"]),
      player() {
        return this.$refs.videoPlayer.player;
      },
      isPay() {
        if (this.detail.course.tradeType == 0) {
          return false;
        } else {
          if (this.detail.course.ispay == 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    methods: {
      playerStateChanged(e) {
        console.log("改变");
      },
      onPlayerCanplay(e) {
        console.log("可以");
      },
      playerReadied(e) {
        console.log("ready");
        this.isReady = true;
      },
      onPlayerTimeupdate(e) {
        // console.log("时间", e.currentTime());
        if (this.trySee <= 0) return;
        if (e.currentTime() >= this.trySee * 60) {
          this.visible = true;
          //e.bigPlayButton.disable();
          e.exitFullscreen();
          e.pause();
        } else {
          e.bigPlayButton.enable();
        }
      },
      videoPlay(item, i) {
        console.log(this.$refs.videoPlayer);
        console.log(i);
        // if (this.isPay) {
        //   this.visible = true;
        //   return;
        // }
        if (this.isPlay && this.defaultVideo == i) {
          this.isPlay = false;
          this.$refs.videoPlayer.player.pause();
        } else {
          this.defaultVideo = i;
          this.isPlay = true;
          this.trySee = item.trySee;
          this.playerOptions.sources[0].src = item.url;

          // this.$nextTick().then(() => {
          setTimeout(() => {
            this.$refs.videoPlayer.player.play();
          }, 100);

          // });
        }
      },
      onPlayerPlay(e) {
        if (this.isLogin) {
          this.isPlay = true;
        } else {
          this.$router.push("/login");
        }
      },
      onPlayerPause(e) {
        this.isPlay = false;
      },
      //获取评论列表
      async getCommentList(page = 1, pageSize = 20) {
        this.loading = true;
        return await _getData(
          `${this.$API_URL.HYGPROURL}/server_pro/video!request.action`,
          {
            method: "getReportCommentList_v27",
            userid: this.$userid,
            params: {
              currentPage: page,
              countPerPage: pageSize,
              id: this.$route.query.id,
              type: "2"
            }
          }
        )
          .then(data => {
            this.commentData = data.result;
          })
          .then(() => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
      }
    },
    mounted() {
      console.log(this.$userid)
      _getData(
        `${this.$API_URL.HYGPROURL}/server_pro/microClassroom!request.action`,
        {
          method: "getVideoById_v31",
          userid: this.$userid,
          params: { id: this.$route.query.id }
        }
      )
        .then(data => {
          this.detail = data.result;
          this.title = this.detail.course.title + "-积分商城";
          this.playerOptions.poster = this.detail.image;
          this.playerOptions.sources[0].src = this.detail.videoSubList[0].url;
          this.trySee = this.detail.videoSubList[0].trySee;
        })
        .then(() => {
          this.getCommentList()
            .then(() => {
              this.isLoading = false;
            })
            .then(() => {
              console.log(this.$refs.videoPlayer.player);
              if (this.isPay) {
                // this.$refs.videoPlayer.player.bigPlayButton.disable();
              }
            });
        });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .video-details {
    width: 100%;
  }
  .left {
    width: $content-left;
    background: $base-background;
    padding-bottom: 0;

    position: relative;

    .video_box {
      padding: 20px;
      padding-bottom: 33px;
      margin-bottom: 10px;
      background: #fff;
      box-shadow: $base-box-shadow;
      h2 {
        font-weight: 600;
        font-size: 24px;
        color: #333333;
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        p {
          font-weight: normal;
          font-size: 14px;
          color: #999999;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 5px;
          span {
            display: flex;
            height: 20px;
            align-items: center;
            margin-right: 20px;
            &:first-child {
              justify-content: flex-start;
              .icon {
                margin-right: 5px;
                width: 15px;
                height: 10px;
              }
            }
          }
        }
      }
      .video {
        width: 100%;
        height: 473px;
        background: $base-background;
        position: relative;
        cursor: pointer;
        background-size: 100% 100%;
        img {
          height: 100%;
          width: 100%;
        }
        /deep/ .video-player-box {
          width: 100%;
          height: 100%;
          .video-js {
            width: 100% !important;
            height: 100% !important;
            .vjs-poster {
              background-size: 100% 100%;
            }
            .vjs-big-play-button {
              width: 80px;
              height: 80px;
              border-radius: 41px;
              border: none;
              background: url("../../../../assets/images/play.svg") no-repeat
                center;
              background-size: 100% 100%;
            }
          }
        }
        .video_menu {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -40px;
          margin-top: -40px;

          .icon {
            width: 80px;
            height: 80px;
          }
        }
        /deep/ .videoModal {
          .modal {
            width: 706px !important;
            .ant-modal-body {
              .content {
                display: flex;
                flex-direction: column;
                align-items: center;
                h2 {
                  font-size: 22px;
                  color: #222222;
                  margin-top: 25px;
                  margin-bottom: 42px;
                  font-weight: 600;
                }
                img {
                  height: 180px;
                  width: 180px;
                }
                span {
                  display: flex;
                  width: 200px;
                  height: 39px;
                  background-image: linear-gradient(
                    96deg,
                    #fad961 0%,
                    #f76b1c 100%
                  );
                  border-radius: 19.5px;
                  margin-top: 35px;
                  font-size: 16px;
                  color: #ffffff;
                  justify-content: center;
                  align-items: center;
                  font-weight: 600;
                  margin-bottom: 36px;
                }
              }
            }
          }
        }
      }
      > ul {
        display: flex;
        justify-content: flex-start;
        margin-top: 10px;
        margin-bottom: 30px;
        li {
          margin-right: 4px;
          height: 25px;
          padding: 0 10px;
          background: #f7f7f7;
          border-radius: 15px;

          font-size: 12px;
          color: #fb6441;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 25px;
        }
      }
      .lecturer {
        font-weight: 600;
        font-size: 20px;
        color: #333333;
        display: flex;
        flex-direction: column;
        h3 {
          justify-content: flex-start;
          align-items: center;
          display: flex;
          height: 28px;
          line-height: 28px;
          margin-bottom: 24px;
          font-weight: 600;
          i {
            display: flex;
            height: 22px;
            width: 6px;
            background: #f5a623;
            border-radius: 3px;
            margin-right: 10px;
          }
        }
        .photo {
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
          > div {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 24px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .img_box {
            height: 50px;
            width: 50px;
            background: #cbcbcb;
            margin-right: 10px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            img {
              height: 100%;
              width: 100%;
            }
            .icon {
              height: 30px;
              width: 30px;
            }
          }
          p {
            font-weight: 600;
            font-size: 16px;
            color: #333333;
            display: flex;
            flex: 1;
            flex-direction: column;
            span {
              font-weight: 500;
              font-size: 14px;
              color: #666666;
              line-height: 20px;
              margin-top: 9px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }
    .introduce {
      //height: 100px;
      background: #fff;
      box-shadow: $base-box-shadow;
      margin-bottom: 10px;
      .share-menu {
        margin-left: 20px;
        border-top: 0.5px solid #dddddd;
      }
      /deep/ .ant-tabs {
        .ant-tabs-bar {
          height: 54px;
          margin-bottom: 0;
          .ant-tabs-nav-container {
            .ant-tabs-nav-wrap {
              padding: 0 20px;
              .ant-tabs-nav {
                > div {
                  &:first-child {
                    display: flex;
                    justify-content: flex-start;
                  }
                  &.ant-tabs-ink-bar {
                    background: $theme-color;
                  }
                }
                .ant-tabs-tab {
                  padding: 0;
                  height: 54px;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  font-size: 16px;
                  color: #666666;
                  &.ant-tabs-tab-active {
                    font-weight: 600;
                    color: $theme-color;
                  }
                  &:hover {
                    color: $theme-color;
                  }
                }
              }
            }
          }
        }
        .ant-tabs-content {
          // padding: 4px 20px 0;
          .ant-tabs-tabpane {
            width: 100%;
            &:first-child {
              padding: 4px 20px 0;
            }
            &:last-child {
              padding: 0px 20px;
            }
            .introduce-content {
              padding-top: 21px;
              padding-bottom: 25px;

              p {
                font-size: 16px;
                color: #666666;
                line-height: 32px;
              }
            }
            .videoList {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              margin-top: 24px;
              li {
                width: 238px;
                height: 126px;
                background: #fafafa;
                border-radius: 7px;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;

                position: relative;
                color: #666666;
                z-index: 1;
                margin-right: 7px;
                &:nth-child(3n) {
                  margin-right: 0;
                }
                &::after {
                  content: "";
                  background: rgba(245, 166, 35, 0.26);
                  position: absolute;
                  top: 25px;
                  left: 0;
                  display: flex;
                  width: 229px;
                  height: 131px;
                  z-index: -1;
                  background: url("../../../../assets/images/shadwo.png")
                    no-repeat;
                  display: none;
                  background-size: 100% 100%;
                }
                cursor: pointer;
                &:hover,
                &.active {
                  &::after {
                    display: flex;
                  }
                  > div {
                    color: #333333;
                    background: #fefaf2;
                    border: 1px solid #f5a623;
                    > span {
                      color: #333;
                    }
                    > div {
                      > span {
                        color: #333;
                      }
                    }
                  }
                }
                > div {
                  border: 1px solid #fafafa;
                  padding: 0 14px;
                  height: 100%;
                  border-radius: 7px;
                  width: 100%;
                  display: flex;
                  background: #fafafa;
                  flex-direction: column;
                  &:hover {
                    color: #333333;
                    background: #fefaf2;
                    border: 1px solid #f5a623;
                    > span {
                      color: #333;
                    }
                    > div {
                      > span {
                        color: #333;
                      }
                    }
                  }
                  > span {
                    display: flex;
                    height: 40px;
                    align-items: center;
                    font-size: 13px;
                  }
                  p {
                    font-size: 14px;
                    margin-bottom: 10px;
                    line-height: 20px;
                    height: 40px;
                  }
                  > div {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    .icon {
                      margin-right: 4px;
                      width: 13px;
                      height: 13px;
                      margin-top: 1px;
                    }
                    > span {
                      margin-left: 10px;
                      font-size: 13px;
                    }
                  }
                }
              }
            }

            h2 {
              font-weight: 600;
              font-size: 16px;
              color: #333333;
              height: 42px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-top: 10px;
              .icon {
                height: 12px;
                width: 12px;
                margin-top: 1px;
                margin-right: 6px;
              }
              &:nth-child(2) {
                margin-top: 0;
              }
            }
            span {
              font-size: 16px;
              color: #666666;
              line-height: 32px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }

    /deep/ .menu {
      border-top: 0;
      position: absolute;
      width: 50px;
      height: 240px;
      left: -60px;
      top: 0;
      flex-direction: column;
      padding: 0;
      background: #fff;
      // justify-content: space-between;
      box-shadow: $base-box-shadow;
      span {
        display: flex;
        flex-direction: column;
        height: auto;
        width: 100%;
        position: relative;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin-top: 0;
        line-height: 18px;
        // margin-bottom: 24px;
        cursor: pointer;
        i {
          margin-right: 0;
        }

        &:hover {
          &::after {
            display: flex;
          }
        }
      }
    }
  }
  .right {
  }
</style>
