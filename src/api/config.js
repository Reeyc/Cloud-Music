//固定域名
export const BASE_URL = 'http://203.195.218.188:3000'

//返回状态
export const ERR_OK = 200

//查询的分类参数
export const SEARCH = {
  //名称
  type: ["songs", "artists", "playlists", "albums", "userprofiles"],
  //数量名称
  typeCount: [
    "songCount",
    "artistCount",
    "playlistCount",
    "albumCount",
    "userprofileCount"
  ],
  //请求类型
  typeRequest: [1, 100, 1000, 10, 1002]
}
