<template>
  <div>
    <div class="container-fluid my-3 header widget">
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
    <b-button-toolbar class="my-2 mx-auto text-center">
      <b-button-group class="my-1 mr-3">
        <b-btn variant="primary" v-b-modal="'import'">Import</b-btn>
      </b-button-group>

      <b-button-group class="my-1 mr-3">
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
      <b-button-group class="my-1">
        <b-btn variant="success" v-b-modal="'makeList'">Make a list</b-btn>
      </b-button-group>
    </b-button-toolbar>
  </div>


    <!-- games browser -->
    <games-browser></games-browser>



    <!-- MODALS -->
    <!-- import -->
    <b-modal
      id="import"
      title="Import"
      ok-only
      ok-title="Close"
      ok-variant="secondary"
      ref="importer">
      <import @ok="closeImporter()"></import>
    </b-modal>
    <!-- make a list -->
    <b-modal
      id="makeList"
      title="Make a list"
      ok-title="Create"
      @ok="makeList(newListName)">
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
import GamesBrowser from './games-browser.vue';
import Import from './import.vue';
import Filters from './filters.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Library',

  components: { GamesBrowser, Filters, Import },

  data() {
    return {
      playerCount: 2,
      playerCountMin: 1,
      playerCountMax: 4,
      playerCountMode: 'includes',
      newListName: ''
    };
  },
  computed: {
    ...mapGetters([
      'viewObj',
      'viewObjs',
      'activePCF',
      'isPCF',
      'allGames',
      'rankableGames'
    ]),
    ...mapGetters({
      activeFilters: 'getActiveFilters',
      filters: 'getFilters',
      lists: 'getLists'
    })
  },
  methods: {
    ...mapMutations(['setView', 'setFilter', 'clearPCF', 'makeNewList']),
    closeImporter() {
      this.$refs.importer.hide();
    },
    makeList(name) {
      let listId = this.makeNewList({ name });
      this.$router.go('/list/' + listId);
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
