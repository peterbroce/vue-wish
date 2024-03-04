<template>
  <g v-if="this.DataAll" class="arrow-rect" 
    @mousemove="dragArrowCenter" 
    @mouseout="dragArrowCenterEnd" 
    @mouseup="dragArrowCenterEnd"
  >
    <path
    @mouseover="pathHover"
    @mouseout="pathOut"
    :class="checkLineClass(each)"
    :d="computedLink()"
    :style="each.style"
    @contextmenu="r_click($event)"
    ></path>

    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
      <g id="centerPoint"> 
        <circle v-show="!each.Move" 
          class="add-icon"
          @mousemove="addByNodeBus"
          @mouseout="cancelAddByNodeBus"
          @mousedown="touchArrowCenter($event, each)"
          r="8"
          style="stroke:transparent; stroke-width: 3; fill:transparent"
        />
        <image xlink:href="./icon/add.svg" x="-10" y="-10" height="20" width="20"></image>
      </g>
    </svg>
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
      <g id="centerPoints"> 
        <circle v-show="!each.Move" 
          class="drag-add-icon"
          @mousemove="addByNodeBus"
          @mouseout="cancelAddByNodeBus"
          @mousedown="touchArrowCenter($event, each)"
          r="10"
          style="stroke:transparent; stroke-width: 3; fill:transparent"
        />
        <image xlink:href="./icon/add-hover.svg" x="-10" y="-10" height="20" width="20"></image>
      </g>
    </svg>
    <use 
      
      :xlink:href="each.add ? '#centerPoints':'#centerPoint'"
      :x="computedCenterCx()" 
      :y="computedCenterCy()" 
      @mousemove="addByNodeBus(each, 'in')"
      @mouseout="addByNodeBus(each, 'out')"
      @mousedown="touchArrowCenter($event, each)">
    </use>
    <!-- <circle v-show="!each.Move" :class="this.dragBus ? 'drag-add-icon' : 'add-icon'"
      @mousemove="addByNodeBus"
      @mouseout="cancelAddByNodeBus"
      @mousedown="touchArrowCenter($event, each)"
      :cx="computedCenterCx()"
      :cy="computedCenterCy()" r="8"
      style="stroke:transparent; stroke-width: 4; fill:transparent"/> -->

    <!-- 启动位移时 -->
    <circle v-show="each.Move" :class="each.Move === 'enableMove' ? 'drag-move-icon' : 'drag-stand-icon'"
      @mousedown="changeStepPosition($event, each)"
      :cx="computedCenterCx()"
      :cy="computedCenterCy()" r="8"
      style="stroke:transparent; stroke-width: 3; fill:transparent"/>
  </g>
</template>
<script>

