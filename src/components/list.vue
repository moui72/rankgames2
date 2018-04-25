<template>
  <div>
    <div class="container-fluid my-3 header widget">
      <div class="row">
        <div class="col-1 text-center">
          <b-btn 
            variant="info" 
            @click="editName()" 
            @keyup.esc="cancelRename"
          >
            <icon 
              v-show="!editingName" 
              name="pencil" 
              aria-hidden 
            />
            <span class="sr-only">
              rename
            </span>
          </b-btn>
          <b-btn 
            v-show="editingName" 
            variant="warning" 
            @click="cancelRename()" 
            @keyup.esc="cancelRename">
            <icon 
              name="close" 
              aria-hidden/>
            <span class="sr-only">cancel</span>
          </b-btn>
        </div>
        <div class="col-10">
          <b-btn 
            v-show="editingName" 
            variant="info" 
            @click="rename()" 
            @keyup.esc="cancelRename()">
            <icon 
              v-show="!editingName" 
              name="check" 
              aria-hidden/>
            <span class="sr-only">confirm rename</span>
          </b-btn>
          <b-form-input 
            v-show="editingName" 
            ref="namefield" 
            :placeholder="data.name" 
            v-model="newName" 
            size="lg" 
            type="text" 
            @blur.native="rename()"
            @keyup.enter.native="rename()" 
            @keyup.esc.native="cancelRename()"/>
          <h2 v-show="!editingName">
            <b-link to="/lists">Lists</b-link> &raquo; "{{ data.name }}"
          </h2>
        </div>
      </div>
    </div>
    <h3 class="base mt-3 p-3">Compare games</h3>
    <transition 
      name="comparison-ready" 
      mode="out-in" 
      enter-active-class="animated slideInLeft" 
      leave-active-class="animated slideOutLeft">
      <div 
        v-if="bufferReady" 
        key="comparing">
        <!-- comparisons -->
        <compare 
          :incumbant-game="incumbant" 
          :challenger-game="challenger" 
          @pick="pick"/>
      </div>
      <div 
        v-else 
        key="loading"
        class="base mt-3 p-3" 
      >
        <h3>Please wait...</h3>
        <spinner/>
        <p>Images are buffering</p>
      </div>
    </transition>


    <div 
      v-if="cached < data.games.length"
      class="widget mt-3" 
    >
      <h4>Preloading images ({{ cached }} of {{ ranked.length + unranked.length }})</h4>
      <h5>Buffer</h5>
      <b-progress 
        :value="cached" 
        :max="ranked.length + 5" 
        variant="success" 
        class="mb-3">
        <b-progress-bar :value="Object.keys(imageCache).length">
          {{ cached }}
        </b-progress-bar>
      </b-progress>
      <h5>Total</h5>
      <b-progress :max="data.games.length">
        <b-progress-bar :value="cached">
          {{ cached }} / {{ ranked.length + unranked.length }}
        </b-progress-bar>
      </b-progress>
    </div>


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
              <div class="row align-items-center">
                <div class="rank col-2 text-right text-primary">
                  {{ rankOf(game) }}
                </div>
                <div class="col-5">
                  <h4>
                    {{ gameData(game).name }}
                  </h4>
                </div>
                <div 
                  v-show="!rerank(game)"
                  class="col-5 text-left"
                
                >
                  <b-button-toolbar 
                    size="sm"                  
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
                      <b-btn 
                        variant="primary"
                        @click="reranking(game)"
                      >
                        <span>#</span>
                        <span class="sr-only">
                          Set this game's rank to a given rank
                        </span>
                      </b-btn>

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
                      class="ml-2" 
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
                  class="col-5 text-right"
                  
                >

                  <b-input-group size="sm">
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

        <b-list-group-item v-if="!data.list || data.list.length < 1">
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
    <!-- games browser -->
    <h3 class="base mt-3 p-3">Unranked games</h3>
    <games-browser 
      :ids="unranked" 
      class="mb-3" 
      @setrank="setrank" 
      @dropgame="drop"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Game from "../components/game.vue";
