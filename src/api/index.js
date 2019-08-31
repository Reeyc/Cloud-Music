import {
  BASE_URL
} from './config'

//发送请求
const request = (path, data, loading) => {
  loading && wx.showLoading({
    title: '加载中',
  })
  return new Promise((res, rej) => {
    wx.request({
      url: BASE_URL + path,
      data,
      method: 'get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        loading && wx.hideLoading();
        res(request.data)
      },
      fail(error) {
        loading && wx.hideLoading();
        rej(error)
      }
    })
  });
}

export default {
  //获取歌曲Url
  songURL(data) {
    return request('/song/url', data)
  },
  //轮播Banner
  banner(data) {
    return request('/banner', data)
  },
  //推荐歌单
  recommendPlayList() {
    return request('/personalized')
  },
  //热门搜索
  hotSearch() {
    return request('/search/hot/detail')
  },
  //搜索建议
  suggestSearch(data) {
    return request('/search/suggest', data)
  },
  //搜索
  search(data) {
    return request('/search', data, true);
  },
  //歌手单曲
  artists(data) {
    return request('/artists', data, true);
  },
  //歌手专辑
  artistsAlbum(data) {
    return request('/artist/album', data);
  },
  //专辑详情
  album(data) {
    return request('/album', data, true);
  },
  //歌单详情
  playList(data) {
    return request('/playlist/detail', data, true);

  }
}
