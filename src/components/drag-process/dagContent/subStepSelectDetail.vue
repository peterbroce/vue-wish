<template>
  <div class="select_body">
    <!-- <div class="sub_flow_body" :class="item.id"> -->
    <div :class="showFull ? 'full_sub_flow_body' : 'sub_flow_body'">
        <!-- 左右移动按钮 -->
          <div class="left_move_btn left_move_icon" style="left:-8px" v-show="showLeftMoveBtn()" @click="moveIndex(-1)" title="向左切换"></div>
          <div class="right_move_btn right_move_icon" style="right:-8px" v-show="showRightMoveBtn()" @click="moveIndex(1)" title="向右切换"></div>
        <!-- 添加新选择 -->
          <div class="add_btn_bg"></div>
          <div class="add_btn" @click="clickAddSelect($event, item)" title="添加新选项"></div>
        <!-- 选项修改弹窗 -->
          <el-dialog width="1000px" top="38px" :visible.sync="dialogFormVisible" :append-to-body="true" :center="false">
              <div slot="title" class="el-header-title"><div class="title-content">编辑选项</div></div>
              <div class="edit_select_form">
                <el-form size="mini" label-position="left" label-width="188px" style="margin:0 28px">
                    <el-form-item label="名称">
                      <el-input v-model="name" maxlength="50" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="默认 flow">
                      <el-checkbox v-model="flow"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="条件类型">
                        <el-button-group>
                          <el-button class="condition_btn" :class="conditionBtn === 1 ? 'conditionBtn_selected': ''" @click="changeConditionBtn(1)">无条件</el-button>
                          <el-button class="condition_btn" :class="conditionBtn === 2 ? 'conditionBtn_selected': ''" @click="changeConditionBtn(2)">简单</el-button>
                          <el-button class="condition_btn" :class="conditionBtn === 3 ? 'conditionBtn_selected': ''" @click="changeConditionBtn(3)">高级</el-button>
                          <el-button class="condition_btn" :class="conditionBtn === 4 ? 'conditionBtn_selected': ''" @click="changeConditionBtn(4)">表达式</el-button>
                        </el-button-group>
                    </el-form-item>
                <!-- 简单 -->
                    <div v-show="conditionBtn === 2">
                      <el-form-item label="依赖于">
                          <el-button-group >
                            <el-button class="depend_on_btn" :class="dependOnBtn === 1 ? 'depend_on_btn_selected': ''" @click="changeDependOnBtn(1)">表单字段</el-button>
                            <el-button class="depend_on_btn" :class="dependOnBtn === 2 ? 'depend_on_btn_selected': ''" @click="changeDependOnBtn(2)">表单结果</el-button>
                            <el-button class="depend_on_btn" :class="dependOnBtn === 3 ? 'depend_on_btn_selected': ''" @click="changeDependOnBtn(3)">变量</el-button>
                            <!-- <el-button class="depend_on_btn" :type="dependOnBtn === 1 ? 'info' : 'primary'" @click="changeDependOnBtn(1)">表单字段</el-button>
                            <el-button class="depend_on_btn" :type="dependOnBtn === 2 ? 'info' : 'primary'" @click="changeDependOnBtn(2)">表单结果</el-button>
                            <el-button class="depend_on_btn" :type="dependOnBtn === 3 ? 'info' : 'primary'" @click="changeDependOnBtn(3)">变量</el-button> -->
                          </el-button-group>
                      </el-form-item>
                      <el-row :gutter="20" class="split_line">
                          <el-col :span="8">
                            <el-select 
                              v-model="dependType"
                              style="width:288px" 
                              size="mini"
                              :placeholder="placeholderText(dependOnBtn-1)" 
                              popper-class="customize_select"
                            >
                              <el-option
                                class="item_select"
                                v-for="item in dependTypeOps"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="8">
                            <el-select 
                              v-model="calculateType" 
                              style="width:288px" 
                              size="mini" 
                              placeholder="选择运算符" 
                              popper-class="customize_select"
                            >
                              <el-option
                                class="item_select"
                                v-for="item in dependOnBtn !== 2 ? calculateOps : calculateOp"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="8">
                            <el-select 
                              v-model="resultType" 
                              style="width:288px" 
                              size="mini" 
                              placeholder="选择结果" 
                              v-show="dependOnBtn === 2" 
                              popper-class="customize_select"
                            >
                              <el-option
                                class="item_select"
                                v-for="item in resultOps"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input v-model="otherValue" size="mini" v-show="dependOnBtn !== 2"></el-input>
                          </el-col>
                      </el-row>
                    </div>
                <!-- 高级 -->
                    <div v-show="conditionBtn === 3" class="split_line">
                      <el-row :gutter="24">
                        <!-- 条件表格 -->
                        <el-col :span="12">
                            <el-table 
                              class="full_width border_color"
                              style="cursor:pointer"
                              height="200"
                              max-height="200"
                              fit border size="samll"
                              :data="tableData" 
                              :stripe="true"
                              :highlight-current-row="true"
                              :row-class-name="tableRowName" 
                              @row-click="rowClick" 
                              :row-style="{height:'30px',fontSize:'13px',color:'#333'}"
                              :cell-style="{padding:'0px',borderTop:'0',borderBottom:'0',borderColor:'#D4D4D4'}"
                              :header-cell-style="{
                                  backgroundColor:'#fff',
                                  backgroundImage:'-webkit-linear-gradient(top,#fff,#eee)',
                                  fontSize:'13px',
                                  borderColor:'#D4D4D4',
                                  color:'#333333', 
                                  height:'28px', 
                                  padding:'0px'
                              }"
                            >
                                <template slot="empty"></template>
                                <el-table-column prop="date" min-width="20%" label="依赖于" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="name" min-width="20%" label="如果其" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="address" min-width="20%" label="值" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="and" min-width="40%" label="下一条件运算符" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                            <div class="height_btn">
                              <el-button-group style="margin-right: 8px">
                                <el-button type="primary" icon="el-icon-top" 
                                  :class="!this.tableData.length && !this.selectTabIndx ? 'dis_add_reduce_btn' : 'add_reduce_btn'" 
                                  :disabled="!this.tableData.length && !this.selectTabIndx"
                                  @click="moveTableList('up')" title="上移"
                                ></el-button>
                                <el-button type="primary" icon="el-icon-bottom" 
                                  :class="!this.tableData.length && !this.selectTabIndx ? 'dis_add_reduce_btn' : 'add_reduce_btn'" 
                                  :disabled="!this.tableData.length && !this.selectTabIndx"
                                  @click="moveTableList('down')" title="下移"
                                ></el-button>
                              </el-button-group>
                              <el-button-group>
                                <el-button type="primary" icon="el-icon-plus" 
                                  class="add_reduce_btn"
                                  @click="changeTableList('add')" title="增加"
                                ></el-button>
                                <el-button type="primary" icon="el-icon-minus" 
                                  :class="!this.tableData.length && !this.selectTabIndx ? 'dis_add_reduce_btn' : 'add_reduce_btn'"
                                  :disabled="!this.tableData.length && !this.selectTabIndx"
                                  @click="changeTableList('reduce')" title="删除"
                                ></el-button>
                              </el-button-group>
                            </div>
                        </el-col>
                        <!-- 条件表单 -->
                        <el-col :span="12">
                          无选中的属性
                        </el-col>
                      </el-row>
                    </div>
                <!-- 表达式 -->
                    <div v-show="conditionBtn === 4" class="split_line">
                      <el-form-item label="条件表达式">
                        <el-input v-model="conditionExpre" type="textarea"></el-input>
                      </el-form-item>
                    </div>
                </el-form>
              </div>
              <div slot="footer" class="dialog_footer">
                  <el-button size="small" type="primary" class="add_reduce_btn submit_btn" @click="dialogFormVisible = false">取 消</el-button>
                  <el-button size="small" type="primary" class="add_reduce_btn submit_btn" @click="submitChangeName">保 存</el-button>
              </div>
          </el-dialog>
        <!-- 选项删除弹窗 -->
          <el-dialog width="600px" top="38px" :visible.sync="dialogDeletVisible" :append-to-body="true" :center="false">
              <div slot="title" class="el-header-title"><div class="title-content">是/否问题。</div></div>
              <div class="dele_select_form">确定要删除所选项？</div>
              <div slot="footer" class="dialog_footer">
                  <el-button class="add_reduce_btn submit_btn" size="small" type="primary" @click="deletSelect()">确定删除</el-button>
                  <el-button class="add_reduce_btn submit_btn" size="small" type="primary" @click="dialogDeletVisible = false">取消</el-button>
              </div>
          </el-dialog>
        <!-- 左侧选择 -->
          <i class="left_sub_flow_select">
                <div class="start_node">
                  <div class="click_mode" @click="openStartNodeDialog('leftChange')">
                    <i class="text_name" :title="item.choices[currentIndex].name">
                      {{item.choices[currentIndex].name}}
                    </i>
                    <span class="select_bind_num">{{bindNum(currentIndex)}}</span>
                  </div>
                    <i 
                      v-show="item.choices.length>2" 
                      class="delet_select close-icon" 
                      @click="deletSelects(currentIndex)" 
                      title="删除这个选项"
                    ></i>
                </div>
                <div style="height:32px">
                    <div class="connect_line"></div>
                    <div class="select_line_btn">
                        <div class="add_btn_bg"></div>
                        <div class="add_btn" @mousedown="clickAddStep($event, 0, currentIndex)"></div>
                    </div>
                </div>
                <!-- 下一步 -->
                  <div class="dagContent" v-for="(i, index) in item.choices[currentIndex].steps" :key="i.id+'_'+index" style="height:auto">
                    <div :class="item.id+i.id">
                        <div :class="checkStatus(i)" @mouseover="overStepBody(i)" @mouseout="outStepBody(i)">
                            <div class="step_header" @click="selNode($event, i, index, currentIndex, selectStepId)">
                              <div class="title">
                                <i class="icon icon-bg" :class="checkSelectIcon(i)"></i>
                                <!-- <input type="text" class="name" v-model="i.name" @click="clickInput($event)"> -->
                                <div class="name" :title="i.name">{{i.name}}</div>
                                <div v-show="i.overing" class="icon-bg sort-icon" @click="prepareMove($event, i)" title="移动这个步骤"></div>
                                <div v-show="i.overing" class="icon-bg close-icon" @click="delEdges($event, i, index, currentIndex, selectStepId)" title="删除这个步骤"></div>
                              </div>
                              <div class="sub_title">
                                <i class="icon icon-bg" :class="checkIcon(i)"></i>
                                <i class="name" :title="titleText(i)">{{titleText(i)}}</i>
                              </div>
                            </div>
                            <div :class="i.type==='human-step'?'step_form border_bottom':'step_form'" v-show="i.selected">
                              <sub-step-detail style="margin:8px;" :item="i" :formDetail="formDetail" :subStepNodes="subStepNodes" :lsStepAll.sync="lsStepAll"></sub-step-detail>
                            </div>
                            <div :class="i.type==='human-step'?'step_form border_bottom':'step_form'" v-show="i.hasOverdueSteps">
                              <overDueSteps :item="i.overdueSteps" :parentStep="i" :formDetail="formDetail" :lsStepAll.sync="lsStepAll" :subStepNodes="subStepNodes"></overDueSteps>
                            </div>
                        </div>

                        <div v-show="i.type !== 'end-process-step' && i.type !== 'goto-step'" style="height:32px">
                            <div class="connect_line"></div>
                            <div class="select_line_btn">
                                <div class="add_btn_bg"></div>
                                <div class="add_btn" @mousedown="clickAddStep($event, index+1, currentIndex)"></div>
                            </div>
                        </div>
                    </div>
                </div>
          </i>
        <!-- 右侧选择 -->
          <i class="right_sub_flow_select">
                <div class="start_node">
                  <div class="click_mode" @click="openStartNodeDialog('rightChange')">
                    <i class="text_name" :title="item.choices[currentIndex+1].name">
                      {{item.choices[currentIndex+1].name}}
                    </i>
                    <span class="select_bind_num">{{bindNum(currentIndex+1)}}</span>
                  </div>
                    <i 
                      v-show="item.choices.length>2" 
                      class="delet_select close-icon" 
                      @click="deletSelects(currentIndex+1)" 
                      title="删除这个选项"
                    ></i>
                </div>
                <div style="height:32px">
                    <div class="connect_line"></div>
                    <div class="select_line_btn">
                        <div class="add_btn_bg"></div>
                        <div class="add_btn" @mousedown="clickAddStep($event, 0, currentIndex+1)"></div>
                    </div>
                </div>
                <!-- 下一步 -->
                  <div class="dagContent" v-for="(i, index) in item.choices[currentIndex+1].steps" :key="i.id+'_'+index" style="height:auto">
                    <div :class="item.id+i.id">
                        <div :class="checkStatus(i)" @mouseover="overStepBody(i)" @mouseout="outStepBody(i)">
                            <div class="step_header" @click="selNode($event, i, index, currentIndex+1, selectStepId)">
                              <div class="title">
                                <i class="icon icon-bg" :class="checkSelectIcon(i)"></i>
                                <!-- <strong class="name" @click="selNode(item)">{{item.name}}</strong> -->
                                <!-- <input type="text" class="name" v-model="i.name" @click="clickInput($event)"> -->
                                <div class="name" :title="i.name">{{i.name}}</div>
                                <div v-show="i.overing" class="icon-bg sort-icon" @click="prepareMove($event, i)" title="移动这个步骤"></div>
                                <div v-show="i.overing" class="icon-bg close-icon" @click="delEdges($event, i, index, currentIndex+1, selectStepId)" title="删除这个步骤"></div>
                              </div>
                              <div class="sub_title">
                                <i class="icon icon-bg" :class="checkIcon(i)"></i>
                                <i class="name" :title="titleText(i)">{{titleText(i)}}</i>
                              </div>
                            </div>
                            <div :class="i.type==='human-step'?'step_form border_bottom':'step_form'" v-show="i.selected">
                              <sub-step-detail style="margin:8px;" :item="i" :formDetail="formDetail" :subStepNodes="subStepNodes" :lsStepAll.sync="lsStepAll"></sub-step-detail>
                            </div>
                            <div :class="i.type==='human-step'?'step_form border_bottom':'step_form'" v-show="i.hasOverdueSteps">
                              <overDueSteps :item="i.overdueSteps" :parentStep="i" :lsStepAll.sync="lsStepAll" :subStepNodes="subStepNodes"></overDueSteps>
                            </div>
                        </div>
                        <div v-show="i.type !== 'end-process-step' && i.type !== 'goto-step'" style="height:32px">
                            <div class="connect_line"></div>
                            <div class="select_line_btn">
                                <div class="add_btn_bg"></div>
                                <div class="add_btn" @mousedown="clickAddStep($event, index+1, currentIndex+1)"></div>
                            </div>
                        </div>
                    </div>
                </div>
          </i>
    </div>
  </div>
