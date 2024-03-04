<template>
  <div class="current_content">
      <div style="width:520px;height:38px;margin-bottom:18px;text-align:center;line-height:38px;border:1px solid #ccc;border-radius:4px;">
        <span>{{testUrl || "无Endpoint"}}/{{restUrl || "URL"}}</span>
      </div>

      <div style="width:520px">
        <el-form size="mini" label-position="left">

          <div style="margin-bottom:8px">
                <el-form-item class="margin_empty" label="HTTP方法"></el-form-item>
                <el-select class="full_width" v-model="httpMethod" value-key="i" @change="changeHttpMethods($event)"  popper-class="customize_select">
                  <el-option
                    class="item_select"
                    v-for="i in httpMethods"
                    :key="i"
                    :label="i"
                    :value="i">
                  </el-option>
                </el-select>
          </div>
          <div style="margin-bottom:8px">
                <el-form-item class="margin_empty" label="基本Endpoint"></el-form-item>
                <el-select class="full_width" v-model="endpoint" value-key="id" @change="changeSelectEndpoint($event)"  popper-class="customize_select">
                  <el-option
                    class="item_select"
                    v-for="i in endpoints"
                    :key="i.id"
                    :label="i.name"
                    :value="i">
                      <span style="color:#333;font-size:14px;font-family:inherit;">{{selectTxt(i)}}</span>
                  </el-option>
                </el-select>
          </div>
          <div style="margin-bottom:38px">
                <el-form-item class="margin_empty" label="重置URL"></el-form-item>
                <div style="color:#999;font-size:13px;font-family:'Lato', sans-serif;margin-bottom:6px">要添加 URL 参数，使用请求配置选项卡。</div>
                <el-input size="mini" v-model="restUrl" @change="changeRestUrl" placeholder=""></el-input>
          </div>

        </el-form>
      </div>


  </div>
</template>

<script>
import "../el-styl.css";
export default {
  name: "endPoint",
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
      testUrl: "",
      restUrl: "",
      httpMethod: "",
      httpMethods: ["GET","POST","PUT","DELETE"],
      endpoint: null,
      endpoints: [
        {
          id: "0",
          name: "无选中的Endpoint"
        },
        {
          id: 1,
          tenantId: 1,
          name: "TestHttp",
          protocol: "HTTP",
          host: "172.16.16.57",
          port: "8085",
          path: "/test/activiti",
          basicAuthId: null,
          basicAuthName: null,
          requestHeaders: [{
            name: "ihome-token",
            value: "o3eydlmhd71m!1622013827714"
          }]
        }
      ]
    }
  },
  methods: {
    testUrlTxt(i) {
      this.testUrl = this.combinUrlTxt(i);
    },
    combinUrlTxt(i) {
      return i.protocol ? `${i.protocol.toLowerCase()}://${i.host}${i.path}` : void(0);
    },
    selectTxt(i) {
      return i.protocol ? `${i.name} (${this.combinUrlTxt(i)})` : i.name;
    },
    changeHttpMethods(i) {
      this.item.httpMethod = i;
    },
    changeSelectEndpoint(i) {
      console.log('打印i:', i);
      console.log('打印this.item:', this.item);
      this.endpoint = i.protocol ? `${i.name} (${this.combinUrlTxt(i)})` : i.name;
      // if (this.item.endpoint) {

      // }
      i.protocol ? this.$set(this.item, "endpoint", i) : this.$delete(this.item, "endpoint");
      i.protocol ? this.item.requestHeaders.push(i.requestHeaders[0])  : void(0);
      if (!this.item.restUrl) {
        this.restUrl = " ";
      }
      this.testUrlTxt(i);
    },
    changeRestUrl(val) {
      if (val) {
        this.item.restUrl = val;
      } else {
        this.item.restUrl ? this.$delete(this.item, "restUrl") : void(0);
      }
    }
  },
  created() {
    const {httpMethod, restUrl, endpoint} = this.item;
    this.httpMethod = httpMethod || "";
    this.restUrl = restUrl || "";
    this.endpoint = endpoint ? `${endpoint.name} (${this.combinUrlTxt(endpoint)})` : "无选中的Endpoint";
  }
};
</script>

<style scoped>
  @import url("../icon.css");
</style>
