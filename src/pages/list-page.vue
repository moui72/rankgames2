<template>
  <div>
    <list :id="id"></list>
  </div>
</template>
<script>
import List from '../components/list.vue';
export default {
  name: 'ListPage',
  components: { List },
  data: () => {
    return {};
  },
  computed: {
    id() {
      return this.$route.params.id * 1;
    }
  }
};
</script>
<style lang="scss">
</style>
