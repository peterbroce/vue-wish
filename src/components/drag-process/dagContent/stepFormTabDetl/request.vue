<template>
  <div class="current_content">
      <!-- 选项修改弹窗 -->
        <el-dialog :width="!response?'1000px':'600px'" top="38px" :visible.sync="dialogJsonPropertyVisible" :append-to-body="true" :center="false">
            <div slot="title" class="el-header-title"><div class="title-content">{{dialogTitle}}</div></div>
            <div class="edit_select_form">
              <el-form size="mini" label-position="left" label-width="188px" style="margin:0 28px">
                  <el-form-item :label="!response?'值：':'属性名称：'">
                    <el-input v-model="jsonPropertyValue" v-if="!response" :clearable="true" placeholder="Enter a json property value"></el-input>
                    <el-input v-model="jsonPropertyName" v-else :clearable="true" placeholder="Enter a response json property name"></el-input>
                  </el-form-item>

                  <el-form-item :label="!response?'属性类型：':'变量类型：'">
                    <el-select style="width:100%" v-model="jsonPropertyType" value-key="i" @change="changePropertyType($event)"  popper-class="customize_select">
                      <el-option
                        class="item_select"
                        v-for="i in propertyTypes"
                        :key="i"
                        :label="i"
                        :value="i">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="!response?'属性名称：':'变量名称：'">
                    <el-input v-model="jsonPropertyName" v-if="!response" :clearable="true" placeholder="Enter a json property name"></el-input>
                    <el-input v-model="processVariableName" v-else :clearable="true" placeholder="Enter a process variable name"></el-input>
                  </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog_footer">
                <el-button size="small" type="primary" class="add_reduce_btn submit_btn" @click="dialogJsonPropertyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" class="add_reduce_btn submit_btn" @click="submitChange">保 存</el-button>
            </div>
        </el-dialog>


      <!-- 请求映射 -->
        <div class="margin_empty" style="width:508px">
            <el-table class="full_width border_color"
              style="cursor:pointer"
              fit border size="samll"
              height="149" max-height="149"
              :data="!response?requestMappings:responseMappings"
              :stripe="true"
              highlight-current-row
              :row-class-name="tableRowName" 
              @row-click="rowClick" 
              :row-style="{height:'30px',fontSize:'13px',color:'#333'}"
              :cell-style="{padding:'0px',borderTop:'0',borderBottom:'0', borderColor:'#D4D4D4'}"
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
              <template slot="empty"><span></span></template>
              <el-table-column :prop="!response?'jsonPropertyValue':'jsonPropertyName'" :label="response?'JSON属性':'值'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column :prop="!response?'jsonPropertyName':'processVariableName'" :label="response?'变量':'JSON属性'" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <div class="height_btn">
              <el-button-group>
                <el-button type="primary" size="small" @click="changeTableList('add')" icon="el-icon-plus" class="add_reduce_btn submit_btn"></el-button>
                <el-button type="primary" size="small" @click="changeTableList('reduce')" icon="el-icon-minus" 
                  class="add_reduce_btn submit_btn" :disabled="checkClick()"></el-button>
              </el-button-group>
              <el-button-group>
                <el-button type="primary" size="small" @click="changeTableList('edit')" icon="el-icon-edit"
                  class="add_reduce_btn submit_btn" :disabled="checkClick()"></el-button>
              </el-button-group>
            </div>

            <div class="split_deep_line" v-if="!response"></div>

            <div v-if="!response">
                <el-row :gutter="24">
                  <!-- Request Header表格 -->
                  <el-col :span="12">
                      <el-table 
                        class="full_width border_color"
                        style="cursor:pointer"
                        height="168"
                        max-height="168"
                        fit border size="samll"
                        :data="requestHeaders" 
                        :stripe="true"
                        
                        highlight-current-row
                        :row-class-name="tableRowNameHeader" 
                        @row-click="rowClickHeader" 
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
                          <el-table-column prop="name" min-width="40%" label="Header名称" :show-overflow-tooltip="true"></el-table-column>
                          <el-table-column prop="value" min-width="40%" label="Header值" :show-overflow-tooltip="true"></el-table-column>
                      </el-table>
                      <div class="height_btn">
                        <el-button-group>
                          <el-button type="primary" icon="el-icon-plus" 
                            class="add_reduce_btn submit_btn"
                            @click="changeHeaderTableList('add')"
                          ></el-button>
                          <el-button type="primary" icon="el-icon-minus" 
                            class="add_reduce_btn submit_btn"
                            :disabled="this.requestHeaders.length < 1 || typeof this.selectHeaderTabIndx !== 'number'"
                            @click="changeHeaderTableList('reduce')"
                          ></el-button>
                        </el-button-group>
                      </div>
                  </el-col>
                  <!-- Request Header表单 -->
                  <el-col :span="12" v-show="this.showHeaderForm || this.requestHeaders.length > 0">
                    <el-form :ref="formRef" :model="this.item" label-position="left">
                      <el-form-item class="margin_empty" label="Header 名称"></el-form-item>
                        <el-input 
                          class="full_width"
                          v-model="name" 
                          @change="changeHeaderName"
                          :disabled="this.requestHeaders.length < 1 || typeof this.selectHeaderTabIndx !== 'number'"
                          size="mini"
                        ></el-input>
                      
                      <el-form-item class="margin_empty" label="Header 值"></el-form-item>
                        <el-input 
                          class="full_width"
                          v-model="value" 
                          @change="changeHeaderValue"
                          :disabled="this.requestHeaders.length < 1 || typeof this.selectHeaderTabIndx !== 'number'"
                          size="mini"
                        ></el-input>
                    </el-form>
                  </el-col>
                </el-row>
            </div>

        </div>
  </div>
