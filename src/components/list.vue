<template>
  <div>
    <div class="container-fluid my-3 header widget">
      <!-- header -->
      <div class="row">
        <div class="col-1 text-center">
          <b-btn
            v-show="!editingName"
            variant="info"
            @click="editName()"
            @keyup.esc="cancelRename">
            <icon name="pencil" aria-hidden></icon>
            <span class="sr-only">rename</span>
          </b-btn>
          <b-btn
            v-show="editingName"
            variant="warning"
            @click="cancelRename()"
            @keyup.esc="cancelRename">
            <icon name="close" aria-hidden></icon>
            <span class="sr-only">cancel</span>
          </b-btn>
        </div>
        <div class="col-10">
          <b-form-input
            size="lg"
            ref="namefield"
            v-show="editingName"
            type="text"
            v-model="newName"
            :placeholder="data.name"
            @blur.native="rename()"
            @keyup.enter.native="rename()"
            @keyup.esc.native="cancelRename()"
            ></b-form-input>
          <h2 v-show="!editingName">
            <b-link to="/lists">Lists</b-link> &raquo; "{{data.name}}"
          </h2>
        </div>
      </div>
    </div>
    <div v-if="incumbant && challenger">
      <h3 class="base mt-3 p-3">Choose</h3>

      <!-- comparisons -->
      <compare
        v-show="imageCache[incumbant] == {} && imageCache[challenger] == {}"
        :incumbantGame="incumbant" :challengerGame="challenger" @pick="pick">
      </compare>
      <div v-show="!imageCache[incumbant] == {} ">
        LOADING (
        {{incumbant}},
        {{imageCache["3"]}},
        {{challenger}},
        {{imageCache[challenger]}}
        )</div>
    </div>
    <div v-else>
      Done? <b-btn @click="debug"></b-btn>
    </div>
    <div>
      <!-- ranked -->


      <h3 class="base mt-3 p-3">Ranked games</h3>
      <b-pagination
        align="center"
        size="md"
        :total-rows="ranked.length"
        v-model="rankedPage"
        :per-page="rankedPerPage"
        label-next-page="See ranked games "
        >
      </b-pagination>
      <b-list-group class="base mb-2">
        <template v-if="data.list && data.list.length > 1"  >
          <b-list-group-item
            v-for="game in pagedRanked"
            :key="game">
            <div class="row align-items-center">

              <div class="rank col-1">
                {{rankOf(game)}}
              </div>

              <div class="col-6">
                {{getGame(game).name}}
              </div>

              <div class="col-4 text-right">
                <b-button-group>
                  <b-btn variant="success" @click="setrank(game, 0)">&uarr;
                    <span class="sr-only">Set this game's rank to #1</span>
                  </b-btn>
                  <b-btn variant="warning" @click="setrank(game, ranked.length)">&darr;
                    <span class="sr-only">Set this game's rank to #{{ranked.length}}</span>
                  </b-btn>
                  <b-btn variant="danger" @click="setrank(game, -1)">&times;
                    <span class="sr-only">Remove this game's rank</span>
                  </b-btn>
                </b-button-group>
              </div>
            </div>
          </b-list-group-item>

        </template>

        <b-list-group-item v-if="!data.list || data.list.length < 1">
          No ranked games yet.
        </b-list-group-item>
      </b-list-group>
      <b-pagination
        align="center"
        size="md"
        :total-rows="ranked.length"
        v-model="rankedPage"
        :per-page="rankedPerPage">
      </b-pagination>
    </div>
    <!-- games browser -->
    <h3 class="base mt-3 p-3">Unranked games</h3>
    <games-browser
      :ids="unranked"
      class="mb-3"
      @setrank="setrank"
      @drop="drop"></games-browser>
  </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Game from '../components/game.vue';
import GamesBrowser from './games-browser.vue';
import Compare from './compare.vue';
import Icon from 'vue-awesome';
import * as _ from 'lodash';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  name: 'List',
  data() {
    return {
      editingName: false,
      newName: '',
      msg: '',
      challengerID: 0,
      incumbantIndex: 0,
      rankedPage: 1,
      rankedPerPage: 10,
      imageCache: {}
    };
  },
  props: { id: Number },
  components: { Icon, Game, GamesBrowser, Compare },
  computed: {
    ...mapGetters(['getList', 'getGame']),
    unranked() {
      return _.difference(this.data.games, this.ranked);
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
    incumbantGame() {
      return this.incumbant;
    },
    challengerGame() {
      return this.challenger;
    },
    incumbant() {
      return this.data.list[this.incumbantIndex];
    },
    challenger() {
      return this.challengerID;
    }
  },
  methods: {
    ...mapActions(['setrankto', 'renameList', 'dropGameInList']),
    debug() {
      console.log('ch', this.challenger);
      console.log('inc', this.incumbant);
    },
    cacheImgAt(index) {
      return new Promise((resolve, reject) => {
        console.log('caching ' + index);
        if (!this.imageCache[this.unranked[index]]) {
          try {
            let img = new Image();
            img.onload = () => {
              resolve(img);
            };
            img.src = this.gameData(this.unranked[index]).image;
          } catch (e) {
            reject(e);
          }
        }
      });
    },
    rankOf(gameId) {
      return (
        this.ranked.findIndex(el => {
          return el == gameId;
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
      if (id === this.incumbantGame) {
        this.setrank(this.challenger, this.incumbantIndex + 1);
        this.newPair();
      } else {
        this.nextIncumbant();
      }
    },
    setrank(id, rank) {
      rank = rank || 0;
      this.setrankto({ listid: this.id, game: id, rank: rank });
    },
    drop(id) {
      this.dropGameInList({ listid: this.id, game: id });
    },
    gameData(id) {
      return this.getGame(id);
    },
    rename() {
      if (this.newName.trim() == '')
        return this.cancelRename('list must have a name');
      this.renameList({ id: this.id, newName: this.newName });
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
    cacheImgs(n = 10, wait = 5, duration = 5000) {
      let preloaded = 0;
      return new Promise((resolve, reject) => {
        for (let i = 0; i < n; i++) {
          console.log(i);
          this.cacheImgAt(i)
            .then(imgObj => {
              preloaded++;
              this.imageCache[this.unranked[i]] = imgObj;
              if (preloaded == n) {
                resolve(true);
              } else if (n - 1 === i) {
                let waiting = setInterval(() => {
                  if (preloaded == n) {
                    clearInterval(waiting);
                    resolve('preloaded ' + n + ' images');
                  } else if (wait < 1) {
                    clearInterval(waiting);
                    reject('timeout: ' + wait * duration);
                  }
                  wait--;
                }, duration);
              }
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    }
  },
  mounted() {
    this.newPair();
    this.cacheImgs();
  }
};
</script>
<style lang="scss">
.rank {
  text-align: right;
  font-size: 3em;
  margin-right: 0.5em;
}
</style>
