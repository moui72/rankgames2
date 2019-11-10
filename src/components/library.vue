<template>
  <div>
    <div v-if="allGames.length < 1" class="my-3 widget">
      <h2>First time here?</h2>
      <p>
        Your collection is empty.
        <b-btn v-b-modal="'import'" is="a" href="#" variant="link" v-html="'Import'" />some games to get started.
      </p>
    </div>
    <div class="my-3 header widget">
      <b-row>
        <b-col>
          <h2>
            Library (
            <span>{{ allGames.length }}</span>
            total)
            <span class="small text-primary">
              <span v-html="'&raquo'" />
              {{ viewObj.text }}
            </span>
          </h2>
        </b-col>
        <b-col>
          <filters />
        </b-col>
      </b-row>

      <!-- view and filter control -->
      <b-button-toolbar class="mb-4 mx-auto text-center">
        <b-button-group class="mr-3">
          <b-btn v-b-modal="'import'" variant="primary">Import</b-btn>
        </b-button-group>

        <b-button-group class="mr-3">
          <b-dropdown :text="'Current view: ' + viewObj.text" variant="info">
            <template v-for="(view, name) in viewObjs">
              <b-dropdown-item
                :title="view.description"
                :key="name"
                @click="setView(name)"
              >{{ view.text }}</b-dropdown-item>
            </template>
          </b-dropdown>
          <b-dropdown text="Add a filter" variant="warning">
            <template v-for="(filter, name) in filters">
              <b-dd-item v-if="filter.simple" :key="name" @click="setFilter(name)">
                {{ activeFilters.indexOf(name) >= 0 ?
                'Stop ignoring' : 'Ignore' }} {{ filter.text }}
              </b-dd-item>
            </template>
            <b-dd-item v-show="activePCF" @click="clearPCF">Stop filtering by player count</b-dd-item>
            <b-dd-item v-b-modal="'playerCount'" v-show="!activePCF">Filter by player count</b-dd-item>
          </b-dropdown>
        </b-button-group>
        <b-button-group>
          <b-btn v-b-modal="'makeList'" variant="success">Make a list</b-btn>
        </b-button-group>
      </b-button-toolbar>

      <p class="mt-3">
        The current view determines which games are visible.
        Currently visible: {{ viewObj.details }}
      </p>

      <p class="mt-3">Filters will categorically remove games from the ones that are rankable.</p>

      <p>
        Each game has several buttons associated with it. You can use these
        buttons to show or hide a game, mark a game as rankable or not rankable,
        or to get more information about a game.
      </p>

      <h4 v-show="!showLegend" class="muted float-left">Legend is hidden</h4>
      <b-card v-show="showLegend" no-body>
        <h3 slot="header">Legend</h3>
        <b-list-group flush>
          <b-list-group-item>
            <prop-button :value="true" :id="-1" :disabled="true" property="visible" />
          </b-list-group-item>
          <b-list-group-item>
            <prop-button :value="false" :id="-1" :disabled="true" property="visible" />
          </b-list-group-item>
          <b-list-group-item>
            <prop-button :value="true" :id="-1" :disabled="true" property="rankable" />
          </b-list-group-item>
          <b-list-group-item>
            <prop-button :value="false" :id="-1" :disabled="true" property="rankable" />
          </b-list-group-item>
          <b-list-group-item>
            <b-btn variant="info" disabled @click="info(id)">
              <icon name="info-circle" aria-hidden />
            </b-btn>
            <span>View game details</span>
          </b-list-group-item>
        </b-list-group>
      </b-card>

      <div class="text-right" s>
        <b-btn
          ize="sm"
          variant="link"
          @click="toggleLegend()"
        >{{ showLegend ? '- hide' : '+ show' }} legend</b-btn>
      </div>
    </div>

    <!-- games browser -->
    <games-browser />

    <!-- MODALS -->
    <!-- import -->
    <import />
    <!-- make a list -->
    <b-modal id="makeList" title="Make a list" ok-title="Create" @ok="makeList(newListName)">
      <p>Creating a list with a pool of {{ rankableGames.length }} rankable games.</p>
      <b-form-group label="List name" description="A name for your list.">
        <b-form-input
          v-model="newListName"
          :placeholder="'List #' + (lists.length + 1)"
          type="text"
        />
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
            minimum and maximum player count for the game."
          >
            <b-form-input v-model="playerCount" type="number" />
          </b-form-group>
        </b-tab>
        <b-tab title="Min and max" class="mt-3">
          <b-form-group
            label="Player count minimum"
            description="The game supports player count at least as low as the
            given value."
          >
            <b-form-input v-model="playerCountMin" type="number" />
          </b-form-group>
          <b-form-group
            label="Player count maximum"
            description="The game supports player count at least as high as the
            given value."
          >
            <b-form-input v-model="playerCountMax" type="number" />
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import GamesBrowser from "./games-browser.vue";
import PropButton from "./prop-button.vue";
import Import from "./import.vue";
import Filters from "./filters.vue";
import Icon from "vue-awesome";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Library",

  components: { GamesBrowser, Filters, Import, PropButton, Icon },

  data() {
    return {
      playerCount: 2,
      playerCountMin: 1,
      playerCountMax: 4,
      playerCountMode: "includes",
      newListName: "",
      showLegend: true
    };
  },
  computed: {
    ...mapGetters([
      "viewObj",
      "viewObjs",
      "activePCF",
      "allGames",
      "rankableGames"
    ]),
    ...mapGetters({
      activeFilters: "getActiveFilters",
      filters: "getFilters",
      lists: "getLists"
    }),
    viewDetails() {
      return this.viewObj.details;
    }
  },
  created() {},
  methods: {
    ...mapMutations(["setView", "setFilter", "clearPCF", "makeNewList"]),
    ...mapActions(["setProp"]),
    toggleLegend() {
      console.log("toggle", this.showLegend);
      this.showLegend = !this.showLegend;
    },
    makeList(name) {
      let listId = this.makeNewList({ name });
      this.$router.go("/list/" + listId);
    },
    setMode(index) {
      this.playerCountMode = index == 0 ? "includes" : "range";
    },
    addPlayerCountFilter() {
      let filter = "pcf";
      if (this.playerCountMode == "range") {
        filter += "-" + this.playerCountMin + "-" + this.playerCountMax;
      } else {
        this.playerCount += "-" + this.playerCount;
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
