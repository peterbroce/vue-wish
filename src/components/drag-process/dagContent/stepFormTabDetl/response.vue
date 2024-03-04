<template>
  <div>
    <request :item="item" :formRef="formRef" :response="active"></request>
  </div>
</template>

<script>
import request from './request.vue';
import util from "@/js/util";
let { setThemeColor } = util;
export default {
  name: "response",
  components: {request},
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
      themeColor: {},
      active: true
    }
  },
  methods: {
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
      // setThemeColor("dis_add_reduce_btn", this.themeColor, "fs-color", "btn");
    }
  },
  created() {
    this.setThemeColor();
  },
  mounted() {
    this.getThemeColor();
  }
};
</script>