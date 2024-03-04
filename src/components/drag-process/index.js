import SVGContent from './dagContent'
// import NodeBus from './nodeBus'
// const dragFlow = {
//   install(Vue, options) {
//     Vue.component(SVGContent.name, SVGContent)
//     // Vue.component(NodeBus.name, NodeBus)
//   }
// }

SVGContent.install = function(Vue) {
  Vue.component(SVGContent.name, SVGContent);
}

const dragFlow = SVGContent;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(dragFlow)
}

export default dragFlow
