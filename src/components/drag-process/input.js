export default (Vue) => {
  Vue.directive('focus', {
    inserted: function (el) {
      if (el.tagName.toLocaleLowerCase() == 'input') {
        el.focus()
      } else {
        if (el.getElementsByTagName('input')) {
          el.getElementsByTagName('input')[0].focus()
        }
      }
    }
  })
};