</template>

<script>
import "../el-styl.css";
import util from "@/js/util";
let { setThemeColor } = util;
export default {
  name: "request",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    formRef: {
      type: String
    },
    response: {
      type: Boolean
    }
  },
  data() {
    return {
      themeColor: {},
      selectTabIndx: null,
      dialogType: "",
      dialogJsonPropertyVisible: false,
      dialogTitle: this.response ? "创建新的响应映射" : "创建新的请求映射",
      propertyTypes: ["string","boolean","long","date"],
      // 请求
      requestMappings: [],
      jsonPropertyType: "string",
      jsonPropertyValue: "",
      jsonPropertyName: "",
      // 响应
      responseMappings: [],
      processVariableType: "string",
      processVariableName: "",
      // 请求头
      requestHeaders: [],
      name: "",
      value: "",
      showHeaderForm: false,
      selectHeaderTabIndx: null
    }
  },
  methods: {
    tableRowName({row, rowIndex}) {
      row.row_index = rowIndex;
    },
    rowClick(row, column, event) {
      if (this.selectTabIndx === row.row_index) {
        // this.selectTabIndx = null;
        // this.getThemeColor();
      } else {
        this.selectTabIndx = row.row_index;
      }
    },
    changeTableList(type) {
      if (type === "add") {
        this.jsonPropertyType = "string";
        this.jsonPropertyValue = "";
        this.jsonPropertyName = "";

        this.processVariableType = "string";
        this.processVariableName = "";

        this.dialogType = "add";
        this.dialogJsonPropertyVisible = true;
        this.$nextTick(() => {
          this.getThemeColor();
        })
      } 
      if (type === "reduce") {
        if (!this.response) {
          this.requestMappings.splice(this.selectTabIndx,1);
          if (this.requestMappings && this.requestMappings.length > 0) {
            this.selectTabIndx = this.requestMappings.length -1;
          }
        } else {
          this.responseMappings.splice(this.selectTabIndx,1);
          if (this.responseMappings && this.responseMappings.length > 0) {
            this.selectTabIndx = this.responseMappings.length -1;
          }
        }
      }
      if (type === "edit") {
        if (!this.response) {
          let requestMappings = this.item.requestMappings[this.selectTabIndx];
          this.jsonPropertyType = requestMappings.jsonPropertyType;
          this.jsonPropertyValue = requestMappings.jsonPropertyValue || "";
          this.jsonPropertyName = requestMappings.jsonPropertyName || "";
        } else {
          let responseMappings = this.item.responseMappings[this.selectTabIndx];
          this.processVariableType = responseMappings.processVariableType;
          this.jsonPropertyName = responseMappings.jsonPropertyName || "";
          this.processVariableName = responseMappings.processVariableName || "";
        }

        this.dialogType = "edit";
        this.dialogJsonPropertyVisible = true;
        this.$nextTick(() => {
          this.getThemeColor();
        })
      }
    },
    changePropertyType(val) {
      !this.response ? this.item.requestMappings[this.selectTabIndx].jsonPropertyType = val : this.item.responseMappings[this.selectTabIndx].processVariableType = val;
    },
    submitChange() {
      if (this.dialogType === "add") {
        if (!this.response) {
          let obj = {
            jsonPropertyType: this.jsonPropertyType || "",
            jsonPropertyValue: this.jsonPropertyValue || "",
            jsonPropertyName: this.jsonPropertyName || ""
          }
          this.requestMappings.push(obj);
          this.selectTabIndx = this.requestMappings.length - 1;
        } else {
          let obj = {
            processVariableType: this.processVariableType || "",
            jsonPropertyName: this.jsonPropertyName || "",
            processVariableName: this.processVariableName || ""
          }
          this.responseMappings.push(obj);
          this.selectTabIndx = this.responseMappings.length - 1;
        }
      }
      if (this.dialogType === "edit") {
        if (!this.response) {
          let requestMappings = this.requestMappings[this.selectTabIndx];
          requestMappings.jsonPropertyType = this.jsonPropertyType || "";
          requestMappings.jsonPropertyValue = this.jsonPropertyValue || "";
          requestMappings.jsonPropertyName = this.jsonPropertyName || ""
        } else {
          let responseMappings = this.responseMappings[this.selectTabIndx];
          responseMappings.processVariableType = this.processVariableType || "";
          responseMappings.jsonPropertyName = this.jsonPropertyName || "";
          responseMappings.processVariableName = this.processVariableName || ""
        }
      }
      this.dialogJsonPropertyVisible = false;
    },
    checkClick() {
      let tet = !this.response ? this.requestMappings.length < 1 : this.responseMappings.length < 1;
      return typeof this.selectTabIndx !== 'number' || tet;
    },
    tableRowNameHeader({row, rowIndex}) {
      row.row_index = rowIndex;
      // for(var i=0;i<this.requestHeaders.length;i++) {
      //   if () {

      //   }
      // }
    },
    rowClickHeader(row, column, event) {
      if (this.selectHeaderTabIndx === row.row_index) {
        // this.selectHeaderTabIndx = null;
        // this.name = this.value = "";
      } else {
        this.selectHeaderTabIndx = row.row_index;
        let requestHeaders = this.item.requestHeaders[this.selectHeaderTabIndx];
        this.name = requestHeaders.name || "";
        this.value = requestHeaders.value || "";
        this.showHeaderForm = true;
      }
    },
    changeHeaderTableList(type) {
      if (type === "add") {
        let obj = {
          name: "",
          value: ""
        }
        this.requestHeaders.push(obj);
        this.selectHeaderTabIndx = this.requestHeaders.length - 1;
      } 
      if (type === "reduce") {
        this.requestHeaders.splice(this.selectHeaderTabIndx,1);

        if (this.requestHeaders && this.requestHeaders.length > 0) {
          this.selectHeaderTabIndx = this.requestHeaders.length -1;
        }
        if (this.item.requestHeaders.length > 0) {
          this.name = this.item.requestHeaders[this.selectHeaderTabIndx].name;
          this.value = this.item.requestHeaders[this.selectHeaderTabIndx].value;
        } else {
          this.name = this.value = "";
          this.showHeaderForm = false;
        }
      }
    },
    changeHeaderName(name) {
      this.item.requestHeaders[this.selectHeaderTabIndx].name = name;
    },
    changeHeaderValue(val) {
      this.item.requestHeaders[this.selectHeaderTabIndx].value = val;
    },
    setThemeColor() {
      let that = this;
      window.addEventListener("storage", function (e) {
        if (e.key === "themeColor") {
          that.themeColor = JSON.parse(e.newValue);
          setThemeColor("condition_btn", that.themeColor, "bg-color", "btn");
          setThemeColor("depend_on_btn", that.themeColor, "bg-color", "btn");
          setThemeColor("add_reduce_btn", that.themeColor, "bg-color", "btn");
          // setThemeColor("dis_add_reduce_btn", that.themeColor, "fs-color", "btn");
        }
      });
    },
    getThemeColor() {
      this.themeColor = JSON.parse(localStorage["themeColor"] || "''");
      setThemeColor("condition_btn", this.themeColor, "bg-color", "btn");
      setThemeColor("depend_on_btn", this.themeColor, "bg-color", "btn");
      setThemeColor("add_reduce_btn", this.themeColor, "bg-color", "btn");
      // setThemeColor("dis_add_reduce_btn", that.themeColor, "fs-color", "btn");
    }
  },
  created() {
    let {requestMappings, responseMappings, requestHeaders} = this.item;
    this.requestMappings = requestMappings;
    this.responseMappings = responseMappings;
    this.requestHeaders = requestHeaders;
    this.setThemeColor();
  },
  mounted() {
    this.getThemeColor();
  }
};
</script>

<style scoped>
  @import url("../icon.css");
  .el-header-title {
    background-image: -webkit-linear-gradient(top,#faf9f9,#ecf0f5)!important;
    height: 94px !important;
    color: #333;
  }
  .edit_select_form {
    width: 100% !important;
    height: auto;
    margin: 16px 8px 30px 8px !important;
  }
</style>
