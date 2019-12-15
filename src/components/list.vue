<template>
  <div>
    <div class="container-fluid my-3 header widget">
      <div class="row">
        <div class="col-1 text-center">
          <b-btn
            v-show="!editingName"
            variant="info"
            @click="editName()"
            @keyup.esc="cancelRename"
          >
            <icon name="pencil" aria-hidden />
            <span class="sr-only">rename</span>
          </b-btn>
          <b-btn
            v-show="editingName"
            variant="warning"
            @click="cancelRename()"
            @keyup.esc="cancelRename"
          >
            <icon name="close" aria-hidden />
            <span class="sr-only">cancel</span>
          </b-btn>
        </div>
        <div class="col-10">
          <b-input-group v-show="editingName">
            <b-input-prepend>
              <b-btn
                variant="info"
                @click="rename()"
                @keyup.esc="cancelRename()"
              >
                <icon name="check" aria-hidden />
                <span class="sr-only">confirm rename</span>
              </b-btn>
            </b-input-prepend>
            <b-form-input
              ref="namefield"
              :placeholder="listData.name"
              v-model="newName"
              size="lg"
              type="text"
              @blur.native="rename()"
              @keyup.enter.native="rename()"
              @keyup.esc.native="cancelRename()"
            />
          </b-input-group>
          <h2 v-show="!editingName">
            <b-link to="/lists">Lists</b-link>
            <span v-html="'&raquo; '" />
            "{{ listData.name }}"
          </h2>
        </div>
      </div>
    </div>
    <h3 class="base mt-3 p-3">Compare games</h3>
    <transition
      name="comparison-ready"
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutLeft"
    >
      <div v-if="bufferReady || getBackgroundLoad" key="comparing">
        <!-- comparisons -->
        <compare
          :images="useImgs"
          :incumbant-game="incumbant"
          :challenger-game="challenger"
          @pick="pick"
        />
      </div>
      <div v-else key="loading" class="base mt-3 p-3">
        <h3>Please wait...</h3>
        <spinner />
        <p>Images are buffering</p>
      </div>
    </transition>

    <div
      v-if="cached < listData.games.length && getUseImgComparisons"
      class="widget mt-3"
    >
      <h4>
        Preloading images ({{ cached }} of
        {{ ranked.length + unranked.length }})
      </h4>
      <h5>Buffer</h5>
      <b-progress
        :value="cached"
        :max="bufferSize"
        variant="success"
        class="mb-3"
      >
        <b-progress-bar :value="Object.keys(imageCache).length">{{
          cached
        }}</b-progress-bar>
      </b-progress>
      <h5>Total</h5>
      <b-progress :max="listData.games.length">
        <b-progress-bar :value="cached"
          >{{ cached }} / {{ ranked.length + unranked.length }}</b-progress-bar
        >
      </b-progress>
    </div>

    <ranked-games :list="listData.list" @setrank="setrank" />
    <!-- games browser -->
    <h3 class="base mt-3 p-3">Unranked games</h3>
    <games-browser
      :ids="unranked"
      class="mb-3"
      @setrank="setrank"
      @dropgame="drop"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Game from "../components/game.vue";
import GamesBrowser from "./games-browser.vue";
import Compare from "./compare.vue";
import RankedGames from "./ranked-games.vue";
import Icon from "vue-awesome";
import Spinner from "vue-simple-spinner";
import * as _ from "lodash";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  name: "List",
  components: {
    RankedGames,
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
    ...mapGetters([
      "getList",
      "getGame",
      "getUseImgComparisons",
      "getBackgroundLoad"
    ]),
    bufferSize() {
      return this.listData.games.length / 2;
    },
    useImgs() {
      if (!this.getUseImgComparisons) return false;
      return this.bufferReady;
    },
    bufferReady() {
      return (
        (this.rankedCached &&
          this.cached - this.ranked.length > this.bufferSize / 2) ||
        !this.getUseImgComparisons
      );
    },
    unranked() {
      return _.difference(this.listData.games, this.ranked).sort((a, b) => {
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
      return this.listData.list;
    },
    listData() {
      return this.getList(this.id);
    },
    incumbant() {
      return this.ranked[this.incumbantIndex];
    },
    challenger() {
      return this.challengerID;
    },
    cached() {
      return Object.keys(this.imageCache).length;
    }
  },
  watch: {
    getUseImgComparisons(val) {
      if (val === true) {
        this.caching();
      }
    }
  },
  mounted() {
    this.caching();
    this.cacheRanked();
    this.newPair();
  },
  methods: {
    ...mapActions(["setrankto", "renameList", "dropGameInList"]),
    caching() {
      console.log("caching..");
      if (!this.getUseImgComparisons) {
        return;
      }
      const vm = this;
      try {
        if (this.cacheCycles > 2000) {
          throw new RangeError("Max cache cycles reached.");
        }
        if (vm.cached >= vm.listData.games.length) {
          console.log("Caching complete");
          return;
        }
        this.cacheImgs()
          .then(() => {
            vm.caching();
          })
          .catch(e => {
            vm.caching();
            throw new Error(e);
          });
      } catch (e) {
        console.error(e);
      }
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
      if (this.listData.list.length < 1) {
        this.setrank(this.unranked[0], 1);
      } else if (this.listData.list.length > 3) {
        this.incumbantIndex = Math.floor(
          this.ranked.length / 2 + randomInt(-1, 1)
        );
      }
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
        if (!this.getUseImgComparisons) reject("images turned off");
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
        if (this.cached > this.listData.games.length - n) {
          n = this.listData.games.length - this.cached;
        }
        if (n < 1) {
          resolve("Nothing left to cache.");
        }
        for (let i = 0; i < n; i++) {
          const gameId = this.listData.games[i + 5 * this.cacheCycles];
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
