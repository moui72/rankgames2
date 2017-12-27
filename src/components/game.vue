<template>
  <div class="one-game">
    <div class="header">
      <h3>{{name}}</h3>
      <div class="controls">
      </div>
    </div>
    <div class="body">
      <p v-for="(v, p) in toggleables">
        <prop-button
          :property="p"
          :value="v"
          :index="index">
        </prop-button>
      </p>
    </div>

    <div class="footer">

    </div>
  </div>
</template>
<script>
import PropButton from './prop-button.vue';

export default {
  name: 'Game',
  // declare the props
  props: { toggleables: Object, index: Number, name: String },
  // the prop can be used inside templates, and will also
  // be set as `this.msg`
  data() {
    return {};
  },
  components: {
    PropButton
  },
  computed: {
    id() {
      return this.game.id;
    }
  }
};
</script>
<style lang="scss"></style>
