<template>
  <div class="current_content">
    <el-form :ref="formRef" :model="this.item.form" label-width="88px" label-position="left">
      <el-form-item class="margin_empty" :label="formRef ? '当前表单' : '启动表单'">
          <el-select 
            :style="formRef ? 'width:69%':'width:436.5px'" 
            v-model="startFormValue" 
            value-key="id" 
            :filterable="true" 
            @change="changeStartForm($event)"
             popper-class="customize_select"
          >
            <el-option
              v-for="item in totalForms"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <button v-if="formRef" class="open_form_edit" type="button" @click="openFormEdit('create')">创建表单</button>
      </el-form-item>
      <!-- <el-form-item class="margin_empty" label="" v-show="this.startForm.id && this.startForm.mappedVariable"> -->
      <el-form-item class="margin_empty" label="">
        <div class="form_value">
          <!-- 表单字段 -->
          <!-- <div class="form_field_string">
            <span>{{startFormString}}</span>
          </div> -->
          <button v-if="!formRef" class="start_open_form_edit" type="button" @click="openFormEdit('create')">创建表单</button>
          <!-- <button v-show="selectedForm" class="open_form_edit" type="button" @click="openFormEdit('open')">打开表单</button> -->
        </div>
      </el-form-item>
      <!-- <el-form-item class="margin_empty" label="映射变量" v-show="this.startForm.id && this.startForm.mappedVariable && this.startForm.mappedVariable.length">
        <div class="form_value">
          <el-checkbox v-model="isMappingVariable" @change="mappingVariable"></el-checkbox>
          <span class="form_select_text">定义表单内外的变量映射</span>
        </div>
      </el-form-item>
      <div class="margin_empty" :style="item.type?'width:520px':'width:550px'" v-show="isMappingVariable && this.startForm.mappedVariable && this.startForm.mappedVariable.length">
          <el-table class="tableBox full_width border_color"
            style="cursor:pointer"
            fit border size="samll"
            height="168" max-height="168"
            :data="variablesmapping" 
            :stripe="true"
            :highlight-current-row="true"
            :row-class-name="tableRowName" 
            @row-click="rowClick" 
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
            <template slot="empty"><span></span></template>
            <el-table-column v-if="this.item.type" prop="inProcessVariable" label="源流程变量" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mappedVariable" label="表单变量" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outProcessVariable" label="目标流程变量" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <div class="height_btn">
            <el-button-group>
              <el-button type="primary" size="small" @click="changeTableList('add')" icon="el-icon-plus" class="add_reduce_btn"></el-button>
              <el-button type="primary" size="small" @click="changeTableList('reduce')" icon="el-icon-minus" 
                :class="typeof this.selectTabIndx !== 'number' || this.variablesmapping.length < 1 ? 'dis_add_reduce_btn' : 'add_reduce_btn'" 
                :disabled="typeof this.selectTabIndx !== 'number' || this.variablesmapping.length < 1"></el-button>
            </el-button-group>
          </div>
      </div> -->

      <!-- 人工步骤中的表单变量映射 -->
      <!-- <div style="width:520px" v-if="this.item.type && this.variablesmapping.length > 0 && typeof this.selectTabIndx === 'number'">
        <el-form size="small" label-position="left" label-width="88px">
          <el-form-item class="margin_empty" label="映射类型">
          </el-form-item>
          <div style="width:528px">
              <el-button-group>
                <el-button size="small" class="input_output_map_btn" :class="typeOfMapping === 'inputOutputMap' ? 'input_output_map_selected': ''" @click="changeTypeOfMapping('inputOutputMap')">输入/输出映射</el-button>
                <el-button size="small" class="input_output_map_btn" :class="typeOfMapping === 'inputMap' ? 'input_output_map_selected': ''" @click="changeTypeOfMapping('inputMap')">输入映射</el-button>
                <el-button size="small" class="input_output_map_btn" :class="typeOfMapping === 'outputMap' ? 'input_output_map_selected': ''" @click="changeTypeOfMapping('outputMap')">输出映射</el-button>
              </el-button-group>
          </div>

          <div v-show="typeOfMapping === 'inputOutputMap' || typeOfMapping === 'inputMap'">
            <el-form-item class="margin_empty" label="值类型:">
            </el-form-item>
            <div style="width:528px">
              <el-button-group >
                <el-button size="small" class="input_value_type_btn" :class="inVariableType === 'formField' ? 'input_value_type_btn_selected': ''" @click="changeInVariableType('formField')">表单字段</el-button>
                <el-button size="small" class="input_value_type_btn" :class="inVariableType === 'staticValue' ? 'input_value_type_btn_selected': ''" @click="changeInVariableType('staticValue')">变量</el-button>
              </el-button-group>
            </div>
          </div>

          <div v-show="typeOfMapping === 'inputOutputMap' || typeOfMapping === 'inputMap'">
            <el-form-item class="margin_empty" label="源流程变量:"></el-form-item>
            <el-select class="full_width" v-model="inProcessVariable" value-key="mappedVariable" @change="selectInProcessVar">
              <el-option
                v-for="item in startForm.mappedVariable"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                  <span style="color: #333333; font-size: 14px">{{item.name}}</span>
                  <span style="color: #888888; font-size: 12px">-{{item.id}}-{{item.type}}</span>
              </el-option>
            </el-select>
          </div>
          
          <el-form-item class="margin_empty" label="表单字段"></el-form-item>
          <el-select class="full_width" v-model="mappedVariable" value-key="mappedVariable" @change="selectFormField($event)">
            <el-option
              v-for="item in startForm.mappedVariable"
              :key="item.name"
              :label="item.name"
              :value="item">
                <span style="color: #333333; font-size: 14px">{{item.name}}</span>
                <span style="color: #888888; font-size: 12px">-{{item.id}}-{{item.type}}</span>
            </el-option>
          </el-select>
          
          <div v-show="typeOfMapping === 'inputOutputMap' || typeOfMapping === 'outputMap'">
            <el-form-item class="margin_empty" label="值类型:">
            </el-form-item>
            <div style="width:528px">
              <el-button-group >
                <el-button size="small" class="output_value_type_btn" :class="this.outputValueTypeBtn === 1 ? 'output_value_type_btn_selected': ''" @click="changeOutVariableType(1)">新变量</el-button>
                <el-button size="small" class="output_value_type_btn" :class="this.outputValueTypeBtn === 2 ? 'output_value_type_btn_selected': ''" @click="changeOutVariableType(2)">表单字段</el-button>
                <el-button size="small" class="output_value_type_btn" :class="this.outputValueTypeBtn === 3 ? 'output_value_type_btn_selected': ''" @click="changeOutVariableType(3)">变量</el-button>
              </el-button-group>
            </div>
          </div>

          <div v-show="typeOfMapping === 'inputOutputMap' || typeOfMapping === 'outputMap'">
            <el-form-item class="margin_empty" label="目标流程变量" label-width="188"></el-form-item>
            <el-input 
              v-if="this.outputValueTypeBtn === 1"
              class="full_width"
              v-model="outProcessVariable" 
              @change="setOutProcessVar"
              size="mini"
            ></el-input>
            
            <el-select 
              v-if="this.outputValueTypeBtn === 2" 
              class="full_width" 
              v-model="outProcessVariable" 
              @change="setOutProcessVar"
              value-key="mappedVariable">
              <el-option
                v-for="item in startForm.mappedVariable"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                  <span style="color: #333333; font-size: 14px">{{item.name}}</span>
                  <span style="color: #888888; font-size: 12px">-{{item.id}}-{{item.type}}</span>
              </el-option>
            </el-select>

            <el-select 
              v-if="this.outputValueTypeBtn === 3" 
              class="full_width" 
              v-model="outProcessVariable" 
              @change="setOutProcessVar"
              value-key="mappedVariable">
              <el-option
                v-for="item in startForm.mappedVariable"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                  <span style="color: #333333; font-size: 14px">{{item.name}}</span>
                  <span style="color: #888888; font-size: 12px">-{{item.id}}-{{item.type}}</span>
              </el-option>
            </el-select>
          </div>
          
        </el-form>
      </div> -->

      <!-- 流程开始中的表单变量映射 -->
      <!-- <div style="width:550px" v-if="!this.item.type && typeof this.selectTabIndx === 'number' && this.variablesmapping.length > 0">
          <el-form-item class="margin_empty" label="表单字段"></el-form-item>
            <el-select class="full_width" v-model="mappedVariable" value-key="name" @change="selectFormField($event)">
              <el-option
                v-for="item in startForm.mappedVariable"
                :key="item.name"
                :label="item.name"
                :value="item">
                  <span style="color: #333333; font-size: 14px">{{item.name}}</span>
                  <span style="color: #888888; font-size: 12px">-{{item.id}}-{{item.type}}</span>
              </el-option>
            </el-select>
          
          <el-form-item class="margin_empty" label-width="188" label="值类型： 目标流程变量"></el-form-item>
            <el-input 
              class="full_width"
              v-model="outProcessVariable" 
              @change="setOutProcessVar"
              size="mini"
            ></el-input>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import "../el-styl.css";
