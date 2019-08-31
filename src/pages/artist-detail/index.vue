<!--歌手详情-->
<template>
  <div class="artist-detail">
    <list-template
      v-if="artistSong.length"
      :type="type"
      :artistSong="artistSong"
      :artistAlbum="artistAlbum"
      :bgImg="artist.picUrl"
    >
      <!-- 背景图部分 -->
      <div class="left">
        <img :src="artist.img1v1Url" />
        <span class="count"></span>
      </div>
      <!-- 描述部分 -->
      <div class="right">
        <p class="name">{{artist.name}}</p>
        <p class="desc">{{artist.briefDesc}}</p>
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
      type: "artist", //类型
      artist: {}, //歌手
      artistSong: [], //歌手单曲
      artistAlbum: [] //歌手专辑
    };
  },
  methods: {
    //获取单曲
    getSongs(id) {
      API.artists({ id })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.artist = res.artist; //歌手
          this.artistSong = res.hotSongs; //单曲
        })
        .catch(err => {});
    },
    //获取专辑
    getAlbum(id) {
      API.artistsAlbum({ id })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.artistAlbum = res.hotAlbums; //专辑
        })
        .catch(err => {});
    }
  },
  mounted() {
    const id = this.$root.$mp.query.id;
    this.getSongs(id);
    this.getAlbum(id);
  },
  //页面卸载 [清空所有数据]
  onUnload() {
    Object.assign(this, this.$options.data());
  },
  components: { ListTemplate }
};
</script>