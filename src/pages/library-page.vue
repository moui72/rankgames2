<template>
  <library></library>
</template>
<script>
import { mapGetters } from 'vuex';
import Library from '../components/library.vue';
import Icon from 'vue-awesome';

export default {
  name: 'LibraryPage',
  props: { id: Number },
  components: {
    Library
  }
};
</script>
<style lang="scss"></style>
