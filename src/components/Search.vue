<!--搜索框列表组件-->
<template>
  <div class="search-wrap">
    <!-- 搜索框 -->
    <van-search
      :value="value"
      @click="showList=true"
      @focus="focus"
      @change="change"
      @search="search"
      use-action-slot
      placeholder="请输入搜索关键词"
      custom-class="my-search"
      class="search"
    >
      <view slot="action" @click.stop="close">{{showList ? "取消" : "搜索"}}</view>
    </van-search>
    <scroll-view v-if="showList" scroll-y class="search-list">
      <!-- 建议列表 -->
      <div class="suggest-list">
        <p v-show="value" @click="listClick(value)" class="suggest-tips">搜索 “{{value}}”</p>
        <div
          v-for="item of suggest"
          :key="item.keyword"
          @click="listClick(item.keyword)"
          class="suggest-item"
        >
          <van-icon name="search" class="suggest-icon"></van-icon>
          <p class="suggest-keyword">{{item.keyword}}</p>
        </div>
      </div>
      <!-- 搜索历史 -->
      <div v-if="showRecord && record.length" class="record-list">
        <p class="title">搜索历史</p>
        <van-icon name="delete" @click="clearHistory" class="record-delete"></van-icon>
        <span
          v-for="(item,index) of record"
          :key="index"
          @click="listClick(item)"
          class="record-item"
        >{{item}}</span>
      </div>
      <!-- 热搜列表 -->
      <div v-show="showHot" class="hot-list">
        <p class="title">热搜榜</p>
        <div
          v-for="(item,index) of hot"
          :key="index"
          @click="listClick(item.searchWord)"
          class="hot-item"
        >
          <span :class="index < 3 ? 'active' : ''" class="hot-index">{{index+1}}</span>
          <div class="info">
            <div class="top">
              <span :class="index < 3 ? 'active' : ''" class="keyword">{{item.searchWord}}</span>
              <span class="score">{{item.score}}</span>
            </div>
            <div class="bottom">{{item.content}}</div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import API from "../api/index";
