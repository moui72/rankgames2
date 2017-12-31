<template>
  <div>
    <h2>Library</h2>
    <div v-if="list.length" class="row">
      <template v-for="(game, index) in list">
        <game
          :id="game.gameId"
          :name="game.name"
          class="col-xs-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
        </game>
      </template>
    </div>
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
      view: 'all',
      list: []
      // @TODO pageinate
    };
  },
  computed: {
    ...mapGetters(['games', 'visibleGames', 'rankableGames'])
  },
  created: function() {
    this.list = this.games.slice(0, 20);
  }
};
</script>

<style lang="scss">

.game-wrap {
  padding: 1rem;
}

</style>