import GamesBrowser from "./games-browser.vue";
import Compare from "./compare.vue";
import Icon from "vue-awesome";
import Spinner from "vue-simple-spinner";
import * as _ from "lodash";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  name: "List",
  components: {
    Icon,
    Game,
    GamesBrowser,
    Compare,
    Spinner
  },
  props: {
    id: { type: Number, required: true }
  },
  data() {
    return {
      editingName: false,
      newName: "",
      msg: "",
      challengerID: 0,
      incumbantIndex: 0,
      rankedPage: 1,
      rankedPerPage: 10,
      rankedCached: false,
      cacheCycles: 0,
      imageCache: {},
      settingRank: 0,
      setRankTo: 1
    };
  },
  computed: {
    ...mapGetters(["getList", "getGame"]),
    bufferReady() {
      return (
        this.rankedCached &&
        this.cached - this.ranked.length > this.unranked.length / 2
      );
    },
    unranked() {
      return _.difference(this.data.games, this.ranked).sort((a, b) => {
        return this.gameData(a).name.toLowerCase() <
          this.gameData(b).name.toLowerCase()
          ? -1
          : 1;
      });
    },
    pagedRanked() {
      return this.ranked.slice(
        (this.rankedPage - 1) * this.rankedPerPage,
        this.rankedPage * this.rankedPerPage
      );
    },
    ranked() {
      return this.data.list;
    },
    data() {
      return this.getList(this.id);
    },
    incumbant() {
      return this.data.list[this.incumbantIndex];
    },
    challenger() {
      return this.challengerID;
    },
    cached() {
      return Object.keys(this.imageCache).length;
    }
  },
  mounted() {
    this.caching();
    this.cacheRanked();
    this.newPair();
  },
  methods: {
    ...mapActions(["setrankto", "renameList", "dropGameInList"]),
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
    caching() {
      const vm = this;
      try {
        if (this.cacheCycles > 2000) {
          throw new RangeError("Max cache cycles reached.");
        }
        if (vm.cached >= vm.data.games.length) {
          console.log("Caching complete");
          return;
        }
        this.cacheImgs()
          .then(() => {
            vm.caching();
          })
          .catch(e => {
            vm.caching();
            console.error(e);
            throw new Error(e);
          });
      } catch (e) {
        console.error(e);
      }
    },
    rankOf(gameId) {
      return (
        this.ranked.findIndex(game => {
          return game == gameId;
        }) + 1
      );
    },
    getChallenger() {
      if (this.unranked.length > 0) {
        this.challengerID = this.unranked[0];
      } else {
        this.challengerID = false;
      }
      return false;
    },
    getIncumbant() {
      this.incumbantIndex = 0;
      if (this.data.list.length < 1) {
        this.setrank(this.unranked[0], 1);
      } else if (this.data.list.length > 3) {
        this.incumbantIndex = Math.floor(
          this.ranked.length / 2 + randomInt(-1, 1)
        );
      }
      this.cacheImg(this.incumbant);
      return this.incumbantIndex;
    },
    nextIncumbant() {
      if (this.incumbantIndex < 1) {
        this.setrank(this.challenger, 0);
        this.newPair();
      } else {
        this.incumbantIndex -= 1;
      }
    },
    newPair() {
      this.getIncumbant();
      this.getChallenger();
      try {
        this.cacheImg(this.challenger)
          .then(i => this.imgReady(this.challenger, i))
          .catch(e => this.cacheImgFail(this.challenger, e));
        this.cacheImg(this.incumbant)
          .then(i => this.imgReady(this.incumbant, i))
          .catch(e => this.cacheImgFail(this.incumbant, e));
      } catch (e) {
        console.error("Invalid incumbant or challenger. Retrying.");
        this.newPair();
      }
    },
    pick(id) {
      if (id === this.incumbant) {
        this.setrank(this.challenger, this.incumbantIndex + 1);
        this.newPair();
      } else {
        this.nextIncumbant();
      }
    },
    setrank(id, rank) {
      rank = rank || 0;
      this.setrankto({
        listid: this.id,
        game: id,
        rank: rank
      });
    },
    drop(id) {
      console.log("drop", id);
      this.dropGameInList({
        listid: this.id,
        game: id
      });
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
    rename() {
      if (this.newName.trim() == "")
        return this.cancelRename("list must have a name");
      this.renameList({
        listid: this.id,
        newName: this.newName
      });
      this.editingName = false;
    },
    editName() {
      this.editingName = true;
      this.$nextTick(() => this.$refs.namefield.$el.focus());
    },
    cancelRename(msg) {
      if (msg) {
        this.msg = msg;
      }
      this.editingName = false;
    },
    imgIsReady(id) {
      if (
        !typeof this.imageCache[id] == "undefined" &&
        this.imageCache[id].ready
      ) {
        return true;
      }
      return false;
    },
    cacheImg(id) {
      this.$set(this.imageCache, id, {
        img: null,
        ready: false
      });
      return new Promise((resolve, reject) => {
        if (
          id === 0 ||
          typeof id == "undefined" ||
          typeof this.gameData(id) == "undefined"
        )
          reject(
            new RangeError("cacheImg got invalid game id (" + id + ")", 400)
          );

        if (!this.imageCache[id] || !this.imageCache[id].ready) {
          try {
            let img = new Image();
            img.onload = () => {
              resolve(img);
            };
            img.src = this.gameData(id).image;
          } catch (e) {
            console.log("loading img failed", id);
            reject(new Error("could not load img for (" + id + ")."));
          }
        } else {
          console.error("ready already", id);
        }
      });
    },
    cacheImgs(n = 5) {
      return new Promise((resolve, reject) => {
        let preloaded = 0;
        let errors = 0;
        const doneFn = () => {
          const resp = "cached " + preloaded + " with " + errors + " errors.";
          this.cacheCycles++;
          if (preloaded > errors) {
            resolve(resp);
          } else {
            reject(resp);
          }
        };
        if (this.cached > this.data.games.length - n) {
          n = this.data.games.length - this.cached;
        }
        if (n < 1) {
          resolve("Nothing left to cache.");
        }
        for (let i = 0; i < n; i++) {
          const gameId = this.data.games[i + 5 * this.cacheCycles];
          try {
            this.cacheImg(gameId)
              .then(imgObj => {
                preloaded++;
                this.imgReady(gameId, imgObj);
                if (preloaded + errors == n) {
                  doneFn();
                }
              })
              .catch(err => {
                errors++;
                this.cacheImgFail(gameId, err);
                if (preloaded + errors == n) {
                  doneFn();
                }
              });
          } catch (e) {
            console.error(e, 455);
          }
        }
      });
    },
    cacheRanked() {
      let cached = 0;
      for (let i = 0; i < this.ranked.length; i++) {
        let ico = this.imageCache[this.ranked[i]]; // image cache object
        if (typeof ico == "undefined" || !ico.ready) {
          this.cacheImg(this.ranked[i])
            .then(() => {
              cached++;
              if (cached == this.ranked.length) {
                this.rankedCached = true;
              }
            })
            .catch(e => this.cacheImgFail(e));
        } else {
          cached++;
          if (cached == this.ranked.length) {
            this.rankedCached = true;
          }
        }
      }
    },
    cacheImgFail(id, imgObj) {
      console.error("failed to cache", id, imgObj, this.cached);
      this.$set(this.imageCache, id, {
        img: imgObj,
        ready: false
      });
    },
    imgReady(id, imgObj) {
      this.$set(this.imageCache, id, {
        img: imgObj,
        ready: true
      });
    }
  }
};
</script>
<style lang="scss">
.shadow {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.6);
}
.page-item {
  @extend .shadow;
  &:first-child {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
  &:last-child {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
}
.weaker {
  color: black;
  opacity: 0.7;
}
.rank {
  text-align: right;
  font-size: 6rem;
  font-weight: 700;
}
.ranked-game-item .btn {
  color: black;
}
</style>