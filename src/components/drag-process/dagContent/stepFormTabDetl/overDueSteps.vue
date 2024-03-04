<template>
  <div class="current_content">
    <div class="sub_due_step_content">
      <div :class="parentStep.processStep === 'main' ? 'main_show_chon': 'sub_show_chon'">
          <div class="sub_due_step_flow">
              <div style="  width: 49.55%;height: 8px;border-right: 4px solid #C0C6D6;"></div>
              <div class="start_node">
                <div>
                  <span class="start_text" :title="startTxt">{{startTxt}}</span>
                </div>
              </div>
              <div style="height:32px;width:100%;position:relative;">
                  <div class="connect_line"></div>
                  <div class="line_btn">
                      <div class="add_btn_bg"></div>
                      <div class="add_btn" @mousedown="clickAddStep($event, 0, item)"></div>
                  </div>
              </div>
              <div v-for="(i, index) in item" :key="i.id+'_'+index">
                    <!-- <div :class="checkStatus(i)"> -->
                    <div class="sub_node" :class="i.id" @mouseover="overStepBody(i)" @mouseout="outStepBody(i)">
                        <div class="step_header" @click="selNode($event, i, index, '', parentStep)">
                          <div class="title">
                            <i class="icon icon-bg" :class="checkSelectIcon(i)"></i>
                            <!-- <input type="text" class="name" v-model="i.name" @click="clickInput($event)"> -->
                            <div class="name" :title="i.name">{{i.name}}</div>
                            <div v-show="i.overing" class="icon-bg sort-icon" @click="prepareMove($event, i)" title="移动这个步骤"></div>
                            <div v-show="i.overing" class="icon-bg close-icon" @click="delEdges($event, i, index)" title="删除这个步骤"></div>
                          </div>
                          <div class="sub_title">
                            <i class="icon icon-bg" :class="checkIcon(i)"></i>
                            <i class="name" :title="titleText(i)">{{titleText(i)}}</i>;
                          </div>
                        </div>
                        <div :class="i.type === 'human-step'?'step_form border_bottom':'step_form'" v-show="i.selected">
                          <sub-step-detail style="margin:8px;" :item="i" :lsStepAll.sync="lsStepAll" :subStepNodes="subStepNodes"></sub-step-detail>
                        </div>

                        <div :class="i.type === 'human-step'?'step_form border_bottom':'step_form'" v-if="i.hasOverdueSteps">
                          <overDueSteps :item="i.overdueSteps" :parentStep="i" :lsStepAll.sync="lsStepAll" :subStepNodes="subStepNodes"></overDueSteps>
                        </div>
                    </div>
                    <div v-show="i.type !== 'end-process-step' && i.type !== 'goto-step'" style="height:32px">
                        <div class="connect_line"></div>
                        <div class="line_btn">
                            <div class="add_btn_bg"></div>
                            <div class="add_btn" @mousedown="clickAddStep($event, index+1, item)"></div>
                        </div>
                    </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../el-styl.css";