export default {
  props: {
    DataAll: {
      type: Object,
      default: () => {}
    },
    dragBus: {
      type: Boolean,
      default: () => false
    },
    keepBusValue: {
      type: Object,
      default: () => {}
    },
    choice: {
        type: Object,
        default: () => {}
    },
    each: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number
    }
  },
  computed: {
   svgScale() { return sessionStorage['svgScale'] || 1 }
  },
  data() {
    return {
      isHover: false,
      r_click_menu: false,
      menu_style: {
        position: "absolute",
        left: `${358}px`,
        top: `${264}px`
      },
      currentEvent: null,
      distanceY: 0,
      distanceX: 0,
      ownVoffset: 0,
      ownXoffset: 0,
    };
  },
  methods: {
    addByNodeBus(each, type) {
      // if (this.dragBus) {
      //   this.$emit("enableInsert", true);
      // }
      if (type === 'in') {
        this.$set(each, 'add', true);
      }
      if (type === 'out') {
        this.$delete(each, 'add');
      }
    },
    cancelAddByNodeBus() {
      if (this.dragBus) {
        this.$emit("enableInsert", false);
      }
    },
    insertByNodesBus(each) {
      if (this.dragBus || this.keepBusValue) {
        let node = { 
          value: this.keepBusValue.value,
          key: this.keepBusValue.type,
          iconClass: this.keepBusValue.iconClass
        };
        this.$emit("insertStepType", node, each.src_node_id);
      }
    },
    checkLineClass(each) {
      if (this.isHover || this.r_click_menu) {
        return 'connector-hl'
      } else {
        if (each.type) {
          if (each.type == 'active') {
            return 'connector-active'
          } else if (each.type == 'success') {
            return 'connector'
          }
        } else {
          return 'defaultArrow'
        }
      }
      // "(isHover || r_click_menu) ? 'connector-hl' : each.type && each.type == 'active' ? 'connector-active' : each.type && each.type == 'success' ? 'connector' : 'defaultArrow'"
    },
    pathHover() {
      // this.isHover = true;
    },
    pathOut() {
      // this.isHover = false;
    },
    changeStepPosition(e, each) {
      if (each.Move === "enableMove") {
        let insertStep, insertStepIndex, insertLineIndex, 
          movingStep, movingStepIndex, movingLineIndex,
          movingNextStep_dst_node_id,
          movingPreStep_src_node_id,
          insertPreStep_src_node_id;
        // 步骤预处理
        this.DataAll.nodes.forEach((step, index) => {
          if (step.Moving) {
            movingStepIndex = index;
            movingStep = step;
          }
          if (step.id === each.dst_node_id) {
            insertStepIndex = index;
            insertStep = step
          }
          step.Moving = false;
        });
        // 移动步骤位置
        this.DataAll.nodes.splice(
          insertStepIndex > movingStepIndex ? insertStepIndex-1 : insertStepIndex,
          0,this.DataAll.nodes.splice(movingStepIndex,1)[0]
        );
        // 连线预处理
        this.DataAll.rectEdges.forEach((line, index) => {
          line.Move = "";
          if (movingStep.id === line.src_node_id) {
            movingNextStep_dst_node_id = line.dst_node_id;
          }
          if (movingStep.id === line.dst_node_id) {
            movingPreStep_src_node_id = line.src_node_id;
            movingLineIndex = index;
          }
          if (insertStep.id === line.dst_node_id) {
            insertPreStep_src_node_id = line.src_node_id;
            insertLineIndex = index;
          }
        });
        this.DataAll.rectEdges[movingLineIndex + 1].src_node_id = movingPreStep_src_node_id;
        this.DataAll.rectEdges[movingLineIndex + 1].dst_node_id = movingNextStep_dst_node_id;
        this.DataAll.rectEdges[movingLineIndex].src_node_id = insertPreStep_src_node_id;
        this.DataAll.rectEdges[movingLineIndex].dst_node_id = movingStep.id;
        this.DataAll.rectEdges[insertLineIndex].src_node_id = movingStep.id;
        this.DataAll.rectEdges[insertLineIndex].dst_node_id = insertStep.id;
        // 移动接线位置
        this.DataAll.rectEdges.splice(
          insertLineIndex > movingLineIndex ? insertLineIndex-1 : insertLineIndex,
          0,this.DataAll.rectEdges.splice(movingLineIndex,1)[0]
        );
        // 取消开启移动状态
        this.$emit('selPaneNode', 99, 'prepareMove', movingStep.id);
      }
    },
    dragArrowCenterEnd(e) {
      // e.stopPropagation();
      e.preventDefault(); 
      if (this.currentEvent === "dragArrowCenter") {
        this.currentEvent = null;
        this.distanceY = 0;
        this.distanceX = 0;
      }
    },
    touchArrowCenter(e, each) {
      const x = e.offsetX;
      const y = e.offsetY;
      this.$emit("insertNodes", each.src_node_id, x, y, e);

      // 拖动线
      // this.currentEvent = "dragArrowCenter";
      // if (this.isVertical()) {
      //   this.distanceY = e.pageY;
      //   this.ownVoffset = this.each.VOffset || 0
      // } else {
      //   this.distanceX = e.pageX;
      //   this.ownXoffset = this.each.XOffset || 0
      // }
    },
    dragArrowCenter(e) {
      if (this.currentEvent === "dragArrowCenter") {
        let _DataAll;
        if (this.isVertical()) {
          const _Y = e.pageY;
          const VOffset = _Y - this.distanceY + this.ownVoffset;
          // console.log("VOffset->", VOffset)
          _DataAll = JSON.parse(JSON.stringify(this.DataAll))
          _DataAll.rectEdges[this.index].VOffset = VOffset
        } else {
          const _X = e.pageX;
          const XOffset = _X - this.distanceX + this.ownXoffset;
          // console.log("XOffset->", XOffset)
          _DataAll = JSON.parse(JSON.stringify(this.DataAll))
          _DataAll.rectEdges[this.index].XOffset = XOffset
        }
        this.$emit('updateData', _DataAll, "updateVoffset")
      }
    },
    click_menu_cover(e) {
      // 点击遮罩
      this.r_click_menu = false;
      e.stopPropagation();
      e.preventDefault();
      e.cancelBubble = true;
    },
    delrectEdge() { // 删除此条连线
      let params = {
        id: this.each.id
      }
      this.$emit('delrectEdge', params)
    },
    changeRectEdgeStatus(type, val) { // 添加连线说明
      let params = {
        id: this.each.id,
        val,
        type
      }
      this.$emit('changeRectEdgeStatus', params)
    },
    r_click(e) {
      // const x = e.offsetX;
      // const y = e.offsetY;
      // this.menu_style = Object.assign({}, this.menu_style, { left: `${(x - (sessionStorage['svg_left'] || 0)) / this.svgScale}px`, top: `${(y - (sessionStorage['svg_top'] || 0)) / this.svgScale}px` })
      // this.r_click_menu = true;
      e.stopPropagation();
      e.preventDefault();
      // e.cancelBubble = true;
    },
    computedLink() {
      // 计算起始点坐标
      let f_X, f_Y, t_X, t_Y
      if (!this.DataAll) {
        return `M 0 0 T 0 0`;
      } else {
        const {
          dst_input_idx, // 目标
          dst_node_id, // 目标id
          src_node_id, // 来源id
          src_output_idx, // 来源
          VOffset = 0, // 纵向位移量
          XOffset = 0 // 横向位移量
        } = this.each;
        const f_Pos = this.DataAll.nodes.find(item => item.id === src_node_id);
        const t_Pos = this.DataAll.nodes.find(item => item.id === dst_node_id);
        let f_pane = this.checkSty(f_Pos);
        let t_pane = this.checkSty(t_Pos);
        if (!f_Pos || !t_Pos) { alert(src_node_id) }
        if (this.isVertical()) {
          // f_X = f_Pos.pos_x + (f_pane.X / (f_Pos.out_ports.length + 1)) * (src_output_idx + 1) + f_pane.H_L_FX;
          f_X = f_Pos.pos_x + (f_pane.X / 2) * (src_output_idx + 1) + f_pane.H_L_FX;
          f_Y = f_Pos.pos_y + f_pane.Y
          // t_X = t_Pos.pos_x + (t_pane.X / (t_Pos.in_ports.length + 1)) * (dst_input_idx + 1) + t_pane.H_L_TX;
          t_X = t_Pos.pos_x + (t_pane.X / 2) * (dst_input_idx + 1) + t_pane.H_L_TX;
          t_Y = t_Pos.pos_y + t_pane.H_L_TY;
          // 上面逻辑通过父子节点位置计算起始点
          return `M ${f_X} ${f_Y} V ${((f_Y + t_Y) / 2 + VOffset)} H ${t_X} T ${t_X} ${t_Y}`;
        } else {
          f_X = f_Pos.pos_x + f_pane.X
          f_Y = f_Pos.pos_y + (f_pane.Y / 2)
          t_X = t_Pos.pos_x + t_pane.W_L_X
          t_Y = t_Pos.pos_y + (t_pane.Y / 2)
          return `M ${f_X} ${f_Y} H ${((f_X + t_X) / 2 + XOffset)} V ${t_Y} T ${t_X} ${t_Y}`;
        }
      }
    },
    computedCx() {
      const { src_node_id, src_output_idx } = this.each;
      const f_Pos = this.DataAll.nodes.find(item => item.id === src_node_id);
      let f_X = 0;
      let f_pane = this.checkSty(f_Pos);
      if (this.isVertical()) {
        // f_X = f_Pos.pos_x + ((f_pane.X + f_pane.H_L_X) / (f_Pos.out_ports.length + 1)) * (src_output_idx + 1) ;
        f_X = f_Pos.pos_x + ((f_pane.X + f_pane.H_L_X) / 2) * (src_output_idx + 1) ;
      } else {
        f_X = f_Pos.pos_x + f_pane.X
      }
      return `${f_X}`;
    },
    computedCy() {
      let f_Y = 0
      const { src_node_id } = this.each;
      const f_Pos = this.DataAll.nodes.find(item => item.id === src_node_id);
      let f_pane = this.checkSty(f_Pos);
      if (this.isVertical()) {
        f_Y = f_Pos.pos_y + f_pane.Y - f_pane.H_L_Y;
      } else {
        f_Y = f_Pos.pos_y + f_pane.Y / 2;
      }
      return `${f_Y}`;
    },
    computedCenterCy() {
      let f_X, f_Y, t_X, t_Y;
      const VConstantHeight = 15;
      const {
        dst_input_idx, // 目标
        dst_node_id, // 目标id
        src_node_id, // 来源id
        src_output_idx, // 来源
        VOffset = 0, // 纵向位移量
      } = this.each;
      const f_Pos = this.DataAll.nodes.find(item => item.id === src_node_id);
      const t_Pos = this.DataAll.nodes.find(item => item.id === dst_node_id);
      if (this.isVertical()) {
        f_Y = f_Pos.pos_y;
        t_Y = t_Pos.pos_y;
        if (f_Pos.type) {
          // 展开和收起的步骤高度不同时，可通过调整f_Y值来影响中点位置
          if (f_Pos.type === "choice-step") {
            f_Y = f_Y + (f_Pos.selected === 1 ? 590 : 40); // 高度展开为620px时，收起为68px时
          } else if (f_Pos.type === "human-step") {
            if (f_Pos.hasOverdueSteps) {
              // f_Y = f_Y + (f_Pos.selected === 1 ? 618 : 340); // 高度展开为648px，收起为368px时
              f_Y = f_Y + (f_Pos.selected === 1 ? 818 : 540); // 高度展开为848px，收起为568px时
            } else {
              // f_Y = f_Y + (f_Pos.selected === 1 ? 318 : 40); // 高度展开为368px，收起为68px时
              f_Y = f_Y + (f_Pos.selected === 1 ? 476 : 40); // 高度展开为368px，收起为68px时
            }
          } else {
            // f_Y = f_Y + (f_Pos.selected === 1 ? 318 : 40); // 高度展开为348px，收起为68px时
            f_Y = f_Y + (f_Pos.selected === 1 ? 476 : 40); // 高度展开为348px，收起为68px时
          }
        } else {
          f_Y = f_Y + (f_Pos.selected === 1 ? 208 : 3);
        }
        return `${(f_Y + t_Y) / 2 + VOffset + VConstantHeight}`;
      }
    },
    computedCenterCx() {
      let NODE_WIDTH_CONSTANT = 90; // 节点固定宽度
      let NODE_HEIGHT_CONSTANT = 15; // 节点固定高度
      let f_X, f_Y, t_X, t_Y
      const {
        dst_input_idx, // 目标
        dst_node_id, // 目标id7
        src_node_id, // 来源id
        src_output_idx, // 来源
        VOffset = 0, // 纵向位移量
      } = this.each;
      const f_Pos = this.DataAll.nodes.find(item => item.id === src_node_id);
      const t_Pos = this.DataAll.nodes.find(item => item.id === dst_node_id);
      const f_pane = this.checkSty(f_Pos);
      const t_pane = this.checkSty(t_Pos);
      if (this.isVertical()) {
        NODE_WIDTH_CONSTANT = (f_pane.X / 2 + t_pane.X / 2) / 2;
        f_X = f_Pos.pos_x;
        t_X = t_Pos.pos_x;
        return `${f_X + NODE_WIDTH_CONSTANT + ((t_X - f_X) / 2)}`;
      } else {
        NODE_HEIGHT_CONSTANT = (f_pane.Y / 2 + t_pane.Y / 2) / 2;
        f_Y = f_Pos.pos_y;
        t_Y = t_Pos.pos_y;
        return `${f_X + NODE_HEIGHT_CONSTANT + ((t_Y - f_Y) / 2)}`;
      }
    },
    checkclickPoint() {
      return this.dragBus ? "#centerPoint" : "#centerPointHover"
    },
    isVertical() {
      let GlobalConfig = { isVertical: true }
      let _GlobalConfig = localStorage.getItem('GlobalConfig')
      if (_GlobalConfig && _GlobalConfig.length > 0) {
        GlobalConfig = Object.assign(GlobalConfig, JSON.parse(_GlobalConfig))
      }
      return GlobalConfig.isVertical
    },
    checkSty(node) {
      let InstanceX = 598, InstanceY = 68;
      if (node.type === "human-step" && node.hasOverdueSteps) {
        InstanceY = node.selected ? 648 : 368;
      } 
      if (node.type !== "choice-step" && !node.hasOverdueSteps) {
        // if (node.id !== 100 && node.id !== 101 && document.querySelector('.'+node.id)) {
        //   console.log('human-step窗口高度:', document.querySelector('.'+node.id).scrollHeight);
        //   let stepHeight = document.querySelector('.'+node.id).scrollHeight;
        //   InstanceY = node.selected ? 148 + stepHeight : 68;
        // } else {
          InstanceY = node.selected ? 348 : 68;
        // }
      }
      if (node.type === "choice-step") {
        InstanceX = 1299; InstanceY = node.selected ? 620 : 68;
      }
      if (!node.type) {
        InstanceX = node.selected ? 598 : 298;
        InstanceY = node.selected ? 238 : 35;
        // InstanceY = node.selected ? node.hasVariablesmapping ? 468 : 238 : 35;
      }
      return {X:InstanceX, Y:InstanceY, W_A_X:-3, W_A_Y:1, W_L_X:-5, W_L_Y:0, H_A_X:0, H_A_Y:-3, H_L_FX:0, H_L_FY:0, H_L_TX:0, H_L_TY:0};
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.edgeText) {
        // console.log(this.$refs.edgeText.style.width)
      }
    })
  },
};
</script>

