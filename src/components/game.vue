<template>
  <div class="one-game">
    <div class="header">
      <h3>{{name}}</h3>
      <div class="controls">
      </div>
    </div>
    <div class="body">
      <p v-for="(v, p) in toggles(id)">
        <prop-button
          :property="p"
          :value="v"
          :id="id">
        </prop-button>
      </p>
    </div>

    <div class="footer">

    </div>
  </div>
</template>
<script>
import PropButton from './prop-button.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Game',
  props: { id: Number, name: String },
  data() {
    return {};
  },
  components: {
    PropButton
  },
  computed: {
    ...mapGetters(['toggles'])
  }
};
</script>
<style lang="scss"></style>
