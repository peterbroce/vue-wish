<template>
  <div class="current_content">
    <el-form :ref="formRef" :model="this.item" label-width="108px" label-position="left" size="mini">
          <el-form-item class="margin_empty" label="收件人类型">
            <el-select
              class="email_form_select"
              v-model="receiveType"
              value-key="value"
              @change="changeReceiveType"
              popper-class="customize_select"
            >
              <el-option
                class="item_select"
                v-for="item in receiveTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="margin_empty" label="收件人" v-if="this.receiveType !== 'initiator'">
            <el-select 
              value-key="id"
              class="email_receiver"
              v-model="receiveUser"
              :filterable="true"
              :multiple="receiveType==='users'"
              @change="changeReceiveUser"
            >
              <el-option
                class="item_select"
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主题">
            <el-input v-model="subject" @change="changeSubject" placeholder="输入标题"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件文本">
            <el-input v-model="emailText" @change="changeEmailText" type="textarea" placeholder="输入电子邮件文本"></el-input>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "sendEmail",
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
      subject: "",
      emailText: "",
      receiveTypes: [
        {value: "initiator", name: "流程发起者收件人"},
        {value: "user", name: "单个用户收件人"},
        {value: "users", name: "多个用户收件人"}
      ],
      userList: [
        // { id: 'userid1', name: '发起人员' },
        // { id: 'userid2', name: '委托人员' },
        // { id: 'userid3', name: '审批人员' }
      ]
    }
  },
  methods: {
    changeReceiveType(val) {
      let recipient = this.item.recipient;
      recipient.type = val;
      recipient.user = null;
      recipient.users = val === "users" ? [] : null;
      recipient.userFields = val === "users" ? [] : null;
      this.receiveUser = "";
    },
    changeReceiveUser(val) {
      if (this.receiveType === "user") {
        this.item.recipient.user = val;
      }
      if (this.receiveType === "users") {
        this.item.recipient.users = val;
      }
    },
    changeSubject(val) {
      !val ? this.$delete(this.item, "subject") : this.$set(this.item, "subject", val); 
    },
    changeEmailText(val) {
      !val ? this.$delete(this.item, "emailText") : this.$set(this.item, "emailText", val); 
    },
    getUserList() {
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
    let recipient = this.item.recipient;
    this.receiveType = recipient.type;
    if (this.receiveType !== "initiator") {
      this.receiveUser = recipient.user || recipient.users;
    }
    this.subject = this.item.subject || "";
    this.emailText = this.item.emailText || "";
    // this.getUserList();
  }
};
</script>

<style scoped>
  @import url("../icon.css");
</style>
