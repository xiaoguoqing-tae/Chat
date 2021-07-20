import pinyin from 'js-pinyin'   //引入插件
/**
 * 判断是否为中文汉字
 * @param {String} temp 需要判断字符
 */
 function isChinese (temp) {
    let re = /[^\u4E00-\u9FA5$]/
    if (re.test(temp)) { return false }
    return true
  }
  /**
   * 判断是否为字母
   * @param {String} char 需要判断字符
   */
 function isChar (char) {
    let reg = /[A-Za-z]/
    if (!reg.test(char)) { return false }
    return true
  }
  /**
   * 按字母排序
   * @param {Array} arr 排序数组
   * @param {String} attrName 排序的属性
   * @param {Boolean} empty 是否显示空的字母排序
   */
  function pySort (arr, attrName, empty) {
     if (!attrName) {
       console.error('请传入排序属性')
      return null
    }
    if (!String.prototype.localeCompare) { return null }
    let letters = 'ABCDEFGHJKLMNOPQRSTWXYZ#'.split('')
    let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
    let arrList = []
    for (let m = 0; m < arr.length; m++) {
      arrList.push(arr[m])
    }
    let result = []
    let curr = {}
    for (let i = 0; i < letters.length; i++) {
      curr = {letter: letters[i], data: []}
      if (i !== 23) {
        for (let j = 0; j < arrList.length; j++) {
          let initial = arrList[j][attrName].charAt(0)// 截取第一个字符
          if (arrList[j][attrName].charAt(0) === letters[i] || arrList[j][attrName].charAt(0) === letters[i].toLowerCase()) { // 首字符是英文的
            curr.data.push(arrList[j]) // 英文字母的
          } else if (zh[i] !== '*' && isChinese(initial)) { // 判断是否是无汉字,是否是中文
            if (pinyin.getCamelChars(initial).charAt(0) === letters[i]) {
              curr.data.push(arrList[j])
            }
          }
        }
      } else {
        for (let k = 0; k < arrList.length; k++) {
          let ini = arrList[k][attrName].charAt(0) // 截取第一个字符
          if (!isChar(ini) && !isChinese(ini)) { // 首字符是不是字母汉字（如数字，特殊字符等）
            curr.data.push(arrList[k])
          }
        }
      }
      if (empty || curr.data.length) {
        result.push(curr)
      }
    }
    return result
  }

  export default pySort