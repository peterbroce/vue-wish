/* eslint-disable */
// import csnJsUtil from "csn-js-util";
// import comm from "./comm.js";

let Util = {
  // 返回年月日单独字符串 可以自由组合 time为时间戳; 月、日、时、分、秒小于10是否前面补0
  getStringDate(time, flg) {
    let newDate = new Date(time);
    let obj = {
      year: newDate.getFullYear(), // 年
      month: newDate.getMonth() + 1, // 月
      day: newDate.getDate(), // 日
      hour: newDate.getHours(), // 时
      minute: newDate.getMinutes(), // 分
      second: newDate.getSeconds(), // 秒
      milliseconds: newDate.getMilliseconds() // 毫秒
    };
    //  月、日、时、分、秒小于10是否前面补0
    if (flg) {
      // 月
      if (obj.month < 10) {
        obj.month = "0" + obj.month;
      }
      // 日
      if (obj.day < 10) {
        obj.day = "0" + obj.day;
      }
      // 时
      if (obj.hour < 10) {
        obj.hour = "0" + obj.hour;
      }
      // 分
      if (obj.minute < 10) {
        obj.minute = "0" + obj.minute;
      }
      // 秒
      if (obj.second < 10) {
        obj.second = "0" + obj.second;
      }
    }
    return obj;
  },
  formatDate(date, flg) {
    let newTime = Util.getStringDate(date, true);
    let str = "";
    if (flg) {
      str =
        newTime.year +
        "-" +
        newTime.month +
        "-" +
        newTime.day +
        " " +
        newTime.hour +
        ":" +
        newTime.minute +
        ":" +
        newTime.second;
    } else {
      str =
        newTime.year +
        "." +
        newTime.month +
        "." +
        newTime.day +
        " " +
        newTime.hour +
        ":" +
        newTime.minute +
        ":" +
        newTime.second;
    }

    return str;
  },
  cTimestamp: (flag, time, isNull) => {
    // 如果为空 则直接返回控制
    if (isNull && !time) {
      return "";
    }
    flag = parseInt(flag);
    var dt, str;
    if (!time) {
      dt = new Date();
    } else {
      dt = new Date(time);
    }
    var y = dt.getFullYear(),
      M = dt.getMonth() + 1,
      d = dt.getDate(),
      h = dt.getHours(),
      m = dt.getMinutes(),
      sec = dt.getSeconds(),
      minsec = dt.getMilliseconds();
    if (flag === 1) {
      str =
        String(y) +
        "-" +
        _addPrefix(M) +
        "-" +
        _addPrefix(d) +
        " " +
        _addPrefix(h) +
        ":" +
        _addPrefix(m) +
        ":" +
        _addPrefix(sec);
    } else if (flag === 2) {
      str =
        String(y) +
        "-" +
        _addPrefix(M) +
        "-" +
        _addPrefix(d) +
        " " +
        _addPrefix(h) +
        ":" +
        _addPrefix(m);
    } else if (flag === 3) {
      str = String(y) + "年" + _addPrefix(M) + "月" + _addPrefix(d) + "日";
    } else if (flag === 4) {
      str = String(y) + "-" + _addPrefix(M) + "-" + _addPrefix(d);
    } else if (flag === 5) {
      str = String(y) + _addPrefix(M) + _addPrefix(d);
    } else {
      while (String(minsec).length < 3) {
        minsec = "0" + minsec;
      }
      str =
        String(y) +
        _addPrefix(M) +
        _addPrefix(d) +
        _addPrefix(h) +
        _addPrefix(m) +
        _addPrefix(sec) +
        minsec;
    }
    return str;

    function _addPrefix(num) {
      return num < 10 ? "0" + num : num;
    }
  },
  // 获取uuid
  generateUUID() {
    let d = new Date().getTime();
    let uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  },
  // 获取几分钟前、几小时前、几天前等时间差
  timeDifference(publishTime) {
    if (!publishTime) {
      publishTime = 0;
    }
    let timeNow = Date.parse(new Date()),
      d = (timeNow - publishTime) / 1000;

    let dDays = parseInt(d / 86400); // 天
    let dHours = parseInt(d / 3600); // 时
    let dMinutes = parseInt(d / 60); // 分
    let dSeconds = parseInt(d); // 秒

    if (dDays > 0 && dDays < 4) {
      return dDays + "天前";
    } else if (dDays <= 0 && dHours > 0) {
      return dHours + "小时前";
    } else if (dHours <= 0 && dMinutes > 0) {
      return dMinutes + "分钟前";
    } else if (dMinutes <= 0 && dSeconds >= 0) {
      // return dSeconds+'秒前';
      return "刚刚之前";
    } else {
      var s = new Date(publishTime);
      return (
        s.getFullYear() +
        "年" +
        (s.getMonth() + 1) +
        "月" +
        s.getDate() +
        "日 " +
        s.getHours() +
        ":" +
        ":" +
        s.getMinutes() +
        ":" +
        s.getSeconds()
      );
    }
  },
  // 秒转成 天 时 分 秒
  dhms(second) {
    let z = function (n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    };

    let d = 0,
      h = 0,
      m = 0,
      s = 0;
    d = Math.floor(second / (24 * 60 * 60));
    s = second - d * 24 * 60 * 60;
    h = Math.floor(s / (60 * 60));
    s = s - h * 60 * 60;
    m = Math.floor(s / 60);
    s = s - m * 60;

    return {
      d: z(d),
      h: z(h),
      m: z(m),
      s: z(s)
    };
  },
  // 不用四舍五入 截取字符串2位数
  toFixed(val, n) {
    if (val == undefined) {
      return "";
    }

    val = val.toString();
    if (val.indexOf(".") === -1) {
      var s = "00";
      if (n && !isNaN(n)) {
        s = "";
        for (var i = 0; i < n; i++) {
          s += "0";
        }
      }
      val = val + "." + s;
    } else if (val.split(".")[1] && val.split(".")[1].length < n) {
      var p = "",
        k = 0,
        len = n - val.split(".")[1].length;
      for (; k < len; k++) {
        p += "0";
      }
      val += p;
    } else {
      var m = 3;
      if (n && !isNaN(n)) {
        m = n + 1;
      }
      val = val.substring(0, val.lastIndexOf(".") + m);
    }
    var str = val.split(".");
    if (str[1].length === 1) {
      val = val + "0";
    }
    return val;
  },
  // 把元转成分
  moneyToPenny(m) {
    if (!m || m == 0 || isNaN(m)) {
      return 0;
    }
    // 支持负数
    let newMoney = Util.toFixed(m).replace(".", "");
    return -(-newMoney);
  },
  // 修复iscroll在新版chrome和其他新版浏览器(Android 7.0)无法滚动bug
  isPassive() {
    let supportsPassiveOption = false;
    try {
      addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassiveOption = true;
          }
        })
      );
    } catch (e) { }
    return supportsPassiveOption;
  },
  // 数字 是否要除以100
  billion(value, flg) {
    if (isNaN(value)) {
      value = 0;
    } else if (flg) {
      // 金额
      value = (value / 100).toFixed(1);
    }

    // 亿
    if (value >= 100000000) {
      value = (value / 100000000).toFixed(1) + "亿";
    } else if (value >= 10000000) {
      // 千万
      value = (value / 10000000).toFixed(1) + "千万";
    } else if (value >= 10000) {
      value = (value / 10000).toFixed(1) + "万";
    }

    return value;
  },
  // 数字 是否要除以100
  billionFixed(value, flg) {
    if (isNaN(value)) {
      value = "0.00";
    } else if (flg) {
      value = parseFloat(value / 100).toFixed(2);
    }

    // 万亿
    if (value >= 1000000000000) {
      value = parseFloat(value / 1000000000000).toFixed(2) + "万亿";
    } else if (value >= 100000000) {
      value = parseFloat(value / 100000000).toFixed(2) + "亿";
    } else if (value >= 10000000) {
      value = parseFloat(value / 10000000).toFixed(2) + "千万";
    } else if (value >= 10000) {
      value = parseFloat(value / 10000).toFixed(2) + "万";
    }

    return value;
  },
  getUrlParam(name) {
    return (
      location.search.match(
        new RegExp("(^|\\?|\\&)" + name + "=([^&]*)", "i")
      )[2] || ""
    );
  },
  // 数组分拆 array 按照多少个分拆
  arraySpinOff(arr, len) {
    let output = [];

    function fn(val, start = 0) {
      output.push(val.slice(start, len));
      let nextVal = val.slice(len, val.length);
      if (nextVal.length > 0) {
        fn(nextVal);
      }
    }
    fn(arr);
    return output;
  },
  windowHeight() {
    return document.body.offsetHeight;
  },
  windowWidth() {
    return document.body.offsetWidth;
  },
  isFunction(obj) {
    return Boolean(
      Object.prototype.toString.call(obj) === "[object Function]"
    );
  },
  // 过滤html标签
  filterHTMLTag(html) {
    let str = html || "";
    let msg = str.toString().replace(/<\/?[^>]*>/g, ""); //去除HTML Tag
    msg = msg.replace(/[|]*\n/, ""); //去除行尾空格
    msg = msg.replace(/&npsp;/gi, ""); //去掉npsp
    return msg;
  },
  division(val, flg, n) {
    if (val == "NaN" || val == null || val == undefined || val === "") {
      if (flg) {
        return "";
      }
      return "0.00";
    }
    let num = val / 100,
      type = n === "rounding" ? true : false;

    // 四舍五入 如果需要四舍五入 必须要自己把金额除100之后再把值传进去
    if (type) {
      num = Math.round(val * 100) / 100;
    }
    if (!n || type === "rounding") {
      n = 2;
    }
    return Util.toFixed(num, n);
  },
  price(val, flg) {
    return Util.division(val, flg);
  },
  // 费率转换
  rateTransform(val, n = 2, m = 1000000) {
    let dw = "";
    for (let i = 0; i < n; i++) {
      dw += "0";
    }
    if (val == "NaN" || val == null || val == undefined || val === "") {
      return "0." + dw;
    }
    let num = val / m;
    return Util.toFixed(num, n);
  },
  // 对象转数组
  ObjectToArray(obj, isAll) {
    let arr = [];
    // 是否需要加全部
    if (isAll) {
      arr = [
        {
          key: "",
          value: "全部"
        }
      ];
    }
    for (var key in obj) {
      arr.push({
        key: key,
        value: obj[key]
      });
    }
    return arr;
  },
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除 并且不能为负数
  isRealNum(val) {
    if (val === "" || val == null || val.toString().indexOf("-") > -1) {
      return false;
    }
    if (!isNaN(val)) {
      return true;
    } else {
      return false;
    }
  },
  // 是否是浮点数 允许是负数
  isFloatingNumber(val, flg) {
    if (val === "" || val == null) {
      return false;
    }

    if (!isNaN(val)) {
      if (flg) {
        if (val > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  // 动态插入js
  injectScript(src) {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = src;
    let t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(s, t);
  },
  // 数字加千分号
  formatNum(n) {
    let s = n + "";
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  // 获取URL参数
  getQueryString(key) {
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    let r = window.location.href.split("?")[1];

    if (!r || typeof r !== "string") {
      return "";
    }
    r = r.match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return "";
    }
  },
  // 去除前后空格 flag为true 如果值没有则直接返回空值
  trimObj(obj, flag) {
    let newObj = obj;
    if (typeof obj != "object") {
      return obj;
    }
    for (var key in newObj) {
      let val = newObj[key];
      if (key && val && typeof val == "string") {
        newObj[key] = val.trim();
      } else if (val === 0) {
        newObj[key] = 0;
      } else if (flag && !val) {
        newObj[key] = "";
      }
    }
    return Object.assign({}, newObj);
  },
  // 去掉字符串的空格（前后 和中间）
  NoSpace(str, type) {
    // type 含义  1.前面  2.后面   all.全部  （默认去掉前后）
    if (str == undefined) {
      return "";
    }
    let newStr = str.toString();
    if (type == 1) {
      newStr = newStr.replace(/(^\s+)/g, "");
    } else if (type == 2) {
      newStr = newStr.replace(/(\s+$)/g, "");
    } else if (type == "all") {
      newStr = newStr.replace(/\s+/g, ""); // 去掉全部空格
    } else {
      newStr = newStr.replace(/(^\s+)|(\s+$)/g, ""); // 去掉前后空格
    }
    return newStr;
  },
  monthsAgoBefore: function (time, n, type) {
    // 几个月之前 或 之后 （限制日期范围）
    var d = new Date(time);

    if (type == "before") {
      // 往前 n个月
      d.setMonth(d.getMonth() - n);
    } else {
      d.setMonth(d.getMonth() + n);
    }

    var yy1 = d.getFullYear();
    var mm1 = d.getMonth() + 1; //  0（一月） 到 11（十二月）
    var dd1 = d.getDate();
    if (mm1 < 10) {
      mm1 = "0" + mm1;
    }
    if (dd1 < 10) {
      dd1 = "0" + dd1;
    }
    return yy1 + "-" + mm1 + "-" + dd1;
  },
  // 事件
  addEvent(obj, type, fn) {
    if (obj.attachEvent) {
      //ie
      obj.attachEvent("on" + type, function () {
        fn.call(obj);
      });
    } else {
      obj.addEventListener(type, fn, false);
    }
  },
  //判断字母是否大写
  isUpperABC: function (val) {
    var patrn = /^[A-Z]+$/;
    if (!patrn.exec(val)) return false;
    return true;
  },
  //判断字母是否为数字
  isInt: function (val) {
    var patrn = /^[0-9]\d*$/;
    if (!patrn.exec(val)) return false;
    return true;
  },

  // 判断是否是 数组、字母、或其组合
  isNumberLetter(val) {
    let reg = /^[0-9a-zA-Z]*$/g;
    if (reg.test(val)) {
      return true;
    } else {
      return false;
    }
  },

  // 判断是否是两位数的金额
  isFloatAmt(money) {
    let reg = /^((0|[1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (!money) {
      return false;
    }
    return reg.test(money);
  },
  // 判断有几位小数
  decimalplaces(n) {
    let k = +n;
    if (_.isNumber(k) && (k + "").includes(".")) {
      return (k + "").split(".")[1].length;
    } else {
      return 0;
    }
  },
  //  金额必须大于零,整数位最大11位,最多保留小数点后两位
  amountYuanReg(money) {
    let reg = /^((([1-9][0-9]{0,10})(\.\d{1,2})?)|([1-9][0-9](,\d{3}){0,2}(\.\d{1,2})?)||([1-9](,\d{3}){0,2}(\.\d{1,2})?)|([1-9][0-9]{0,2}(,\d{3}){0,1}(\.\d{1,2})?)|([0])(\.(\d{1,2})))$/;
    if (!money) {
      return false;
    }
    return reg.test(money);
  },
  //验证为正常字符
  signMerchantNoRegex(val) {
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    if (!val) {
      return false;
    }
    return reg.test(val);
  },
  //判断是否为英文字母
  bankCodeRegex(val) {
    let reg = /^[A-Za-z_-]+$/;
    if (!val) {
      return false;
    }
    return reg.test(val);
  },
  //验证手机号码
  isMobile(val) {
    var patrn = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if (!patrn.exec(val)) return false;
    return true;
  },
  //验证身份证号码
  isIDCard(code) {
    if (!code) {
      return false;
    }
    code = code.toUpperCase();
    var pass = true,
      province = [
        "11",
        "12",
        "13",
        "14",
        "15",
        "21",
        "22",
        "23",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "50",
        "51",
        "52",
        "53",
        "54",
        "61",
        "62",
        "63",
        "64",
        "65",
        "71",
        "81",
        "82",
        "91"
      ];
    if (
      !code ||
      !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
        code
      )
    ) {
      pass = false;
    } else if (province.indexOf(code.substr(0, 2)) === -1) {
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split("");
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0,
          ai = 0,
          wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if (parity[sum % 11] != code[17]) {
          pass = false;
        }
      }
    }
    return pass;
  },
  // 比较开始时间是否大于结束时间
  isStartTimeGreaterEndTime(startTime, endTime) {
    if (!startTime || !endTime) {
      return false;
    }
    if (new Date(startTime).getTime() - new Date(endTime).getTime() > 0) {
      return true;
    } else {
      return false;
    }
  },
  // 返回n天以前的时间
  getOtherDayDate(n, format) {
    if (!format) {
      format = 4;
    }
    if (!n && n != 0) {
      n = 1;
    }
    let date = Util.cTimestamp(
      format,
      new Date().getTime() - 24 * 60 * 60 * 1000 * n
    );
    return date;
  },
  // 获取属性
  getAttr(dom, key) {
    let attr = "";
    if (dom) {
      attr = dom.getAttribute(key);
    }
    return attr;
  },
  // 设置属性
  setAttr(dom, key, val) {
    if (dom) {
      dom.setAttribute(key, val);
    }
  },
  //js相乘精度问题
  accuracyMul(arg1, arg2) {
    let m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) { }
    try {
      m += s2.split(".")[1].length;
    } catch (e) { }
    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  },
  // 数字金额大写转换(可以处理整数,小数,负数) 最大支持(千亿) 999999999999.99
  smalltoBIG(n) {
    let fraction = ["角", "分"];
    let digit = [
      "零",
      "壹",
      "贰",
      "叁",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖"
    ];
    let unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
    // 最大支持千亿
    const maxNumber = 999999999999.99;
    const minNumber = -999999999999.99;
    let accuracy = Util.accuracyMul(n, 10);
    if (n > maxNumber || n < minNumber) {
      return "金额超出最大范围";
    }
    let head = n < 0 ? "欠" : "";
    n = Math.abs(n);

    let s = "";

    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(accuracy * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, "");
    }
    s = s || "整";
    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = "";
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, "元")
        .replace(/(零.)+/g, "零")
        .replace(/^整$/, "零元整")
    );
  },
  //校验月份是否合法
  isValidMonth(month) {
    if (isFinite(month)) {
      month = parseInt(month);
      if (month > 12 || month < 1) {
        return false;
      }
      return true;
    }
    return false;
  },
  //根据月份校验日期是否合法
  isValidDay(month, day) {
    var arr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (Util.isValidMonth(month)) {
      if (isFinite(day)) {
        if (day > arr[month - 1]) {
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  },
  // js精度
  precision(n) {
    if (!_.isNumber(n)) {
      return "";
    }
    let m = Math.round(n * 100000) / 100000;
    if (!m) {
      m = 0;
    }
    return m;
  },
  //转化百分百
  formatF(val) {
    return val === 0 ? "0.00%" : val ? (val * 100).toFixed(2) + "%" : "";
  },
  getDateInterval(min, max) { // 获取两个日期之间相差多少天
    let d0 = min.split("-"),
      d1 = max.split("-"),
      Min = new Date(d0[0], d0[1] - 1, d0[2]),
      Max = new Date(d1[0], d1[1] - 1, d1[2]);

    let day = parseInt(
      (Max.getTime() - Min.getTime()) / 1000 / 60 / 60 / 24
    );
    return day;
  },
  requestAnimation() {
    return window.requestAnimationFrame;
  },
  cancelAnimation() {
    return window.cancelAnimationFrame;
  },
  getBrowserInfo() { //浏览器型号版本兼容
    let agent = navigator.userAgent.toLowerCase();
    //var isEdge = navigator.userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1; //检测是否edge模式
    // let regStr_ie = /msie [\d.]+;/gi;
    // let regStr_ff = /firefox\/[\d.]+/gi;
    // let regStr_chrome = /chrome\/[\d.]+/gi;
    // let regStr_saf = /safari\/[\d.]+/gi;
    let reIE = new RegExp("msie ([0-9]{1,}[.0-9]{0,})");
    // let fIEVersion = parseFloat(RegExp["$1"]); //IE版本

    if (agent.indexOf("msie") > 0) {
      //IE

      if (reIE.exec(agent) != null) {
        if (parseFloat(RegExp.$1) > -1 && parseFloat(RegExp.$1) >= 9) {
          //IE版本校验
          return true;
        } else {
          return false;
        }
      }
    } else if (agent.indexOf("firefox") > 0) {
      /*else if(isEdge) {
   return false;
   } */
      //firefox
      return false;
      //return agent.match(regStr_ff) ;
    } else if (agent.indexOf("chrome") > 0) {
      //Chrome
      return true;
      //return agent.match(regStr_chrome) ;
    } else if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
      //safari
      return false;
      //return agent.match(regStr_saf) ;
    } else {
      return false;
    }
  },
  isEmail(mail) { //校验是否是正确的邮箱地址
    let regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regExp.test(mail)) {
      return true;
    }
    return false;
  },
  isValidLoginPwd(value) {
    let len = value.length;
    if (len < 6 || len > 16) {
      return false;
    }
    let numRegExp = /^\d+$/g,
      charRegExp = /^[A-Za-z]+$/g,
      spRegExp = /^[^\dA-Za-z]+$/g;
    let flag1 = numRegExp.test(value),
      flag2 = charRegExp.test(value),
      flag3 = spRegExp.test(value);
    //如果全数字或者全字母或全部特殊字符，则表示不合法
    if (flag1 || flag2 || flag3) {
      return false;
    }
    return true;
  },
  account(str) { //邮箱**处理
    if (!str) {
      return str;
    }
    let asteriskStr = ""; //"*"字符串
    let index = str.indexOf("@");
    let isMobile = false;
    let patrn = /^0?1[2|3|4|5|8][0-9]\d{8}$/;
    if (!patrn.exec(str)) {
      isMobile = false;
    } else {
      isMobile = true;
    }
    if (index > 0) {
      //Email exp: 12***1@myhome.163.com
      for (let i = 1; i <= index - 1; i++) {
        asteriskStr += "*";
      }
      if (index < 3) {
        return str;
      } else {
        return str.substring(0, 1) + asteriskStr + str.substring(index);
      }
    } else if (isMobile) {
      for (let i = 1; i <= 4; i++) {
        asteriskStr += "*";
      }
      return (
        str.substring(0, 3) + asteriskStr + str.substring(str.length - 4)
      );
    } else {
      return str;
    }
  },
  entryNumber(value) { // 输入数字
    return value.replace(/[^\d]/g, "");
  },
  // 遍历树
  recursiveTree({ list, childrens, id }) {
    let resultArr = [];
    function getTickMenuId(obj) {
      if (obj === undefined || obj === null || !_.isObject(obj)) {
        return;
      }
      resultArr.push(obj[id]);
      if (Array.isArray(obj[childrens])) {
        for (let child of obj[childrens]) {
          getTickMenuId(child);
        }
      }
    };

    if (!Array.isArray(list)) {
      return [];
    }
    for (let rootMenu of list) {
      getTickMenuId(rootMenu);
    }
    return resultArr;
  },
  isIeBrowser() {
    if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
      return true;
    }
    return false;
  },
  getLoginInfo(cb) {
    // comm.getLoginInfo(cb);
  },
  removeAlert(id) {
    //判断是什么浏览器
    if (Util.isIeBrowser()) {
      document.getElementById(id).removeNode(true);
    } else {
      document.getElementById(id).remove();
    }
  },
  //数据比对, 将不一样的数据返回
  dataComparison(nowData, oldData, flag) {
    // 如果是第一次进来， 清空数组
    if (flag) {
      window.comparisonData = [];
    }
    //判断传入的参数格式
    if ((typeof nowData !== 'object' || typeof oldData !== 'object') && oldData === {}) {
      return;
    }
    //递归遍历层级数据，找到不一样的值
    for (let key in nowData) {
      //当前层级key的value为对象时,继续递归遍历
      if (Object.prototype.toString.call(nowData[key]) === "[object Object]" || Object.prototype.toString.call(nowData[key]) === "[object Array]") {
        this.dataComparison(nowData[key], oldData[key]);
      } else if (nowData[key] !== oldData[key]) {
        //当前层级key的value不等于对象， 则可以直接进行对比
        window.comparisonData.push(key);
      }
    }
    return window.comparisonData;
  },
  // 判断按钮是否有复核配置
  btnIsReview(menuKey, btnKey) {
    let currentPageObj = localStorage.getItem("currentPageObj") && JSON.parse(localStorage.getItem("currentPageObj")),
      isReview = "";
    currentPageObj.menuButton.forEach(item => {
      if (item.permisCode === btnKey) {
        isReview = item.isReview;
      }
    });

    if (!isReview) {
      currentPageObj.menuDetails.forEach(item => {
        if (item.menuKey === menuKey) {
          item.menuButton.forEach(btnItem => {
            if (btnItem.permisCode === btnKey) {
              isReview = btnItem.isReview;
            }
          });
        }
      });
    }

    return isReview;
  },
  copyFields(propertyPanelFields, form) {
    let type = form.$type.split(":")[1],
      eventDefinitionType = form.eventDefinitions ? form.eventDefinitions[0].$type.split(":")[1] : "",
      fields = eventDefinitionType ? propertyPanelFields[`${type}-${eventDefinitionType}`] : propertyPanelFields[type];
    
    for (let key in fields) {
      if (!form[key]) {
        form[key] = fields[key];
      }
    }

    return form;
  },
  // 下拉框值转换
  selectChangeData(val, data, flag, key="key", value="value") {
    let result = "";
    // val 匹配的值   data-要比较的数据  flag  默认根据key获取value, 传入flag 则是根据value获取key
    for (let item of data) {
      if (flag) {
        if (item[value] === val) {
          result = item[key]
        }
      } else {
        if (item[key] === val) {
          result = item[value];
        }
      }
    }
    return result;
  },
  setThemeColor(btnName, themeColor, colorName, type) {
    let dom = document.getElementsByClassName(btnName);
    if (type === "btn") {
      for(var i=0;i<dom.length;i++) {
        dom[i].style.backgroundColor = themeColor[colorName];
        dom[i].style.borderColor = themeColor[colorName];
      }
    }
    if (type === "txt") {
      for(var i=0;i<dom.length;i++) {
        dom[i].style.color = themeColor[colorName];
      }
    }
  },
  getTotalProcess() {
    let stepProcessModels = [], bpmnProcessModels = [];
    if (localStorage["stepProcessModels"]) {
      stepProcessModels = JSON.parse(localStorage["stepProcessModels"] || "''");
    }
    if (sessionStorage["stepProcessModels"]) {
      stepProcessModels = JSON.parse(sessionStorage["stepProcessModels"] || "''");
      localStorage["stepProcessModels"] = sessionStorage["stepProcessModels"];
      sessionStorage.removeItem("stepProcessModels");
    }
    if (localStorage["processModels"]) {
      bpmnProcessModels = JSON.parse(localStorage["processModels"] || "''");
    }
    if (sessionStorage["processModels"]) {
      bpmnProcessModels = JSON.parse(sessionStorage["processModels"] || "''");
      localStorage["processModels"] = sessionStorage["processModels"];
      sessionStorage.removeItem("processModels");
    }
    return [...stepProcessModels, ...bpmnProcessModels];
  },
  getTotalMoke() {
    let mokeData = [], bpmnProcessModels = [];
    if (localStorage["mokeData"]) {
      mokeData = JSON.parse(localStorage["mokeData"] || "''");
    }
    if (sessionStorage["mokeData"]) {
      mokeData = JSON.parse(sessionStorage["mokeData"] || "''");
      localStorage["mokeData"] = sessionStorage["mokeData"];
      sessionStorage.removeItem("mokeData");
    }
    if (localStorage["processModels"]) {
      bpmnProcessModels = JSON.parse(localStorage["processModels"] || "''");
    }
    if (sessionStorage["processModels"]) {
      bpmnProcessModels = JSON.parse(sessionStorage["processModels"] || "''");
      localStorage["processModels"] = sessionStorage["processModels"];
      sessionStorage.removeItem("processModels");
    }
    return [...mokeData, ...bpmnProcessModels];
  },
  filterMoneyFormYuan(val, isThousand) {
    if (val == "NaN" || val == null || val == undefined || val === "") {
      // return '0.00';
      return "";
    }
    let num = val;

    let str = Util.toFixed(num, 2);
    //是否千分位分割
    if (isThousand) {
      str = str.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    return str;
  },
  tableSelectData(oldlist, newList, code, comparisonCode) {
    // 表格组件 csn-grid选中
    /*
      oldlist:比对原数据
      newList：要比对数据
      code： ischeckd 码
      comparisonCode：'比对字段'
    */
    if (oldlist.length === 0) return newList;
    let activeList = oldlist.map(item => item[comparisonCode]);
    newList.map(it => {
      let isActive = activeList.some(v => it[comparisonCode] === v);
      if (isActive) {
        it[code] = true;
      }
    });
    return newList;
  },
  delcommafy(num) {
    if (num && num != "undefined" && num != "null") {
      let numS = num;
      numS = numS.toString();
      numS = numS.replace(/,/gi, "");
      return numS;
    } else {
      return num;
    }
  },
  numberFormat(val, isThousand = true) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    if (!val) return "";
    if (val == "NaN" || val == null || val == undefined || val === "") {
      // return '0.00';
      return "";
    }
    let num = val;

    let str = Util.toFixed(num, 2);
    //是否千分位分割
    if (isThousand) {
      str = str.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    return str;
  },
  debounce(method, time) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method.call();
    }, time);
  }
};
// Util = Object.assign(csnJsUtil, Util);
export default Util;
