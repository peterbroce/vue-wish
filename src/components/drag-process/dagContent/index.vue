<template>
    <!-- 添加到下面的svg内可以控制全局鼠标样式 -->
    <!-- :style="{cursor: this.currentEvent === 'move_graph' ? 'grabbing' : 'grab'}" -->
  <svg
     id="svgContent"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="1029" data-spm-anchor-id="TODO.11007039.0.i6.12b64a9bcbXQmm"
    @mousedown="svgMouseDown"
    @mousemove="dragIng($event)"
    @mouseup="dragEnd($event)"
    >
    <!-- 控制鼠标移动和离开svg面板的事件 -->
    <!-- @mouseover="atMouseOver"
    @mouseleave="atMouseOut" -->
    <g id="svgBody" :transform="` translate(${svg_left}, ${svg_top}) scale(${svgScale})`" >
      <ArrowRect
        v-for="(each, n) in DataAll.rectEdges"
        :key="'___' + n"
        :DataAll="DataAll"
        :dragBus="dragBus"
        :keepBusValue="keepBusValue"
        :choice="choice"
        @selPaneNode="selPaneNode"
        @enableInsert="enableInsert"
        @delrectEdge="delrectEdge"
        @changeRectEdgeStatus="changeRectEdgeStatus"
        @updateData="updateData"
        @insertNodes="insertNodes"
        @insertStepType="insertStepType"
        :each="each"
        :index="n" />
      <g id="svgNode"
      v-for="(item, i) in DataAll.nodes"
      :key="item.id + '__' + i" class="svgEach"
      :transform="`translate(${item.pos_x}, ${item.pos_y})`"
      @contextmenu="r_click_nodes($event, i)"
      @dblclick="focusInput($event.path[0])"
      @mousedown="dragPre($event, i, item)"
      >
        <main-body
          id="startNodeStep"
          v-if="!item.type"
          :item="item"
          :i="i"
          :choice="choice"
          :currentEvent="currentEvent"
          :formDetail="formDetail"
          @selPaneNode="selPaneNode"
          @nodesPersonalEvent="nodesPersonalEvent"
          @changeNodeName="changeNodeName"
          @linkEnd="linkEnd"
          @linkPre="linkPre"
        ></main-body>
        <main-step-body
          v-if="item.type && item.type !== 'choice-step'"
          :item="item"
          :i="i"
          :choice="choice"
          :moving="moving"
          :lsStepAll.sync="lsStepAll"
          :currentEvent="currentEvent"
          :stepNodes="stepNodes"
          :subStepNodes="subStepNodes"
          :formDetail="formDetail"
          @selPaneNode="selPaneNode"
          @nodesPersonalEvent="nodesPersonalEvent"
          @changeNodeName="changeNodeName"
          @linkEnd="linkEnd"
          @linkPre="linkPre"
          @delNode="delNode"
        ></main-step-body>
        <sub-step-body
          v-if="item.type && item.type === 'choice-step'"
          :item="item"
          :i="i"
          :choice="choice"
          :moving="moving"
          :lsStepAll.sync="lsStepAll"
          :currentEvent="currentEvent"
          :isSelectArea="is_select_area"
          :stepNodes="stepNodes"
          :subStepNodes="subStepNodes"
          :formDetail="formDetail"
          @selPaneNode="selPaneNode"
          @nodesPersonalEvent="nodesPersonalEvent"
          @changeNodeName="changeNodeName"
          @linkEnd="linkEnd"
          @linkPre="linkPre"
          @delNode="delNode"
        ></sub-step-body>
      </g>
    </g>
    <EditArea @editNodeDetails="editNodeDetails" :isEditAreaShow="is_edit_area" @nodesPersonalEvent="nodesPersonalEvent" @delNode="delNode" @changePort="changePort" @close_click_nodes="close_click_nodes" />
    <SelectArea :stepNodes="stepNodes" :subStepNodes="subStepNodes" :isSelectArea="is_select_area" @insertStepType="insertStepType" @subInsertStepType="subInsertStepType" @close_select_nodes="close_select_nodes"/>
  </svg>
</template>
<script>
import mainBody from './mainBody.vue';
import mainStepBody from './mainStepBody.vue';
import subStepBody from './subStepBody.vue';
import ArrowRect from "./arrowRect.vue";
import EditArea from "./editArea.vue";
import SelectArea from "./selectArea.vue";

