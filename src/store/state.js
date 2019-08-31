//同步获取本地用户信息
let localUserInfo = wx.getStorageSync('userInfo');
let userInfo = localUserInfo ? JSON.parse(localUserInfo) : null

export default {
  userInfo: userInfo, //用户信息
  searchResult: [], //搜索结果 [单曲、歌手、专辑、歌单、用户]
  currentSong: {}, //当前播放的歌曲信息
  globalAudio: wx.getBackgroundAudioManager(), //全局的背景音频对象
  playing: false, //播放状态
  playAvatar: "" //播放头像
}
