<!--首页Icon图标组件-->
<template>
  <div class="icon-wrap">
    <div class="icon">
      <span class="iconfont iconrili"></span>
      <p class="des">每日推荐</p>
    </div>
    <div class="icon">
      <span class="iconfont icongedan"></span>
      <p class="des">歌单</p>
    </div>
    <div class="icon">
      <span class="iconfont iconpaihangbang"></span>
      <p class="des">排行榜</p>
    </div>
    <div class="icon">
      <span class="iconfont icondiantai"></span>
      <p class="des">电台</p>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
@import '../styles/css/variable.styl'
.icon-wrap
  display: flex
  justify-content: space-between
  padding: 25px 50px
  border-bottom: 1px solid #efefef
  .icon
    text-align: center
    span
      display: inline-block
      width: 90px
      height: 90px
      line-height: 90px
      border-radius: 50%
      margin-bottom: 10px
      color: #fff
      background-color: $theme-color
    .des
      font-size: $mini-size
      color: #333
</style>