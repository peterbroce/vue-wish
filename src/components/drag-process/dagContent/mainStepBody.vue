<template>
  <foreignObject width="180" height="30" >
    <body xmlns="http://www.w3.org/1999/xhtml"
      v-show="item.type !== 'stepEnd'"
      style="margin: 0"
      @mouseover="overStepBody"
      @mouseout="outStepBody"
    >
      <div>
        <!-- <div :style="checkNodeStyle(item)" :class="this.checkStatus(item)"> -->
        <div :class="this.checkStatus(item)">
          <div class="step_header" @click="selNode(item)">
            <div class="title">
              <i class="icon icon-bg" :class="this.checkSelectIcon(item)"></i>
              <!-- <strong class="name" @click="selNode(item)">{{item.name}}</strong> -->
              <!-- <input type="text" class="name" v-model="item.name" @change="$emit('changeNodeName', item)" @click="clickInput($event)"> -->
              <div class="name" :title="item.name">{{item.name}}</div>
              <div v-show="item.overing" class="sort-icon icon-bg" @click="prepareMove($event, item)" title="移动这个步骤"></div>
              <div v-show="item.overing" class="close-icon icon-bg" @click="delEdges($event, item)" title="删除这个步骤"></div>
            </div>
            <div class="sub_title">
              <i class="icon icon-bg" :class="this.checkIcon(item)"></i>
              <div class="name" :title="titleText(item)">{{titleText(item)}}</div>
            </div>
          </div>
          <div class="step_form" v-if="item.selected">
            <step-detail style="margin:8px;" :item="item" :stepNodes="stepNodes"></step-detail>
          </div>
          <div class="step_form" v-if="item.hasOverdueSteps">
            <overDueSteps :item="item.overdueSteps" :parentStep="item" :lsStepAll.sync="lsStepAll" :subStepNodes="subStepNodes"></overDueSteps>
          </div>
        </div>
        <div :class="currentEvent === 'dragLink' ? 'pane-node-parent-hl' : 'pane-node-parent' ">
          <!-- <div v-for="(poi, nth) in item.in_ports" :key="'__' + nth" :style="{width: `${ 100 / (item.in_ports.length + 1)}%`}">
            <span class="space" @mouseup="$emit('linkEnd', i, nth)"></span>
          </div> -->
          <div style="width: 50%"><span class="space"></span></div>
        </div>
      </div>
    </body>
  </foreignObject>
</template>

