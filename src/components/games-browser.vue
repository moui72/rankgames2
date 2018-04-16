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
        <transition name="game-list"
          appear
          mode="out-in"
          enter-active-class="animated bounceIn"
          leave-active-class="animated zoomOut"
          :duration="{enter: 300, leave: 200}">
          <game
            :key="game.gameId"
            :id="game.gameId"
            class="col-6 col-sm-4 col-md-3 col-lg-2 game-wrap">
            <div v-if="ranking" slot="controls">
              <b-btn size="sm" variant="primary" @click="setrank(game.gameId)">
                <icon name="angle-double-up" aria-hidden></icon>
                <span class="sr-only">set rank</span>
              </b-btn>
              <b-btn size="sm" variant="danger" @click="dropgame(game.gameId)">
                <icon name="close" aria-hidden></icon>
                <span class="sr-only">drop game</span>
              </b-btn>
              <b-btn size="sm" variant="info" :to="'/game/'+game.gameId">
                <icon name="info-circle" aria-hidden></icon>
                <span class="sr-only">view details for {{game.name}}</span>
              </b-btn>
            </div>
          </game>
        </transition>
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
import Icon from 'vue-awesome';

export default {
  name: 'GamesBrowser',

  components: { Game, PageControls, Icon },

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
    ranking() {
      return this.ids ? true : false;
    },
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
    setrank(id) {
      this.$emit('setrank', id);
    },
    dropgame(id) {
      this.$emit('dropgame', id);
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
