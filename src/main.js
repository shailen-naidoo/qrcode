import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios,axios);

Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App)
})
