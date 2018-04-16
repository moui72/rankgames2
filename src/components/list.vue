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
    <div  v-if="rankedCached && unrankedCached">
      <h3 class="base mt-3 p-3">Choose</h3>

      <!-- comparisons -->
      <compare
        :incumbantGame="incumbant" :challengerGame="challenger" @pick="pick">
      </compare>
    </div>
    <div class="widget mt-3">
       <h4>Preloading images ({{cached}} of {{ranked.length + 5}})</h4>
       <h5>Buffer</h5>
       <b-progress variant="success" :value="cached" :max="ranked.length + 5" class="mb-3">
         <b-progress-bar :value="Object.keys(imageCache).length" >
           {{cached}} / {{ranked.length + 5}}
         </b-progress-bar>
       </b-progress>
       <h5>Total</h5>
       <b-progress  :max="ranked.length + unranked.length">
         <b-progress-bar :value="cached" >
           {{ cached  }} / {{ranked.length + unranked.length}}
         </b-progress-bar>
      </b-progress>
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
        class="widget"
        >
      </b-pagination>
      <b-list-group class="base mb-2" v-if="data.list && data.list.length > 1">

        <template v-for="game in pagedRanked">
          <transition
            name="next-game"
            mode="out-in"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut" :duration="{out: 200, in: 400}">
            <b-list-group-item
              :key="game"
              class="ranked-game-item">
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
          </transition>
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
      rankedCached: false,
      unrankedCached: false,
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
  methods: {
    ...mapActions(['setrankto', 'renameList', 'dropGameInList']),
    rankOf(gameId) {
      return (
        this.ranked.findIndex(el => {
          return el == gameId;
        }) + 1
      );
    },
    getChallenger() {
      this.unrankedCached = false;
      this.cacheImgs().then(r => {
        this.unrankedCached = true;
      })
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
      this.cacheImg(this.incumbant)
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
      let imgsReady = 0;
      this.getIncumbant();
      this.getChallenger();
      try{
        this.cacheImg(this.challenger)
          .then(i => this.imgReady(this.challenger, i))
          .catch(e => this.cacheImgFail(this.challenger,e));
        this.cacheImg(this.incumbant)
          .then(i => this.imgReady(this.incumbant, i))
          .catch(e => this.cacheImgFail(this.incumbant,e));

      } catch(e) {
        console.error("Invalid incumbant or challenger. Retrying.");
        this.setTimeout(this.newPair, 500)
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
    imgIsReady(id) {
      console.log(this.imageCache[id])
      if (!typeof this.imageCache[id] == 'undefined' && this.imageCache[id].ready) {
        return true;
      }
      return false;
    },
    cacheImg(id) {
      if (id === 0) throw new RangeError("cacheImg got invalid game id ("+id+")", 282)
      this.$set(this.imageCache, id, { ready: false });
      return new Promise((resolve, reject) => {
        if (typeof this.gameData(id) == 'undefined') {
          reject(id);
        }
        if (!this.imageCache[id] || !this.imageCache[id].ready) {
          try {
            let img = new Image();
            img.onload = () => {
              resolve(img);
            };
            img.src = this.gameData(id).image;
          } catch (e) {
            reject(e);
          }
        } else {
          console.log('ready already', id)
        }
      });
    },
    cacheImgs(n = 5, wait = 5, duration = 5000) {
      let preloaded = 0;
      return new Promise((resolve, reject) => {
        for (let i = 0; i < n; i++) {
          this.cacheImg(this.unranked[i])
            .then(imgObj => {
              preloaded++;
              if (preloaded == n) {
                resolve(true);
              } else if (n - 1 === i) {
                let waiting = setInterval(() => {
                  if (preloaded == n) {
                    clearInterval(waiting);
                    resolve('preloaded ' + n + ' images');
                  } else if (wait < 1) {
                    clearInterval(waiting);
                    reject('timeout', wait * duration);
                  }
                  wait--;
                }, duration);
              }
              this.imgReady(this.unranked[i], imgObj);
            })
            .catch(err => {
              console.log('error:', err)
              this.cacheImgFail(this.unranked[i], err);
              reject(err);
            });
        }
      });
    },
    cacheRanked() {
      let cached = 0;
      for (let i = 0; i < this.ranked.length; i++) {
        let ico = this.imageCache[this.ranked[i]]; // image cache object
        if (typeof ico == 'undefined' || !ico.ready) {
          this.cacheImg(this.ranked[i]).then(r => {
            cached++;
            console.log('r', r)
            console.log('ranked cached', cached, '/', this.ranked.length)
            if (cached == this.ranked.length) {
              this.rankedCached = true;
            }
          });
        } else {
          cached++;
          console.log('ranked cached', cached, '/', this.ranked.length)
          if (cached == this.ranked.length) {
            this.rankedCached = true;
          }
        }

      }
    },
    cacheImgFail(id, imgObj) {
      console.log('failed to cache', id, imgObj);
      this.$set(this.imageCache, id, { img: imgObj, ready: false });
    },
    imgReady(id, imgObj) {
      console.log('cached', id);
      this.$set(this.imageCache, id, { img: imgObj, ready: true });
    }
  },
  mounted() {
    this.cacheImgs().then(r => {
      console.log(r);
      this.unrankedCached = true;
      let caching = setInterval(() => {
        this.cacheImgs().then(() => {
          if (this.ranked.length + this.unranked.length == Object.keys(this.imageCache).length) {
            console.log('done caching ' +cached+' images');
            clearInterval(caching);
          }
        })
      }, 3000);
    });
    this.cacheRanked();
    this.newPair();
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