import util from "@/js/util";
let { setThemeColor, openIframe } = util;
export default {
  name: "formVarMap",
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
      selectedForm: false,
      themeColor: {},
      $_index: null,
      DataAll: {},
      totalForms: [],
      startFormOptions: [],
      startFormOption: [
        {
          name: '无选中的表单',
          id: '0'
        }
        // {
        //   name: '表单一',
        //   id: '66',
        //   "description": "test",
        //   "version": 1,
        //   "lastUpdatedBy": 1,
        //   "lastUpdatedByFullName": " Administrator",
        //   "lastUpdated": "2021-03-12T10:01:23.007+0000",
        //   "stencilSetId": 0,
        //   "referenceId": null,
        //   "formDefinition": null,
        //   mappedVariable: [
        //     {
        //       name: "Label6",
        //       id: "label6",
        //       type: "text"
        //     },
        //     {
        //       name: "Label66",
        //       id: "label66",
        //       type: "multi-line-text"
        //     },
        //     {
        //       name: "Label666",
        //       id: "label666",
        //       type: "select"
        //     }
        //   ]
        // }, {
        //   name: '表单二',
        //   id: '88',
        //   "description": "test",
        //   "version": 1,
        //   "lastUpdatedBy": 1,
        //   "lastUpdatedByFullName": " Administrator",
        //   "lastUpdated": "2021-03-12T10:01:23.007+0000",
        //   "stencilSetId": 0,
        //   "referenceId": null,
        //   "formDefinition": null,
        //   mappedVariable: [
        //     {
        //       name: "Label8",
        //       id: "label8",
        //       type: "date"
        //     },
        //     {
        //       name: "Label88",
        //       id: "label88",
        //       type: "select"
        //     },
        //     {
        //       name: "Label888",
        //       id: "label888",
        //       type: "text"
        //     }
        //   ]
        // }, {
        //   name: '表单三',
        //   id: '99',
        //   "description": "test",
        //   "version": 1,
        //   "lastUpdatedBy": 1,
        //   "lastUpdatedByFullName": " Administrator",
        //   "lastUpdated": "2021-03-12T10:01:23.007+0000",
        //   "stencilSetId": 0,
        //   "referenceId": null,
        //   "formDefinition": null,
        //   mappedVariable: []
        // }
      ],
      startFormValue: "无选中的表单",
      startFormString: "",
      startForm: {
        mappedVariable: []
      },
      isMappingVariable: false,
      selectTabIndx: null,
      mappedVariable: "选择字段",
      startMappedVariable: "选择字段",
      variablesmapping: null,
      inProcessVariable: "",
      outProcessVariable: "",
      // 变量映射类型
      outputValueTypeBtn: 1,
      typeOfMapping: "inputOutputMap",
      inVariableType: "formField",
      outVariableType: "staticValue"
    }
  },
  methods: {
    startFormLabel() {
      return this.formRef ? '当前表单' : '启动表单'
    },
    setFormString (obj) {
      let startFormLabel = [];
      // if (obj.mappedVariable.length) {
      if (obj.mappedVariable) {
        for(let i=0;i<obj.mappedVariable.length;i++) {
          startFormLabel.push(obj.mappedVariable[i].name)
        }
        this.startFormString = startFormLabel.join(" , ");
      } else {
        this.startFormString = "表单还没有字段...";
      }
    },
    changeStartForm(obj) {
      // if (obj.mappedVariable) {
      if (obj.htmlCodes) {
        this.selectedForm = true;
        sessionStorage["selectForm"] = JSON.stringify(obj);
        this.startForm = JSON.parse(JSON.stringify(obj));
        if (this.item.type) {
          this.item.formDefinition = this.startForm;
        } else {
          this.$_index.DataAll.startForm = this.startForm;
        }
        this.setFormString(this.startForm);
      } else {
        this.selectedForm = false;
        sessionStorage.removeItem("selectForm");
        if (this.item.type) {
          this.variablesmapping = [];
          this.item.formDefinition = this.startForm = {};
          this.$delete(this.item, "variablesmapping");
        } else {
          this.variablesmapping = [];
          this.$_index.DataAll.startForm = this.startForm = {};
        }
        this.isMappingVariable = false;
      }
    },
    openFormEdit(val) {
      if (val === "create") {
        if (sessionStorage["selectForm"]) {
          sessionStorage.removeItem("selectForm");
          sessionStorage.removeItem("allWidgetConfig");
          localStorage.removeItem("formId");
        }
        openIframe({
          key: "pageConfigDetail",
          text: "创建表单",
          param: {
            type: "add"
          }
        });
      }
      if (val === "open") {
        openIframe({
          key: "publicPage",
          text: this.startForm.name,
          param: {}
        });
      }
    },
    mappingVariable(val) {
      if(!val) {
        this.variablesmapping = [];
      }
    },
    changeTableList(type) {
      if (type === "add") {
        this.mappedVariable = "";
        this.inProcessVariable = "";
        this.outProcessVariable = "";

        this.typeOfMapping = "inputOutputMap";
        this.inVariableType = "formField";
        this.outVariableType = "staticValue";
        this.outputValueTypeBtn = 1;

        const obj = {
          mappedVariable: "",
          inProcessVariable: "",
          outProcessVariable: "",
          typeOfMapping: this.item.type ? "inputOutputMap" : "outputMap",
          inVariableType: "formField",
          outVariableType: "staticValue"
        }
        this.variablesmapping.push(obj);
        console.log('selectTabIndx-1:', this.selectTabIndx);
        this.selectTabIndx = this.variablesmapping.length - 1;
        console.log('selectTabIndx-2:', this.selectTabIndx);
      } else {
        this.variablesmapping.splice(this.selectTabIndx,1);
        this.mappedVariable = "";
        if (this.variablesmapping && this.variablesmapping.length > 0) {
          this.selectTabIndx = this.variablesmapping.length -1;
        }
      }
    },
    tableRowName({row, rowIndex}) {
      row.row_index = rowIndex;
    },
    rowClick(row, column, event) {
      if (this.selectTabIndx === row.row_index) {
        this.selectTabIndx = null;
      } else {
        this.selectTabIndx = row.row_index;
        let variablesmapping = this.variablesmapping[this.selectTabIndx];

        this.typeOfMapping = variablesmapping.typeOfMapping;
        this.inVariableType = variablesmapping.inVariableType;
        this.outVariableType = variablesmapping.outVariableType;
        this.outputValueTypeBtn = this.outVariableType === "formField" ? 2 : 1;

        this.mappedVariable = variablesmapping.mappedVariable;
        this.inProcessVariable = variablesmapping.inProcessVariable;
        this.outProcessVariable = variablesmapping.outProcessVariable;
      }
    },
    selectFormField(obj) {
      let variablesmapping = this.variablesmapping[this.selectTabIndx];
      variablesmapping.mappedVariable = obj.name;
      if (this.item.type) {
        if (variablesmapping.outProcessVariable && variablesmapping.inProcessVariable) {
          this.item.variablesmapping = this.variablesmapping;
        }
      } else {
        if (variablesmapping.outProcessVariable) {
          this.$_index.DataAll.variablesmapping = this.variablesmapping;
        }
      }
    },
    selectInProcessVar(val) {
      let varMapping = this.variablesmapping[this.selectTabIndx];
      varMapping.inProcessVariable = val;
      if (varMapping.outProcessVariable && varMapping.mappedVariable) {
        this.item.variablesmapping = this.variablesmapping;
      }
    },
    setOutProcessVar(val) {
      let outProcessVariable = val.replace(/^[0-9]+[a-zA-Z0-9]*$/g, ''),
        varMapping = this.variablesmapping[this.selectTabIndx];

      varMapping.outProcessVariable = this.outProcessVariable = outProcessVariable || "";

      if (this.item.type) {
        if (varMapping.mappedVariable && varMapping.inProcessVariable) {
          this.item.variablesmapping = this.variablesmapping;
        }
      } else {
        if (varMapping.mappedVariable) {
          this.$_index.DataAll.variablesmapping = this.variablesmapping;
        }
      }
    },
    changeTypeOfMapping(type) {
      this.outputValueTypeBtn = 1;
      let varMapping = this.variablesmapping[this.selectTabIndx];

      varMapping.typeOfMapping = this.typeOfMapping = type;
      varMapping.inVariableType = this.inVariableType = "formField";
      varMapping.outVariableType = this.outVariableType = "staticValue";

      varMapping.inProcessVariable = this.inProcessVariable = "";
      varMapping.outProcessVariable = this.outProcessVariable = "";
      varMapping.mappedVariable = this.mappedVariable = "";
    },
    changeInVariableType(type) {
      let varMapping = this.variablesmapping[this.selectTabIndx];
      varMapping.inProcessVariable = this.inProcessVariable = "";
      this.inVariableType = type;
    },
    changeOutVariableType(num) {
      let varMapping = this.variablesmapping[this.selectTabIndx];
      varMapping.outProcessVariable = this.outProcessVariable = "";
      this.outputValueTypeBtn = num;
      this.outVariableType = num === 2 ? "formField" : "staticValue";
    },
    setThemeColor() {
      let that = this;
      window.addEventListener("storage", function (e) {
        if (e.key === "themeColor") {
          that.themeColor = JSON.parse(e.newValue);
          setThemeColor("open_form_edit", that.themeColor, "bg-color", "btn");
          setThemeColor("start_open_form_edit", that.themeColor, "bg-color", "btn");
        }
      });
    },
    getThemeColor() {
      this.themeColor = JSON.parse(localStorage["themeColor"] || "''");
      setThemeColor("open_form_edit", this.themeColor, "bg-color", "btn");
      setThemeColor("start_open_form_edit", this.themeColor, "bg-color", "btn");
    }
  },
  created() {
    if (sessionStorage["allWidgetConfigStr"]) {
      this.startFormOptions = JSON.parse(sessionStorage["allWidgetConfigStr"] || "''");
      this.$set(this.startFormOptions, "mappedVariable", []);
      this.totalForms = [...this.startFormOption, ...this.startFormOptions];
    } else {
      this.totalForms = this.startFormOption;
    }
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
    // 获取数据
    let thisForm = this.item.type ? this.item : this.$_index.DataAll;
    this.startForm = thisForm.formDefinition || thisForm.startForm || {};
    // if (this.startForm.id) {
    //   let mappedVariable = this.startFormOptions.filter(mapped => mapped.id === this.startForm.id)[0];
    //   this.$set(this.startForm, 'mappedVariable', mappedVariable.mappedVariable);
    // }
    // if (this.startForm.mappedVariable) {
    if (this.startForm.htmlCodes) {
      this.selectedForm = true;
      sessionStorage["selectForm"] = JSON.stringify(this.startForm);
      this.startFormValue = this.startForm.name || "无选中表单";
      this.setFormString(this.startForm);
    }
    if (thisForm.variablesmapping) {
      this.variablesmapping = thisForm.variablesmapping;
      this.isMappingVariable = this.variablesmapping.length > 0;
    }
    this.setThemeColor();
  },
  mounted() {
    this.getThemeColor();
  }
};
</script>

<style scoped>
  @import url("../icon.css");
  .el-button .is-disabled {
    color: #fff !important;
    font-size: 15px !important;
    margin-right: 1px !important;
    background: #9BB3B9 !important;
    border: 1px solid #9BB3B9 !important;
  }
</style>
