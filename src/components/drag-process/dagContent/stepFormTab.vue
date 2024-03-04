<template>
  <div class="current_content">
    <!-- 类型步骤表单 -->
    <div v-if="item.type" class="form_body">
      
      <div v-if="stepActive === '1'">
        <el-form :ref="formRef" :model="this.item.form" label-width="98px" label-position="left" size="mini">
          <!-- <el-form-item label="类型">
            <el-input v-model="item.type" :disabled="true"></el-input>
          </el-form-item> -->
          <el-form-item label="名称">
            <el-input v-model="item.name" maxlength="50" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="item.description" maxlength="300" type="textarea" placeholder="输入说明" rows="3"></el-input>
          </el-form-item>
          <emailAssign v-if="item.type === 'human-step'" :item="item" :formRef="formRef"></emailAssign>
          <subProcess v-if="item.type === 'subprocess-step'" :item="item" :formRef="formRef"></subProcess>
          <goto v-if="item.type === 'goto-step'" :item="item" :lsStepAll.sync="lsStepAll" :formRef="formRef"></goto>
        </el-form>
      </div>



      <div v-if="stepActive === '2'">
          <formVarMap v-if="item.type === 'human-step'" :item="item" :formRef="formRef"></formVarMap>
          <sendEmail v-if="item.type === 'email-step'" :item="item" :formRef="formRef"></sendEmail>
          <endPoint v-if="item.type === 'rest-call-step'" :item="item" :formRef="formRef"></endPoint>
      </div>



      <div v-if="stepActive === '3'">
        <dueDate v-if="item.type === 'human-step'" :item="item" :formRef="formRef"></dueDate>
        <request v-if="item.type === 'rest-call-step'" :item="item" :formRef="formRef"></request>
      </div>



      <div v-if="stepActive === '4'">
        <timer v-if="item.type === 'human-step'" :item="item" :formRef="formRef"></timer>
        <response v-if="item.type === 'rest-call-step'" :item="item" :formRef="formRef"></response>
      </div>
    </div>

    <!-- 流程开始表单 -->
    <div v-else class="start_form_body">
      <el-form ref="starStepForm" :model="this.item.form" label-width="88px" label-position="left">
        <el-form-item label="流程触发器:" class="margin_empty">
          <el-select v-model="startValue" @change="changeStartValue" class="form_first_select" popper-class="customize_select">
            <el-option
              v-for="item in startOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="this.startValue === '2'">
          <formVarMap :item="item" :formRef="formRef"></formVarMap>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import "./el-styl.css";
import emailAssign from './stepFormTabDetl/emailAssign';
import formVarMap from './stepFormTabDetl/formVarMap';
import dueDate from './stepFormTabDetl/dueDate';
import timer from './stepFormTabDetl/timer';
import sendEmail from './stepFormTabDetl/sendEmail';
import endPoint from './stepFormTabDetl/endPoint';
import request from './stepFormTabDetl/request';
import response from './stepFormTabDetl/response';
import subProcess from './stepFormTabDetl/subProcess';
import goto from './stepFormTabDetl/goto';
export default {
  components: { 
    emailAssign,
    formVarMap,
    dueDate,
    timer,
    sendEmail,
    endPoint,
    request,
    response,
    subProcess,
    goto
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    lsStepAll: {
      type: Array,
      default: () => []
    },
    formRef: {
      type: String
    },
    stepActive: {
      type: String
    }
  },
  data() {
    return {
      $_index: null,
      startOptions: [
        {
          value: '1',
          label: '由用户启动'
        }, {
          value: '2',
          label: '由填表单的用户启动'
        }
      ],
      startValue: "1",
      startForm: {}
    };
  },
  methods: {
    onSubmit() {
      
    },
    changeStartValue(val) {
      if (val === "1") {
        this.startForm = "无选中的表单";
        this.$_index.DataAll.variablesmapping = [];
      }
    }
  },
  created() {
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
  }
};
</script>

<style scoped>
  @import url("./icon.css");
</style>
