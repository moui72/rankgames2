<template>
  <div>
    <h2>Library</h2>
    <div class="my-2 text-center">
      <b-dropdown :text="({
        vbl: 'Default',
        rbl: 'Rankable only',
        all: 'Unrestricted',
        inv: 'Invisible only',
        unr: 'Unrankable only'
        }[view]) + ' view'">

        <b-dropdown-item @click="setView('vbl')">Default</b-dropdown-item>
        <b-dropdown-item @click="setView('rbl')">Rankable only</b-dropdown-item>
        <b-dropdown-item @click="setView('unr')">Show not rankable only</b-dropdown-item>
        <b-dropdown-item @click="setView('inv')">Show hidden only</b-dropdown-item>
        <b-dropdown-item @click="setView('all')">All</b-dropdown-item>

      </b-dropdown>
      <b-dropdown text="Filter">
        <template v-for="(filter, name) in filters">
          <b-dd-item @click="setFilter(name)">
            {{activeFilters.indexOf(name) >= 0 ?
              'Stop ignoring' : 'Ignore'}} {{filter.text}}
          </b-dd-item>
        </template>
      </b-dropdown>
    </div>
    <page-controls
      v-show="pages > 1"
      :pages="pages"
      :page="page"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"></page-controls>
    <div v-if="list.length" class="row">
      <template v-for="(game, index) in list">
        <game
          :id="game.gameId"
          :name="game.name"
          class="col-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
        </game>
      </template>
    </div>
    <page-controls
      v-show="pages > 1"
      :pages="pages"
      :page="page"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"></page-controls>
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
      activeFilters: [],
      filters: {
        owned: {
          test: true,
          text: "games I don't own"
        },
        isExpansion: { test: false, text: 'expansions' },
        numPlays: { test: 1, text: "games I haven't played" }
      },
      view: 'all',
      views: {
        all: 'games',
        vbl: 'visibleGames',
        rbl: 'rankableGames',
        inv: 'games',
        unr: 'games'
      },
      page: 1,
      perPage: 24
    };
  },
  computed: {
    ...mapGetters(['games', 'visibleGames', 'rankableGames']),
    pages() {
      return Math.ceil(this.viewGames.length / this.perPage);
    },
    list() {
      return this.viewGames.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
    viewGames() {
      return this[this.views[this.view]].filter(game => {
        let show = true;
        this.activeFilters.forEach(filter => {
          console.log(
            filter,
            game[filter],
            game[filter] !== this.filters[filter].test,
            typeof this.filters[filter].test != 'number' ||
              game[filter] <= this.filters[filter].test
          );
          if (
            game[filter] !== this.filters[filter].test &&
            (typeof this.filters[filter].test != 'number' ||
              game[filter] < this.filters[filter].test)
          ) {
            show = false;
          }
        });
        return show;
      });
    }
  },
  methods: {
    setFilter(f) {
      let index = this.activeFilters.indexOf(f);
      if (index >= 0) {
        this.activeFilters.splice(index, 1);
        return false;
      }
      this.activeFilters.push(f);
      return true;
    },
    setView(v) {
      console.log(this.view, '=>', v);
      console.log([this.views[v]]);

      this.view = v;
    },
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
