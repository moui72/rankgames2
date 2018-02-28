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
      <b-btn @click="newPair">new comparison</b-btn>
    </div>
    <div v-if="incumbant && challenger">
      <h3 class="base mt-3 p-3">Choose</h3>

      <!-- comparisons -->
      <compare
        :incumbantGame="incumbant" :challengerGame="challenger" @pick="pick">
      </compare>
    </div>
    <div>
      <!-- ranked -->
      <h3 class="base mt-3 p-3">Ranked games</h3>

      <b-list-group class="base">
        <template v-if="data.list && data.list.length > 1"  >
          <b-list-group-item v-for="game in data.list" :key="game">
            <p>
              {{getGame(game).name}}
            </p>
          </b-list-group-item>
        </template>

        <b-list-group-item v-if="!data.list || data.list.length < 1">
          No ranked games yet.
        </b-list-group-item>
      </b-list-group>
    </div>
    <!-- games browser -->
    <h3 class="base mt-3 p-3">Unranked games</h3>
    <games-browser :ids="unranked" class="mb-3" @setrank="setrank" @drop="drop"></games-browser>
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
      incumbantIndex: 0
    };
  },
  props: { id: Number },
  components: { Icon, Game, GamesBrowser, Compare },
  computed: {
    ...mapGetters(['getList', 'getGame']),
    unranked() {
      return _.difference(this.data.games, this.ranked);
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
    getChallenger() {
      if (this.unranked.length < 2) {
        return this.unranked[0];
      }
      this.challengerID = this.unranked[randomInt(0, this.unranked.length)];
      return this.challengerID;
    },
    newPair() {
      console.log(this.challenger, this.incumbantIndex);
      this.getIncumbant();
      this.getChallenger();
    },
    pick(id) {
      if (id === this.incumbantGame) {
        console.log('incumbant picked');
        this.setrank(this.challenger, this.incumbantIndex + 1);
        this.newPair();
      } else {
        console.log('challenger picked');
        this.nextIncumbant();
      }
    },
    setrank(id, rank) {
      rank = rank || 0;
      console.log('setrank (id, rank)', id, rank);
      this.setrankto({ listid: this.id, game: id, rank: rank });
    },
    drop(id) {
      this.dropGameInList({ listid: this.id, game: id });
      console.log('drop', id);
    },
    gameData(id) {
      console.log(id, this.getGame(id));
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
    }
  },
  created() {
    this.newPair();
  }
};
</script>
<style lang="scss">

</style>
