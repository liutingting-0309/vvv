import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(router)
import TreeTable from 'vue-table-with-tree-grid'
import './js/axios.js'

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
 
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
