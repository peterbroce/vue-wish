<template>
  <div>
    <div v-if="this.item.processStep === 'main'" :class="!this.item.type ? 'start_step_form_content' : 'main_step_form_content '">
    <!-- <div v-if="this.item.processStep === 'main'" class="main_step_form_content" :class="item.id"> -->
      <step-form-tab :item="item" :lsStepAll.sync="lsStepAll" :formRef="formRef" :stepActive="stepActive"></step-form-tab>
    </div>
    <div v-else class="sub_step_form_content">
      <step-form-tab :item="item" :lsStepAll.sync="lsStepAll" :formRef="formRef" :stepActive="stepActive"></step-form-tab>
    </div>
  </div>
</template>

<script>
import stepFormTab from "./stepFormTab";
export default {
  components: {
    stepFormTab
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    formRef: {
      type: String
    },
    lsStepAll: {
      type: Array,
      default: () => []
    },
    stepActive: {
      type: String
    }
  }
};
</script>

<style scoped>
.sub_step_form_content {
  width: 100%;
}
/* .start_step_form_content {
  width: 100%;
  height: 460px;
  overflow-y: auto;
  overscroll-behavior: contain;
} */
.start_step_form_content {
  width: 100%;
  height: 200px;
  /* height: auto; */
  overflow-y: auto;
  overscroll-behavior: contain;
}
.main_step_form_content {
  width: 100%;
  /* height: 200px; */
  height: 328px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
/* .main_step_form_content::-webkit-scrollbar,  */
.start_step_form_content::-webkit-scrollbar{
	display:none;
}
</style>
