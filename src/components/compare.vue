<template>
  <div class="base">
    <div class="row no-gutters compares">
      <div @click="pickIncumbant()" class="col-6">
        <transition
          name="next-game"
          mode="out-in"
          class="ranked-games-list"
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut">
          <game-compare
            :key="incumbantGame"
            :id="incumbantGame"
            left>
          </game-compare>
        </transition>
      </div>
      <div @click="pickChallenger()" class="col-6">
        <transition
          name="next-game"
          mode="out-in"
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut">
          <game-compare
            mode="out-in"
            :key="challengerGame"
            :id="challengerGame">
          </game-compare>
        </transition>

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
    pickIncumbant() {
      this.pick(this.incumbantGame);
    },
    pickChallenger() {
      this.pick(this.challengerGame);
    },
    pick(id) {
      this.$emit('pick', id);
    }
  }
};
</script>
<style lang="scss">
.animated {
  animation-duration: 0.5s;
}
.compares {
  background-color: #666;
}
</style>
