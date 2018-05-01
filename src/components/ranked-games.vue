<template>
  <div>
    <!-- ranked -->
    <h3 class="base mt-3 p-3">Ranked games</h3>
    <b-pagination 
      v-if="ranked.length > rankedPerPage"
      :total-rows="ranked.length" 
      :per-page="rankedPerPage" 
      v-model="rankedPage" 
      align="center" 
      size="md" 
    />

    <b-list-group 
      class="base mb-2" 
    >
      <b-list-group-item
        variant="dark"
      >
        
        <div 
          class="row small" 
        >

          <div class="col-1 ">
            <b-btn 
              variant="primary" 
              size="sm"
              @click="changeOrder()"
            >
              Order: {{ order }}
            </b-btn>
          </div>
          <div 
            class="offset-2 col-3 text-right" 
            size="sm">
            <b-btn 
              :disabled="view == 'display'" 
              block
              variant="link"
              size="sm"
              @click="setView('display')"
              
            >
              Display
            </b-btn>
          </div>
          <div class="col-3 text-right">
            <b-btn 
              :disabled="view == 'plaintext'"
              block
              variant="link" 
              size="sm"
              @click="setView('plaintext')"
              
            >
              Plain text
            </b-btn>
          </div>
          <div class="col-3 text-right">
            <b-btn 
              :disabled="view == 'forum'"
              block
              variant="link" 
              size="sm"
              @click="setView('forum')"
            >
              BGGCode
            </b-btn>
          </div>

        </div>
        

      </b-list-group-item>
      <transition-group 
        :duration="{out: 200, in: 400}"
        name="next-game" 
        move-class="move" 
        enter-active-class="animated fadeIn" 
        leave-active-class="animated fadeOut"
      >
        <template v-for="game in pagedRanked">
          
          <b-list-group-item 
            :key="game" 
            class="ranked-game-item"
          >
            <div 
              v-if="view == 'plaintext'" 
            >
              {{ rankOf(game) }}. 
              {{ gameData(game).name }} 
              ({{ gameData(game).rating }}/10) 
              Published in {{ gameData(game).yearPublished }}

            </div>
            <div 
              v-if="view == 'forum'" 
              class="pre"
            >
              [size=12][b][thing={{ game }}]{{ rankOf(game) }}. {{ gameData(game).name }}[/thing] <span v-if="gameData(game).numPlays > 0">- [COLOR=#00CC00]{{ gameData(game).numPlays }} plays[/COLOR]</span> - [BGCOLOR={{ ratingColor(gameData(game).rating) }}] {{ gameData(game).rating }}[/BGCOLOR][/b][/size]
              [size=7][b]{{ gameData(game).yearPublished }}[/b][/size]
              [imageID={{ getImageId(game) }} square inline]
            </div>
            <div 
              v-if="view == 'display'" 
              class="row align-items-center"
            >
              <div class="rank col-2 text-center text-primary">
                {{ rankOf(game) }}
              </div>
              <div class="col-4">
                <strong>
                  {{ gameData(game).name }}
                </strong>
              </div>
              <div 
                v-show="!rerank(game)"
                class="col-6 col-md-5 offset-md-1 col-lg-4 offset-lg-2 col-xl-3 offset-xl-3 text-right"
              >
                <b-button-toolbar 
                  justify       
                >

                  <b-button-group 
                  >
                    <b-btn 
                      variant="success" 
                      @click="setrank(game, 0)">
                      &#10514;
                      <span class="sr-only">
                        Set this game's rank to #1
                      </span>
                    </b-btn>            
                    <b-btn 
                      variant="success" 
                      class="weaker"
                      @click="setrank(game, rankOf(game) - 2)"
                    >
                      &uarr;
                      <span class="sr-only">
                        Set this game's rank to #{{ rankOf(game) - 1 }}
                      </span>
                    </b-btn>
                  </b-button-group>
                  <b-button-group>
                    <b-btn 
                      variant="primary"
                      @click="reranking(game)"
                    >
                      <span>#</span>
                      <span class="sr-only">
                        Set this game's rank to a given rank
                      </span>
                    </b-btn>
                  </b-button-group>
                  <b-button-group>
                    <b-btn 
                      variant="warning" 
                      class="weaker"
                      @click="setrank(game, rankOf(game))"
                    >
                      &darr;
                      <span class="sr-only">
                        Set this game's rank to #{{ rankOf(game) + 1 }}
                      </span>
                    </b-btn>
                    <b-btn 
                      variant="warning" 
                      @click="setrank(game, ranked.length)"
                    >
                      &#10515;
                      <span class="sr-only">
                        Set this game's rank to #{{ ranked.length }}
                      </span>
                    </b-btn>
                    
                  </b-button-group>
          
                  <b-button-group 
                  >
                    <b-btn 
                      variant="danger" 
                      @click="setrank(game, -1)"
                    >
                      &times;
                      <span class="sr-only">
                        Remove this game from the ranked list
                      </span>
                    </b-btn>
                  </b-button-group>
                </b-button-toolbar>
                  
              </div>
              <div
                v-show="rerank(game)"
                :ref="'rr-' + game"
                class="col-6 text-right"
                  
              >

                <b-input-group size="lg">
                  <b-form-input
                    v-model="setRankTo"
                    :placeholder="rankOf(game).toString()"
                    :max="ranked.length" 
                    :min="1" 
                    type="number" 
                  />
                  <b-input-group-append>
                    <b-btn 
                      variant="success" 
                      @click="reranked()"
                    >
                      &#10003;
                    </b-btn>
                    <b-btn 
                      variant="warning" 
                      @click="clearRerank()"
                    >
                      &times;
                    </b-btn>
                  </b-input-group-append>
                </b-input-group>
              </div>
                  
            </div>
          </b-list-group-item>
        </template>
      </transition-group>

      <b-list-group-item v-if="!list || list.length < 1">
        No ranked games yet.
      </b-list-group-item>
    </b-list-group>
    <b-pagination 
      v-if="ranked.length > rankedPerPage"
      :total-rows="ranked.length" 
      :per-page="rankedPerPage"
      v-model="rankedPage" 
      align="center" 
      size="md" 
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Icon from "vue-awesome";

export default {
  name: "List",
  components: {
    Icon
  },
  props: {
    list: { type: Array, required: true }
  },
  data() {
    return {
      rankedPage: 1,
      rankedPerPage: 10,
      settingRank: 0,
      setRankTo: 1,
      order: "ASC",
      view: "display"
    };
  },

  computed: {
    ...mapGetters(["getGame"]),
    pagedRanked() {
      if (this.view != "display") return this.ranked;
      return this.ranked.slice(
        (this.rankedPage - 1) * this.rankedPerPage,
        this.rankedPage * this.rankedPerPage
      );
    },
    ranked() {
      if (this.order == "ASC") return this.list;
      else return this.list.slice().reverse();
    }
  },
  methods: {
    ratingColor(r) {
      let colors = [
        "#DB303B",
        "#DF4751",
        "#5369A2",
        "#1D8ACD",
        "#2FC482",
        "#249563"
      ];
      return colors[
        r > 8 ? 0 : r > 7 ? 1 : r > 6 ? 2 : r > 4 ? 3 : r > 2 ? 4 : 5
      ];
    },
    getImageId(id) {
      let stringr = this.gameData(id).image;
      let reg = /pic([0-9]+)\.(jpg|png|gif)/;
      let arr = reg.exec(stringr);
      console.log(arr);
      return arr[1];
    },
    setView(v) {
      this.view = v;
    },
    gameData(id) {
      try {
        if (typeof id == "undefined" || id == 0)
          throw new TypeError("Invalid game id (" + id + ")");
        return this.getGame(id);
      } catch (e) {
        console.error(e);
      }
    },
    setrank(id, rank) {
      this.$emit("setrank", id, rank);
    },
    drop(id) {
      this.$emit("drop", id);
    },
    rankOf(gameId) {
      return (
        this.list.findIndex(game => {
          return game == gameId;
        }) + 1
      );
    },
    rerank(id) {
      return id == this.settingRank;
    },
    reranking(id) {
      this.settingRank = id == this.settingRank ? 0 : id;
      this.$nextTick(function() {
        this.$refs["rr-" + id][0].children[0].children[0].focus();
      });
    },
    reranked() {
      let rank =
        this.setRankTo < 0
          ? 0
          : this.setRankTo > this.ranked.length
            ? this.ranked.length - 1
            : this.setRankTo - 1;
      this.setrank(this.settingRank, rank);
      this.clearRerank();
    },
    clearRerank() {
      this.settingRank = 0;
    },
    changeOrder() {
      if (this.order == "ASC") this.order = "DSC";
      else this.order = "ASC";
    }
  }
};
</script>    
<style lang="scss">
.list-group-item-dark .disabled {
  color: #000;
  font-weight: 600;
  text-decoration: underline;
}
.pre {
  white-space: pre;
}
</style>