import subStepDetail from "../subStepDetail";
export default {
  name: "overDueSteps",
  props: {
    item: {
      type: Array,
      default: () => {}
    },
    parentStep: {
      type: Object,
      default: () => {}
    },
    lsStepAll: {
      type: Array,
      default: () => []
    },
    subStepNodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      startTxt: "已经到达定时器所设定日期",
      mainStepNode: {},
      $_index: {}
    }
  },
  components: { subStepDetail },
  created() {
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
  },
  methods: {
    clickAddStep(e, index, step) {
      this.item = [];
      // 调整选择类型面板的y轴位置，防止最外层步骤收起导致选择类型面板没有与选择点对应上
      let ops = { selectType: "subAddNextStep", preIndex: index, stepSelectNode: step, currentSelectIndex: "", parentStep: this.parentStep },
        scrollTop = document.querySelector('.diagramExample').scrollTop || 0,
        mainShowChonScrollTop = document.querySelector('.main_show_chon').scrollTop || 0;
      let y = e.clientY - 32 + scrollTop, x = e.clientX;
      this.getParent(this);
      let currentTopParent = this.mainStepNode.item;
      if (currentTopParent.type === "human-step") {
        console.log('打印currentTopParent:', currentTopParent);
            // 上一级是最外层时
            if (this.parentStep.processStep && this.parentStep.processStep === "main") {
              if (this.parentStep.selected) {
                console.log('1:');
                y = y - 299 - 128;
                document.querySelector('.diagramExample').scrollTop = scrollTop - 299 > -1 ? scrollTop - 299 : 0;
              }
            }
            // 上一级不是最外层时
            if (!this.parentStep.processStep) {
              // if (mainShowChonScrollTop) {
                console.log('2:');
              //   y = y - 139;
              //   document.querySelector('.diagramExample').scrollTop = scrollTop - mainShowChonScrollTop - 139 > 0 ? scrollTop - mainShowChonScrollTop - 139 : 0;
              // }
              if (this.parentStep.selected) {
                console.log('3:');
                let height = document.querySelector(`.${this.parentStep.id} > .step_form`).clientHeight;
                y = height + 30;
                document.querySelector('.diagramExample').scrollTop = scrollTop  - height > 0 ? scrollTop - height : 0;
              }
            }
      }
      // 新增嵌套步骤时，收起最外层父级步骤(不收起会造成渲染时卡在选择类型面板)
      this.ShrinkMainStep();
      // 触发选择面板显示
      this.$_index.insertNodes(99, x, y, e, ops);
    },
    // 递归遍历循环嵌套步骤
    shrinkAll(parentOverSteps) {
      for(let i=0;i<parentOverSteps.length;i++) {
        parentOverSteps[i].selected = 0;
        if (parentOverSteps[i].overdueSteps && parentOverSteps[i].overdueSteps.length > 0) {
          this.shrinkAll(parentOverSteps[i].overdueSteps);
        }
      }
    },
    getParent(that) {
      let parent = that.$parent;
      if (parent.$vnode.tag.indexOf("main-step-body")>0 || parent.$vnode.tag.indexOf("sub-step-body")>0) {
        this.mainStepNode = parent;
      } else {
        this.getParent(parent);
      }
    },
    // 收起最外层父级步骤
    ShrinkMainStep() {
      this.getParent(this);
      if (this.mainStepNode.item.type === "human-step") {
        if (this.mainStepNode.item.selected) {
          // 如果最外层父级是展开时，触发一次最外层的父级的头部点击，使其收起
          this.$_index.selPaneNode(this.mainStepNode.item.id, "clickNodeHeader");
        } else {
          // 如果最外层父级收起时，触发两次头部点击可以使其他展开的最外层步骤收起
          this.$_index.selPaneNode(this.mainStepNode.item.id, "clickNodeHeader");
          this.$_index.selPaneNode(this.mainStepNode.item.id, "clickNodeHeader");
        }
      }
    },
    async overStepBody(i) {
      this.$set(i, "overing", 1);
    },
    async outStepBody(i) {
      this.$delete(i, "overing");
    },
    selNode(e, selOverItem, overItemIndex, selectIndex, parent) {
      if (!selOverItem.selected) {
        this.ShrinkMainStep();
        // 点击当前步骤时，先把同级的其他选项步骤都收起
        this.shrinkAll(this.parentStep.overdueSteps);
        selOverItem.selected = 1; 
        // 用于点击展开定时任务中的转至步骤时更新步骤列表
        let op = { selOverItem };
        this.$_index.runChoicesStepEvent("selSubStep", op);
      } else {
        // 点击已展开的步骤，则同级的全部收起
        this.shrinkAll(this.parentStep.overdueSteps);
      }
    },
    checkSelectIcon(item) {
      let defaultIcon = "arrow-right";
      if (item.selected === 1) {
        defaultIcon = "arrow-down";
      }
      return defaultIcon;
    },
    clickInput(e) {
      e.cancelBubble=true;
    },
    prepareMove() {},
    delEdges(e, item, index) {
      this.parentStep.overdueSteps.splice(index,1);
    },
    checkIcon(item) {
      let iconStyle = "";
      iconStyle = this.subStepNodes.filter(i => item.type === i.key)[0].iconClass;
      return iconStyle;
    },
    titleText(item) {
      if (item.type === "human-step") {
        if (["initiator","users","groups"].includes(item.assignment.type)) return "任务，已指派至流程发起者";
        if (item.assignment.type === "groupManagerForInitiator") return "任务，已指派至流程发起者的组管理员";
        if (item.assignment.type === "user") return "任务，已转派至 " + (item.assignment.assignee.name || "");
        if (item.assignment.type === "groupManager") return "任务，已指派至组管理员";
      } else if (item.type === "goto-step") {
        return item.gotoStep && item.gotoStep.name ? `转至步骤：${item.gotoStep.name}` : "无选中的转至步骤";
      } else if (item.type === "email-step") {
        return item.recipient.type === 'users' ? `发送电子邮件至 ${item.recipient.users.length || '0'} 个收件人` : '发送电子邮件至流程发起者';
      } else if (item.type === "subprocess-step") {
        return item.subProcessDefinition.name ? `子流程 ${item.subProcessDefinition.name}` : "无选中的子流程";
      } else {
        return item.name;
      }
    }
  }
};
</script>

<style scoped>
@import url("../icon.css");
.current_content {
  /* border-top: 1px solid #bbbbbb; */
  border-top: 1px solid #CDD6EC;
}
.start_text {
  width: 135px;
  line-height: 28px;
  font-size: 18px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 26px;
  cursor: default;
}
.sub_due_step_content {
  margin: 0 auto;
  /* padding: 5px; */
  width: 96%;
  height: auto;
}
.main_show_chon {
  width: 100%;
  height: 468px;
  overflow-y: auto;
  /* overscroll-behavior: auto; */
  overscroll-behavior: contain;
}
.main_show_chon::-webkit-scrollbar{
	display:none;
}
.sub_show_chon {
  width: 100%;
  height: auto;
  /* height: 268px; */
  /* overflow-y: auto;
  overscroll-behavior: auto; */
}
.sub_due_step_flow {
  /* background: rgb(139, 185, 245) !important; */
  width: 100%;
  height: auto;
}
.sub_node {
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  width: 99.9%;
  height: auto;
  /* border: 2px solid #1A1A1A; */
  border: 2px solid #CDD6EC;
  border-radius: 8px;
  background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
  /* box-shadow: 0px 2px 3px rgb(164, 165, 167); */
  box-shadow: 0px 2px 3px rgb(225, 230, 248);
  overflow: hidden;
  font-size: 12px;
}
</style>
