<template>
  <div>
    <h2>Library</h2>
    <ul v-if="games.length">
      <li v-for="(game, index) in games">
        <game
        :name="game.name"
          :toggleables="game.properties.toggleable"
          :index="index"
          @toggle="toggle($event, game)">
        </game>
      </li>
    </ul>
    <div v-show="games.length < 1">
      No games.
    </div>
  </div>
</template>

<script>
import Game from './game.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'Lib',

  components: { Game },

  data() {
    return {
      view: 'all'
    };
  },
  computed: {
    ...mapGetters(['games', 'visibleGames', 'rankableGames'])
  },
  created: function() {}
};
</script>

<style></style>
