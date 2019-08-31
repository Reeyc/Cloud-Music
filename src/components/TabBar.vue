<!-- 自定义tabBar组件 -->
<template>
  <div class="tabbar-wrap">
    <ul class="tabbar">
      <li
        v-for="(item,index) of tarBar"
        :key="index"
        @click="tabSwitch(index,item)"
        class="tabbar-item"
      >
        <!-- 中间头像 -->
        <img
          v-if="item.special"
          :src="item.avatar"
          :class="playAvatar ? 'play-avatar' : '' "
          class="special"
        />
        <!-- 两侧内容 -->
        <div v-else class="main">
          <img
            :src="index === selected ? item.selectedIconPath : item.iconPath"
            class="tabbar-icon"
          />
          <p :class="index === selected ? 'active' : ''" class="tabbar-text">{{item.text}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    selected: Number
  },
  data() {
    return {
      /* 头像
       * 用户未登录：默认用[singer.jpg]
       * 用户已登录：用用户头像
       * 播放歌曲时：用歌曲图片
       */
      avatar: "/static/images/singer.jpg"
    };
  },
  computed: {
    //用户信息，播放状态，播放头像
    ...mapState(["userInfo", "playing", "playAvatar"]),
    //tabBar数据
    tarBar() {
      return [
        {
          text: "乐库",
          pagePath: "/pages/index/main",
          iconPath: "/static/images/index.png",
          selectedIconPath: "/static/images/index-active.png"
        },
        {
          text: "",
          pagePath: "/pages/playing/main",
          iconPath: "",
          selectedIconPath: "",
          special: true,
          avatar: this.showAvatar
        },
        {
          text: "我的",
          pagePath: "/pages/profile/main",
          iconPath: "/static/images/profile.png",
          selectedIconPath: "/static/images/profile-active.png"
        }
      ];
    },
    //头像展示的优先级展示
    showAvatar() {
      //当前播放的歌曲头像
      if (this.playAvatar) return this.playAvatar;
      //当前没播放歌曲
      return this.userInfo ? this.userInfo.userInfo.avatarUrl : this.avatar;
    }
  },
  methods: {
    //tabBar跳转
    tabSwitch(index, item) {
      if (index === this.selected) return;
      //头像点击前往播放器
      if (item.special) {
        //非播放状态不跳转
        if (!this.playing) return;
        wx.navigateTo({ url: `${item.pagePath}?from=tarbar` });
        return;
      } else {
        //非头像点击
        wx.switchTab({ url: item.pagePath });
      }
    }
  },
  mounted() {
    //接收外界传进来的头像
    this.$bus.$on("avatar", avatar => {
      this.avatar = avatar;
    });
  }
};
</script>

<style lang="stylus" scoped>
// 底部固定
.tabbar-wrap
  height: 12vw
  position: fixed
  bottom: 0
  left: 0
  right: 0
  padding: 10px 20px
  box-shadow: 0 0 10px #DCDFE6
  background-color: rgba(255, 255, 255, 0.9)
  .tabbar
    height: 100%
    display: flex
    align-items: center
    .tabbar-item
      flex: 1
      display: flex
      justify-content: center
      .main
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        .tabbar-icon
          width: 8vw
          height: 8vw
          border-radius: 50%
        .tabbar-text
          font-size: 22px
          color: #515151
          &.active
            color: #d43c33
      .special
        width: 14vw
        height: 14vw
        border: 2px solid snow
        box-shadow: 0 0 10px #909399
        border-radius: 50%
        &.play-avatar
          animation: rotate 20s infinite linear
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