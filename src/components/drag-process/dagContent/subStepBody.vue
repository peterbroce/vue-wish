<template>
  <foreignObject width="180" height="30">
    <body xmlns="http://www.w3.org/1999/xhtml"
      @mouseover="overStepBody"
      @mouseout="outStepBody"
      style="margin: 0"
    >
      <div class="dagContent">
        <!-- <div :style="item.nodeStyle" :class="this.checkStatus(item)"> -->
        <div :class="this.checkStatus(item)">
          <div class="step_header" @click="selNode(item)"> 
            <div class="title">
              <i class="icon icon-bg" :class="this.checkSelectIcon(item)"></i>
              <!-- <strong class="name" @click="selNode(item)">{{item.name}}</strong> -->
              <!-- <input type="text" class="name" v-model="item.name" @change="$emit('changeNodeName', item)" @click="clickInput($event)"> -->
              <div class="name" :title="item.name">{{item.name}}</div>
              <div v-show="item.overing" class="full-icon icon-bg" @click="showFullScreen" title="全屏这个步骤"></div>
              <div v-show="item.overing" class="sort-icon icon-bg" @click="prepareMove($event, item)" title="移动这个步骤"></div>
              <div v-show="item.overing" class="close-icon icon-bg" @click="delEdges($event, item)" title="删除这个步骤"></div>
            </div>
            <div class="sub_title">
              <i class="icon icon-bg" :class="this.checkIcon(item)"></i>
              <i class="name" :title="titleText(item)">{{titleText(item)}}</i>
            </div>
          </div>
          <!-- body -->
          <div class="step_form">
            <step-detail 
              style="margin:8px"
              :item="item"
              :choice="choice"
              :lsStepAll.sync="lsStepAll"
              :formDetail="formDetail" 
              :subStepNodes="subStepNodes" 
              :choices="choices"
            >
            </step-detail>
          </div>
          <div>
            <full-screen    
              ref="fullScreen"           
              :item="item"
              :choice="choice"
              :lsStepAll.sync="lsStepAll"
              :isSelectArea.sync="isSelectArea"
              :formDetail="formDetail" 
              :subStepNodes="subStepNodes" 
              :choices="choices">
            </full-screen>
          </div>
        </div>
        <!-- line -->
        <div :class="currentEvent === 'dragLink' ? 'pane-node-parent-hl' : 'pane-node-parent' ">
          <!-- <div v-for="(poi, nth) in item.in_ports" :key="'__' + nth" :style="{width: `${ 100 / (item.in_ports.length + 1)}%`}">
            <span class="space" @mouseup="$emit('linkEnd', i, nth)"></span>
          </div> -->
          <div style="width:50%"><span class="space"></span></div>
        </div>
      </div>
    </body>
  </foreignObject>
</template>

<script>
import stepDetail from "./stepDetail";
import fullScreen from "./stepFormTabDetl/fullScreen";
export default {
  props: {
      item: {
        type: Object,
        default: () => {}
      },
      choice: {
        type: Object,
        default: () => {}
      },
      moving: {
        type: Object,
        default: () => {}
      },
      currentEvent: {
        type: String,
        default: () => ''
      },
      i: {
        type: Number,
        default: () => 0
      },
      lsStepAll: {
        type: Array,
        default: () => []
      },
      stepNodes: {
        type: Array,
        default: () => []
      },
      subStepNodes: {
        type: Array,
        default: () => []
      },
      formDetail: {
        type: Object,
        default: () => {}
      },
      isSelectArea: {
        type: Object,
        default: () => {}
      }
  },
  data() {
    return {
      choices: [
        {
          name: "第一个选择",
          flow: false,
          conditionBtn: 1,
          dependOnBtn: 1,
          conditionExpre: "",
          steps: []
        },
        {
          name: "第二个选择",
          flow: false,
          conditionBtn: 1,
          dependOnBtn: 1,
          conditionExpre: "",
          steps: []
        }
      ]
    }
  },
  methods: {
    async overStepBody() {
      this.$set(this.item, "overing", 1);
    },
    async outStepBody() {
      this.$delete(this.item, "overing");
    },
    checkStatus(item) {
      // choice判断展开，moving判断移动颜色
      let selectStatus = "", nodeStyle = "pane_node_content";
      if (this.choice.paneNode.indexOf(item.id) !== -1) {
        // selectStatus = "selected";
        if (this.moving.paneNode.indexOf(item.id) !== -1) {
          nodeStyle = "choice_moving_pane_node_content";
        } else {
          nodeStyle = "choice_pane_node_content";
        }
      } else {
        if (this.moving.paneNode.indexOf(item.id) !== -1) {
          nodeStyle = "moving_pane_node_content";
        }
      }
      return nodeStyle + " " + selectStatus + " " + item.id;
    },
    checkSelectIcon(item) {
      let defaultIcon = "arrow-right";
      if (this.choice.paneNode.indexOf(item.id) !== -1) {
        defaultIcon = "arrow-down";
      }
      return defaultIcon;
    },
    checkIcon(item) {
      let iconClass = "";
      iconClass = this.stepNodes.filter(i => item.type === i.key)[0].iconClass;
      return iconClass;
    },
    clickIcon(item, e) {
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.$emit('nodesPersonalEvent', 'dbClickNodeIcon', item.id, item, clientX, clientY);
    },
    titleText(item) {
      if (item.id === this.item.id) {
        return `选择步骤和 ${this.item.choices.length} 个选项`;
      }
    },
    // 用于控制删除按钮的展示
    // showDelet(item) {
    //   let enableDelet = false;
    //   if (this.choice.paneNode.indexOf(item.id) !== -1) {
    //     enableDelet = true;
    //   }
    //   return enableDelet;
    // },
    isVertical() {
      let GlobalConfig = { isVertical: true }
      let _GlobalConfig = localStorage.getItem('GlobalConfig')
      if (_GlobalConfig && _GlobalConfig.length > 0) {
        GlobalConfig = Object.assign(GlobalConfig, JSON.parse(_GlobalConfig))
      }
      return GlobalConfig.isVertical
    },
    clickInput(e) {
      e.cancelBubble=true;
    },
    delEdges(e, item) {
      let params = {
        model_id: sessionStorage['newGraph'],
        id: item.id
      }
      this.$emit('delNode', params);
      e.cancelBubble=true;
    },
    showFullScreen() {
      this.$refs.fullScreen.showFull();
    },
    prepareMove(e, item) {
      if (this.moving.paneNode && item.id === this.moving.paneNode[0]) {
        this.$emit('selPaneNode', 99, 'prepareMove');
      } else {
        this.$emit('selPaneNode', item.id, 'prepareMove');
      }
      e.cancelBubble=true;
    },
    selNode(item) {
      this.$emit('selPaneNode', item.id, 'clickNodeHeader');
      // this.setBodyHeight();
    },
    setBodyHeight() {
      let leftHeight = 0, rightHeight = 0;
      if (document.querySelector(`.${this.item.id}_left`)) {
        leftHeight = document.querySelector(`.${this.item.id}_left`).offsetHeight;
      }
      if (document.querySelector(`.${this.item.id}_right`)) {
        rightHeight = document.querySelector(`.${this.item.id}_right`).offsetHeight;
      }
      let bodyHeight = Math.max(leftHeight,rightHeight);
      console.log('打印subStepbodyHeight:', bodyHeight);
      this.$set(this.item, "bodyHeight", bodyHeight);
    }
  },
  components: { stepDetail, fullScreen }
}
</script>