import { ERR_OK } from "../api/config";
import { mapMutations } from "vuex";
import { throttle } from "../utils/impose";
export default {
  data() {
    return {
      value: "",
      showList: false, //控制滚动组件[scroll-view]的显示隐藏
      showHot: true, //是否展示热搜列表
      showRecord: true, //是否展示历史列表
      suggest: [], //建议列表
      record: [], //搜索历史
      hot: [] //热搜列表
    };
  },
  methods: {
    ...mapMutations(["SEARCH_RESULT"]),
    //获取热搜列表
    getHot() {
      API.hotSearch()
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          this.hot = res.data;
        })
        .catch(err => {});
    },
    //获取搜索建议
    getSuggest(val) {
      if (!val) return;
      API.suggestSearch({
        keywords: val,
        type: "mobile"
      })
        .then(res => {
          if (!res || res.code !== ERR_OK) return;
          const arr = res.result.allMatch;
          this.suggest = arr ? arr : [];
        })
        .catch(err => {});
    },
    //获取综合搜索数据
    getSearch(keywords, type) {
      if (!keywords) return;
      return Promise.all([
        API.search({ keywords, type: 1 }), //歌曲
        API.search({ keywords, type: 100 }), //歌手
        API.search({ keywords, type: 1000 }), //歌单
        API.search({ keywords, type: 10 }), //专辑
        API.search({ keywords, type: 1002 }) //用户
      ]);
    },

    //聚焦 [节流，20秒内重复聚焦，不重新发送请求]
    focus: throttle(function() {
      this.getHot();
    }, 20000),

    //值变化
    change(event) {
      this.listToggle(event.mp.detail);
    },
    //列表点击
    listClick(val) {
      if (!val) return;
      this.toSongList(val);
    },
    //搜索 [键盘回车键]
    search(event) {
      const val = event.mp.detail;
      if (!val) return;
      this.toSongList(val);
    },
    //取消
    close() {
      this.listToggle(false);
      this.showList = false; //隐藏列表
    },
    //列表的切换隐藏
    listToggle(val) {
      if (!val) {
        //无值，隐藏建议列表，显示历史列表/热搜列表
        this.value = "";
        this.suggest = [];
        this.showRecord = true;
        this.showHot = true;
      } else {
        //有值，隐藏历史列表/热搜列表，显示建议列表
        this.showRecord = false;
        this.showHot = false;
        this.value = val;
        this.getSuggest(val);
      }
    },
    //添加到历史记录
    addHistory(val) {
      //相同的记录
      for (let key of this.record) {
        if (val === key) return;
      }
      this.record.unshift(val);
      //最多存放6个记录
      if (this.record.length > 6) {
        this.record.length = 6;
      }
      wx.setStorageSync("searchHistory", this.record);
    },
    //清空历史记录
    clearHistory() {
      let _this = this;
      wx.showModal({
        content: "确认清空全部历史记录？",
        cancelColor: "#576B95",
        success(res) {
          if (res.confirm) {
            _this.record = [];
            wx.setStorageSync("searchHistory", _this.record);
            wx.showToast({
              title: "清除成功"
            });
          } else if (res.cancel) {
          }
        }
      });
    },
    //跳转到搜索列表页面
    toSongList(val) {
      let _this = this;
      this.getSearch(val)
        .then(res => {
          //利用vuex传值，navigateTo传值的话需要JSON转码
          _this.SEARCH_RESULT(res);
          wx.navigateTo({
            url: `/pages/search-list/main?keywords=${val}`,
            success() {
              //保存历史记录
              _this.addHistory(val);
            }
          });
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.record = wx.getStorageSync("searchHistory") || [];
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/css/variable.styl'
@import '../styles/css/mixins.styl'
// 搜素框吸顶
.search
  position: fixed
  top: 0
  width: 100%
  z-index: 11
  & >>> .van-field__clear-root
    display: none
// 搜索列表全屏滚动
.search-list
  width: 100%
  padding: 20px 0
  position: fixed
  top: 108px
  bottom: 0
  z-index: 10
  background-color: #fff
  .title
    width: 100%
    font-size: 28px
    font-weight: bold
    padding: 0 16px
    margin-bottom: 10px
  // 建议列表
  .suggest-list
    padding: 0 26px 20px
    .suggest-tips
      padding-bottom: 20px
      color: $theme-color
      border-bottom: 1px solid $border-color
      ellipsis(1)
    .suggest-item
      display: flex
      align-items: center
      .suggest-icon
        margin-right: 20px
        & >>> .van-icon
          display: block
      .suggest-keyword
        flex: 1
        padding: 20px 0
        font-size: $medium-size
        border-bottom: 1px solid $border-color
        ellipsis(1)
  // 搜索历史
  .record-list
    position: relative
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
    padding-bottom: 60px
    .record-delete
      position: absolute
      top: 0
      right: 36px
    .record-item
      font-size: $small-size
      padding: 14px
      margin: 16px
      border-radius: 18px
      color: $theme-color
      background-color: #f1f1f1
      ellipsis(1)
  // 热搜列表
  .hot-list
    .hot-item
      display: flex
      align-items: center
      margin: 30px 0
      .hot-index
        width: 80px
        font-size: 28px
        text-align: center
        color: $deputy-color
        &.active
          color: $theme-color
      .info
        flex: 1
        overflow: hidden
        .top
          display: flex
          margin-bottom: 10px
          .keyword
            font-size: $medium-size
            margin-right: 16px
            &.active
              font-weight: bold
          .score
            font-size: $small-size
            margin-right: 24px
            color: #d4d4d4
        .bottom
          font-size: $small-size
          color: $deputy-color
          ellipsis(1)
</style>

<style lang="stylus">
.my-search
  height: 108px
</style>