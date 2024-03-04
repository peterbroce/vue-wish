<template>
  <div class="current_content">
    <el-form :ref="formRef" :model="this.item" label-width="98px" label-position="left" size="mini">
          <el-form-item class="margin_empty" label="子流程">
            <el-select 
              class="email_receiver" 
              v-model="subProcessDefinition" 
              :filterable="true" 
              value-key="id" 
              @change="changeSubProcess($event)" 
              placeholder="无选中的子流程"
               popper-class="customize_select"
            >
              <el-option
                class="item_select"
                v-for="item in subProcessList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <button 
              v-show="subProcessList.length < 2" 
              class="open_form_edit" 
              type="button" 
              @click="createSub"
            >创建子流程</button>
            <button 
              v-show="subProcessList.length > 1 && subProcessDefinition.id" 
              class="open_form_edit" 
              type="button" 
              @click="openSub"
            >打开子流程</button>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "../el-styl.css";
import util from "@/js/util";
let { openIframe, closeIframe, setThemeColor } = util;
export default {
  name: "subProcess",
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
      subProcessDefinition: null,
      subProcessList: [
        {
          "name": "无选中流程"
        }
      ]
    }
  },
  methods: {
    changeSubProcess(val) {
      this.item.subProcessDefinition = val.id ? val : {};
    },
    getThemeColor() {
      this.themeColor = JSON.parse(localStorage["themeColor"] || "''");
      setThemeColor("open_form_edit", this.themeColor, "bg-color", "btn");
    },
    createSub() {
      const key ="stepFlow", text = "步骤流设计器";
      openIframe({
        key,
        text,
        param: {
          processName: null,
          description: null
        }
      });
    },
    openSub() {
      const key ="stepFlow", text = "步骤流设计器";
      openIframe({
        key,
        text,
        param: {
          processName: this.subProcessDefinition.name,
          description: this.subProcessDefinition.description,
          id: this.subProcessDefinition.id,
          type: "edit"
        }
      })
    }
  },
  mounted() {
    this.getThemeColor();
  },
  created() {
    this.subProcessDefinition = this.item.subProcessDefinition;

    let stepProcessModels = [];
    if (localStorage["stepProcessModels"]) {
      stepProcessModels = JSON.parse(localStorage["stepProcessModels"] || "''");
    }
    if (sessionStorage["stepProcessModels"]) {
      stepProcessModels = JSON.parse(sessionStorage["stepProcessModels"] || "''");
      localStorage["stepProcessModels"] = sessionStorage["stepProcessModels"];
      sessionStorage.removeItem("stepProcessModels");
    }
    stepProcessModels.forEach(step => {
      this.$delete(step, "kickstartModel");
      this.$delete(step, "modelImageBase64");
    });
    let $_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
    stepProcessModels.map(i => i.id !== $_index.DataAll.id ? this.subProcessList.push(i) : void(0));
  }
};
</script>

<style scoped>
  @import url("../icon.css");
</style>
