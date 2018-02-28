<template>
  <div class="base">
    <div class="row no-gutters">
      <div @click="pick(incumbantGame)" class="col-6">
        <game-compare
          :id="incumbantGame"
          :left="true">
        </game-compare>
      </div>
      <div @click="pick(challengerGame)" class="col-6">
        <game-compare
          :id="challengerGame"
          :left="false">
        </game-compare>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GameCompare from './game-compare.vue';
import Icon from 'vue-awesome';

export default {
  name: 'Compare',
  components: { GameCompare },
  props: { incumbantGame: Number, challengerGame: Number },
  methods: {
    pick(id) {
      this.$emit('pick', id);
    }
  }
};
</script>
<style lang="scss">

</style>
