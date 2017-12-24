import Vue from 'vue';
import Vuex from 'vuex';

import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import store from './store/store.js';

Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
