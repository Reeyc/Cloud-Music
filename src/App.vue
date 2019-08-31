<!-- App.vue相当于app.js+app.wxss，一般不需要在这里写template -->
<script>
export default {};
</script>

<script>
export default {
  //小程序初始化
  onLaunch() {
    //获取用户的授权状态
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          console.log(`小程序初始化，用户已授权`);
        } else {
          console.log(`小程序初始化，用户未授权`);
        }
      }
    });
    //音频的全局配置
    wx.setInnerAudioOption({
      mixWithOther: false, //不与其他音频混播
      obeyMuteSwitch: false //不遵循静音开关
    });
  },
  //小程序加载
  mounted() {
    //隐藏原生TabBar
    wx.hideTabBar();
  }
};
</script>

<style>
@import "./styles/icon/iconfont.css";
.container {
  background-color: #cccccc;
}
</style>