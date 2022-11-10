import _ from "lodash";
import {
  BLOCKCHAIN_BROWSER,
  isBinanceNetwork,
  isEthereumNetwork,
  isMainnetNetwork,
  SUPPORTED_NETWORKS_MAP,
} from "@/assets/linearLibrary/linearTools/network";
import { URLS } from "@/assets/linearLibrary/linearTools/constants/urls";
import { DECIMAL_PRECISION } from "@/assets/linearLibrary/linearTools/constants/process";

/**
 * 时间格式化函数, 按照指定格式化字符串格式化传入时间
 *
 * @param {Date} time 需要格式化的时间
 * @param {String} fmStr 定义时间的格式
 * 		yyyy: 代表四位数年份
 * 		  yy: 代表两位数年份
 * 		  mm: 代表月份(小于10时补0)
 * 		  dd: 代表日期(小于10时补0)
 * 		  hh: 代表小时(小于10时补0)
 * 		  hh: 代表小时(小于10时补0)
 * 		  MM: 代表分钟(小于10时补0)
 * 		  ss: 代表秒数(小于10时补0)
 * 		 SSS: 代表毫秒数
 * 		   w: 代表周几(数字)
 * 		   W: 代表周几(中文)
 * 		  ww: 代表周几(英文)
 * @returns {String} 返回格式化的时间
 */
//timeFormat
export const timeFormat = (time, fmStr) => {
  const weekCN = "一二三四五六日";
  const weekEN = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let milliSeconds = time.getMilliseconds();
  let week = time.getDay();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hours = hours >= 10 ? hours : "0" + hours;
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  if (fmStr.indexOf("yyyy") !== -1) {
    fmStr = fmStr.replace("yyyy", year);
  } else {
    fmStr = fmStr.replace("yy", (year + "").slice(2));
  }
  fmStr = fmStr.replace("mm", month);
  fmStr = fmStr.replace("dd", day);
  fmStr = fmStr.replace("hh", hours);
  fmStr = fmStr.replace("MM", minutes);
  fmStr = fmStr.replace("ss", seconds);
  fmStr = fmStr.replace("SSS", milliSeconds);
  fmStr = fmStr.replace("W", weekCN[week - 1]);
  fmStr = fmStr.replace("ww", weekEN[week - 1]);
  fmStr = fmStr.replace("w", week);
  return fmStr;
};

//时间格式化
Date.prototype.format = function (fmStr) {
  return timeFormat(this, fmStr);
};

//取小数位长度
Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
  return this.toString().split(".")[1].length || 0;
};

/**
 * 输入内容格式化
 * @param value 值
 * @param decimal  保留小数位
 */
export const formatterInput = (value, decimal = DECIMAL_PRECISION) => {
  //小数位大于2位才四舍五入,防止小数后第一位0无法输入的情况
  if (value.countDecimals() > decimal) {
    value = _.floor(value, decimal);
  }

  //大于最大安全整数
  if (value > Number.MAX_SAFE_INTEGER) {
    value = toNonExponential(value);
  }
  return value;
};

/**
 * 科学计数法转数字文本
 * @param {*} num
 */
// toNonExponential: Conversion of scientific counting method to digital text
export const toNonExponential = (num) => {
  try {
    if (isNaN(num)) return 0;
    let strParam = String(num);
    let flag = /e/.test(strParam);
    if (!flag) return num;

    // 指数符号 true: 正，false: 负
    let sysbol = true;
    if (/e-/.test(strParam)) {
      sysbol = false;
    }
    // 指数
    let index = Number(strParam.match(/\d+$/)[0]);
    // 基数
    let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, "");

    if (sysbol) {
      return basis.padEnd(index + 1, 0);
    } else {
      return basis.padStart(index + basis.length, 0).replace(/^0/, "0.");
    }
  } catch (error) {
    return 0;
  }
};

/**
 * 查找父级元素
 * @param {Element} el  当前dom元素
 * @param {String} className 要查找的类名
 * @return {Element} 返回找到的元素
 */
//findParents
export const findParents = ($el, $className) => {
  try {
    let parentNode = $el.parentNode;
    while (parentNode) {
      if (
        parentNode.className &&
        parentNode.className.indexOf($className) != -1
      ) {
        return parentNode;
      }
      parentNode = parentNode.parentNode;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * 删除class
 * @param {Element} el  当前dom元素
 * @param {Array,String} className 要删除的类名
 */
//removeClass
export const removeClass = ($el, $className) => {
  try {
    let classNameArray = $el.className.split(" ");

    if (_.isArray($className)) {
      _.pullAll(classNameArray, $className);
    } else if (_.isString($className)) {
      _.pull(classNameArray, $className);
    } else {
      return false;
    }

    $el.className = classNameArray.join(" ");
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 添加class
 * @param {Element} el  当前dom元素
 * @param {Array,String} className 要添加的类名
 */
//addClass
export const addClass = ($el, $className) => {
  try {
    let classNameArray = $el.className.split(" ");

    if (_.isArray($className)) {
      classNameArray = [...classNameArray, ...$className];
    } else if (_.isString($className)) {
      classNameArray.push($className);
    } else {
      return false;
    }

    $el.className = classNameArray.join(" ");
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 根据HASH打开网站
 * @param {String} hash  交易hash
 * @param {Number | String} networdId 网络ID
 */
export const openBlockchainBrowser = (hash, networdId) => {
  try {
    const baseUrl = BLOCKCHAIN_BROWSER[networdId] + hash;
    window.open(baseUrl, "_blank");
  } catch (error) {
    console.log(error, "openBlockchainBrowser");
  }
};

//设置输入框的光标位置，会选中 selectionStart 到 selectionEnd 间的内容
export const setCursorRange = (el, selectionStart, selectionEnd) => {
  try {
    if (el.setSelectionRange) {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    } else if (el.createTextRange) {
      var range = el.createTextRange();
      range.collapse(true);
      range.moveEnd("character", selectionEnd);
      range.moveStart("character", selectionStart);
      range.select();
    }
  } catch (error) {
    console.log(error, "setCursorRange");
  }
};

/**
 * Open LINA purchase page on PancakeSwap
 */
export const openBuyLINA = () => {
  window.open(URLS.BUY_LINA);
};

/**
 * Open LINA purchase page on Binance
 */
export const openBuyLINABinance = () => {
  window.open(URLS.BUY_LINA_BINANCE);
};