export default {
  name: 'dragProcess',
  props: {
    DataAll: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: () => ''
    },
    stepNodes: {
      type: Array,
      default: () => []
    },
    subStepNodes: {
      type: Array,
      default: () => []
    },
    dragBus: {
      type: Boolean,
      default: () => false
    },
    keepBusValue: {
      type: Object,
      default: () => {}
    },
    formDetail: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    svgScale () {
      return this.svg_scale || !!sessionStorage['svgScale'] ? sessionStorage['svgScale'] : 1
    }
  },
  created() {
    this.$nextTick(() => {
      this.setMouseWheelEvent()
    })
  },
  mounted() {
    sessionStorage["svg_left"] = 0;
    sessionStorage["svg_top"] = 0;
  },
  methods: {
    getChoicesSubStepAll (choiceStep) {
      let choicesAllSteps = [], choices = choiceStep.choices;
      for (let i=0;i<choices.length;i++) {
        if (choices[i].steps.length) {
          choicesAllSteps.push(choiceStep.choices[i].steps);
        }
      }
      return choicesAllSteps;
    },
    getStepAll() {
      let StepAll = [], lsStepAll = [];
      let DataAll = JSON.parse(JSON.stringify(this.DataAll.nodes));
      DataAll.shift(); DataAll.pop();
      for (let i=0; i<DataAll.length;i++) {
        if (DataAll[i].type !== "choice-step") {
          StepAll.push(DataAll[i]);
        } else {
          StepAll.push(this.getChoicesSubStepAll(DataAll[i]));
        }
      }
      // 扁平化
      let steps = StepAll.flat(Infinity);
      // 排除本身
      steps = steps.filter(i => i.type !== "goto-step");
      // 转换结构
      for (let i=0;i<steps.length;i++) {
        let obj = {id:steps[i].id, name:steps[i].name, stepType:steps[i].type};
        lsStepAll.push(obj);
      }
      this.lsStepAll = lsStepAll;
    },
    runChoicesStepEvent(type, options) {
      // 通过$parent触发的事件 subStepSelectDetail -> stepDetail -> subStepBody -> index
      let {subStepItem, subStepIndex, selectIndex, id, selOverItem} = options;
      if (type === "deletSubStep") {
        this.DataAll.nodes.filter(i => i.id === id)[0].choices[selectIndex].steps.splice(subStepIndex, 1);
      }
      if (type === "selSubStep") {
        if (!selOverItem) {
          let choiceStep = this.DataAll.nodes.filter(i => i.id === id)[0];
          let subStep = choiceStep.choices[selectIndex].steps[subStepIndex];
          subStep.selected = 1;
          // 用于转至步骤获取全部的步骤时使用
          subStep.type === "goto-step" ? this.getStepAll() : void(0);
        } else {
          selOverItem.type === "goto-step" ? this.getStepAll() : void(0);
        }
      }
    },
    clear_Choice_PaneNode() {
      this.choice.paneNode = [];
    },
    enableInsert(val) {
      this.$emit("changeInsertStatus", val);
    },
    insertStepType(node, id) {
      this.$emit("insertStepType", node, id);
    },
    // 收起当前选项步骤
    ShrinkAllSubStep(selectArr) {
      if (selectArr) {
        selectArr.forEach(i => {
          i.selected = 0;
        });
      }
    },
    // 收起所有选项步骤
    shrinkAll(stepSelectNode) {
      let that = this;
      if (stepSelectNode.choices) {
        stepSelectNode.choices.forEach(i => {
          that.ShrinkAllSubStep(i.steps);
        });
      }
    },
    setBodyHeight(item, currentIndex, currentChoice) {
      let leftHeight = 0, rightHeight = 0;
      if (document.querySelector(`.${item.id}_left`)) {
        leftHeight = document.querySelector(`.${item.id}_left`).offsetHeight;
      }
      if (document.querySelector(`.${item.id}_right`)) {
        rightHeight = document.querySelector(`.${item.id}_right`).offsetHeight;
      }
      let bodyHeight = Math.max(leftHeight,rightHeight);
      console.log('打印subStepbodyHeight:', bodyHeight);
      console.log('左侧高度：',document.querySelector('.left_sub_flow_select').offsetHeight);
    },
    addParamsBySubStepType(stepType) {
      if (stepType === "human-step") {
        return {
          overdueSteps: [],
          assignment: {
            initiatorCanCompleteTask: true,
            type: "initiator",
            assignee: {},
            candidateUsers: [],
            candidateUserFields: [],
            candidateGroups: [],
            candidateGroupFields: []
          },
          allowSendEmail: true,
          emailTemplateSource: {
            type: "default"
          },
          taskDueDateOption: "none",
          dueAction: "none",
          formDefinition: {},
          variablesmapping: []
        }
      }
      if (stepType === "email-step") {
        return {
          recipient: {
            type: "initiator",
            user: null,
            users: null,
            userFields: null
          }
        }
      }
      if (stepType === "subprocess-step") {
        return {
          subProcessDefinition : {}
        }
      }
      if (stepType === "rest-call-step") {
        return {
          httpMethod: "GET",
          requestMappings: [],
          requestMappingJSONTemplate: "",
          responseMappings: [],
          requestHeaders: []
        }
      }
    },
    subInsertStepType(selectTypeOpions, node) {
      let { currentSelectIndex, preIndex, selectType, stepSelectNode, currentStep } = selectTypeOpions,
        { id } = stepSelectNode,
        that = this,
        newDate = new Date().getTime(),
        newId = `${node.key}-${newDate}-${parseInt(Math.random()*900 + 100, 10)}`,
        obj = {
          name: node.value,
          pos_x: 438, 
          pos_y: 0, 
          // iconStyle: "#5093E1",
          // nodeStyle: { "border": "2px solid #585858" },
          iconClass: node.iconClass,
          type: node.key,
          description: "",
          id: newId,
          // in_ports: [0],
          // out_ports: [0],
          Move: "",
          Moving: false,
          selected: 1
        };
        obj = Object.assign(obj, this.addParamsBySubStepType(node.key));
      // this.shrinkAll(stepSelectNode);
      if (typeof currentSelectIndex === "number") {
        this.DataAll.nodes.forEach(step => {
          if (step.id === id) {
            // that.setBodyHeight(step);
            // that.ShrinkAllSubStep(step.choices[currentSelectIndex].steps);
            // 新增时收起其他选择的步骤
            that.shrinkAll(step);
            step.choices[currentSelectIndex].steps.splice(preIndex, 0, obj);
            // 用于转至步骤获取全部的步骤时使用
            obj.type === "goto-step" ? this.getStepAll() : void(0);
          }
        });
      } else {
        // 添加定时任务-嵌套子流程-新增步骤
        selectTypeOpions.parentStep.overdueSteps.splice(preIndex, 0, obj);
        // 用于定时任务中转至步骤获取主流程的全部步骤使用
        obj.type === "goto-step" ? this.getStepAll() : void(0);
        this.$emit('updateDAG', this.DataAll);
      }
    },
    insertNodes(srcNodeId, s_x, s_y, e, ops) {
      this.is_select_area = {
        value: true,
        x: s_x,
        y: s_y,
        id: srcNodeId,
        selectTypeOpions: ops
      };
      e.stopPropagation();
      e.cancelBubble = true;
      e.preventDefault();
    },
    changeCurve(val) {
      this.curve = val;
    },
    updateData(DataAll, name) {
      this.$emit('updateDAG', DataAll, name)
    },
    atMouseOut() {
      // 鼠标移出svg
      this.currentEvent = null;
      // 隐藏图标面板和右键面板
      this.close_icon_nodes();
      this.close_click_nodes();
      this.close_select_nodes();
      // 清空选中状态
      // this.choice.paneNode = [];
    },
    atMouseOver() {
      this.panel = true;
    },
    /**
     * 事件分发器
     */
    dragPre(e, i, item) {
      this.sty = item.sty;
      // 准备拖动节点
      this.multipleSelectNodes = JSON.parse(JSON.stringify(this.choice))
      if (this.multipleSelectNodes && this.multipleSelectNodes.paneNode.length) {
        this.initMultiplePosition = JSON.parse(JSON.stringify(this.DataAll.nodes))
      }
      this.setInitRect(); // 工具类 初始化dom坐标
      this.currentEvent = "dragPane"; // 修正行为
      sessionStorage['offsetX'] = e.offsetX
      sessionStorage['offsetY'] = e.offsetY
      this.choice.index = i; // 当前选择的接点
      this.timeStamp = e.timeStamp;
      // this.selPaneNode(item.id); // 触发点击步骤事件
      // this.setDragFramePosition(e); // 触发步骤拖拽事件
      // e.preventDefault();
      // e.stopPropagation();
      // e.cancelBubble = true;
    },
    dragIng(e) {
      // 事件发放器 根据currentEvent来执行系列事件
      switch (this.currentEvent) {
        // case 'dragPane':
        //   this.paneDragIng(e);
        //   // this.choice.paneNode = [];
        //   this.$emit('updateDAG', this.DataAll, 'clickNull', 0);
        //   break;
        // case 'PaneDraging':
        //    this.setDragFramePosition(e); // 触发节点拖动
        //    break;
        case 'dragLink':
          this.setDragLinkPostion(e); // 触发连线拖动
          break;
        case 'sel_area_ing':
          this.setSelAreaPostion(e); // 触发框选
          break;
        // case 'move_graph':
        //   this.graphMoveIng(e); // 触发拖动整体
        //   break;
        default: () => { }
      }
    },
    dragEnd(e) {
      // 拖动结束
      switch (this.currentEvent) {
        // case 'PaneDraging': this.paneDragEnd(e); // 触发节点拖动结束
        // break;
        case 'sel_area_ing': this.getSelNodes(this.simulate_sel_area);
        break;
        default: () => { }
      }
      this.currentEvent = null;
    },
    // svg鼠标按下触发事件分发
    svgMouseDown(e) {
      // this.choice.paneNode = [];
      //不选中节点时无激活样式
      this.$emit('updateDAG', this.DataAll, 'clickNull', 0);
      this.setInitRect();
      if (this.currentEvent === "sel_area") {
        this.selAreaStart(e);
      } else {
        // 那就拖动画布
        this.currentEvent = "move_graph";
        this.graphMovePre(e);
      }
    },
    moveOnNode(e) {
      this.currentEvent = "dragLink";
    },
    /**
     * 连线系列事件
     */
    linkPre(e, i, nth) {
      // 开始连线
      this.setInitRect();
      this.currentEvent = "dragLink";
      this.choice = Object.assign({}, this.choice, { index: i, point: nth });
      this.setDragLinkPostion(e, true);
      e.preventDefault();
      e.stopPropagation();
    },

    linkEnd(i, nth) {
      // 连线结束 i, 目标点序号 nth 出发点 choice.index 出发点序号 choice.point
      if (this.currentEvent === "dragLink") {
        let params = {
          desp: {
            src_node_id: this.DataAll.nodes[this.choice.index].id,
            src_output_idx: this.choice.point,
            dst_node_id: this.DataAll.nodes[i].id,
            dst_input_idx: nth
          }
        };
        const that = this
        if (that.curve) {
          this.addEdge(params, that);
        } else {
          this.addrectEdge(params, that);
        }
      }
      this.currentEvent = null;
    },
    /**
     *  svg画板缩放行为
     */
    sizeInit() {
      this.changeSize("init"); // 回归到默认倍数
      this.svg_left = 0; // 回归到默认位置
      this.svg_top = 0;
      sessionStorage["svg_left"] = 0;
      sessionStorage["svg_top"] = 0;
      this.$emit("reAlign");
    },
    sizeExpend() {
      // this.changeSize("expend"); // 画板放大0.1
    },
    sizeShrink() {
      // this.changeSize("shrink"); // 画板缩小0.1
    },
    getDate() {
      this.$emit("getDate");
    },
    onMouseWheel(e) { // 鼠标滚动或mac触摸板可以改变size
        if (!e) return false
        let multiple = (e.wheelDelta / 10)
        if (this.canMouseWheelUse && (multiple * multiple) > 1) {
          multiple > 0
          ? this.sizeExpend()
          : this.sizeShrink()
          this.canMouseWheelUse = false
          setTimeout(() => { // 节流
            this.canMouseWheelUse = true
          }, 50)
        }
      },
    setMouseWheelEvent() { // 绑定鼠标滚轮事件
      const addEvent = (obj, xEvent, fn) => {
        if (obj.attachEvent) {
          obj.attachEvent('on' + xEvent, fn);
        } else {
          obj.addEventListener(xEvent, fn, false);
        }
      }

      var oDiv = document.getElementById('svgContent');
      // 当滚轮事件发生时，执行onMouseWheel这个函数
      addEvent(oDiv, 'mousewheel', this.onMouseWheel);
      addEvent(oDiv, 'DOMMouseScroll', this.onMouseWheel);
    },
    /**
     * 节点事件 单选 框选 拖动
     */
    sel_area() {
      this.currentEvent = "sel_area";
      this.simulate_sel_area = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
    },
    paneDragIng(e) {
      let offsetX = sessionStorage['offsetX'] || 0
      let offsetY = sessionStorage['offsetY'] || 0
      let x =
        (e.x - this.initPos.left - (sessionStorage["svg_left"] || 0)) /
          this.svgScale - 30 - offsetX
      let y =
        (e.y - this.initPos.top - (sessionStorage["svg_top"] || 0)) /
          this.svgScale - offsetY;
      let params = {
        model_id: sessionStorage["newGraph"],
        id: this.DataAll.nodes[this.choice.index].id,
        pos_x: x,
        pos_y: y
      };
      if (this.multipleMoveNode && this.multipleSelectNodes.paneNode.length > 1) {
        this.multipleMoveNode(params)
      } else {
        this.moveNode(params);
      }
    },
    paneDragEnd(e) {
      // 节点拖动结束
      this.multipleSelectNodes = {}
      this.initMultiplePosition = null
      this.dragFrame = { dragFrame: false, posX: 0, posY: 0 };
      const x =
        (e.x - this.initPos.left - (sessionStorage["svg_left"] || 0)) /
          this.svgScale -
        90;
      const y =
        (e.y - this.initPos.top - (sessionStorage["svg_top"] || 0)) /
          this.svgScale -
        15;
      let params = {
        model_id: sessionStorage["newGraph"],
        id: this.DataAll.nodes[this.choice.index].id,
        pos_x: x,
        pos_y: y
      };
    },
    // 点击节点时触发事件分类
    selPaneNode(id, selType, movedStepId) {
      // 点击头部时默认窗口内容回到顶部
      if (document.querySelector('.main_step_form_content')) {
        document.querySelector('.main_step_form_content').scrollTop = 0;
      }
      if (document.querySelector('.sub_flow_body')) {
        document.querySelector('.sub_flow_body').scrollTop = 0;
      }
      if (!movedStepId) {
        if (selType === 'clickNodeHeader' && this.choice.paneNode[0] === id && this.moving.paneNode[0] === id) {
          this.choice.paneNode.length = [];
          this.moving.paneNode[0] = id
          this.$emit('reAlign');
          return;
        } 
        else if (selType === 'clickNodeHeader' && this.choice.paneNode[0] === id && !this.moving.paneNode[0]) {
          this.choice.paneNode.length = [];
          this.$emit('reAlign');
        } 
        else if (selType === 'clickNodeHeader' && !this.choice.paneNode[0] && this.moving.paneNode[0] === id) {
          this.choice.paneNode[0] = id;
          this.moving.paneNode[0] = id;
          this.$emit('updateDAG', this.DataAll, 'selectNode',);
        }
        else if (selType === 'prepareMove') {
          // 启动步骤移动
          this.moving.paneNode = [];
          if (typeof id !== "number") {
            this.moving.paneNode.push(id);
          }
          this.$emit('updateDAG', this.DataAll, 'prepareMove', id);
        } else {
          this.choice.paneNode.length = [];
          if (id) {
            this.choice.paneNode.push(id);
            this.$emit('updateDAG', this.DataAll, 'selectNode', id);
          }
        }
      } else {
        console.log('movedStepId:', movedStepId);
        // 步骤移动位置后默认展开
        this.moving.paneNode.length = [];
        this.choice.paneNode.push(movedStepId);
        this.$emit('updateDAG', this.DataAll, 'selectNode', movedStepId);
      }
    },
    selAreaStart(e) {
      // 框选节点开始
      this.currentEvent = "sel_area_ing";
      const x =
        (e.x - this.initPos.left - (sessionStorage["svg_left"] || 0)) /
        this.svgScale;
      const y =
        (e.y - this.initPos.top - (sessionStorage["svg_top"] || 0)) /
        this.svgScale;
      this.simulate_sel_area = {
        left: x,
        top: y,
        width: 0,
        height: 0
      };
    },
    setSelAreaPostion(e) {
      // 框选节点ing
      const x =
        (e.x - this.initPos.left - (sessionStorage["svg_left"] || 0)) /
        this.svgScale;
      const y =
        (e.y - this.initPos.top - (sessionStorage["svg_top"] || 0)) /
        this.svgScale;
      const width = x - this.simulate_sel_area.left;
      const height = y - this.simulate_sel_area.top;
      this.simulate_sel_area.width = width;
      this.simulate_sel_area.height = height;
    },
    getSelNodes(postions) {
      // 选取框选的节点
      const { left, top, width, height } = postions;
      this.choice.paneNode.length = 0;
      this.DataAll.nodes.forEach(item => {
        if (
          item.pos_x > left &&
          item.pos_x < left + width &&
          item.pos_y > top &&
          item.pos_y < top + height
        ) {
          // set the select nodes into this.data.choice
          this.choice.paneNode.push(item.id);
        }
      });
      this.simulate_sel_area = {
        // 触发框选结束
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
    },
    focusInput(el) { // 双击选中input
      if (el) { el.focus() }
    },
    /**
     * 画布拖动
     */
    graphMovePre(e) {
      const { x, y } = e;
      this.svg_trans_init = { x, y };
      this.svg_trans_pre = { x: this.svg_left, y: this.svg_top };
    },
    graphMoveIng(e) {
      const { x, y } = this.svg_trans_init;
      this.svg_left = e.x - x + this.svg_trans_pre.x;
      this.svg_top = e.y - y + this.svg_trans_pre.y;
      sessionStorage["svg_left"] = this.svg_left;
      sessionStorage["svg_top"] = this.svg_top;
    },
    /**
     * 模态框类
     */
    setDragFramePosition(e) {
      // 节点拖拽模态
      const x = e.x - this.initPos.left - (sessionStorage["svg_left"] || 0);
      const y = e.y - this.initPos.top - (sessionStorage["svg_top"] || 0);
      this.dragFrame = {
        posX: x / this.svgScale - 90,
        posY: y / this.svgScale - 15
      };
    },
    setDragLinkPostion(e, init) {
      // 节点连线模态
      const x =
        (e.x - this.initPos.left - (sessionStorage["svg_left"] || 0)) /
        this.svgScale;
      const y =
        (e.y - this.initPos.top - (sessionStorage["svg_top"] || 0)) /
        this.svgScale;
      if (init) {
        this.dragLink = Object.assign({}, this.dragLink, {
          fromX: x,
          fromY: y
        });
      }
      this.dragLink = Object.assign({}, this.dragLink, { toX: x, toY: y });
    },
    close_click_nodes() {
      // 关闭模态
      this.is_edit_area = { value: false, x: -9999, y: -9999 };
    },
    close_icon_nodes() {
      // 关闭图标选择
      this.is_icon_area = { value: false, x: -9999, y: -9999 };
    },
    close_select_nodes() {
      // 关闭图标选择
      this.is_select_area = { value: false, x: -9999, y: -9999 };
    },
    r_click_nodes(e, i) {
      console.log("点击右键");
      // 节点右键模态
      this.setInitRect();
      const id = this.DataAll.nodes[i].id;
      const detail = this.DataAll.nodes[i].detail || null
      const rightClickEvent = this.DataAll.nodes[i].rightClickEvent || null
      const x = e.x - this.initPos.left;
      const y = e.y - this.initPos.top;
      this.is_edit_area = {
        value: true,
        x,
        y,
        id,
        detail,
        rightClickEvent
      };
      e.stopPropagation();
      e.cancelBubble = true;
      e.preventDefault();
    },
    nodesPersonalEvent(eventName, id, item, clientX, clientY) {
      // this.$emit('doSthPersonal', eventName, id);
      this.setInitRect();
      const x = clientX - this.initPos.left - 168;
      const y = clientY - this.initPos.top;
      this.is_icon_area = {
        value: true,
        x,
        y,
        id
      };
    },
    /**
     * 工具类
     */
    setInitRect() {
      // 矫正svg组件坐标
      let { left, top } = document
        .getElementById("svgContent")
        .getBoundingClientRect();
      this.initPos = { left, top };
    },
    // 增加边
    addEdge: (value, that) => {
      let _DataAll = that.DataAll
      _DataAll.edges.push({
        ...value.desp,
        id: _DataAll.edges.length + 10
      })
      that.$emit('updateDAG', _DataAll, 'addEdge')
    },
    // 删除虚线边
    delEdge({ id }) {
      console.log('id', id)
      let _edges = []
      this.DataAll.edges.forEach((item, i) => {
        if (item.id !== id) {
          _edges.push(item)
        }
      })
      this.DataAll.edges = _edges
      this.$emit('updateDAG', this.DataAll, 'delEdge')
    },
    // 改变连线状态
    // changeEdgeStatus({id, val, type}) {
    //   let _edges = []
    //   this.DataAll.edges.forEach((item, i) => {
    //     if (item.id !== id) {
    //       _edges.push(item)
    //     } else {
    //       if (val) {
    //         item.edgesText = val
    //       }
    //       item.type = type
    //       _edges.push(item)
    //     }
    //   })
    //   this.DataAll.edges = _edges
    //   this.$emit('updateDAG', this.DataAll, 'changeEdgeStatus')
    // },
    // 增加折线边
    addrectEdge: (value, that) => {
      let _DataAll = that.DataAll
      _DataAll.rectEdges.push({
        ...value.desp,
        id: _DataAll.rectEdges.length + 10
      })
      that.$emit('updateDAG', _DataAll, 'addrectEdge')
    },
    // 删除折线边
    delrectEdge({ id }) {
      console.log('id', id)
      let _rectEdges = []
      this.DataAll.rectEdges.forEach((item, i) => {
        if (item.id !== id) {
          _rectEdges.push(item)
        }
      })
      this.DataAll.rectEdges = _rectEdges
      this.$emit('updateDAG', this.DataAll, 'delrectEdge')
    },
    // 添加折线说明
    changeRectEdgeStatus({id, val, type}) {
      let _rectEdges = []
      this.DataAll.rectEdges.forEach((item, i) => {
        if (item.id !== id) {
          _rectEdges.push(item)
        } else {
          if (val) {
            item.rectEdgesText = val;
          }
          item.type = type;
          _rectEdges.push(item);
        }
      })
      this.DataAll.rectEdges = _rectEdges;
      this.$emit('updateDAG', this.DataAll, 'changeRectEdgeStatus')
    },
    moveNode(params) {
      // 移动点的位置
      const { id, pos_x, pos_y } = params
      let _DataAll = this.DataAll
      _DataAll.nodes.forEach((item, i) => {
        if (item.id === params.id) {
          item.pos_x = params.pos_x
          item.pos_y = params.pos_y
        }
      })
      this.$emit('updateDAG', _DataAll, 'moveNode')
    },
    multipleMoveNode(params) {
      // 同时移动多个点
      const { id, pos_x, pos_y } = params
      let x = 0
      let y = 0
      let _initMultiplePosition = this.initMultiplePosition
      let _DataAll = this.DataAll
      _initMultiplePosition.map(item => {
        if (item.id === id) {
          x = pos_x - item.pos_x
          y = pos_y - item.pos_y
        }
      })
      _initMultiplePosition.forEach(item => {
        if (this.multipleSelectNodes.paneNode.indexOf(item.id) > -1) {
          item.pos_x += x
          item.pos_y += y
        }
      })
      _DataAll.nodes = _initMultiplePosition
      this.$emit('updateDAG', _DataAll, 'moveNode')
    },
    addNode: (params) => {
      // 增加节点
      let _nodes = this.DataAll.nodes
      _nodes.push({
        ...params.desp,
        id: this.DataAll.nodes.length + 100,
        in_ports: [0],
        out_ports: [0]
      })
      this.$emit('updateDag', this.DataAll, 'addNode')
    },
    delNode({ model_id, id }) {
      this.choice.paneNode = [];
      // 删除节点
      let _rectEdges = [], _edges = [], 
        _nodes = [], _keepDeleNode = [], 
        _deleIds = [], _deleRectEdgeId,
        rectEdges = this.DataAll.rectEdges;
      if (rectEdges.length > 0) {
        rectEdges.forEach((item,index) => {
          if (item.dst_node_id === id || item.src_node_id === id) {
            if (item.dst_node_id === id) {
              _deleIds.push(String(index));
              _deleRectEdgeId = item.id
              _deleIds.push(item.src_node_id)
            } else {
              _deleIds.push(item.dst_node_id)
            }
          } else {
            _rectEdges.push(item)
          }
        })
        // for (let i=0;i<rectEdges.length;i++) {
        //   if (rectEdges[i].dst_node_id === id || rectEdges[i].src_node_id === id) {
        //     // 步骤设计器删除节点时，下级节点顶替被删节点的位置
        //     if (rectEdges[i].dst_node_id === id) {
        //       // 获取该删除步骤的入线下标，以做替换备用
        //       _deleIds.push(String(i));
        //       _deleRectEdgeId = rectEdges[i].id
        //       _deleIds.push(rectEdges[i].src_node_id)
        //     } else {
        //       _deleIds.push(rectEdges[i].dst_node_id)
        //     }
        //   } else {
        //     // 与被删步骤没关联的线保留下来
        //     _rectEdges.push(rectEdges[i])
        //   }
        // }
      }
      if (this.DataAll.edges.length > 0) {
        _edges.push(this.DataAll.edges.filter(item => item.dst_node_id !== id && item.src_node_id !== id)[0]);
      }
      this.DataAll.nodes.forEach(item => {
        if (item.id !== id) {
          _nodes.push(item)
        } else {
          if (item.Moving) {
            //删除步骤时，如果当前步骤启动了移动功能，先保存备用
            _keepDeleNode.push(item) 
          }
        }
      })
      // for (let i=0;i<this.DataAll.nodes.length;i++) {
      //   if (this.DataAll.nodes[i].id !== id) {
      //     _nodes.push(this.DataAll.nodes[i])
      //   } else {
      //     if (this.DataAll.nodes[i].Moving) {
      //       //删除步骤时，如果当前步骤启动了移动功能，先保存备用
      //       _keepDeleNode.push(this.DataAll.nodes[i]) 
      //     }
      //   }
      // }
      this.DataAll.rectEdges = _rectEdges;
      this.DataAll.edges = _edges;
      this.DataAll.nodes = _nodes;
      this.shrinSubAll(); // 收起选项步骤中的子步骤和人工步骤中的定时子步骤
      this.$emit('updateDAG', this.DataAll, 'delNode', _deleIds, _deleRectEdgeId, _keepDeleNode);
    },
    shrinkTimerSubAll(parentOverSteps) {
      if (parentOverSteps && parentOverSteps.length > 0) {
        for(let i=0;i<parentOverSteps.length;i++) {
          parentOverSteps[i].selected = 0;
          this.shrinkTimerSubAll(parentOverSteps[i].overdueSteps);
        }
      }
    },
    ShrinkSubStep(selectArr) {
      if (selectArr) {
        for(let i=0;i<selectArr.length;i++) {
          selectArr[i].selected = 0;
        }
      }
    },
    shrinChoiceSubAll(that) {
      if (that.choices && that.choices.length > 0) {
        for(let i=0;i<that.choices.length;i++) {
          this.ShrinkSubStep(that.choices[i].steps);
        }
      }
    },
    shrinSubAll() {
      for(let i=0;i<this.DataAll.nodes.length;i++) {
        if (this.DataAll.nodes[i].type === "choice-step") {
          this.shrinChoiceSubAll(this.DataAll.nodes[i]);
        }
        if (this.DataAll.nodes[i].type === "human-step") {
          this.shrinkTimerSubAll(this.DataAll.nodes[i].overdueSteps);
        }
      }
    },
    changeSize(action) {
      // 改变size
      let svgScale = typeof sessionStorage['svgScale'] === 'string' ? Number(sessionStorage['svgScale']) : 1
      let _width = window.innerWidth
      let _height = window.innerHeight
      switch (action) {
        case 'shrink':
          svgScale -= 0.05;
          this.svg_left = sessionStorage['svg_left'] = this.svg_left + _width * 0.01
          this.svg_top = sessionStorage['svg_top'] = this.svg_top + _height * 0.01

          break;
        case 'expend':
          svgScale += 0.05;
          this.svg_top = sessionStorage['svg_top'] = this.svg_top - _height * 0.01
          this.svg_left = sessionStorage['svg_left'] = this.svg_left - _width * 0.01
          break;
        case 'init':
          svgScale = 1
          break;
        default: () => ''
      }
      this.svg_scale = sessionStorage['svgScale'] = svgScale
    },
    changeNodeName(params) {
      // 改变节点名称
      // this.DataAll.nodes.forEach(item => {
      //   if (item.id === params.id) {
      //     item.name = params.name
      //   }
      // })
      this.DataAll.nodes.filter(item => item.id === params.id)[0].name = params.name;
      this.$emit('updateDAG', this.DataAll, 'changeNodeName')
    },
    changePort(action, id) {
      this.DataAll.nodes.forEach(item => {
        if (item.id === id) {
          // item.iconClassName = '';
          item[action] ? item[action].push(item[action].length) : item[action] = ['0']
        }
      })
      this.$emit('updateDAG', this.DataAll, 'changePort')
    },
    changeIcon(elIcon, id) {
      this.DataAll.nodes.forEach(item => {
        if (item.id === id) {
          // item.iconClassName = elIcon;
        }
      })
      this.$emit('updateDAG', this.DataAll, 'changeIcon');
    },
    editNodeDetails(value) {
      // 抛出待编辑内容
      this.$emit('editNodeDetails', value)
    },
    // 修改步骤的顺序位置
    // showMovePoint(DataAll) {
    //   this.$emit('updateDAG', DataAll, 'showMovePointIndex');
    // }
  },
  data() {
    return {
      sty: "",
      curve: false,
      panel: true,
      svg_scale: null,
      choice: {
        paneNode: [], // 选取的节点下标组
        index: -1,
        point: -1 // 选取的点数的下标
      },
      moving: {
        paneNode: [], // 选取的节点下标组
        index: -1
      },
      dragFrame: {
        // 节点模态
        posX: 9999,
        posY: 9999
      },
      dragLink: {
        // 连线模态
        fromX: 0,
        fromY: 100,
        toX: 0,
        toY: 0
      },
      currentEvent: null, // 当前执行的方法
      initPos: {
        // 初始化svg dom位置
        left: -1,
        top: -1
      },
      timeStamp: "",
      is_edit_area: {
        value: false,
        x: -9999,
        y: -9999
      }, // 是否在编辑节点
      is_icon_area: {
        value: false,
        x: -9999,
        y: -9999
      }, // 是否在修改图标
      is_select_area: {
        value: false,
        x: -9999,
        y: -9999
      }, // 是否在选择插入步骤
      simulate_sel_area: {
        // 框选节点
        left: 10,
        top: 50,
        width: 0,
        height: 0
      },
      svg_left: 0,
      svg_top: 0,
      svg_trans_init: {
        x: 0,
        y: 0
      },
      canMouseWheelUse: true,
      multipleSelectNodes: {},
      initMultiplePosition: {},
      lsStepAll: []
    };
  },
  components: {
    ArrowRect,
    EditArea,
    SelectArea,
    mainBody,
    mainStepBody,
    subStepBody
  }
};
</script>

<style  scoped>
.svgEach {
  position: relative;
}
/* 模态线样式 */
.connector {
  stroke: hsla(0, 0%, 50%, 0.6);
  stroke-width: 2px;
  fill: none;
}
.simulate_sel_area {
  /* border: 3px dashed blue; */
  position: absolute;
  cursor: crosshair;
}
</style>
