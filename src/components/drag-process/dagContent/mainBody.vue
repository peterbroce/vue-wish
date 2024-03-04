<template>
    <foreignObject v-if="isVertical()" width="180" height="33" >
            <body xmlns="http://www.w3.org/1999/xhtml" style="margin: 0" @mouseover="overStepBody" @mouseout="outStepBody">
              <div @mouseover="overStepBody($event, item)" @mouseout="outStepBody($event, item)">
                <div :class="this.checkStatus(item)">
                  <div class="title" @click="selNode(item)">
                    <div style="width:298px;margin:auto">
                      <div style="width:20px;height:20px;display:inline-block;line-height:20px;">
                        <div v-show="item.overing || item.selected" class="icon-bg-start" :class="this.checkSelectIcon(item)"></div>
                      </div>
                      <i class="start_text_name">{{item.name}}</i>
                    </div>
                  </div>
                  <div class="step_form">
                    <step-form :item="item"></step-form>
                  </div>
                </div>
                <div :class="currentEvent === 'dragLink' ? 'pane-node-parent-hl' : 'pane-node-parent' ">
                  <!-- <div v-for="(poi, nth) in item.in_ports" :key="'__' + nth" :style="{width: `${ 100 / (item.in_ports.length + 1)}%`}">
                    <span class="space" @mouseup="$emit('linkEnd', i, nth)"></span>
                  </div> -->
                  <div style="width:50%"><span class="space"></span></div>
                </div>
              </div>
            </body>
    </foreignObject>
</template>

<script>
  import stepForm from "./stepForm";
  export default {
    components: {
      stepForm
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        choice: {
            type: Object,
            default: () => {}
        },
        currentEvent: {
            type: String,
            default: () => ''
        },
        i: {
            type: Number,
            default: () => 0
        },
        formDetail: {
          type: Object,
          default: () => {}
        }
    },
    data() {
        return {
          onMouse: false
        }
    },
    methods: {
      overStepBody() {
        this.$set(this.item, "overing", 1);
      },
      outStepBody() {
        this.$delete(this.item, "overing");
      },
      checkStatus(item) {
        let otherStatus = "", selectStatus = "", nodeStyle = "start_pane_node_content";

        if (this.choice.paneNode.indexOf(item.id) !== -1) {
          // selectStatus = "selected";
          selectStatus = "selectd_start_pane_node_content";
          // if (item.hasVariablesmapping) {
          //   otherStatus = "has_variables_mapping";
          // }
        } else {
          otherStatus = "";
        }

        return nodeStyle + " " + selectStatus + " " + otherStatus;
      },
      checkSelectIcon(item) {
        let defaultIcon = "arrow-right";
        if (this.choice.paneNode.indexOf(item.id) !== -1) {
          defaultIcon = "arrow-down";
        }
        return defaultIcon;
      },
      clickIcon(item, e) {
        let clientX = e.clientX;
        let clientY = e.clientY;
        this.$emit('nodesPersonalEvent', 'dbClickNodeIcon', item.id, item, clientX, clientY);
      },
      isVertical() {
        let GlobalConfig = { isVertical: true }
        let _GlobalConfig = localStorage.getItem('GlobalConfig')
        if (_GlobalConfig && _GlobalConfig.length > 0) {
          GlobalConfig = Object.assign(GlobalConfig, JSON.parse(_GlobalConfig))
        }
        return GlobalConfig.isVertical
      },
      selNode(item) {
        this.$emit('selPaneNode', item.id, 'clickNodeHeader');
      }
    }
  }
</script>

<style scoped>
@import url("./icon.css");
foreignObject {
  overflow: visible;
}
.icon-coin {
  background-size: 20px 20px;
  background: url("./icon/email.svg") no-repeat;
}
.noIcon {
  width: 20px;
  height: 20px;
  margin: 5px;
  float: left;
  font-size: 18px;
  line-height: 20px;
}
.step_form {
  margin: 18px 0 0 18px;
  width: 100%;
  /* height: 99px; */
  height: auto;
  /* overflow-y: hidden; */
  /* border: 1px solid #ccc; */
}

/* 收起开始步骤-start */
  .start_pane_node_content {
    /* box-shadow: 0 0 16px rgba(138, 137, 137, 0.5); */
    box-sizing: border-box;
    height: 35px !important;
    /* width: 398px !important; */
    width: 298px !important;
    text-align: center;
    /* background-color: hsla(0, 0%, 100%, 1); */
    background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
    /* border: 3px solid #888888; */
    /* border: 3px solid #aaaaaa; */
    border: 3px solid #CDD6EC;
    overflow: hidden;
    border-radius: 18px;
    font-size: 12px;
    /* transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38); */
    /* transition: 0.218s height cubic-bezier(.46, 1, .23, 1.18); */
    /* -webkit-transition: width 0.2s;
    transition: width 0.2s; */
  }
