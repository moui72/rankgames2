<template>
  <div>
    <!-- header -->
    <b-row>
      <b-col>
        <h2>Library</h2>
      </b-col>
      <b-col>
        <filters></filters>
      </b-col>

    </b-row>

    <!-- view and filter control -->
    <b-button-toolbar class="my-2 text-center">
      <b-button-group>
        <b-dropdown :text="'Current view: ' + viewObj.text" variant="info">
          <template v-for="(view, name) in viewObjs">
            <b-dropdown-item @click="setView(name)" :title="view.description">
              {{view.text}}
            </b-dropdown-item>
          </template>
        </b-dropdown>
        <b-dropdown text="Add a filter" variant="warning">
          <template v-for="(filter, name) in filters">
            <b-dd-item v-if="filter.simple" @click="setFilter(name)">
              {{activeFilters.indexOf(name) >= 0 ?
                'Stop ignoring' : 'Ignore'}} {{filter.text}}
              </b-dd-item>
            </template>
            <b-dd-item v-show="activePCF" @click="clearPCF">
              Stop filtering by player count
            </b-dd-item>
            <b-dd-item v-show="!activePCF" v-b-modal="'playerCount'">
              Filter by player count
            </b-dd-item>
          </b-dropdown>
      </b-button-group>
      <b-button-group class="mx-3">

        <b-btn variant="success" v-b-modal="'makeList'">Make a list</b-btn>

        <b-dropdown text="Modify a list" variant="primary">
          <b-dropdown-item disabled v-if="lists.length < 1">No lists yet</b-dropdown-item>
          <template v-else v-for="list in lists">
            <b-dropdown-item >{{list.name}}</b-dropdown-item>
          </template>
        </b-dropdown>

      </b-button-group>
    </b-button-toolbar>

    <!-- games browser -->
      <!-- top pager -->
    <page-controls
      v-show="pages > 1"
      :pages="pages"
      :page="page"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"></page-controls>
      <!-- games list -->
    <div v-if="list.length" class="row">
      <template v-for="(game, index) in list">
        <game
          :id="game.gameId"
          :name="game.name"
          class="col-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
        </game>
      </template>
    </div>
      <!-- bottom pager -->
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


    <!-- MODALS -->
    <!-- make a list -->
    <b-modal
      id="makeList"
      title="Make a list"
      ok-title="Create"
      @ok="makeNewList(newListName)">
      <p>
        Creating a list with a pool of {{rankableGames.length}} rankable games.
      </p>
      <b-form-group
        label="List name"
        description="A name for your list.">
        <b-form-input
        type="text"
        v-model="newListName"
        :placeholder="'List #' + (lists.length + 1)"></b-form-input>
      </b-form-group>
    </b-modal>

    <!-- add player count filter -->
    <b-modal
      id="playerCount"
      title="Filter by player count"
      ok-title="Apply"
      ok-variant="success"
      @ok="addPlayerCountFilter"
      >
      <b-tabs @input="setMode">
        <b-tab title="Includes" class="mt-3" active>
          <b-form-group
            label="Player count includes"
            description="The given player count falls within the
            minimum and maximum player count for the game.">
            <b-form-input type="number" v-model="playerCount"></b-form-input>
          </b-form-group>
        </b-tab>
        <b-tab title="Min and max" class="mt-3">
          <b-form-group
            label="Player count minimum"
            description="The game supports player count at least as low as the
            given value.">
            <b-form-input type="number" v-model="playerCountMin">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Player count maximum"
            description="The game supports player count at least as high as the
            given value.">
            <b-form-input type="number" v-model="playerCountMax">
            </b-form-input>
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import Game from './game.vue';
import PageControls from './page-controls.vue';
import Filters from './filters.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Lib',

  components: { Game, PageControls, Filters },
  // @ TODO move filter state to store.js

  data() {
    return {
      page: 1,
      playerCount: 2,
      playerCountMin: 1,
      playerCountMax: 4,
      playerCountMode: 'includes',
      newListName: ''
    };
  },
  computed: {
    ...mapGetters([
      'games',
      'rankableGames',
      'viewObj',
      'viewObjs',
      'activePCF',
      'isPCF',
      'allGames'
    ]),
    ...mapGetters({
      activeFilters: 'getActiveFilters',
      filters: 'getFilters',
      perPage: 'getPerPage',
      lists: 'getLists'
    }),

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
    ...mapMutations(['setView', 'setFilter', 'clearPCF', 'makeNewList']),
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
    },
    setMode(index) {
      this.playerCountMode = index == 0 ? 'includes' : 'range';
    },
    addPlayerCountFilter() {
      let filter = 'pcf';
      if (this.playerCountMode == 'range') {
        filter += '-' + this.playerCountMin + '-' + this.playerCountMax;
      } else {
        this.playerCount += '-' + this.playerCount;
      }
      this.setFilter(filter);
    }
  }
};
</script>

<style lang="scss">

.game-wrap {
  padding: 1rem;
}
</style>
