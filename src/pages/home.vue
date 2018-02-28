<template>
  <div>
    <library></library>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Library from '../components/library.vue';
import Icon from 'vue-awesome';

export default {
  name: 'home',
  components: {
    Library
  }
};
</script>

<style lang="scss">
</style>
