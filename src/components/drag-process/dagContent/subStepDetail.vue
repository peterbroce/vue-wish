<template>
  <div class="formTab">
    <!-- 人工步骤 -->
      <el-tabs 
        v-if="item.type === 'human-step'" v-model="humanStepActive" type="card" @tab-click="humanStepClick">
        <el-tab-pane v-for="(form,index) in humanStep" :key="item.id+'_'+index" :label="form.label" :name="form.name">
          <step-form :formRef="item.type" :item="item" :stepActive="humanStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 邮件步骤 -->
      <el-tabs v-if="item.type === 'email-step'" v-model="emailStepActive" type="card" @tab-click="emailStepClick">
        <el-tab-pane v-for="(form,index) in emailStep" :key="item.id+'_'+index" :label="form.label" :name="form.name">
          <step-form :formRef="item.type" :item="item" :stepActive="emailStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 子流程步骤 -->
      <el-tabs v-if="item.type === 'subprocess-step'" v-model="subprocessStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :formRef="item.type" :item="item" :stepActive="subprocessStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- REST调用 -->
      <el-tabs v-if="item.type === 'rest-call-step'" v-model="RestCallStepActive" type="card" @tab-click="restCallClick">
        <el-tab-pane v-for="(form,index) in restCallStep" :key="item.id+'_'+index" :label="form.label" :name="form.name">
          <step-form :formRef="item.type" :item="item" :stepActive="RestCallStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 生成文档 -->
      <el-tabs v-if="item.type === 'generate-doc-step'" v-model="generateDocStepActive" type="card" @tab-click="generateDocClick">
        <el-tab-pane v-for="(form,index) in generateDocStep" :key="item.id+'_'+index" :label="form.label" :name="form.name">
          <step-form :formRef="item.type" :item="item" :stepActive="generateDocStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 决策步骤 -->
      <el-tabs v-if="item.type === 'decision-step'" v-model="decisionStepActive" type="card" @tab-click="decisionStepClick">
        <el-tab-pane v-for="(form,index) in decisionStep" :key="item.id+'_'+index" :label="form.label" :name="form.name">
          <step-form :formRef="item.type" :item="item" :stepActive="decisionStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 转至步骤 -->
      <el-tabs v-if="item.type === 'goto-step'" v-model="gotoStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :formRef="item.type" :item="item" :stepActive="gotoStepActive" :lsStepAll.sync="lsStepAll"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 结束步骤 -->
      <el-tabs v-if="item.type === 'end-process-step'" v-model="endProcessStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :formRef="item.type" :item="item" :stepActive="endProcessStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>

  </div>
</template>

<script>
import stepForm from "./stepForm";

export default {
  components: { stepForm },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    choice: {
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
      humanStep: [
        {label:"详细信息", name:"1"},
        {label:"表单", name:"2"},
        {label:"截止日期", name:"3"},
        {label:"计时器", name:"4"}
      ],
      emailStep: [
        {label:"详细信息", name:"1"},
        {label:"电子邮件", name:"2"}
      ],
      restCallStep: [
        {label:"详细信息", name:"1"},
        {label:"Endpoint", name:"2"},
        {label:"请求", name:"3"},
        {label:"响应", name:"4"}
      ],
      generateDocStep: [
        {label:"详细信息", name:"1"},
        {label:"模板", name:"2"},
        {label:"变量", name:"3"}
      ],
      decisionStep: [
        {label:"详细信息", name:"1"},
        {label:"决策表", name:"2"}
      ],
      stepTypes: [
        "human-step",
        "email-step",
        "subprocess-step",
        "rest-call-step",
        "generate-doc-step",
        "decision-step",
        "goto-step",
        "end-process-step"
      ],
      humanStepActive: "1",
      emailStepActive: "1",
      subprocessStepActive: "1",
      RestCallStepActive: "1",
      generateDocStepActive: "1",
      decisionStepActive: "1",
      gotoStepActive: "1",
      endProcessStepActive: "1"
    };
  },
  methods: {
    humanStepClick(tab, event) {
      this.humanStepActive = tab.name;
    },
    emailStepClick(tab, event) {
      this.emailStepActive = tab.name;
    },
    restCallClick(tab, event) {
      this.RestCallStepActive = tab.name;
    },
    generateDocClick(tab, event) {
      this.generateDocStepActive = tab.name;
    },
    decisionStepClick(tab, event) {
      this.decisionStepActive = tab.name;
    }
  }
};
</script>

<style scoped>
.formTab {
  margin: 0 9px;
}
</style>
