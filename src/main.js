import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import VuejsDialog from "vuejs-dialog";

import App from "./App.vue";
import store from "./store/store.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import GameDetail from "./pages/game-detail.vue";
import Lists from "./pages/lists-page.vue";
import Home from "./pages/home.vue";
import ListPage from "./pages/list-page.vue";
import LibraryPage from "./pages/library-page.vue";


Vue.use(VuejsDialog);
Vue.use(VueRouter);
Vue.use(BootstrapVue);

Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(value).format("MM/DD/YYYY hh:mm");
  }
});

const routes = [{
    path: "/lists",
    component: Lists
  },
  {
    path: "/game/:id",
    component: GameDetail
  },
  {
    path: "/list/:id",
    component: ListPage
  },
  {
    path: "/lib",
    component: LibraryPage,
    name: "Library"
  },
  {
    path: "/",
    component: Home,
    name: "Home"
  }
];
const router = new VueRouter({
  routes
});

const app = new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});

if (!app) {
  console.error("app not loaded");
}