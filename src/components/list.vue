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
            List: {{data.name}}
          </h2>
        </div>
      </div>
    </div>
    <div>
      <!-- comparisons -->
    </div>
    <div>
      <!-- ranked -->
      <b-list-group class="base">
        <template v-if="data.list && data.list.length > 1"  >
          <b-list-group-item v-for="game in data.list" :key="game">
            <p>
              {{game}}
            </p>
          </b-list-group-item>
        </template>

        <b-list-group-item>
          No ranked games yet.
        </b-list-group-item>
      </b-list-group>
    </div>
    <!-- games browser -->
    <games-browser :ids="data.games" class="my-3"></games-browser>
  </div>

</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import Game from '../components/game.vue';
import GamesBrowser from './games-browser.vue';
import Icon from 'vue-awesome';
export default {
  name: 'List',
  data() {
    return {
      editingName: false,
      newName: '',
      msg: ''
    };
  },
  props: { id: Number },
  components: { Icon, Game, GamesBrowser },
  computed: {
    ...mapGetters(['getList', 'getGame']),
    data() {
      return this.getList(this.id);
    }
  },
  methods: {
    gameData(id) {
      console.log(id, this.getGame(id));
      return this.getGame(id);
    },
    ...mapMutations(['renameList']),
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
  }
};
</script>
<style lang="scss">
</style>