</template>

<script>
  import "./el-styl.css";
  import subStepDetail from "./subStepDetail";
  import overDueSteps from "./stepFormTabDetl/overDueSteps";
  import util from "@/js/util";

  let { setThemeColor } = util;
  export default {
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      formDetail: {
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
      },
      choices: {
        type: Array,
        default: () => []
      },
      showFull: {
        type: Boolean
      }
    },
    data() {
      return {
        $_index: {},
        themeColor: {},
        stepSelectNode: {},
        selectStepId: null,
        currentIndex: 0,
        //弹窗变量
        dialogFormVisible: false,
        dialogDeletVisible: false,
        name: "",
        editIndex: null,
        flow: false,
        conditionBtn: 1,
        dependOnBtn: 1,
        prepareDeletSelectIndex: null,
        // 简单
        dependType: "",
        dependTypeOps: [],
        calculateType: "选择运算符",
        calculateOps: [
          { value: '1', label: '等于' },
          { value: '2', label: '不等于' },
          { value: '3', label: '空' },
          { value: '4', label: '不为空' }
        ],
        calculateOp: [
          { value: '1', label: '等于' },
          { value: '2', label: '不等于' }
        ],
        resultType: "选择结果",
        resultOps: [{ value: '0', label: '无结果可用' }],
        otherValue: "",
        // 高级
        tableData: [{
          date: 'label1',
          name: '等于',
          address: 'empty',
          and: 'AND'
        }, {
          date: 'label1',
          name: '不等于',
          address: 'empty',
          and: 'OR'
        }],
        selectTabIndx: null,
        //条件表达式
        conditionExpre: ""
      }
    },
    methods: {
      //选项步骤事件分发器
      despatchEvent(type, options) {
        // 点击定时任务中的转至步骤时更新步骤列表
        this.$_index.runChoicesStepEvent(type, options);
      },
      checkStatus(item) {
        return item.selected === 1 ? 'open_sub_next_node' : 'sub_next_node'
      },
      async overStepBody(i) {
        this.$set(i, "overing", 1);
      },
      async outStepBody(i) {
        this.$delete(i, "overing");
      },
      // 收起当前选择的所有步骤
      ShrinkAllSubStep(selectArr) {
        if (selectArr) {
          // selectArr.forEach(i => {
          //   i.selected = 0;
          // });
          for(let i=0;i<selectArr.length;i++) {
            selectArr[i].selected = 0;
          }
        }
      },
      // 遍历所有选择
      shrinkAll(that) {
        // that.item.choices.forEach(i => {
        //   that.ShrinkAllSubStep(i.steps);
        // });
        for(let i=0;i<that.item.choices.length;i++) {
          that.ShrinkAllSubStep(that.item.choices[i].steps);
        }
      },
      // 点击步骤header时,触发选择
      selNode(e, subStepItem, subStepIndex, selectIndex, id) {
        let that = this;
        let currentSel = this.item.choices[selectIndex].steps[subStepIndex].selected;
        // 点击已展开的步骤，则全部收起
        if (currentSel > 0) {
          this.shrinkAll(that);
          return;
        }
        // 点击当前步骤时，先把其他选项步骤都收起
        this.shrinkAll(that);

        let ops = {subStepItem, subStepIndex, selectIndex, id};
        this.despatchEvent("selSubStep", ops);
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
      prepareMove(e, item) {
        // if (this.moving.paneNode && item.id === this.moving.paneNode[0]) {
        //   this.$emit('selPaneNode', 99, 'prepareMove');
        // } else {
        //   this.$emit('selPaneNode', item.id, 'prepareMove');
        // }
        e.cancelBubble=true;
      },
      delEdges(e, subStepItem, subStepIndex, selectIndex, id) {
        let ops = {subStepItem, subStepIndex, selectIndex, id};
        this.despatchEvent("deletSubStep", ops);
        e.cancelBubble=true;
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
          return item.recipient.type === 'users' ? `发送电子邮件至 ${item.recipient.users.length || '0'} 个收件人` : "发送电子邮件至流程发起者";
        } else if (item.type === "subprocess-step") {
          return item.subProcessDefinition.name ? `子流程 ${item.subProcessDefinition.name}` : "无选中的子流程";
        } else {
          return item.name;
        }
      },
      placeholderText(i) {
        let text = ["字段","表单","变量"];
        this.dependType = `选择${text[i]}`;
        return `选择${text[i]}`;
      },
      changeConditionBtn(int) {
        this.conditionBtn = int;
      },
      changeDependOnBtn(int) {
        this.dependOnBtn = int;
      },
      tableRowName({row, rowIndex}) {
        row.row_index = rowIndex;
      },
      rowClick(row, column, event) {
        if (this.selectTabIndx === row.row_index) {
          this.selectTabIndx = null;
        } else {
          this.selectTabIndx = row.row_index;
        }
      },
      moveTableList(type) {
        if (typeof this.selectTabIndx !== "number") return;
        if (type === "up" && this.selectTabIndx === 0) return;
        if (type !== "up" && this.selectTabIndx === this.tableData.length -1) return;

        let tableData = JSON.parse(JSON.stringify(this.tableData)),
          replaceIndex = this.selectTabIndx + (type === "up" ? -1 : 1),
          replaceItem = JSON.parse(JSON.stringify(tableData[replaceIndex]));

        tableData[replaceIndex] =  JSON.parse(JSON.stringify(tableData[this.selectTabIndx]));
        tableData[this.selectTabIndx] = replaceItem;

        this.tableData = tableData;
        this.selectTabIndx = null;
      },
      changeTableList(type) {
        if (type === "add") {
          const obj = {
            date: '',
            name: '',
            address: '',
            and: ''
          }
          this.tableData.push(obj);
        } else {
          this.tableData.splice(this.selectTabIndx,1);
        }
      },
      showLeftMoveBtn() {
        return this.currentIndex > 0;
      },
      showRightMoveBtn() {
        let len = this.item.choices.length;
        return len > 2 && this.currentIndex < len - 2 ;
      },
      moveIndex(int) {
        let that = this;
        // 回到选项顶部
        this.toSelectTop();
        // 切换
        this.currentIndex = this.currentIndex + int;
      },
      toSelectTop() {
        // 防止下滑到空白处，切换选择时无内容，默认切换选择时，选项都回到顶部
        if (document.querySelector(".sub_flow_body")) {
          document.querySelector(".sub_flow_body").scrollTop = 0;
        }
      },
      bindNum(i) {
        return `(${i+1}/${this.item.choices.length})`;
      },
      clickAddSelect(e, item) {
        let that = this;
        // 新增时回到选项顶部
        this.toSelectTop();
        // e.stopPropagation();
        // e.cancelBubble = true;
        // e.preventDefault();
        console.log('添加新选择');
        const newSelect = {
          name: "新选择",
          flow: false,
          conditionBtn: 1,
          dependOnBtn: 1,
          conditionExpre: "",
          steps: []
        };
        this.item.choices.push(newSelect);
      },
      clickAddStep(e, index, currentSelectIndex) {
        let that = this;
        // 添加时先把其他选项的步骤都收起
        // this.shrinkAll(that);
        console.log('添加下一步', index, currentSelectIndex);
        let ops = {
          selectType: "subAddNextStep",
          preIndex: index,
          stepSelectNode: this.stepSelectNode,
          currentSelectIndex
        }
        let scrollTop = document.querySelector('.diagramExample').scrollTop;
        const x = e.clientX,
          y = e.clientY - 32 + scrollTop;
        this.$_index.insertNodes(99, x, y, e, ops);
      },
      deletSelect() {
        let index = this.prepareDeletSelectIndex;
        if (index === this.item.choices.length-1) {
          this.item.choices.pop();
        } else {
          this.item.choices.splice(index,1);
        }
        // 删除后调整当前的currentIndex
        if (this.currentIndex > 0) {
          this.currentIndex = this.currentIndex - 1;
        }
        this.prepareDeletSelectIndex = null;
        this.dialogDeletVisible = false;
      },
      deletSelects(index) {
        this.prepareDeletSelectIndex = index;
        this.dialogDeletVisible = true;
        // if (index === this.item.choices.length-1) {
        //   this.item.choices.pop();
        // } else {
        //   this.item.choices.splice(index,1);
        // }
        // // 删除后调整当前的currentIndex
        // if (this.currentIndex > 0) {
        //   this.currentIndex = this.currentIndex - 1;
        // }
      },
      openStartNodeDialog(type) {
        this.editIndex = type === "leftChange" ? this.currentIndex : this.currentIndex + 1;
        let {name, flow, conditionBtn, dependOnBtn, conditionExpre} = this.item.choices[this.editIndex];
        this.name = name;
        this.flow = flow;
        this.conditionBtn = conditionBtn;
        this.dependOnBtn = dependOnBtn;
        this.conditionExpre = conditionExpre;
        this.dialogFormVisible = true;
        this.$nextTick(() => {this.getThemeColor()})
      },
      submitChangeName() {
        let steps = JSON.parse(JSON.stringify(this.item.choices[this.editIndex].steps)),
          name = this.name,
          flow = this.flow,
          conditionBtn = this.conditionBtn,
          dependOnBtn = this.dependOnBtn,
          conditionExpre = this.conditionExpre;
        this.item.choices[this.editIndex] = {name, flow, conditionBtn, dependOnBtn, conditionExpre, steps};
        this.dialogFormVisible = false;
      },
      setThemeColor() {
        let that = this;
        window.addEventListener("storage", function (e) {
          if (e.key === "themeColor") {
            that.themeColor = JSON.parse(e.newValue);
            setThemeColor("condition_btn", that.themeColor, "bg-color", "btn");
            setThemeColor("depend_on_btn", that.themeColor, "bg-color", "btn");
            setThemeColor("add_reduce_btn", that.themeColor, "bg-color", "btn");
            setThemeColor("select_bind_num", that.themeColor, "bg-color", "txt");
          }
        });
      },
      getThemeColor() {
        this.themeColor = JSON.parse(localStorage["themeColor"] || "''");
        setThemeColor("condition_btn", this.themeColor, "bg-color", "btn");
        setThemeColor("depend_on_btn", this.themeColor, "bg-color", "btn");
        setThemeColor("add_reduce_btn", this.themeColor, "bg-color", "btn");
        setThemeColor("select_bind_num", this.themeColor, "bg-color", "txt");
      }
    },
    created() {
      this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")+1)[0];
      console.log('this.$root.$children[0].$children[0].$children:', this.$root.$children[0].$children[0].$children)
      this.setThemeColor();
    },
    mounted() {
      let step = JSON.parse(JSON.stringify(this.item || "''"));
      if (step.id) {
        this.selectStepId = step.id;
      }
      this.stepSelectNode = step;
      this.getThemeColor();
    },
    components: { subStepDetail, overDueSteps }
  };
