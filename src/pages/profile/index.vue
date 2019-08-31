<template>
  <div class="profile">
    <!-- userInfo不存在，则显示按钮 -->
    <div v-if="!userInfo" class="login">
      <button open-type="getUserInfo" @getuserinfo="getUserInfo" class="login-btn">点击登录</button>
    </div>
    <!-- userInfo存在，头像、昵称、列表 -->
    <list-template v-else :bgImg="userInfo.userInfo.avatarUrl">
      <div class="user-info">
        <img :src="userInfo.userInfo.avatarUrl" class="user-avatar" />
        <p class="user-nickname">{{userInfo.userInfo.nickName}}</p>
      </div>
    </list-template>
    <tab-bar :selected="2"></tab-bar>
  </div>
</template>

<script>
import ListTemplate from "../../components/ListTemplate";
import TabBar from "../../components/TabBar";
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["USER_INFO"]),
    //按钮点击
    getUserInfo(e) {
      if (e.mp.detail.userInfo) {
        //异步存入本地缓存
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(e.mp.detail)
        });
        //存入vuex
        this.USER_INFO(e.mp.detail);
        //替换tabbar头像
        this.$bus.$emit("avatar", e.mp.detail.userInfo.avatarUrl);
      }
    }
  },
  components: { TabBar, ListTemplate }
};
</script>

<style lang="stylus" scoped>
@import '../../styles/css/variable.styl'
.profile
  width: 100%
  padding-bottom: 120px
  .login
    position: relative
    width: 100%
    height: 0
    padding-bottom: 55%
    background-color: #333
    .login-btn
      width: 40%
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
  .user-info
    width: 90%
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    text-align: center
    .user-avatar
      width: 150px
      height: 150px
      border-radius: 50%
      box-shadow: 0 0 10rpx #fff
    .user-nickname
      margin-top: 10px
      font-size: $medium-size
      color: #fff
</style>