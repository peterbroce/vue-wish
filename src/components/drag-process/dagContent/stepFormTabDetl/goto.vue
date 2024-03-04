<template>
  <div class="current_content">
    <el-form :ref="formRef" :model="this.item" label-width="98px" label-position="left" size="mini">
          <el-form-item class="margin_empty" label="转至步骤">
            <el-select 
              ref="select"
              class="goto_select" 
              v-model="gotoStep" 
              value-key="id" 
              placeholder="选择步骤..."
              @change="changeGotoStep($event)" 
              popper-class="customize_select"
            >
              <el-option
                class="item_select"
                v-for="item in [...gotoStepList, ...lsStepAll]"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
                <el-popover v-if="item.name.length >= 16" placement="right" width="218" trigger="hover">
                  <p class="sele_popvr">{{ item.name }}</p>
                  <span slot="reference">{{ item.name.slice(0,16) + '...' }}
                    <span class="sele_op"> {{item.stepType}}</span>
                  </span>
                </el-popover>
                <span v-else>{{ item.name }}
                  <span v-if="item.stepType" class="sele_op"> {{item.stepType}}</span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "goto",
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
    }
  },
  data() {
    return {
      gotoStep: null,
      gotoStepList: [
        {
          "name": "无选中的步骤"
        }
      ]
    }
  },
  methods: {
    changeGotoStep(val) {
      if (val.id) {
        this.item.gotoStep ? this.item.gotoStep = JSON.parse(JSON.stringify(val)) : this.$set(this.item, "gotoStep", val);
      } else {
        this.item.gotoStep ? this.$delete(this.item, "gotoStep") : void(0);
      }
    }
  },
  created() {
    console.log('打印lsStepAll:', this.lsStepAll);
    // let lsStepList = [];
    // if (localStorage["lsStepAll"]) {
    //   lsStepList = JSON.parse(localStorage["lsStepAll"] || "''");
    // }
    // lsStepList.forEach(i=>{
    //   this.gotoStepList.push(i);
    // });
  }
};
</script>

<style scoped>
  @import url("../icon.css");
  .sele_popvr {
    color: #333;
    font-size: 12px;
    cursor: default;
  }
  .sele_op {
    color: #aaa; 
    font-size: 12px;
  }
</style>
