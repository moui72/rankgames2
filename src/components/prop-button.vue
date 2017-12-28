<template>
  <button
    @click="toggle({
      property: property,
      value: !value,
      id: id
    })">
    <icon :name="icon"></icon>
    <span class="sr-only">set {{property}} to {{!value}}</span>
  </button>
</template>
<script>
import 'vue-awesome/icons/eye';
import 'vue-awesome/icons/eye-slash';
import 'vue-awesome/icons/toggle-on';
import 'vue-awesome/icons/toggle-off';

import Icon from 'vue-awesome';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'PropButton',
  props: { property: String, value: Boolean, id: Number },
  components: { Icon },
  data() {
    return {
      icons: {
        visible: {
          true: 'eye',
          false: 'eye-slash'
        },
        rankable: {
          true: 'toggle-on',
          false: 'toggle-off'
        }
      }
    };
  },
  computed: {
    icon() {
      return this.icons[this.property][this.value];
    }
  },
  methods: { ...mapMutations(['toggle']) }
};
</script>
<style lang="scss"></style>
