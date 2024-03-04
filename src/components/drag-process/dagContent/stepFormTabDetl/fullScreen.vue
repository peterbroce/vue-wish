<template>
  <div>
    <el-dialog 
      class="current_content"
      width="1000px" 
      top="38px" 
      :fullscreen="true" 
      :visible.sync="dialogDetailVisible" 
      :append-to-body="true" 
      :center="false"
      @close="closeDialog"
    >
      <div slot="title" class="el-header-title">
        <div class="title-content">{{item.name}}</div>
      </div>

      <div v-if="isShowSelect()">
        <div width="100%" height="100%" style="z-index:1;position:relative">
          <div :style="menu_style()">
              <div class="menu_contain">
                <div class="menu_content_title">
                  <span class="create_bar_title">选择要添加的步骤</span>
                  <span class="close_create" @click="click_menu_cover($event)">关闭</span>
                </div>
                <div style="margin:0 6px;" v-for="(node,index) in subStepNodes" :key="node.key+'_'+index">
                  <span @click="selectStep(node)"><i class="step_icon" :class="node.minIconClass"></i>{{node.value}}</span>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div style="width:100%;height:100%">
        <step-detail
          :item="item"
          :choice="choice"
          :showFull="dialogDetailVisible"
          :lsStepAll.sync="lsStepAll"
          :subStepNodes="subStepNodes" 
          :choices="choices"
        ></step-detail>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import stepDetail from "../stepDetail";
export default {
  name: "fullScreen",
  components: {stepDetail},
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
    isSelectArea: {
      type: Object,
      default: () => {
        return {
        value: false,
        x: -9999,
        y: -9999,
        id: null,
        selectTypeOpions: {}
        }
      }
    }
  },
  data() {
    return {
      $_index: {},
      dialogDetailVisible: false
    }
  },
  methods: {
    showFull() {
      this.dialogDetailVisible = !this.dialogDetailVisible;
    },
    isShowSelect() {
      return this.isSelectArea.value;
    },
    menu_style() {
      // let left = this.isSelectArea.x - 199;
      // let top = this.isSelectArea.y + 18;
      let left = 500, top = 200;
      return {
        position: "absolute",
        left: left + 'px',
        top: top + 'px'
      }
    },
    click_menu_cover() {
      this.$_index.close_select_nodes();
      this.isSelectArea = { value: false, x: -9999, y: -9999 };
    },
    selectStep(node) {
      this.$_index.subInsertStepType(this.isSelectArea.selectTypeOpions, node);
      this.click_menu_cover();
    },
    closeDialog() {
      this.click_menu_cover();
    }
  },
  created() {
    this.$_index = this.$root.$children[0].$children[0].$children.filter(node => node.$vnode.tag.indexOf("dragProcess")>0)[0];
  }
};
</script>

<style scoped>
  @import url("../icon.css");
/* 创建面板样式 */
.menu_contain {
  cursor: default !important;
}
.create_bar_title {
  position: fixed;
  left: 10px;
  width: 180px !important;
  display: inline-block;
}
.create_bar_title:hover {
  background-color: transparent !important;
  cursor: default !important;
}
.close_create {
  position: fixed;
  right: 0;
  width: 50px !important;
  display: inline-block;
}
.close_create:hover {
  background-color: transparent !important;
  color: #000 !important;
}
/* 弹窗样式-start */
 .el-dialog__body {
  padding: 30px 20px !important;
  }
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__headerbtn {
    top: 5px !important;
    right: 5px !important;
    padding-top: 10px !important;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #000 !important;
    height: 30px !important;
    width: 35px !important;
    line-height: 88px !important;
  }
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #000 !important;
  }
  .el-header-title {
    background-image: none !important;
    height: 38px !important;
    color: #333;
  }
  .dele_select_form {
    width: 100%;
    height: auto;
    font-size: 15px;
    color: #000;
    margin: 8px !important;
    /* border: 1px solid #ccc; */
  }
  .title-content {
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    font-weight: normal !important;
    padding: 0 20px;
    margin-bottom: 18px;
  }
  .el-dialog__wrapper {
    background: #383838 !important;
  }
/* 弹窗样式-end */
</style>
