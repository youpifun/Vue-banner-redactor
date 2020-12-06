import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import { ColorPicker } from 'vue-color-gradient-picker';
Vue.use(VueKonva);
Vue.use(ColorPicker);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