/* 收起开始步骤-end */


/* 展开开始步骤-start */
  .selectd_start_pane_node_content {
    /* box-shadow: 0 0 16px rgba(138, 137, 137, 0.5); */
    box-sizing: border-box;
    /* width: 398px !important; */
    height: 238px !important;
    width: 598px !important;
    text-align: center;
    /* background-color: hsla(0, 0%, 100%, 1); */
    background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
    /* border: 3px solid #aaaaaa; */
    border: 3px solid #CDD6EC;
    border-radius: 18px;
    font-size: 12px;
    transition: 0.318s all cubic-bezier(.46, 1, .23, 1.38);
    /* transition: 0.318s height cubic-bezier(.46, 1, .23, 1.88); */
    /* -webkit-transition: width 0.2s;
    transition: width 0.2s; */
  }
/* 展开开始步骤-end */

.has_variables_mapping {
  height: 468px !important;
}

.icon {
  width: 20px;
  height: 20px;
  /* margin: 5px 5px 5px 136px; */
  margin: 5px;
  border-radius: 0;
  /* float: left; */
  color: #000;
  font-size: 18px;
  line-height: 20px;
  /* background-color: #fff; */
  cursor: pointer;
  text-align: center;
}
.parentLink {
  font-size: 0;
  height: 12px;
  width: 12px;
  position: absolute;
  top: 0;
  left: 90px;
  transform: translateX(-50%);
  border-top: 6px solid black;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.childLink {
  height: 10px;
  width: 10px;
  position: absolute;
  bottom: 0;
  left: 90px;
  transform: translate(-50%, 50%);
  border-radius: 50%;
  background: #ffffff;
  cursor: crosshair;
}
.name {
  float: left;
  margin-left: 2px;
  width: 135px;
  line-height: 28px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  height: 26px;
  background: transparent;
  border: none;
}

.text_name {
  /* float: left; */
  margin-left: 2px;
  width: 135px;
  line-height: 28px;
  font-size: 18px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  height: 26px;
  background: transparent;
  border: none;
}
.title {
  position: relative;
  height: 33px;
  width: 100%;
  font-size: 16px;
  /* font-weight: bold; */
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  /* border-bottom: 2px solid rgb(226, 226, 226); */
  /* background-image: -webkit-linear-gradient(top,#f5f5f5,#eee) !important; */
}
.pane-node-parent-hl {
  position: fixed;
  top: -5px;
  height: 10px;
  width: 100%;
  display: flex;
  transform: translateX(6px);
}
.pane-node-parent-hl .space {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(158, 158, 158);
    background: #ffffff;
    position: absolute;
    right: 0;
    top: 0px;
    cursor: crosshair;
}
.pane-node-parent-hl .space:hover {
  box-shadow: 0 0 0 6px #3ddd73;
}
.paneSuccess {
  background: #3ddd73 !important;
}
.pane-node-parent-hl > div {
  position: relative;
  display: inline-block;
}
#parent-cross {
  top: 8px ;
  height: 100% ;
  width: 10px ;
  left: -10px ;
}
#parent-cross .space {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-0);
}
#children-cross {
    top:0px;
    right: 0;
    height: 100%;
    width: 10px;
    position: fixed;
}
#children-cross .space{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.pane-node-parent {
  position: fixed;
  top: -5px;
  height: 10px;
  width: 100%;
  display: flex;
  opacity: 0;
  transform: translateX(6px);
}
.pane-node-parent .space {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid gray;
    background: #ffffff;
    position: absolute;
    right: 0;
    top: 0;
}

.pane-node-parent > div {
  position: relative;
  display: inline-block;
}

.pane-node-children {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  opacity: 1;
  transform: translateX(6px);
}
.pane-node-children .space{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgb(158, 158, 158);
    background: #ffffff;
    position: absolute;
    right: 0px;
    bottom: -6px;
    cursor: crosshair;
}
.pane-node-children .space:hover {
   /* background: #cccccc; */
   background: #5093E1;
}
/* .pane-node-children:hover {
  opacity: 1;
} */

.pane-node-children > div {
  position: relative;
  display: inline-block;
}
</style>
