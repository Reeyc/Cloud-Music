<!--音乐播放器-->
<template>
  <div class="player">
    <!-- 歌名 -->
    <van-notice-bar
      :text="formatName"
      custom-class="song-name"
      color="#FFF"
      backgroundColor="transparent"
    />
    <!-- 滚动圆 -->
    <div :style="background" class="round"></div>
    <div class="bottom">
      <!-- 进度条 -->
      <div class="progress">
        <span class="time">{{currentTime}}</span>
        <van-progress pivot-text="*" color="#d43c33" :percentage="ratio" class="progress-bar" />
        <span class="time">{{total}}</span>
      </div>
      <!-- 播放控件控件 -->
      <div class="control">
        <span class="prev iconfont iconshangyishou"></span>
        <span
          @click="play"
          :class="!isPause ? 'iconzanting' : 'iconbofang2' "
          class="play iconfont"
        ></span>
        <span class="next iconfont iconxiayishou"></span>
      </div>
    </div>
    <!-- 毛玻璃效果 -->
    <div :style="background" class="bg-fill bg-img"></div>
    <div class="bg-fill bg-layer"></div>
  </div>
</template>

<script>
import API from "../../api/index";
import { ERR_OK } from "../../api/config";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      URL: "", //播放地址
      bgImg: "", //封面
      audio: {}, //音频对象
      total: "", //音频总时长
      currentTime: "", //音频当前播放时常
      ratio: "", //播放进度百分比
      isPause: false //是否暂停
    };
  },
  computed: {
    //[歌曲信息/全局音频对象/全局播放状态]
    ...mapState(["currentSong", "globalAudio", "playing"]),
    //背景图
    background() {
      return `background-image: url(${this.bgImg})`;
    },
    //格式化歌曲名称
    formatName() {
      /**
       * [搜索结果]的歌曲数据为：artists
       * [歌手/专辑/歌单]的歌曲数据为：ar
       */
      let artists = this.currentSong.artists || this.currentSong.ar;
      let result = "";
      artists.forEach((item, index, arr) => {
        if (index === arr.length - 1) {
          result += item.name;
          return;
        }
        result += `${item.name}/`;
      });
      return `${this.currentSong.name} - ${result}`;
    }
  },
  methods: {
    ...mapMutations(["PLAYING", "PLAY_AVATAR"]),
    //获取歌曲的播放地址
    getSongURL(id) {
      return API.songURL({ id })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.URL = res.data[0].url;
        })
        .catch(err => {});
    },
    //获取歌曲封面
    getSongCover(id) {
      API.album({ id }).then(res => {
        if (!res || res.code !== ERR_OK) return;
        this.bgImg = res.album.picUrl;
      });
    },
    //创建音频对象
    createAudio() {
      this.globalAudio.destroy && this.globalAudio.destroy(); //销毁上个audio实例
      this.globalAudio.src = this.URL; //URL
      this.globalAudio.title = this.formatName; //后台标题
      this.globalAudio.coverImgUrl = this.bgImg; //后台背景图
      this.playTime(); //获取播放时间
    },
    //获取播放时间
    playTime() {
      setTimeout(() => {
        //监听进度更新
        this.globalAudio.onTimeUpdate(() => {
          this.currentTime = this.formatTime(
            this.globalAudio.currentTime,
            null
          ); //格式化当前播放时常
          this.ratio =
            this.globalAudio.currentTime / this.globalAudio.duration * 100; //进度百分比
        });
      }, 500);
    },
    //格式化播放时间
    formatTime(currtime, totaltime) {
      let time = currtime || totaltime;
      //分钟
      let min = parseInt(time / 60);
      //秒钟（当前时常需要上取整，总时长不需要上取整）
      let sec = totaltime ? parseInt(time % 60) : Math.ceil(time % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      return `${min}:${sec}`;
    },
    //点击播放/暂停
    play() {
      this.isPause ? this.globalAudio.play() : this.globalAudio.pause();
    }
  },
  async mounted() {
    //从tabbar头像点进来的，不重新创建audio
    if (this.$root.$mp.query.from) return;

    //监听播放
    this.globalAudio.onPlay(() => {
      this.isPause = false; //播放中
      this.PLAYING(true); //全局播放中[用于通知其他组件]
      this.PLAY_AVATAR(this.bgImg); //头像
      this.total = this.formatTime(null, this.globalAudio.duration); //格式化总时长
    });
    //监听暂停
    this.globalAudio.onPause(() => {
      this.isPause = true;
    });
    //监听结束
    this.globalAudio.onEnded(() => {
      this.isPause = true;
      this.PLAYING(false);
      //播放完毕后可能[currentTime]和[ratio]还会有一丝丝毫秒偏差，手动设置其到终点
      this.currentTime = this.total;
      this.ratio = 100;
      //播放下一首
      this.createAudio();
    });

    /**
     * 数据获取
     * [搜索结果]的专辑id为：album.id
     * [歌手/专辑/歌单]的专辑id为：al.id
     */
    const album = this.currentSong.album || this.currentSong.al;
    this.getSongCover(album.id); //获取封面
    await this.getSongURL(this.currentSong.id); //获取播放地址
    this.createAudio(); //创建audio实例
  }
};
</script>

<style lang="stylus" scoped>
.player
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  padding: 40px 0
  // 歌名
  & >>> .song-name
    width: 60%
    margin: 0 auto 40px
    font-size: 36px
  & >>> .van-notice-bar__content
    left: 50%
    transform: translate(-50%, 0)
  // 滚动圆
  .round
    width: 75vw
    height: 75vw
    margin: 10vh auto
    border-radius: 50%
    border: 1px solid rgba(255, 255, 255, 0.5)
    background-size: cover
    animation: rotate 20s infinite linear
  .bottom
    position: fixed
    left: 0
    right: 0
    bottom: 0
    // 进度条
    .progress
      width: 90%
      margin: 0 auto
      display: flex
      justify-content: space-between
      align-items: center
      .progress-bar
        flex: 1
        margin: 0 46px
      .time
        font-size: 26px
        color: #fff
    // 播放控件
    .control
      display: flex
      justify-content: space-between
      align-items: center
      padding: 100px 180px
      color: #fff
      span
        font-size: 50px
      .play
        font-size: 66px
  // 毛玻璃效果
  .bg-fill
    position: absolute
    top: 0
    bottom: 0
    width: 100%
  .bg-img
    z-index: -2
    filter: blur(20px)
    background-size: cover
    background-position: center
    transform: scale(1.1)
  .bg-layer
    z-index: -1
    opacity: 0.8
    background-color: rgba(0, 0, 0, 0.8)
</style>

<style>
/* 将keyframes写在stylus里面，mpvue编译不出来 */
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>