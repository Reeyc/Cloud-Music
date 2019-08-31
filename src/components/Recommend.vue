<!--首页推荐歌单组件-->
<template>
  <div class="playlist-wrap">
    <h2 class="title">推荐歌单</h2>
    <ul class="playlist">
      <li
        v-for="item of playlist"
        :key="item.id"
        @click="toPlayList(item.id)"
        class="playlist-item"
      >
        <image :src="item.picUrl ? item.picUrl : placeholderImg" mode="widthFix" />
        <span class="playlist-name">{{item.name}}</span>
        <div class="playlist-count">
          <span class="iconfont iconbofang"></span>
          <span>{{item.playCount}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import API from "../api/index";
import { ERR_OK } from "../api/config";
import { numberFormat } from "../utils/hot";
export default {
  data() {
    return {
      playlist: []
    };
  },
  methods: {
    //获取歌单
    getPlaylist() {
      API.recommendPlayList()
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.playlist = res.result.map(item => {
            item.playCount = numberFormat(item.playCount);
            return item;
          });
        })
        .catch(err => {});
    },
    //跳转到歌单详情
    toPlayList(id) {
      wx.navigateTo({
        url: `/pages/playlist-detail/main?id=${id}`
      });
    }
  },
  created() {
    this.getPlaylist();
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/css/mixins.styl'
@import '../styles/css/variable.styl'
.playlist-wrap
  padding: 30px 20px 0
  .title
    font-size: 32px
    font-weight: bold
    margin-bottom: 10px
  .playlist
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    .playlist-item
      position: relative
      width: 32%
      margin: 20px 0
      image
        width: 100%
        border-radius: 6px
      .playlist-name
        font-size: $mini-size
        ellipsis(2)
      .playlist-count
        font-size: $mini-size
        position: absolute
        top: 6px
        right: 8px
        color: #fff
        .iconbofang
          font-size: $mini-size
</style>