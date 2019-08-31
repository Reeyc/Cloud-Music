<!--专辑详情-->
<template>
  <div class="album-detail">
    <list-template
      v-if="albumSong.length"
      :type="type"
      :albumSong="albumSong"
      :bgImg="album.picUrl"
    >
      <!-- 背景图部分 -->
      <div class="left">
        <img :src="album.picUrl" />
      </div>
      <!-- 描述部分 -->
      <div class="right">
        <p class="album-name name">{{album.name}}</p>
        <div class="album-artist">
          歌手：
          <span
            v-for="(item,index) of album.artists"
            :key="item.id"
            :class="index === album.artists.length-1 ? 'last' : ''"
          >{{item.name}}</span>
        </div>
        <p class="album-date">发行时间：{{formatDate}}</p>
      </div>
    </list-template>
  </div>
</template>

<script>
import ListTemplate from "../../components/ListTemplate";
import API from "../../api/index";
import { ERR_OK } from "../../api/config";
import { formatDateTime } from "../../utils/formatDate";
export default {
  data() {
    return {
      type: "album", //类型
      album: {}, //专辑
      albumSong: [] //专辑歌曲
    };
  },
  computed: {
    formatDate() {
      return formatDateTime(this.album.publishTime);
    }
  },
  methods: {
    getAlbum(id) {
      API.album({ id })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.album = res.album; //专辑
          this.albumSong = res.songs; //专辑歌曲
        })
        .catch(err => {});
    }
  },
  mounted() {
    const id = this.$root.$mp.query.id;
    this.getAlbum(id);
  },
  //页面卸载 [清空所有数据]
  onUnload() {
    Object.assign(this, this.$options.data());
  },
  components: { ListTemplate }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/css/variable.styl'
.album-artist
  margin-bottom: 50px
  font-size: $small-size
  color: #e1e1e1
  span
    color: #fff
    &::after
      content: '/'
    &.last
      &::after
        content: ''
.album-date
  font-size: $small-size
  color: #e1e1e1
</style>