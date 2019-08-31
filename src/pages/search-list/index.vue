<!--搜索结果页面-->
<template>
  <div class="search-result">
    <van-tabs sticky swipeable :active="active" custom-class="search-tabs" @change="tabChange">
      <!-- 单曲 -->
      <van-tab title="单曲">
        <div
          v-for="(item,index) of songs"
          :key="item.id"
          @click="toPlaying(item)"
          class="item song-item"
        >
          <p class="song-name">{{item.name}}</p>
          <p class="song-info">
            <span
              v-for="(e,i) of item.artists"
              :key="e.id"
              :class="i === item.artists.length-1 ? 'last' : ''"
              class="singer"
            >{{e.name}}</span>&ensp;-&ensp;
            <span class="desc">{{item.album.name}}</span>
          </p>
        </div>
      </van-tab>
      <!-- 歌手 -->
      <van-tab title="歌手">
        <div
          v-for="item of artists"
          :key="item.id"
          @click="toArtist(item.id)"
          class="item artist-item"
        >
          <img :src="item.img1v1Url" lazy-load class="avatar" />
          <p class="artist-name">{{item.name}}</p>
        </div>
      </van-tab>
      <!-- 歌单 -->
      <van-tab title="歌单">
        <div
          v-for="item of playlists"
          :key="item.id"
          @click="toPlaylist(item.id)"
          class="item playlist-item"
        >
          <img :src="item.coverImgUrl" lazy-load class="playlist-avatar" />
          <div class="playlist-info">
            <p class="playlist-name">{{item.name}}</p>
            <p class="playlist-creator">by：{{item.creator.nickname}}</p>
            <p class="playlist-count">{{item.trackCount}}首音乐&ensp;&ensp;播放{{item.playCount}}次</p>
          </div>
        </div>
      </van-tab>
      <!-- 专辑 -->
      <van-tab title="专辑">
        <div
          v-for="item of handleAlbums"
          :key="item.id"
          @click="toAlbum(item.id)"
          class="item album-item"
        >
          <img :src="item.picUrl" lazy-load class="avatar album-avatar" />
          <div class="album-info">
            <p class="album-name">{{item.name}}</p>
            <span class="album-singer">{{item.artist.name}}&ensp;&ensp;{{item.publishTime}}</span>
          </div>
        </div>
      </van-tab>
      <!-- 用户 -->
      <van-tab title="用户">
        <div v-for="item of userprofiles" :key="item.userId" class="item user-item">
          <img :src="item.avatarUrl" lazy-load class="avatar" />
          <div class="user-info">
            <div class="user-nickname">
              {{item.nickname}}
              <span :class="userGender[item.gender]" class="iconfont"></span>
            </div>
            <p class="user-signature">{{item.signature}}</p>
          </div>
          <div class="user-focus">关注</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import API from "../../api/index";
