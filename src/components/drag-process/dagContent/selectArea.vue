<template>
    <g v-if="isShowSelect()">
      <foreignObject width="100%" height="100%" style="position: relative" @click="click_menu_cover($event)">
        <body xmlns="http://www.w3.org/1999/xhtml" :style="menu_style()">
            <div class="menu_contain">
              <div class="menu_content_title"><div class="text">选择要添加的步骤</div></div>
              <div style="margin:0 6px;" v-for="(node,index) in isSelectArea.selectTypeOpions ? subStepNodes : stepNodes" :key="node.key+'_'+index">
                <span @click="selectStep(node)"><i class="step_icon" :class="node.minIconClass"></i>{{node.value}}</span>
              </div>
            </div>
        </body>
      </foreignObject>
    </g>
</template>

<script>
import util from "@/js/util";
let { setThemeColor } = util;
export default {
  props: {
    isSelectArea: {
      type: Object,
      default: () => {
        return {
        value: false,
        x: -9999,
        y: -9999,
        id: null,
        selectTypeOpions: {}
        }
      }
    },
    stepNodes: {
      type: Array,
      default: () => []
    },
    subStepNodes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isShowSelect() {
      return this.isSelectArea.value;
    },
    selectStep(node) {
      if (this.isSelectArea.selectTypeOpions) {
        this.$emit("subInsertStepType", this.isSelectArea.selectTypeOpions, node);
      } else {
        this.$emit("insertStepType", node, this.isSelectArea.id);
      };
    },
    click_menu_cover(e) {
      this.$emit('close_select_nodes')
      e.preventDefault();
      e.cancelBubble = true;
      e.stopPropagation();
    },
    menu_style() {
      let left = this.isSelectArea.x - 199;
      let top = this.isSelectArea.y + 18;
      return {
        position: "absolute",
        left: left + 'px',
        top: top + 'px'
      }
    },
    setThemeColor() {
      let that = this;
      window.addEventListener("storage", function (e) {
        if (e.key === "themeColor") {
          that.themeColor = JSON.parse(e.newValue);
          setThemeColor("menu_content_title", that.themeColor, "bg-color", "txt");
        }
      });
    },
    getThemeColor() {
      this.themeColor = JSON.parse(localStorage["themeColor"] || "''");
      setThemeColor("menu_content_title", this.themeColor, "bg-color", "txt");
    }
  },
  created() {
    this.setThemeColor();
  },
  mounted() {
    this.getThemeColor();
  },
  data() {
    return {
      themeColor: {}
    }
  }
};
</script>

<style scoped>
@import url("./icon.css");
.connector {
  stroke: hsla(0, 0%, 50%, 0.6);
  stroke-width: 2px;
  fill: none;
}
.menu_cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.connector-hl {
  stroke: hsla(0, 0%, 50%, 0.4);
  stroke-width: 5px;
  fill: none;
}
</style>
