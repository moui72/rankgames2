  <template>
  <b-button
    :variant="variant"
    @click="toggle({
      property: property,
      value: !value,
      id: id
    })"
    class="prop-btn"
    :title="desc">
    <icon :name="icon"></icon>
    <span class="sr-only">set {{property}} to {{!value}}</span>
  </b-button>
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
      },
      variants: {
        visible: 'warning',
        rankable: 'danger'
      }
    };
  },
  computed: {
    desc() {
      return this.propertyObj(this.property).details;
    },
    ...mapGetters(['propertyObj']),
    icon() {
      return this.icons[this.property][this.value];
    },
    variant() {
      return (!this.value ? 'outline-' : '') + this.variants[this.property];
    }
  },
  methods: {
    ...mapMutations(['toggle'])
  }
};
</script>
<style lang="scss">
</style>
