<!--歌单详情-->
<template>
  <div class="playlist-detail">
    <list-template
      v-if="playlistSong.length"
      :type="type"
      :playlistSong="playlistSong"
      :bgImg="playlist.coverImgUrl"
    >
      <!-- 背景图部分 -->
      <div class="left">
        <img :src="playlist.coverImgUrl" />
        <span class="count"></span>
      </div>
      <!-- 描述部分 -->
      <div class="right">
        <p class="playlist-name">{{playlist.name}}</p>
        <p class="playlist-desc">{{playlist.description||""}}</p>
        <div class="playlist-tag">
          <span v-for="(item,index) of playlist.tags" :key="index">{{item}}</span>
        </div>
      </div>
    </list-template>
  </div>
</template>

<script>
import ListTemplate from "../../components/ListTemplate";
import API from "../../api/index";
import { ERR_OK } from "../../api/config";
export default {
  data() {
    return {
      type: "playlist",
      playlist: {}, //歌单信息
      playlistSong: [] //歌单歌曲
    };
  },
  methods: {
    getPlayList(id) {
      API.playList({ id })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.playlist = res.playlist;
          this.playlistSong = res.playlist.tracks;
        })
        .catch(err => {});
    }
  },
  mounted() {
    const id = this.$root.$mp.query.id;
    this.getPlayList(id);
  },
  //页面卸载 [清空所有数据]
  onUnload() {
    Object.assign(this, this.$options.data());
  },
  components: { ListTemplate }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/css/mixins.styl'
@import '../../styles/css/variable.styl'
.playlist-name
  font-size: 34px
  margin-bottom: 20px
  color: #fff
  ellipsis(2)
.playlist-desc
  font-size: $small-size
  margin-bottom: 20px
  color: #f5f5f5
  ellipsis(2)
.playlist-tag
  font-size: $small-size
  color: #fff
  span
    display: inline-block
    padding: 6px
    margin-right: 10px
    border-radius: 6px
    background-color: rgba(255, 255, 255, 0.2)
</style>