<style scoped>
@import url("./icon.css");
foreignObject {
  overflow: visible;
}
.noIcon {
  width: 20px;
  height: 20px;
  margin: 5px;
  float: left;
  font-size: 18px;
  line-height: 20px;
}

.step_header {
  border: none;
}

/* 收起固定中的选项步骤 */
.pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  width: 1299px !important;
  height: 69px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  /* border: 2px dotted rgb(36, 36, 36) !important; */
  border: 2px dashed #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 展开固定中的选项步骤 */
.choice_pane_node_content {
  box-sizing: border-box;
  width: 1299px !important;
  /* height: 348px !important; */
  /* height: 598px !important; */
  height: 620px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
  backdrop-filter: blur(6px); */
  /* border: 2px dotted rgb(36, 36, 36) !important; */
  border: 2px dashed #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38);
}

/* 收起移动中的选项步骤 */
.moving_pane_node_content {
  box-sizing: border-box;
  width: 1299px !important;
  height: 69px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 展开移动中的选项步骤 */
.choice_moving_pane_node_content {
  box-sizing: border-box;
  width: 1299px !important;
  /* height: 348px !important; */
  /* height: 598px !important; */
  height: 620px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  font-size: 12px;
  transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38);
}

.parentLink {
  font-size: 0;
  height: 12px;
  width: 12px;
  position: absolute;
  top: 0;
  left: 90px;
  transform: translateX(-50%);
  border-top: 6px solid black;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.childLink {
  height: 10px;
  width: 10px;
  position: absolute;
  bottom: 0;
  left: 90px;
  transform: translate(-50%, 50%);
  border-radius: 50%;
  background: #ffffff;
  cursor: crosshair;
}
.pane-node-parent-hl {
  position: fixed;
  top: -5px;
  right: -39px;
  height: 10px;
  width: 100%;
  display: flex;
  transform: translateX(6px);
}
.pane-node-parent-hl .space {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(158, 158, 158);
    background: #ffffff;
    position: absolute;
    left: 49;
    right: 0;
    top: 0;
    cursor: crosshair;
}
.pane-node-parent-hl .space:hover {
  box-shadow: 0 0 0 6px #3ddd73;
}
.paneSuccess {
  background: #3ddd73 !important;
}
.pane-node-parent-hl > div {
  position: relative;
  display: inline-block;
}
#parent-cross {
  top: 8px ;
  height: 100% ;
  width: 10px ;
  left: -10px ;
}
#parent-cross .space {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-0);
}
#children-cross {
    top:0px;
    right: 0;
    height: 100%;
    width: 10px;
    position: fixed;
}
#children-cross .space{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.pane-node-parent {
  position: fixed;
  top: -5px;
  height: 10px;
  width: 100%;
  display: flex;
  opacity: 0;
  transform: translateX(6px);
}
.pane-node-parent .space {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(158, 158, 158);
    background: #ffffff;
    position: absolute;
    right: 0;
    top: 0;
}

.pane-node-parent > div {
  position: relative;
  display: inline-block;
}

.pane-node-children {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  opacity: 1;
  transform: translateX(6px);
}
.pane-node-children .space{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(158, 158, 158);
    background: #ffffff;
    position: absolute;
    right: -39px;
    bottom: -6px;
    cursor: crosshair;
}

.pane-node-children .space:hover {
   background: #5093E1;
}

.pane-node-children > div {
  position: relative;
  display: inline-block;
}

/* 滑片的样式 */
.el-carousel__item h3 {
  color: #475669 !important;
  font-size: 14px !important;
  opacity: 0.75 !important;
  line-height: 150px !important;
  margin: 0 !important;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf !important;
}
.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6 !important;
}
#subSvgContent {
  height: 10000px !important;
}
</style>
