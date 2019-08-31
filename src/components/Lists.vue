<!-- 数据列表 -->
<template>
  <div class="wrap">
    <!-- [歌手专辑]不显示全部播放 -->
    <div v-if="!isArtistAlbum" class="play-all">
      <span class="play-icon iconfont iconbofang1"></span>
      <span class="play-text">全部播放</span>
      <span class="play-length">（共{{data.length}}首）</span>
    </div>
    <div v-for="(item,index) of data" :key="item.id" @click="location(item)" class="item">
      <div class="main">
        <!-- [歌手专辑]图片 -->
        <img v-if="isArtistAlbum" :src="item.picUrl" class="img" />
        <span v-else class="index">{{index+1}}</span>
        <div class="info">
          <p class="medium-size name">{{item.name}}</p>
          <!-- [歌手专辑]日期/数量 -->
          <div v-if="isArtistAlbum" class="date">
            <span>{{item.publishTime}}</span>&ensp;&ensp;
            <span>{{item.size}}首</span>
          </div>
          <p v-else class="mini-size deputy">{{item.deputy}}</p>
        </div>
      </div>
      <!-- [歌手专辑]不显示播放图标 -->
      <span v-if="!isArtistAlbum" class="play-icon iconfont iconbofang1"></span>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from "../utils/formatDate";
import { mapMutations } from "vuex";
export default {
  props: {
    type: String,
    artistSong: Array, //歌手单曲
    artistAlbum: Array, //歌手专辑
    albumSong: Array, //专辑歌曲
    playlistSong: Array //歌单数据
  },
  computed: {
    //找出当前的数据数组
    data() {
      if (this.isArtistAlbum) {
        //[歌手专辑]数据要特殊处理
        return this.handleArtistAlbum(this.artistAlbum);
      }
      return [this.artistSong, this.albumSong, this.playlistSong].find(Boolean);
    },
    //判断当前数据类型是否是[歌手专辑]
    isArtistAlbum() {
      return this.type === "artist-album";
    }
  },
  methods: {
    ...mapMutations(["CURRENT_SONG"]),
    //跳转
    location(item) {
      if (this.isArtistAlbum) {
        //跳转专辑详情
        wx.navigateTo({
          url: `/pages/album-detail/main?id=${item.id}`
        });
        return;
      } else {
        //跳转歌曲播放
        this.CURRENT_SONG(item); //vuex传值
        wx.navigateTo({
          url: `/pages/playing/main`
        });
      }
    },
    //[歌手专辑]日期格式化
    handleArtistAlbum(data) {
      if (!data) return [];
      data.forEach(item => {
        item.publishTime = formatDateTime(item.publishTime);
        return;
      });
      return data;
    },
    //deputy区域展示不同的数据
    handleDeputy() {
      const _this = this;
      const temp = {
        //歌手数据 => deputy展示专辑
        artist: function() {
          _this.data.forEach(item => {
            item.deputy = item.al.name;
          });
        },
        //专辑数据 => deputy展示歌手（多个）
        album: function() {
          _this.data.forEach(item => {
            item.deputy = item.deputy || "";
            item.ar.forEach((e, i, r) => {
              if (i === r.length - 1) {
                item.deputy += e.name;
                return;
              }
              item.deputy += `${e.name}/`;
            });
          });
        },
        //歌单数据 => deputy展示歌手（多个） - 专辑
        playlist: function() {
          _this.data.forEach((item, index, arr) => {
            item.deputy = item.deputy || "";
            item.ar.forEach((e, i, r) => {
              if (i === r.length - 1) {
                item.deputy += `${e.name} - ${item.al.name}`;
                return;
              }
              item.deputy += `${e.name}/`;
            });
          });
        }
      };
      temp[this.type] && temp[this.type]();
    }
  },
  onLoad() {
    //处理deputy数据
    this.handleDeputy();
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/css/mixins.styl'
@import '../styles/css/variable.styl'
.play-icon
  font-size: 42px
.medium-size
  font-size: $medium-size
  margin-bottom: 6px
  ellipsis(1)
.mini-size
  font-size: $mini-size
  color: $deputy-color
  ellipsis(1)
.wrap
  padding: 20px 0
  .play-all
    display: flex
    align-items: center
    padding: 16px 80px 16px 30px
    padding-bottom: 38px
    border-bottom: 1px solid $border-color
    .play-text
      margin-left: 14px
    .play-length
      font-size: $small-size
      color: $deputy-color
  .item
    display: flex
    align-items: center
    justify-content: space-between
    padding: 16px 80px 16px 30px
    border-bottom: 1px solid $border-color
    .main
      display: flex
      align-items: center
      overflow: hidden
      .img
        width: 120px
        height: 120px
      .index
        font-size: $small-size
        margin-right: 8px
        color: $deputy-color
      .info
        padding: 0 30px 0 20px
        overflow: hidden
        .name
          margin-bottom: 6px
        .date
          font-size: $small-size
          color: $deputy-color
</style>