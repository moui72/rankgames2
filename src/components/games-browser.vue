<template>
  <div>
    <!-- games browser -->
    <!-- top pager -->
    <page-controls
      id="top-pager"
      class="widget mt-1"
      v-show="pages > 1"
      :pages="pages"
      :page="page"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"></page-controls>
      <!-- games list -->
    <div v-if="list.length" class="row my-1">
      <template v-for="(game, index) in list">
        <game
          :key="game.id"
          :id="game.gameId"
          :name="game.name"
          class="col-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
        </game>
      </template>
    </div>
    <div v-show="list.length < 1"
      class="row my-1 widget container-fluid mx-auto">
      No games.
    </div>
      <!-- bottom pager -->
    <page-controls
      id="bottom-pager"
      class="widget mb-1"
      v-show="pages > 1"
      :pages="pages"
      :page="page"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"></page-controls>
  </div>
</template>

<script>
import Game from './game.vue';
import PageControls from './page-controls.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'GamesBrowser',

  components: { Game, PageControls },

  data() {
    return {
      page: 1
    };
  },

  props: { ids: Array },

  computed: {
    ...mapGetters(['games', 'rankableGames', 'getGame']),
    ...mapGetters({
      perPage: 'getPerPage'
    }),
    pages() {
      if (this.ids) {
        return Math.ceil(this.ids.length / this.perPage);
      }
      return Math.ceil(this.games.length / this.perPage);
    },
    list() {
      let games = [];
      if (this.ids) {
        games = this.ids.map(game => this.getGame(game));
      } else {
        games = this.games;
      }
      return games.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    }
  },

  methods: {
    setPage(p) {
      this.page = p;
    },
    nextPage() {
      if (this.page >= this.pages) return false;
      this.page += 1;
    },
    prevPage() {
      if (this.page <= 1) return false;
      this.page -= 1;
    }
  }
};
</script>

<style lang="scss">

.game-wrap {
  padding: 1rem;
}

</style>
