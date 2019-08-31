//获取元素信息
export const eleNode = selector => {
  const query = wx.createSelectorQuery();
  return new Promise((resolve, reject) => {
    query.select(selector)
      .boundingClientRect(res => {
        res ? resolve(res) : reject(res)
      })
      .exec();
  });
}
