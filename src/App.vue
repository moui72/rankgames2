<template>
  <b-container id="app">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#"> {{title}} <small>{{version}}</small></b-navbar-brand>
       <b-collapse is-nav id="nav_dropdown_collapse">
         <b-navbar-nav>
           <b-nav-item href="/">Home</b-nav-item>
           <b-nav-item v-b-modal="'import'">Import</b-nav-item>
         </b-navbar-nav>
       </b-collapse>
    </b-navbar>
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
import Lib from './components/library.vue';
import Import from './components/import.vue';

export default {
  name: 'app',
  components: {
    Lib,
    Import
  },
  data() {
    return {
      title: 'Rank Games',
      version: '0.0.1',
      focus: false
    };
  }
};
</script>

<style lang="scss">
</style>
