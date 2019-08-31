<!--首页轮播图组件-->
<template>
  <div class="banner-wrap">
    <swiper
      :indicator-dots="showDots"
      indicator-color="#fafafa"
      indicator-active-color="#d43c33"
      :autoplay="autoplay"
      :circular="circular"
      :interval="interval"
      :style="height"
      class="banner"
    >
      <swiper-item v-for="item of bannerData" :key="item.bannerId" :item-id="item.bannerId">
        <image class="banner-img" :src="item.pic" mode="widthFix" @load="imgLoad" />
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import API from "../api/index";
import { ERR_OK } from "../api/config";
export default {
  data() {
    return {
      bannerHeight: "", //banner高度
      showDots: true, //圆点显示
      autoplay: true, //自动轮播
      circular: true, //循环轮播
      interval: 3000, //轮播间隔
      bannerData: []
    };
  },
  computed: {
    height() {
      return `height:${this.bannerHeight}px;`;
    }
  },
  methods: {
    getBanner() {
      API.banner({ type: 2 })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.bannerData = res.banners;
        })
        .catch(err => {});
    },
    imgLoad(event) {
      const deviceWidth = wx.getSystemInfoSync().windowWidth; //设备宽
      const imgwidth = event.mp.detail.width; //图片原宽
      const imgheight = event.mp.detail.height; //图片原高
      const ratio = imgwidth / imgheight; //图片宽高比
      this.bannerHeight = deviceWidth / ratio; //banner高度自适应
    }
  },
  created() {
    this.getBanner();
  }
};
</script>

<style lang="stylus" scoped>
.banner
  padding: 0 6px
.banner-img
  width: 100%
  border-radius: 12px
</style>