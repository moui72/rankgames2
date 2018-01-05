<template>
  <b-container id="app">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#"> {{title}} <small>{{version}}</small></b-navbar-brand>
       <b-collapse is-nav id="nav_dropdown_collapse">
         <b-navbar-nav>
           <b-nav-item href="/">Home</b-nav-item>
           <b-nav-item v-b-modal="'import'">Import</b-nav-item>
           <b-nav-item v-b-modal="'settings'" title="settings">
             <icon name="cog"></icon>
             <span class="sr-only">settings</span>
           </b-nav-item>
         </b-navbar-nav>
       </b-collapse>
    </b-navbar>
    <b-modal
      id="settings"
      title="Settings"
      ok-title="Close"
      ok-variant="primary"
      ok-only>
      <b-form-group
        label="Games per page"
        description="How many games to show on each page.
          Lower values may provide better performance.">

        <b-form-select @change="setPerPage" v-model="perPage">
          <option v-for="n in 9" :value="n*12">
            {{n * 12}} items
          </option>
        </b-form-select>
      </b-form-group>
    </b-modal>
    <b-modal
      id="import"
      title="Import"
      ok-only
      ok-title="Close"
      ok-variant="secondary">
      <import></import>
    </b-modal>
    <lib></lib>
  </b-container>
</template>

<script>
import { mapMutations } from 'vuex';
import Lib from './components/library.vue';
import Import from './components/import.vue';
import Icon from 'vue-awesome';

export default {
  name: 'app',
  components: {
    Lib,
    Import,
    Icon
  },
  data() {
    return {
      title: 'Rank Games',
      version: '0.0.1',
      focus: false,
      perPage: 24
    };
  },
  methods: {
    ...mapMutations(['setPerPage'])
  }
};
</script>

<style lang="scss">
</style>
