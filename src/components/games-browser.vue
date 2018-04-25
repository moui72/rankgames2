<template>
  <div>
    <!-- games browser -->
    <!-- top pager -->
    <page-controls
      v-if="pages > 1"
      id="top-pager"
      :page="page"
      :pages="pages"
      class="widget mt-1"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"
    />
    <!-- games list -->
    <div v-if="list.length">
      <transition-group 
        :duration="{enter: 300, leave: 200}"
        tag="div"
        name="game-list"
        appear
        move-class="move" 
        mode="out-in"
        enter-active-class="animated bounceIn"
        leave-active-class="animated zoomOut"
        class="row"
      >
        <template v-for="game in list">
          <game
            :id="game.gameId"
            :key="game.gameId"
            class="col-6 col-sm-4 col-md-3 col-lg-2 game-wrap"
          >
            <div 
              v-if="ranking" 
              slot="controls">
              <b-btn 
                size="sm" 
                variant="primary" 
                @click="setrank(game.gameId)">
                <icon 
                  name="angle-double-up" 
                  aria-hidden/>
                <span class="sr-only">set rank</span>
              </b-btn>
              <b-btn 
                size="sm" 
                variant="danger" 
                @click="dropgame(game.gameId)">
                <icon 
                  name="close" 
                  aria-hidden/>
                <span class="sr-only">drop game</span>
              </b-btn>
              <b-btn 
                :to="'/game/'+game.gameId"
                size="sm" 
                variant="info" 
              >
                <icon 
                  name="info-circle" 
                  aria-hidden/>
                <span class="sr-only">view details for {{ game.name }}</span>
              </b-btn>
            </div>
          </game>
        </template>
      </transition-group>
        
    </div>
    <div 
      v-show="list.length < 1"
      class="row my-1 widget container-fluid mx-auto">
      No games.
    </div>
    <!-- bottom pager -->
    <page-controls
      v-show="pages > 1"
      id="bottom-pager"
      :pages="pages"
      :page="page"
      class="widget mb-1"
      @pageChange="setPage"
      @next="nextPage"
      @prev="prevPage"/>
  </div>
</template>

<script>
import Game from "./game.vue";
import PageControls from "./page-controls.vue";
import { mapGetters } from "vuex";
import Icon from "vue-awesome";

export default {
  name: "GamesBrowser",

  components: { Game, PageControls, Icon },

  props: {
    ids: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  data() {
    return {
      page: 1
    };
  },

  computed: {
    ...mapGetters(["games", "rankableGames", "getGame"]),
    ...mapGetters({
      perPage: "getPerPage"
    }),
    ranking() {
      return this.ids == [] ? false : true;
    },
    pages() {
      if (this.ids) {
        return Math.ceil(this.ids.length / this.perPage);
      }
      return Math.ceil(this.games.length / this.perPage);
    },
    list() {
      let games = [];
      if (this.ids.length) {
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
    setrank(id) {
      this.$emit("setrank", id);
    },
    dropgame(id) {
      this.$emit("dropgame", id);
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
