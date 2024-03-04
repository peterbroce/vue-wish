<template>
  <div class="current_content" v-if="this.item.type === 'human-step'">
      <el-form-item label="指派">
                <el-select style="width:100%" v-model="assignType" @change="changeAssignType" popper-class="customize_select">
                  <el-option
                    v-for="item in assignTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
      </el-form-item>
      <el-form-item :label="setAssignType()" v-if="this.assignType === 'user' || this.assignType === 'users'">
                <el-select 
                  style="width:100%" 
                  v-model="assignee" 
                  value-key="id" 
                  :filterable="true"
                  @change="changeAssignee($event)" 
                  placeholder="请选择" 
                  v-if="this.assignType === 'user'"
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
                  v-model="candidateUsers" 
                  value-key="id" 
                  multiple="true"
                  :filterable="true" 
                  collapse-tags 
                  @change="changeCandidateUsers($event)" 
                  placeholder="请选择" 
                  v-if="this.assignType === 'users'"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
      </el-form-item>
      <div style="margin-bottom:28px" v-if="this.assignType !== 'initiator' && this.assignType !== 'groupManagerForInitiator'">
              <el-checkbox v-model="selfCompleteTask" @change="changeSelfCompleteTask">
              </el-checkbox>
              <span class="form_select_text">允许流程发起者完成任务</span>
      </div>
      <div style="margin-bottom:8px">
              <el-checkbox v-model="allowSendEmail" @change="changeAllowSendEmail">
              </el-checkbox>
              <span class="form_select_text">允许发送电子邮件通知</span>
      </div>
      <el-form-item label="电子邮件" v-show="this.allowSendEmail">
                <el-select style="width:100%" v-model="emailTemplateType" @change="changeEmailType" popper-class="customize_select">
                  <el-option
                    v-for="item in emailTypes"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
      </el-form-item>
      <el-form-item label="模板" v-show="this.allowSendEmail && this.emailTemplateType === 'template'">
                <el-select style="width:100%" v-model="templateEmail" :filterable="true" @change="changeEmailTemplage" popper-class="customize_select">
                  <el-option
                    v-for="item in emailTemplate"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
      </el-form-item>
      <el-form-item label="主题" v-show="this.allowSendEmail && this.emailTemplateType === 'custom'">
        <el-input v-model="templateSubject" @change="changeTemplateSubject" placeholder="输入电子邮件标题"></el-input>
      </el-form-item>
      <el-form-item label="电子邮件内容" v-show="this.allowSendEmail && this.emailTemplateType === 'custom'">
        <el-input v-model="templateText" @change="changeTemplateText" type="textarea" placeholder="输入电子邮件内容"></el-input>
      </el-form-item>
  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "emailAssign",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    formRef: {
      type: String
    }
  },
  data() {
    // let { successCode } = this.config.CODEMAP;
    let successCode = 1;
    return {
      successCode,
      allowSendEmail: null,
      assignType: "initiator",
      assignee: "",
      candidateUsers: [],
      selfCompleteTask: null,
      emailTemplateType: "default",
      templateEmail: "none",
      templateSubject: "",
      templateText: "",
      assignTypes: [
        { value: 'initiator', label: '已指派至流程发起者' },
        { value: 'groupManagerForInitiator', label: '已指派至流程发起者的组管理员' },
        { value: 'user', label: '已指派至单个用户' },
        { value: 'groupManager', label: '已指派至组管理员' },
        { value: 'users', label: '候选用户' },
        { value: 'groups', label: '候选组' },
      ],
      userList: [],
      emailTypes: [
        { value: 'default', label: '默认值' },
        { value: 'template', label: '电子邮件模板' },
        { value: 'custom', label: '自定义模板' }
      ],
      emailTemplate: [
        { value: 'none', label: '无电子邮件模板' }
      ],
      // 选了字段作为指派用户
			assigneeField: {
				"fieldType": "FormFieldRepresentation",
				"id": "label10",
				"name": "Label10",
				"type": "people",
				"value": null,
				"required": false,
				"readOnly": false,
				"overrideId": false,
				"colspan": 1,
				"placeholder": null,
				"minLength": 0,
				"maxLength": 0,
				"minValue": null,
				"maxValue": null,
				"regexPattern": null,
				"optionType": null,
				"hasEmptyValue": null,
				"options": null,
				"restUrl": null,
				"restResponsePath": null,
				"restIdProperty": null,
				"restLabelProperty": null,
				"tab": null,
				"className": null,
				"dateDisplayFormat": null,
				"layout": null,
				"sizeX": 0,
				"sizeY": 0,
				"row": 0,
				"col": 0,
				"visibilityCondition": null
      },
      // 指派管理员
			groupManager: {
				"id": 5,
				"name": "test-act",
				"externalId": null,
				"status": "active",
				"parentGroupId": null,
				"groups": null
      },
      // 添加了组
			candidateGroups: [{
				"id": 5,
				"name": "test-act",
				"externalId": null,
				"status": "active",
				"parentGroupId": null,
				"groups": null
      }],
      // 自定义邮件
      emailTemplateSource: {
        "type": "custom",
        "templateSubject": "主题",
        "templateText": "电子邮件内容"
      }
    }
  },
  methods: {
    changeAssignType(val) {
      this.item.assignment.type = val;
      this.assignee = this.item.assignment.assignee ="";
    },
    setAssignType() {
      let type = this.assignType;
      let label = "";
      if (type === "user") {
        label = "被指派者";
      }
      if (type === "groupManager" || type === "groups") {
        label = "组";
      }
      if (type === "users") {
        label = "候选者";
      }
      return label;
    },
    changeAssignee(val) {
      this.item.assignment.candidateUsers = this.candidateUsers = [];
      this.item.assignment.assignee = val;
    },
    changeCandidateUsers(val) {
      this.assignee = "";
      this.item.assignment.assignee = {};
      this.item.assignment.candidateUsers.push(val);
    },
    changeSelfCompleteTask(val) {
      this.item.assignment.initiatorCanCompleteTask = val;
      // if (!val) {
      //   this.$delete(this.item, "emailTemplateSource");
      // } else {
      //   this.$set(this.item, "emailTemplateSource", {type:"default"});
      // }
    },
    changeAllowSendEmail(val) {
      this.item.allowSendEmail = val;
      if (!val) {
        this.$delete(this.item, "emailTemplateSource");
      } else {
        this.$set(this.item, "emailTemplateSource", {type:"default"});
      }
    },
    changeEmailType(val) {
      this.item.emailTemplateSource.type = val;
    },
    changeEmailTemplage(val) {
      this.item.emailTemplateSource.template = val;
    },
    changeTemplateSubject(val) {
      this.item.emailTemplateSource.templateSubject = val;
    },
    changeTemplateText(val) {
      this.item.emailTemplateSource.templateText = val;
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
    let {allowSendEmail, emailTemplateSource, assignment} = this.item;
    this.allowSendEmail = allowSendEmail;
    this.emailTemplateType = emailTemplateSource.type;
    this.assignType = assignment.type;
    this.selfCompleteTask = assignment.initiatorCanCompleteTask;
    if (assignment.type !== 'initiator' && assignment.type !== 'groupManagerForInitiator') {
      if (assignment.type === "user") {
        this.assignee = assignment.assignee.name;
      }
      // if (assignment.type === "users") {
      //   this.candidateUsers = assignment.candidateUsers;
      // }
    }
    if (emailTemplateSource.type === 'custom') {
      this.templateSubject = emailTemplateSource.templateSubject;
      this.templateText = emailTemplateSource.templateText;
    }
    // this.getUserList(); // 人员列表
  },
  mounted() {
    // if (this.item.type === "human-step") {
    //   let dom = document.querySelector(`.${this.item.id}`);
    //   let height = window.getComputedStyle(dom).getPropertyValue("height");
    //   console.log('打印height:', height);
    // }
  }
};
</script>

<style scoped>
  @import url("../icon.css");
</style>
