<template>
  <div>
    <h2>Library</h2>
    <ul v-if="games.length">
      <li v-for="(game, index) in games">
        <game :game="game" :index="index+1" @toggle="toggle($event, game)"></game>
      </li>
    </ul>
  </div>
</template>

<script>
import Game from './game.vue';
import * as _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  name: 'Lib',

  components: { Game },

  data() {
    return {};
  },
  computed: {
    ...mapGetters(['games', 'visibleGames', 'rankableGames'])
  },
  created: function() {}
};
</script>

<style></style>
