<template>
  <div>
    <h2>Library</h2>
    <div class="my-2 text-center">
      <b-dropdown :text="'Current view: ' + viewObj.text" variant="primary">
        <template v-for="(view, name) in viewObjs">
          <b-dropdown-item @click="setView(name)" :title="view.description">
            {{view.text}}
          </b-dropdown-item>
        </template>


      </b-dropdown>
      <b-dropdown text="Add a filter" variant="info">
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
    <div v-show="list.length < 1">
      No games.
    </div>
  </div>
</template>

<script>
import Game from './game.vue';
import PageControls from './page-controls.vue';
import { mapGetters, mapMutations } from 'vuex';

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
      page: 1,
      perPage: 24
    };
  },
  computed: {
    ...mapGetters(['games', 'viewObj', 'viewObjs']),
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
      return this.games.filter(game => {
        let show = true;
        this.activeFilters.forEach(filter => {
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
    ...mapMutations(['setView']),
    setFilter(f) {
      let index = this.activeFilters.indexOf(f);
      if (index >= 0) {
        this.activeFilters.splice(index, 1);
        return false;
      }
      this.activeFilters.push(f);
      return true;
    },
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
