<template>
  <div class="base">
    <div class="row no-gutters">
      <game-compare :id="incumbantGame" :left="true" class="col-6">
      </game-compare>
      <game-compare :id="challengerGame" :left="false" class="col-6">
      </game-compare>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GameCompare from './game-compare.vue';
import Icon from 'vue-awesome';

export default {
  name: 'Compare',
  components: {GameCompare},
  props: {incumbantGame: Number, challengerGame: Number}
}
</script>
<style lang="scss"></style>