<script>
import stepDetail from "./stepDetail";
import overDueSteps from "./stepFormTabDetl/overDueSteps";
export default {
  components: { stepDetail, overDueSteps },
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
      }
  },
  methods: {
    // checkNodeStyle(item) {
    //   // console.log('item.nodeStyle:', item.nodeStyle);
    //   // if (item.id !== 100 && item.id !== 101 && document.querySelector('.'+item.id)) {
    //   //   let stepHeight = document.querySelector('.'+item.id).scrollHeight;
    //   //   this.$set(item.nodes, "height", stepHeight);
    //   // }
    //   return item.nodeStyle
    // },
    overStepBody() {
      this.$set(this.item, "overing", 1);
    },
    outStepBody() {
      this.$delete(this.item, "overing");
    },
    checkStatus(item) {
      let selectStatus = "", nodeStyle = "pane_node_content";
      let isSelected = this.choice.paneNode.indexOf(item.id) !== -1;
      let isMoving = this.moving.paneNode.indexOf(item.id) !== -1;
      let hasOverdue = item.type === "human-step" && (item.hasOverdueSteps || false);
      if (isSelected) {
        selectStatus = "selected";
        if (isMoving) {
          if (hasOverdue) {
            nodeStyle = "selectd_moving_hasoverduesteps_pane_node_content";
            item.selected = 1;
          } else {
            nodeStyle = "selectd_moving_pane_node_content";
            item.selected = 1;
            // selectStatus = "";
          }
        } else {
          if (hasOverdue) {
            nodeStyle = "hasoverduesteps_selectd_pane_node_content";
          } else {
            nodeStyle = "selectd_pane_node_content";
          }
        }
      } else {
        if (isMoving) {
          if (hasOverdue) {
            nodeStyle = "moving_hasoverduesteps_pane_node_content";
          } else {
            nodeStyle = "moving_pane_node_content";
          }
        } else {
          if (hasOverdue) {
            nodeStyle = "hasoverduesteps_pane_node_content";
          } else {
            nodeStyle = "pane_node_content"
          }
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
      if (item.type !== 'stepEnd') {
        let iconClass = "";
        iconClass = this.stepNodes.filter(i => item.type === i.key)[0].iconClass;
        return iconClass;
      }
    },
    titleText(item) {
      if (item.type === "human-step") {
        if (["initiator","users","groups"].includes(item.assignment.type)) return "任务，已指派至流程发起者";
        if (item.assignment.type === "groupManagerForInitiator") return "任务，已指派至流程发起者的组管理员";
        if (item.assignment.type === "user") return "任务，已转派至 " + (item.assignment.assignee.name || "");
        if (item.assignment.type === "groupManager") return "任务，已指派至组管理员";
      } else if (item.type === "goto-step") {
        return "无选中的转至步骤";
      } else if (item.type === "email-step") {
        return item.recipient.type === 'users' ? `发送电子邮件至 ${item.recipient.users.length || '0'} 个收件人` : '发送电子邮件至流程发起者';
      } else if (item.type === "subprocess-step") {
        return item.subProcessDefinition.id ? `子流程 ${item.subProcessDefinition.name}` : "无选中的子流程";
      } else {
        return item.name;
      }
    },
    clickIcon(item, e) {
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.$emit('nodesPersonalEvent', 'dbClickNodeIcon', item.id, item, clientX, clientY);
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
      if (item.Moving) {
        this.moving.paneNode = [];
      }
      let params = {
        model_id: sessionStorage['newGraph'],
        id: item.id
      }
      this.$emit('delNode', params);
      e.cancelBubble=true;
    },
    prepareMove(e, item) {
      console.log('打印this.moving.paneNode:', this.moving.paneNode);
      if (this.moving.paneNode && item.id === this.moving.paneNode[0]) {
        this.$emit('selPaneNode', 99, 'prepareMove');
      } else {
        this.$emit('selPaneNode', item.id, 'prepareMove');
      }
      e.cancelBubble=true;
    },
    selNode(item) {
      this.$emit('selPaneNode', item.id, 'clickNodeHeader');
    }
  }
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

/* 收起固定中的步骤 */
.pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  /* box-shadow: 0px 3px 6px rgb(193, 199, 219); */
  width: 598px !important;
  height: 69px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  /* border: 2px solid #1A1A1A !important; */
  border: 2px solid #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  /* -webkit-transition: height 0.2s;
  transition: height 0.2s; */
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 展开固定中的步骤 */
.selectd_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 3px 6px rgb(225, 230, 248);
  width: 598px !important;
  /* height: 348px !important; */
  height: 506px !important;
  /* height: auto !important; */
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  /* border: 2px solid #585858 !important; */
  /* border: 2px solid #3f5c8d !important; */
  /* border: 2px solid #1A1A1A !important; */
  border: 2px solid #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 收起移动中的步骤 */
.moving_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  height: 69px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  border-radius: 8px;
  font-size: 12px;
}

/* 展开移动中的步骤 */
.selectd_moving_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  /* height: 348px !important; */
  height: 506px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  border-radius: 8px;
  /* border-radius: 3px; */
  font-size: 12px;
}

/* 收起带有定时器的移动中的步骤 */
.moving_hasoverduesteps_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  height: 568px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  border-radius:  8px;
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}
/* 展开带有定时器的移动中的步骤 */
.selectd_moving_hasoverduesteps_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  height: 848px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  border: 2px solid #72A83F !important;
  border-radius:  8px;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 有定时器时收起固定中的步骤 */
.hasoverduesteps_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  height: 568px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  /* border: 2px solid #1A1A1A !important; */
  border: 2px solid #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
}

/* 有定时器时展开固定中的步骤 */
.hasoverduesteps_selectd_pane_node_content {
  box-sizing: border-box;
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  width: 598px !important;
  height: 848px !important;
  overflow: hidden;
  background-color: hsla(0, 0%, 100%, 1);
  /* background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)); */
  /* border: 2px solid #1A1A1A !important; */
  border: 2px solid #CDD6EC !important;
  border-radius: 8px;
  font-size: 12px;
  /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
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
   /* background: #cccccc; */
   background: #5093E1;
}
/* .pane-node-children:hover {
  opacity: 1;
} */

.pane-node-children > div {
  position: relative;
  display: inline-block;
}
</style>
