import * as type from './mutation-types'

export default {
  [type.USER_INFO](state, data) { //用户信息
    state.userInfo = data
  },
  [type.SEARCH_RESULT](state, list) { //搜索结果
    state.searchResult = list
  },
  [type.CURRENT_SONG](state, song) { //当前播放的歌曲信息
    state.currentSong = song
  },
  [type.PLAYING](state, bool) { //播放状态
    state.playing = bool
  },
  [type.PLAY_AVATAR](state, avatar) { //播放头像
    state.playAvatar = avatar
  }

}
