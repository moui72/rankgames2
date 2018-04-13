<template>
  <div>
    <div class="widget my-3">
      <h2>Your lists</h2>
      <b-button-toolbar class="mt-3">
        <b-button-group>
          <b-btn variant="info" v-b-modal="'makeList'">Make new list</b-btn>
          <b-btn variant="danger" @click="purgeLists">Purge lists</b-btn>
        </b-button-group>
      </b-button-toolbar>
    </div>

    <b-modal
      id="makeList"
      title="Make a list"
      ok-title="Create"
      @ok="makeList(newListName, rankableGames)">
      <p>
        Creating a list with a pool of {{rankableGames.length}} rankable games.
      </p>
      <b-form-group
        label="List name"
        description="A name for your list.">
        <b-form-input
        type="text"
        v-model="newListName"
        :placeholder="'List #' + (lists.length + 1)"></b-form-input>
      </b-form-group>
    </b-modal>

    <b-list-group class="my-3 base">
      <template v-for="list in listsByDate">
        <b-list-group-item :key="list.id">
          <div class="mr-2 d-sm-inline-block d-block">

            <h3 class="d-inline">
              {{list.name}}
            </h3>
            <b-badge class="align-top">
              ID {{list.id}}
            </b-badge>
          </div>

          <b-button-toolbar class="d-block my-3 d-md-inline float-none float-md-right align-bottom">
            <b-button-group>
              <b-btn @click="deleteList({id: list.id})" variant="danger">&times; delete</b-btn>
              <b-btn :to="'list/' + list.id" variant="info"><icon aria-hidden name="pencil"></icon> edit</b-btn>
            </b-button-group>
          </b-button-toolbar>

          <div class="d-block mt-3 text-secondary small">
            Created {{list.created | formatDate}}.
            {{list.games && list.games.length > 0 ? list.games.length : 'No'}} unranked games.
            {{list.list && list.list.length > 0 ? list.list.length : 'No'}} ranked games.
          </div>

        </b-list-group-item>
      </template>
      <b-list-group-item v-if="lists.length < 1">No lists yet.</b-list-group-item>
    </b-list-group>
  </div>

</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Library from '../components/library.vue';
import Icon from 'vue-awesome';

export default {
  name: 'Lists',
  data: () => {
    return {
      newListName: 'some list',
      byDate: false
    };
  },
  components: { Icon },
  computed: {
    ...mapGetters(['getLists', 'rankableGames']),
    lists() {
      if (this.byDate) return this.listsByDate;
      return this.listsById;
    },
    listsById() {
      return this.getLists.sort((a, b) => {
        return a.id - b.id;
      });
    },
    listsByDate() {
      return this.getLists.sort(function(a, b) {
        return a.created - b.created;
      });
    }
  },
  methods: {
    ...mapMutations(['purgeLists', 'deleteList']),
    ...mapActions(['makeNewList']),
    makeList(name) {
      let listId = this.makeNewList({ name });
    }
  }
};
</script>
<style lang="scss">

</style>