<style scoped>
  .add-icon {
    fill: #fff !important;
    /* stroke: #b9afaf !important; */
    stroke: #C0C6D6 !important;
    stroke-width: 3 !important;
    cursor: pointer;
  }
  .add-icon:hover {
    fill: #fff !important;
    stroke: #5F8DD3 !important;
    stroke-width: 8 !important;
    cursor: pointer;
  }
  .drag-add-icon {
    fill: #fff !important;
    stroke: #5F8DD3 !important;
    stroke-width: 3 !important;
    cursor: pointer;
  }
  .drag-add-icon:hover {
    fill: #72A83F !important;
    stroke: #72A83F !important;
    stroke-width: 28 !important;
    cursor: pointer;
  }
  .drag-move-icon {
    fill: #B7D897 !important;
    stroke: #72A83F !important;
    stroke-width: 3 !important;
    transform: stroke 0.8s;
    cursor: pointer;
  }
  .drag-move-icon:hover {
    /* fill: #1ad309 !important; */
    fill: #72A83F !important;
    stroke: #72A83F !important;
    stroke-width: 3 !important;
    cursor: pointer;
  }
  .drag-stand-icon{
    fill: #fff !important;
    stroke: #EEEEEE !important;
    stroke-width: 5 !important;
    transform: stroke 0.8s;
    cursor: not-allowed;
  }
  .arrow-rect {
    padding: 20px;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .arrow-rect::after {
    content: ".";
    font-size: 0;
    position: absolute;
    left: -50px;
    right: -50px;
    top: -50;
    height: -50px;
  }
  .only-watch-el {
    pointer-events: none;
  }
  .connector {
    stroke: #5093E1;
    stroke-width: 2px;
    /* fill: none; */
    fill: transparent;
    cursor: pointer;
    stroke-dasharray: 5px;
    stroke-dashoffset: 1000px;
    animation: grown 40s infinite linear;
    /* stroke: #00c0ff;
    stroke-width: 2px;
    fill: transparent;
    cursor: pointer;
    stroke-dasharray: 100%;
    animation: line_success 2s; */
  }
  @keyframes line_success {
    0% {
      stroke-dashoffset: 100%;
    }
    100% {
      stroke-dashoffset: 0%;
    }
  }
  .connector-active {
    stroke: rgba(91, 230, 20, 0.6);
    /* fill: none; */
    fill: transparent;
    cursor: pointer;
    stroke-width: 2px;
    stroke-dasharray: 5px;
    stroke-dashoffset: 1000px;
    animation: grown 40s infinite linear;
  }
  .defaultArrow {
    /* stroke: #00c0ff; */
    /* stroke: #5093E1; */
    /* stroke: #999999; */
    stroke: #c0c6d6;
    stroke-width: 4px;
    /* fill: none; */
    fill: transparent;
    cursor: pointer;
    /* stroke-dasharray: 5px; */
    stroke-dashoffset: 0;
    animation: none;
  }
  @keyframes grown {
    to{
      stroke-dashoffset: 0px;
    }
  }
  .menu_cover {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .connector-hl {
    stroke: #5093E1;
    stroke-width: 6px;
    /* fill: none; */
    fill: transparent;
    cursor: pointer;
  }
  .menu_contain {
    z-index: 1;
    width: 180px;
    border: 1px solid rgba(1, 1, 1, 0.3);
    background: #ffffff;
    border-radius: 5px;
    padding: 3px;
  }
  .meun_contain  span {
    width: 100%;
    display: inline-block;
  }
  .meun_contain  p {
    width: 100%;
    display: inline-block;
  }
  .menu_contain  span:hover {
      background-color: rgba(40,157,233, .3);
      cursor: pointer;
      /* cursor: none; */
  }
  .menu_contain  p:hover {
      background-color: rgba(40,157,233, .3);
      cursor: pointer;
      /* cursor: none; */
  }
</style>
