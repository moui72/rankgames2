import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';

import App from './App.vue';
import store from './store/store.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import GameDetail from './pages/game-detail.vue';

Vue.use(VueRouter);
Vue.use(BootstrapVue);

const routes = [{ path: '/game/:id', component: GameDetail }];
const router = new VueRouter({ routes });

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
