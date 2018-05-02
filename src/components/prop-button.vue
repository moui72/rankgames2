<template>
  <div>
    <b-button
      :disabled="disabled"
      :variant="variant"
      :title="desc"
      class="prop-btn"
      @click="toggle({
        property: property,
        value: !value,
        id: id
    })">
      <icon :name="icon"/>
      <span v-if="size == 'lg'">{{ text }}</span>
      <span class="sr-only">set {{ property }} to {{ !value }}</span>
    </b-button>
    <span 
      v-if="id < 0" 
      class="ml-3">{{ text }}</span>
  </div>

</template>
<script>
import "vue-awesome/icons/eye";
import "vue-awesome/icons/eye-slash";
import "vue-awesome/icons/share-square";
import "vue-awesome/icons/trash";
import "vue-awesome/icons/toggle-on";
import "vue-awesome/icons/toggle-off";

import Icon from "vue-awesome";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "PropButton",
  components: { Icon },
  props: {
    property: String,
    value: Boolean,
    id: Number,
    size: String,
    disabled: Boolean
  },
  data() {
    return {
      icons: {
        visible: {
          true: "eye-slash",
          false: "eye"
        },
        rankable: {
          true: "trash",
          false: "share-square"
        }
      },
      variants: {
        visible: "warning",
        rankable: "danger"
      },
      texts: {
        visible: {
          true: "Hide game.",
          false: "Show game."
        },
        rankable: {
          true: "Make game unrankable.",
          false: "Make game rankable."
        }
      }
    };
  },
  computed: {
    desc() {
      return this.propertyObj(this.property).details;
    },
    ...mapGetters(["propertyObj"]),
    icon() {
      return this.icons[this.property][this.value];
    },
    variant() {
      return (!this.value ? "outline-" : "") + this.variants[this.property];
    },
    text() {
      let texts = {
        visible: {
          true: "Hide this game",
          false: "Show this game"
        },
        rankable: {
          true: "Make unrankable",
          false: "Make rankable"
        }
      };
      return this.texts[this.property][this.value];
    }
  },
  methods: {
    ...mapMutations(["toggle"])
  }
};
</script>
<style lang="scss">

</style>
