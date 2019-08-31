<!-- 列表模板 -->
<template>
  <div>
    <!-- 背景区域 [内容由父组件决定] -->
    <div class="bg-img-wrap">
      <div class="bg-fill bg-main">
        <slot></slot>
      </div>
      <!-- 背景图 [高度模糊] -->
      <div :style="background" class="bg-fill bg-img"></div>
      <!-- 遮挡层 [黑色背景] -->
      <div class="bg-fill bg-layer"></div>
    </div>
    <!-- 歌手数据 -->
    <van-tabs v-if="type==='artist'" swipeable :active="active" class="list-wrap">
      <van-tab title="热门单曲">
        <lists :type="type" :artistSong="artistSong"></lists>
      </van-tab>
      <van-tab title="专辑">
        <lists :type="'artist-album'" :artistAlbum="artistAlbum"></lists>
      </van-tab>
    </van-tabs>
    <!-- 专辑数据 -->
    <div v-if="type==='album'" class="list-wrap">
      <lists :type="type" :albumSong="albumSong"></lists>
    </div>
    <!-- 歌单数据 -->
    <div v-if="type==='playlist'" class="list-wrap">
      <lists :type="type" :playlistSong="playlistSong"></lists>
    </div>
    <!-- 用户数据 -->
  </div>
</template>

<script>
import Lists from "./Lists";
export default {
  props: {
    type: String, //类型
    bgImg: String, //背景图
    artistSong: Array, //歌手单曲
    artistAlbum: Array, //歌手专辑
    albumSong: Array, //专辑歌曲
    playlistSong: Array //歌单数据
    //电台数据
  },
  data() {
    return {
      active: 0
    };
  },
  computed: {
    //背景图样式
    background() {
      return `background-image: url(${this.bgImg});`;
    }
  },
  components: { Lists }
};
</script>

<style lang="stylus" scoped>
// 背景区域
.bg-img-wrap
  position: relative
  height: 0
  padding-bottom: 55%
  background-size: cover
  margin-bottom: -30px
  .bg-fill
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
  .bg-img
    z-index: -2
    filter: blur(5px)
    background-size: cover
    background-position: center
  .bg-layer
    z-index: -1
    opacity: 0.8
    background-color: rgba(0, 0, 0, 0.8)
.list-wrap
  background-color: #fff
  border-top-left-radius: 30px
  border-top-right-radius: 30px
  & >>> .van-tabs__wrap
    border-top-left-radius: 30px
    border-top-right-radius: 30px
  & >>> .van-hairline--top-bottom::after
    border: none
    border-bottom: 1px solid #efefef
</style>

<style lang="stylus">
@import '../styles/css/mixins.styl'
@import '../styles/css/variable.styl'
// 由父组件插入的模板样式，不能写在[scope]作用域内
.bg-main
  display: flex
  align-items: center
  padding: 0 30px
  .left
    img
      width: 260px
      height: 260px
      border-radius: 16px
      background-color: #ccc
  .right
    padding-left: 20px
    overflow: hidden
    .name
      font-size: 40px
      margin-bottom: 20px
      color: #fff
      ellipsis(1)
    .desc
      font-size: $small-size
      color: #f5f5f5
      ellipsis(4)
</style>