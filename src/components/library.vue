<template>
  <div>
    <h2>Library</h2>
    <page-controls :pages="pages" @pageChange="setPage" @next="nextPage" @orev="prevPage"></page-controls>
    <div v-if="list.length" class="row">
      <template v-for="(game, index) in list">
        <game
          :id="game.gameId"
          :name="game.name"
          class="col-xs-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
        </game>
      </template>
    </div>
    <page-controls :pages="pages" @pageChange="setPage" @next="nextPage" @orev="prevPage></page-controls>
    <div v-show="games.length < 1">
      No games.
    </div>
  </div>
</template>

<script>
import Game from './game.vue';
import PageControls from './page-controls.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Lib',

  components: { Game, PageControls },

  data() {
    return {
      view: 'all',
      page: 1,
      perPage: 24
      // @TODO paginate
    };
  },
  computed: {
    ...mapGetters(['games', 'visibleGames', 'rankableGames']),
    pages() {
      return Math.ceil(this.games.length / this.perPage);
    },
    list() {
      return this.games.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    }
  },
  methods: {
    setPage(p) {
      console.log('pgs', p);
      this.page = p;
    },
    nextPage() {
      if (this.page >= this.pages) return false;
      this.page += 1;
    },
    prevPage() {
      if (this.page <= 1) return false;
    }
  }
};
</script>

<style lang="scss">

.game-wrap {
  padding: 1rem;
}
</style>