import { ERR_OK, SEARCH } from "../../api/config";
import { mapState, mapMutations } from "vuex";
import { formatDateTime } from "../../utils/formatDate";
export default {
  data() {
    return {
      threshold: {}, //当前的Tab没有更多数据
      active: 0, //Tab索引
      keywords: "", //关键字
      songs: [], //单曲
      artists: [], //歌手
      playlists: [], //歌单
      albums: [], //专辑
      userprofiles: [], //用户
      //用户性别
      userGender: {
        0: "",
        1: "iconnan",
        2: "iconnv"
      }
    };
  },
  computed: {
    ...mapState(["searchResult"]),
    //处理Albums [格式化日期]
    handleAlbums() {
      this.albums.forEach(item => {
        item.publishTime = formatDateTime(item.publishTime);
        return;
      });
      return this.albums;
    }
  },
  methods: {
    ...mapMutations(["CURRENT_SONG"]),
    //下拉触底请求数据
    search(type, count, request) {
      API.search({
        keywords: this.keywords,
        type: request,
        limit: 30,
        offset: this[type].length
      })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          //没有更多数据了...
          if (this[type].length >= res.result[count] || !res.result[type]) {
            this.threshold[this.active] = true;
            return;
          }
          //数据请求
          Object.keys(res.result).forEach(key => {
            if (key !== type) return;
            this[type] = this[type].concat(res.result[key]);
          });
        })
        .catch(err => {});
    },
    //Tab切换，手动响应式
    tabChange(event) {
      this.active = event.mp.detail.index;
    },
    //处理数据
    handleData(data) {
      data.forEach(item => {
        const result = item.result; //对象
        Object.keys(result).forEach(key => {
          //key=>对象的属性
          SEARCH.type.forEach(type => {
            //type=>对象属性对应的数据类型
            if (key === type) {
              this[type] = result[key];
              return;
            }
          });
        });
      });
    },
    //歌曲播放
    toPlaying(item) {
      this.CURRENT_SONG(item);
      wx.navigateTo({
        url: `/pages/playing/main`
      });
    },
    //歌手详情
    toArtist(id) {
      wx.navigateTo({
        url: `/pages/artist-detail/main?id=${id}`
      });
    },
    //歌单详情
    toPlaylist(id) {
      wx.navigateTo({
        url: `/pages/playlist-detail/main?id=${id}`
      });
    },
    //专辑详情
    toAlbum(id) {
      wx.navigateTo({
        url: `/pages/album-detail/main?id=${id}`
      });
    }
  },
  mounted() {
    //搜索的关键字
    this.keywords = this.$root.$mp.query.keywords;
    //搜索的数据
    this.handleData(this.searchResult);
  },
  //下拉触底 [请求数据]
  onReachBottom() {
    //当前Tab已没有更多数据
    if (this.threshold[this.active]) {
      wx.showToast({
        title: "没有更多了哦",
        icon: "none"
      });
      return;
    }
    const currentType = SEARCH.type[this.active]; //当前的Tab分类
    const currentCount = SEARCH.typeCount[this.active]; //当前的分类总数
    const currentRequest = SEARCH.typeRequest[this.active]; //当前的分类对应请求的类型
    this.search(currentType, currentCount, currentRequest);
  },
  //页面卸载 [清空所有数据]
  onUnload() {
    Object.assign(this, this.$options.data());
  }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/css/mixins.styl'
@import '../../styles/css/variable.styl'
.item
  padding: 20px 30px
  display: flex
  align-items: center
  .avatar
    width: 120px
    height: 120px
    margin-right: 30px
    border-radius: 50%
// 单曲Tab
.song-item
  display: block
  border-bottom: 1px solid $border-color
  .song-name
    margin-bottom: 6px
    ellipsis(1)
  .song-info
    ellipsis(1)
    font-size: $small-size
    color: $deputy-color
    .singer
      &::after
        content: '/'
      &.last
        &::after
          content: ''
// 歌手Tab
.artist-item
  .artist-name
    font-size: $medium-color
// 专辑Tab
.album-item
  .album-avatar
    border-radius: 0
  .album-info
    flex: 1
    overflow: hidden
    font-size: $medium-size
    .album-name
      ellipsis(1)
      margin-bottom: 8px
    .album-singer
      font-size: $mini-size
      color: $deputy-color
      ellipsis(1)
// 歌单Tab
.playlist-item
  .playlist-avatar
    width: 160px
    height: 160px
    margin-right: 30px
  .playlist-info
    flex: 1
    overflow: hidden
    p
      margin-bottom: 10px
    .playlist-name
      fonst-size: $medium-size
      ellipsis(1)
    .playlist-creator, .playlist-count
      color: $deputy-color
      font-size: $small-size
      ellipsis(1)
// 用户Tab
.user-item
  .user-info
    flex: 1
    overflow: hidden
    padding-right: 10px
    font-size: $medium-size
    .user-nickname
      margin-bottom: 8px
      ellipsis(1)
      .iconfont
        margin-left: 10px
        font-size: 24px
        &.iconnan
          color: #409EFF
        &.iconnv
          color: #FF4090
    .user-signature
      ellipsis(1)
      font-size: $mini-size
  .user-focus
    width: 120px
    height: 50px
    text-align: center
    line-height: 50px
    font-size: $mini-size
    color: $theme-color
    border: 1px solid $theme-color
    border-radius: 40px
</style>

<style lang="stylus">
.search-tabs
  padding-top: 110px !important
</style>