</script>

<style scoped>
@import url("./icon.css");
  .select_body {
    height: 300px;
    width: 100%;
    position: relative;
  }
  .sub_flow_body {
    width: 100%;
    /* height: 400px; */
    height: 518px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .sub_flow_body::-webkit-scrollbar, .full_sub_flow_body::-webkit-scrollbar{
    display: none;
  }
  .full_sub_flow_body {
    width: 100%;
    /* height: 400px; */
    height: 768px;
    overflow-y: auto;
    /* overscroll-behavior: contain; */
  }
  /* .sub_flow_body_disScroll {
    width: 100%;
    height: 618px;
    overflow-y: hidden;
  } */
  .left_move_btn {
    z-index: 1;
    position: absolute;
    left: 0;
    width: 36px;
    height: 36px;
    font-size: 36px;
    color: #383838;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
  .right_move_btn {
    z-index: 1;
    position: absolute;
    right: 0;
    width: 36px;
    height: 36px;
    font-size: 36px;
    color: #383838;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
  .left_move_btn:hover, .right_move_btn:hover {
    color: #5f8dd3;
  }
  .left_sub_flow_select {
    float: left;
    width: 637px;
    height: auto;
    margin-bottom: 48px;
  }
  .right_sub_flow_select {
    float: right;
    width: 637px;
    height: auto;
    margin-bottom: 48px;
  }
  /* 弹窗样式-start */
  .el-dialog__body{
    padding: 30px 20px !important;
  }
  .el-dialog__header{
    padding: 20px 20px 10px !important;
  }
  .el-dialog__headerbtn {
    top: 5px !important;
    right: 5px !important;
    padding-top: 10px !important;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #000 !important;
    height: 30px !important;
    width: 35px !important;
    line-height: 88px !important;
  }
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #fff !important;
  }
  .el-header-title {
    background-image: -webkit-linear-gradient(top,#faf9f9,#ecf0f5)!important;
    height: 94px !important;
    color: #333;
  }
  .dele_select_form {
    width: 100%;
    height: auto;
    font-size: 15px;
    color: #000;
    margin: 8px !important;
    /* border: 1px solid #ccc; */
  }
  .title-content {
    height: 88px;
    line-height: 88px;
    font-size: 28px;
    font-weight: normal !important;
    padding:15px 20px;
    margin-bottom: 18px;
  }
  .el-dialog__wrapper {
    background: #383838 !important;
  }
  .edit_select_form {
    width: 100% !important;
    height: auto;
    margin: 16px 8px 30px 8px !important;
    /* border: 1px solid #ccc; */
  }
  .split_line {
    border-bottom: none !important;
  }
  /* 弹窗样式-end */
</style>

