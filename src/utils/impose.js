/**
 * 节流和防抖都是采用闭包的原理来[缓存变量]
 * 外函数用于[包装]，并提供变量
 * 返回的内函数当作事件响应函数，它缓存着外函数的变量，并判断来[执行]外部传入的[回调]，执行时别忘了[回调的参数]给传递进去
 */

/**
 * @description 节流函数 (每隔一段时间执行)
 * @param callback 执行的函数
 * @param delay 间隔的时间
 */
export const throttle = (callback, delay) => {
  let firstTime = true; //第一次触发
  let previous = +new Date(); //上次触发的时间戳
  return function (...arg) {
    if (firstTime) { //第一次触发直接执行
      callback.apply(this, arg)
      firstTime = false;
      return
    }
    let now = +new Date()
    if (now - previous >= delay) { //如果时间间隔大于需求的时间间隔, 则执行
      callback.apply(this, arg)
      previous = now; //更新 "上次" 时间间隔
    }
  }
}

/**
 * @description 防抖函数 (规定时间内只允许执行一次回调, 也就是触发最后一次)
 * @param callback 执行的回调
 * @param delay 规定的时间
 */
export const debounce = (callback, delay) => {
  let firstTime = true; //第一次调用
  let timer = null; //每次触发都重置定时器
  return function (...arg) {
    if (firstTime) { //第一次调用函数直接执行回调
      callback.apply(this, arg)
      firstTime = false;
      return
    }
    timer && clearTimeout(timer); //定时器存在则清除
    timer = setTimeout(() => { //能顺利走到这里, 说明函数不再触发, 则执行回调
      callback.apply(this, arg);
    }, delay)
  }
}
