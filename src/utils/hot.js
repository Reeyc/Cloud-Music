 //数字转换
 export const numberFormat = value => {
   if (!value || value < 10000) return value
   const num = parseInt(value / 10000)
   if (num >= 10000) {
     return `${parseInt(num/10000)}亿`
   } else {
     return `${num}万`
   }
 }
