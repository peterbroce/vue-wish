<template>
  <div class="current_content">
    <el-form :ref="formRef" :model="this.item" label-width="108px" label-position="left" size="mini">
      <el-select v-model="taskDueDateOption" style="width:100%" value-key="value" @change="getSelect"  popper-class="customize_select">
        <el-option
          class="item_select"
          v-for="i in dueDateOptions"
          :key="i.value"
          :label="i.label"
          :value="i.value">
        </el-option>
      </el-select>
    </el-form>
    <div style="width:100%;margin-top:16px" v-show="this.taskDueDateOption !== 'none'">
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
    </div>
  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "dueDate",
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
    return {
      taskDueDateOption: "none", //基于 none、static、field、variable
      taskDueDateCalculationType: null, //计算方式 add、subtract
      // taskDueDate: {
      years: undefined,
      months: undefined,
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      // },
      dueDateOptions: [
        {value: "none", label: "这个任务无截止日期"},
        {value: "static", label: "创建后的固定持续时间"}
        // {value: "field", label: "基于字段"},
        // {value: "variable", label: "基于变量"}
      ]
    }
  },
  methods: {
    getSelect(val) {
        if (!this.item.taskDueDate && val !== "none" ) {
          this.$set(this.item, "taskDueDate", {});
          this.item.taskDueDateOption = val;
        } else {
          this.$delete(this.item, "taskDueDate");
          this.item.taskDueDateOption = val;
        }
    },
    handleChange(type) {
      console.log(type, this[type])
      switch(type) {
        case "years":
          this.item.taskDueDate.years = this.years;
        break;
        case "months":
          this.item.taskDueDate.months = this.months;
        break;
        case "days":
          this.item.taskDueDate.days = this.days;
        break;
        case "hours":
          this.item.taskDueDate.hours = this.hours;
        break;
        case "minutes":
          this.item.taskDueDate.minutes = this.minutes;
        break;
        case "seconds":
          this.item.taskDueDate.seconds = this.seconds;
        break;
        default: () => {}
      }
    }
  },
  created() {
    this.taskDueDateOption = this.item.taskDueDateOption;
    if (this.item.taskDueDate) {
      let {years,months,days,hours,minutes,seconds} = this.item.taskDueDate;
      this.years = years || undefined;
      this.months = months || undefined;
      this.days = days || undefined;
      this.hours = hours || undefined;
      this.minutes = minutes || undefined;
      this.seconds = seconds || undefined;
    }
  }
};
</script>

<style scoped>
  @import url("../icon.css");
</style>
