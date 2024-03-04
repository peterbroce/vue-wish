let Util = {
    queryCurrentHeight(item) {
        if (item.processStep === "main") {
          let dom = document.querySelector(`.${item.id}`);
          let height = window.getComputedStyle(dom).getPropertyValue("height");
          height = height.replace("px","");
          return Number(height);
        }
    }
};
export default Util;