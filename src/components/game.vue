<template>
  <div class="one-game">
    <div class="header">
      <h3>{{index}}. {{game.name}}</h3>
      <div class="controls">
      </div>
    </div>
    <div class="body">
      <p v-for="(v, p) in game.props.toggleable">
        <prop-button
          :property="p"
          :value="v"
          :game="game"
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
  props: { game: Object, index: Number },
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
