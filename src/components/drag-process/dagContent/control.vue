<template>
<g>
  <foreignObject x="1000px" y="8px" width="480px" height="32px" style="position: relative">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <!-- <div class="control_menu">
        <span @click="sizeExpend" @mousemove="showTips('sizeExpend')" @mousemout="hideTips()">
          <i>放大</i>
        </span>
        <span @click="sizeShrink">
          <i>缩小</i>
        </span>
        <span @click="sizeInit">
          <i>还原</i>
        </span>
        <span
          @click="sel_area($event)"
          :class="['sel_area', 'sel_area_ing'].indexOf(currentEvent) !== -1 ? 'sel_ing' : ''"
        >
          <i>框选</i>
        </span>
      </div> -->
      <div class="process_time" @click="getDate"><span>查看数据</span></div>
      <div class="process_time" @click="sizeExpend"><span>放大</span></div>
      <div class="process_time" @click="sizeShrink"><span>缩小</span></div>
      <div class="process_time" @click="sizeInit"><span>还原</span></div>
      <div class="process_time" @click="sel_area($event)" :class="['sel_area', 'sel_area_ing'].indexOf(currentEvent) !== -1 ? 'sel_ing' : ''"><span>框选</span></div>
      <div class="process_time"><span>上一步</span></div>
      <div class="process_time"><span>下一步</span></div>
    </body>
  </foreignObject>
</g>
</template>

<script>
export default {
  props: {
    currentEvent: {
      type: String,
      default: () => {
        "";
      }
    }
  },
  data() {
    return {
      changeScreen: "full"
    };
  },
  methods: {
    getDate() {
      this.$emit("getDate");
    },
    sizeExpend() {
      this.$emit("sizeExpend");
    },
    sizeShrink() {
      this.$emit("sizeShrink");
    },
    sizeInit() {
      this.$emit("sizeInit");
    },
    sel_area(e) {
      this.$emit("sel_area");
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
    },
    showTips(type) {
      switch (type) {
        case "sizeExpend":
          break;
        case "sizeShrink":
          break;
        case "sizeInit":
          break;
        default: () => {};
      }
    },
    hideTips() {}
  }
};
</script>

<style scoped>
.process_time {
  color: #606266;
  font-size: 12px;
  height: 18px;
  border: 1px solid #DCDFE6;
  display: inline-block;
  padding: 6px 16px;
  margin: 0 -5px 0 0;
  background: #ffffff;
  /* display: flex; */
}
.process_time .span {
  height: 12px;
  line-height: 12px;
}
.process_time:hover {
  background: #CCE4FC;
  border: 1px solid #66BBF1;
}



.control_menu {
  height: 30px;
  width: 186px;
  justify-content: space-around;
  display: flex;
  user-select: none;
}
.control_menu span {
  color: #ffffff;
  height: 20px;
  width: 34px;
  cursor: pointer;
  display: block;
  background: #bebdbd;
  text-align: center;
  transform: translateY(5px);
}
.control_menu span {
  transform: scale(1.4);
  transform-origin: 50% 0;
}
.control_menu span:hover {
  color: #5093e1;
  background: #e3f4ff;
}
.sel_ing {
  background: #CCE4FC !important;
  border: 1px solid #66BBF1 !important;
  /* color: #5093e1 !important;
  background: #e3f4ff !important; */
}
.icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: 1em;
  height: 1em;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
      normalize.css 中也包含这行 */
  overflow: hidden;
}
</style>
