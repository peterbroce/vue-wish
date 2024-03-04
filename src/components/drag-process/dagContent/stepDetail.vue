<template>
  <div class="formTab">
    <!-- 人工步骤 -->
      <el-tabs 
        v-if="item.type === 'human-step'" v-model="humanStepActive" type="card" @tab-click="humanStepClick">
        <el-tab-pane v-for="(form,index) in humanStep" :key="item.id+'humanStep'+index" :label="form.label" :name="form.name">
          <step-form :item="item" :formRef="item.type" :stepActive="humanStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 邮件步骤 -->
      <el-tabs v-if="item.type === 'email-step'" v-model="emailStepActive" type="card" @tab-click="emailStepClick">
        <el-tab-pane v-for="(form,index) in emailStep" :key="item.id+'emailStep'+index" :label="form.label" :name="form.name">
          <step-form :item="item" :formRef="item.type" :stepActive="emailStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 选项步骤 -->
      <!-- 收起时 -->
        <!-- <div style="height:200px" v-if="item.type === 'choice-step'">
            <sub-step-select-detail
              :item="item"
              :subStepNodes="subStepNodes"
              :choices="choices"
            ></sub-step-select-detail>
        </div> -->
      <!-- 展开时 -->
        <el-tabs v-if="item.type === 'choice-step'" v-model="choiceStepActive" type="card">
          <el-tab-pane label="详细信息" name="1">
            <step-form :item="item" :formRef="item.type" :stepActive="choiceStepActive"></step-form>
          </el-tab-pane>
          <el-tab-pane label="选项" name="2" :class="showFull ? 'full_select_content':'select_content'">
            <sub-step-select-detail :item="item" :showFull="showFull" :subStepNodes="subStepNodes" :lsStepAll.sync="lsStepAll" :choices="choices"></sub-step-select-detail>
          </el-tab-pane>
        </el-tabs>
    <!-- 子流程步骤 -->
      <el-tabs v-if="item.type === 'subprocess-step'" v-model="subprocessStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :item="item" :formRef="item.type" :stepActive="subprocessStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- REST调用 -->
      <el-tabs v-if="item.type === 'rest-call-step'" v-model="RestCallStepActive" type="card" @tab-click="restCallClick">
        <el-tab-pane v-for="(form,index) in restCallStep" :key="item.id+'restCallStep'+index" :label="form.label" :name="form.name">
          <step-form :item="item" :formRef="item.type" :stepActive="RestCallStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 生成文档 -->
      <el-tabs v-if="item.type === 'generate-doc-step'" v-model="generateDocStepActive" type="card" @tab-click="generateDocClick">
        <el-tab-pane v-for="(form,index) in generateDocStep" :key="item.id+'generateDocStep'+index" :label="form.label" :name="form.name">
          <step-form :item="item" :formRef="item.type" :stepActive="generateDocStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 决策步骤 -->
      <el-tabs v-if="item.type === 'decision-step'" v-model="decisionStepActive" type="card" @tab-click="decisionStepClick">
        <el-tab-pane v-for="(form,index) in decisionStep" :key="item.id+'decisionStep'+index" :label="form.label" :name="form.name">
          <step-form :item="item" :formRef="item.type" :stepActive="decisionStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 转至步骤 -->
      <el-tabs v-if="item.type === 'goto-step'" v-model="gotoStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :item="item" :formRef="item.type" :stepActive="gotoStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>
    <!-- 结束步骤 -->
      <el-tabs v-if="item.type === 'end-process-step'" v-model="endProcessStepActive" type="card">
        <el-tab-pane label="详细信息" name="1">
          <step-form :item="item" :formRef="item.type" :stepActive="endProcessStepActive"></step-form>
        </el-tab-pane>
      </el-tabs>

  </div>
</template>

<script>
import stepForm from "./stepForm";
import subStepSelectDetail from "./subStepSelectDetail";
import pluginUtil from "./js/util";
let { queryCurrentHeight } = pluginUtil;

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
        "choice-step",
        "subprocess-step",
        "rest-call-step",
        "generate-doc-step",
        "decision-step", 
        "goto-step",
        "end-process-step"
      ],
      humanStepActive: "1",
      emailStepActive: "1",
      choiceStepActive: "2",
      subprocessStepActive: "1",
      RestCallStepActive: "1",
      generateDocStepActive: "1",
      decisionStepActive: "1",
      gotoStepActive: "1",
      endProcessStepActive: "1"
    };
  },
  components: { stepForm, subStepSelectDetail },
  methods: {
    humanStepClick(tab, event) {
      this.humanStepActive = tab.name;
      this.getHeight();
    },
    emailStepClick(tab, event) {
      this.emailStepActive = tab.name;
      this.getHeight();
    },
    restCallClick(tab, event) {
      this.RestCallStepActive = tab.name;
      this.getHeight();
    },
    generateDocClick(tab, event) {
      this.generateDocStepActive = tab.name;
      this.getHeight();
    },
    decisionStepClick(tab, event) {
      this.decisionStepActive = tab.name;
      this.getHeight();
    },
    getHeight() {
      this.$nextTick(_ => {
        if (this.item.type && this.item.processStep === "main") {
          let height = queryCurrentHeight(this.item);
          console.log('height:', height);
          this.item.height = height;
        }
      })
    }
  },
  mounted() {
    this.getHeight();
  },
  created() {
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
  }
};
</script>

<style scoped>
.formTab {
  margin: 0 9px;
}
.select_content {
  z-index: 1 !important;
  /* height: 448px; */
  height: 470px;
}
.full_select_content {
  z-index: 1 !important;
  height: 738px !important;
}

</style>
