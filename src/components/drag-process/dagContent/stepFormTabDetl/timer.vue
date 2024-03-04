<template>
  <div class="current_content">
          <el-form :ref="formRef" :model="this.item" label-width="108px" label-position="left" size="mini">
            <el-select v-model="dueDurations" style="width:100%" value-key="value" @change="getSelect" popper-class="customize_select">
              <el-option
                class="item_select"
                v-for="i in dueDateOptions"
                :key="i.value"
                :label="i.label"
                :value="i.value">
              </el-option>
            </el-select>
          </el-form>

          <div style="width:100%;margin-top:16px" v-show="this.dueDurations !== 'none'">

            <el-row :gutter="20">
              <el-col :span="8">
                <span class="single_txt">年：</span>
                <el-input-number style="width:155px" size="mini" v-model="years" controls-position="right" @change="handleChange('years')"></el-input-number>
              </el-col>
              <el-col :span="8">
                <span class="single_txt">月：</span>
                <el-input-number style="width:155px" size="mini" v-model="months" controls-position="right" @change="handleChange('months')"></el-input-number>
              </el-col>
              <el-col :span="8">
                <span class="single_txt">天：</span>
                <el-input-number style="width:155px" size="mini" v-model="days" controls-position="right" @change="handleChange('days')"></el-input-number>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <span class="single_txt">时：</span>
                <el-input-number style="width:155px" size="mini" v-model="hours" controls-position="right" @change="handleChange('hours')"></el-input-number>
              </el-col>
              <el-col :span="8">
                <span class="single_txt">分：</span>
                <el-input-number style="width:155px" size="mini" v-model="minutes" controls-position="right" @change="handleChange('minutes')"></el-input-number>
              </el-col>
              <el-col :span="8">
                <span class="single_txt">秒：</span>
                <el-input-number style="width:155px" size="mini" v-model="seconds" controls-position="right" @change="handleChange('seconds')"></el-input-number>
              </el-col>
            </el-row>

            <el-form style="margin-top:18px" :ref="formRef" :model="this.item" label-width="176px" label-position="left" size="small">
              <el-form-item label="要执行的操作:">
                        <el-select v-model="dueAction" style="width:100%" @change="getDueActionSelect" popper-class="customize_select">
                          <el-option
                            class="item_select"
                            v-for="i in dueActions"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value">
                          </el-option>
                        </el-select>
              </el-form-item>
              <div style="margin:-8px 0 8px 178px">
                <span class="form_text">{{dueActionText}}</span>
              </div>
            </el-form>

            <el-form style="margin-top:18px" v-if="this.dueAction === 'reassign-task'" :ref="formRef" :model="this.item" label-width="108px" label-position="left" size="mini">
              <el-form-item label="重新指派:">
                        <el-select style="width:100%" v-model="dueAssignType" @change="changeDueAssignType" popper-class="customize_select">
                          <el-option
                            class="item_select"
                            v-for="item in dueAssignTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
              </el-form-item>
              <el-form-item :label="setAssignType()" v-if="['user','users','groups'].includes(this.dueAssignType)">
                        <!-- <el-select style="width:100%" v-model="dueAssigneeUsers" value-key="id" @change="changeDueAssignUser($event)" placeholder="请选择">
                          <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                          </el-option>
                        </el-select> -->
                        <el-select 
                          style="width:100%" 
                          v-model="dueAssignee" 
                          value-key="id" 
                          :filterable="true"
                          @change="changeDueAssignUser($event)" 
                          placeholder="请选择" 
                          v-if="this.dueAssignType === 'user'"
                        >
                          <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                          </el-option>
                        </el-select>
                        <el-select 
                          style="width:100%" 
                          v-model="dueCandidateUsers" 
                          value-key="id" 
                          multiple="true" 
                          :filterable="true" 
                          collapse-tags="3"
                          @change="changeCandidateUsers($event)" 
                          placeholder="请选择" 
                          v-if="this.dueAssignType === 'users'"
                        >
                          <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                          </el-option>
                        </el-select>
              </el-form-item>
            </el-form>

            <div style="margin-bottom:28px" v-if="['user','users','groups'].includes(this.dueAssignType)">
              <el-checkbox v-model="initiatorCanCompleteTask" @change="changeSelfCompleteTask">
              </el-checkbox>
              <span class="form_select_text">允许流程发起者完成任务</span>
            </div>

          </div>

  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "timer",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    formRef: {
      type: String
    },
  },
  data() {
    // let { successCode } = this.config.CODEMAP;
    let successCode = 1;
    let dueDateOptions = [
      {value: "none", label: "这个任务无计时器"},
      {value: "static", label: "创建后的固定持续时间"}
      // {value: "field", label: "基于字段"},
      // {value: "variable", label: "基于变量"}
    ];
    return {
      scroll: 0,
      successCode,
      dueDateOptions,
      $_index: {},
      dueActionText: "",
      dueDurations: "none",
      dueAction: "none",
      dueActions: [
        { value: 'none', label: '无操作', text: '' },
        { value: 'reassign-task', label: '重新指派任务', text: '将任务重新指派至特定的用户，或将其设置为特定用户或组可申请。' },
        { value: 'keep-task', label: '保留任务', text: '保留任务，但在日期到来时执行其他步骤。' },
        { value: 'end-task', label: '结束任务', text: '结束任务并在日期到来时执行其他步骤。' },
        { value: 'end-process', label: '结束流程', text: '结束流程。所有活动步骤将被取消，决不会执行所有未来的步骤。' }
      ],
      years: undefined,
      months: undefined,
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      dueAssignType: "initiator",
      dueAssignTypes: [
        { value: 'initiator', label: '已指派至流程发起者' },
        { value: 'groupManagerForInitiator', label: '已指派至流程发起者的组管理员' },
        { value: 'user', label: '已指派至单个用户' },
        { value: 'groupManager', label: '已指派至组管理员' },
        { value: 'users', label: '候选用户' },
        { value: 'groups', label: '候选组' },
      ],
      initiatorCanCompleteTask: false,
      userList: [],
      dueAssignee: "",
      dueCandidateUsers: []
    }
  },
  methods: {
    initDueAction() {
      this.item.dueAction = this.dueAction = "none";
      this.item.overdueSteps = [];
      this.dueActionText = "";
      this.dueAssignType = "initiator";
      this.initiatorCanCompleteTask = false,
      this.userList = [],
      this.dueAssignee = "",
      this.dueCandidateUsers = []
    },
    initTimer() {
      this.years = this.months = this.days = this.hours = this.minutes = this.seconds = undefined;
    },
    getSelect (val) {
      if (!this.item.dueDuration && val !== "none") {
        this.$set(this.item, "dueDuration", {});
      } else {
        this.initTimer();
        if (this.dueAction !== "none") {
          this.$delete(this.item, "dueDuration");
          this.initDueAction();
          if (this.item.hasOverdueSteps) {
            this.$delete(this.item,'hasOverdueSteps');
            if (this.item.processStep && this.item.processStep === "main") {
              this.$_index.$emit('updateDAG', this.$_index.DataAll, 'selectNode', this.item.id);
            }
          }
        }
      }
    },
    handleChange(type) {
      switch(type) {
        case "years":
          this.item.dueDuration.years = this.years;
        break;
        case "months":
          this.item.dueDuration.months = this.months;
        break;
        case "days":
          this.item.dueDuration.days = this.days;
        break;
        case "hours":
          this.item.dueDuration.hours = this.hours;
        break;
        case "minutes":
          this.item.dueDuration.minutes = this.minutes;
        break;
        case "seconds":
          this.item.dueDuration.seconds = this.seconds;
        break;
        default: () => {}
      }
    },
    getDueActionSelect(i) {
      this.item.dueAction = i;
      this.dueActionText = this.dueActions.filter(item => item.value === i)[0].text;
      if (["keep-task","end-task"].includes(i)) {
        this.dueAssignType = "initiator";
        this.$set(this.item, "hasOverdueSteps", true);
        this.item.dueAssignment ? this.$delete(this.item,'dueAssignment') : void(0);
      } else {
        this.item.hasOverdueSteps ? this.$delete(this.item,'hasOverdueSteps') : void(0);
        if (i === "reassign-task") {
          let dueAssignment = {
            type: "initiator",
            assignee: {},
            candidateUsers: [],
            candidateUserFields: [],
            candidateGroups: [],
            candidateGroupFields: []
          }
          this.$set(this.item, "dueAssignment", dueAssignment);
        }
      }
      if (this.item.processStep && this.item.processStep === "main") {
        console.log('this:', this)
        console.log('this.$_index', this.$_index)
        this.$_index.$emit('updateDAG', this.$_index.DataAll, 'selectNode', this.item.id);
      }
      if (i === "none") {
        this.initDueAction();
      }
    },
    changeDueAssignType(val) {
      this.item.dueAssignment.type = val;
      if (["initiator","groupManagerForInitiator"].includes(val)) {
        this.$delete(this.item.dueAssignment, "initiatorCanCompleteTask");
      } else {
        this.$set(this.item.dueAssignment, "initiatorCanCompleteTask", false);
      }
    },
    changeSelfCompleteTask(val) {
      this.item.dueAssignment.initiatorCanCompleteTask = val;
    },
    setAssignType() {
      let type = this.dueAssignType;
      let label = "";
      if (type === "user") {
        label = "被指派者";
      }
      if (["groupManager","groups"].includes(type)) {
        label = "组";
      }
      if (type === "users") {
        label = "候选者";
      }
      return label;
    },
    changeDueAssignUser(val) {
      this.dueCandidateUsers = [];
      this.item.dueAssignment.candidateUsers = [];
      this.item.dueAssignment.assignee = val;
    },
    changeCandidateUsers(val) {
      this.dueAssignee = "";
      this.item.dueAssignment.assignee = {};
      this.item.dueAssignment.candidateUsers = val;
    },
    async getUserList() {
      this.http.get({
        url: "operator/list",
        data: {
          pageNum: 1,
          pageSize: 1000
        },
        success: (data) => {
          if (this.successCode === data.code) {
            for (let item of data.data.result) {
              item["id"] = item.userName;
              item["name"] = item.userName;
            }
            this.userList = data.data.result;
          } else {
            this.Alert(data.message || "用户接口获取失败");
          }
        }
      })
    }
  },
  created() { 
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
    let {dueDuration, dueAction, dueAssignment} = this.item;

    this.dueDurations = dueDuration || "none";
    this.dueAction = dueAction || "none";
    this.dueActionText = this.dueActions.filter(item => item.value === this.dueAction)[0].text;
    if (dueDuration) {
      let {years,months,days,hours,minutes,seconds} = dueDuration;
      this.years = years || undefined;
      this.months = months || undefined;
      this.days = days || undefined;
      this.hours = hours || undefined;
      this.minutes = minutes || undefined;
      this.seconds = seconds || undefined;
    }
    if (dueAssignment) {
      this.dueAssignType = dueAssignment.type || "initiator";
      this.initiatorCanCompleteTask = dueAssignment.initiatorCanCompleteTask;
      if (dueAssignment.assignee) {
        this.dueAssignee = dueAssignment.assignee.name;
      }
      if (dueAssignment.candidateUsers && dueAssignment.candidateUsers.length) {
        this.dueCandidateUsers = dueAssignment.candidateUsers;
      }
    }
    // this.getUserList();
  }
};
</script>

<style scoped>
@import url("../icon.css");
.form_text {
  font-size: 12px;
  font-family: 'Lato', sans-serif;
  color: #666666;
}
</style>
