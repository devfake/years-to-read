import Vue from "vue"
import App from "./App.vue"
import VModal from 'vue-js-modal'

Vue.use(VModal)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount("#app")
