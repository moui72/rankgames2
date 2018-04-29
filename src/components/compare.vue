<template>
  <div class="base">
    <div class="row no-gutters compares">
      <div 
        class="col-6" 
        @click="pickIncumbant()">
        <transition
          name="next-game"
          mode="out-in"
          class="ranked-games-list"
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut">
          <game-compare
            :key="incumbantGame"
            :id="incumbantGame"
            :use-image="images"
            left/>
        </transition>
      </div>
      <div 
        class="col-6" 
        @click="pickChallenger()">
        <transition
          name="next-game"
          mode="out-in"
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut">
          <game-compare
            :key="challengerGame"
            :id="challengerGame"
            :use-image="images"
            :left="false"
            mode="out-in"/>
        </transition>

      </div>
    </div>
  </div>
</template>
<script>
import GameCompare from "./game-compare.vue";

export default {
  name: "Compare",
  components: { GameCompare },
  props: {
    incumbantGame: { type: Number, required: true },
    challengerGame: { type: Number, required: true },
    images: { type: Boolean, default: true }
  },
  methods: {
    pickIncumbant() {
      this.pick(this.incumbantGame);
    },
    pickChallenger() {
      this.pick(this.challengerGame);
    },
    pick(id) {
      this.$emit("pick", id);
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
