<template>
  <div>
    <div class="my-3 header widget">
      <!-- header -->
      <b-row>
        <b-col>
          <h2>Library <span class="small text-primary">&raquo; {{viewObj.text}}</span></h2>
        </b-col>
        <b-col>
          <filters></filters>
        </b-col>
      </b-row>

    <!-- view and filter control -->
    <b-button-toolbar class="mb-4 mx-auto text-center">
      <b-button-group class="mr-3">
        <b-btn variant="primary" v-b-modal="'import'">Import</b-btn>
      </b-button-group>

      <b-button-group class="mr-3">
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
      <b-button-group>
        <b-btn variant="success" v-b-modal="'makeList'">Make a list</b-btn>
      </b-button-group>
    </b-button-toolbar>



    <p class="mt-3">
      The current view determines which games are visible.
      Currently: {{viewObj.details}}
    </p>

    <p>
      Each game has several buttons associated with it. You can use these
      buttons to show or hide a game, mark a game as rankable or not rankable,
      or to get more information about a game.
    </p>

    <h4 class="muted float-left" v-show="!showLegend">Legend is hidden</h4>
    <b-card no-body v-show="showLegend">
      <h3 slot="header">
        Legend
      </h3>
      <b-list-group flush>
        <b-list-group-item>
          <prop-button
           property="visible"
           :value="true"
           :id="-1" :disabled="true">
          </prop-button>
        </b-list-group-item>
        <b-list-group-item>
          <prop-button
           property="visible"
           :value="false"
           :id="-1" :disabled="true">
          </prop-button>
        </b-list-group-item>
        <b-list-group-item>
          <prop-button
           property="rankable"
           :value="true"
           :id="-1" :disabled="true">
          </prop-button>
        </b-list-group-item>
        <b-list-group-item>
          <prop-button
           property="rankable"
           :value="false"
           :id="-1" :disabled="true">
          </prop-button>
        </b-list-group-item>
        <b-list-group-item>
          <b-btn variant="info" @click="info(id)" disabled>
            <icon name="info-circle" aria-hidden></icon>
          </b-btn>
          <span>View game details</span>
        </b-list-group-item>
      </b-list-group>
    </b-card>

    <div class="text-right" s>
      <b-btn ize="sm" variant="link" @click="toggleLegend()">
        {{ showLegend ? '- hide' : '+ show' }} legend
      </b-btn>
    </div>

  </div>


    <!-- games browser -->
    <games-browser></games-browser>



    <!-- MODALS -->
    <!-- import -->

    <import></import>
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
import PropButton from './prop-button.vue';
import Import from './import.vue';
import Filters from './filters.vue';
import Icon from 'vue-awesome';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Library',

  components: { GamesBrowser, Filters, Import, PropButton, Icon },

  data() {
    return {
      playerCount: 2,
      playerCountMin: 1,
      playerCountMax: 4,
      playerCountMode: 'includes',
      newListName: '',
      showLegend: true
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
    }),
    viewDetails() {
      return this.viewObj.details;
    }
  },
  methods: {
    toggleLegend() {
      console.log('toggle', this.showLegend);
      this.showLegend = !this.showLegend;
    },
    ...mapMutations(['setView', 'setFilter', 'clearPCF', 'makeNewList']),
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
