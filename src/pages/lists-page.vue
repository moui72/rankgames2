<template>
  <div>
    <div class="widget my-3">
      <h2>Your lists</h2>
      <p>Sorted by 
        {{ 
          byDate 
            ? 'date created ' + (sortAsc 
              ? '(Old &rarr; New)' 
              : '(New &rarr; Old)')
            : 'name ' + (sortAsc 
              ? '(A &rarr; Z)' 
              : '(Z &rarr; A)' )
        }}
      </p>
      <b-button-toolbar class="mt-3">
        <b-button-group>
          <b-btn 
            v-b-modal="'makeList'"
            variant="info" 
          >
            Make new list
          </b-btn>
          <b-btn 
            v-confirm="{
              ok: purgeLists, 
              okText: 'Delete',
              cancelText: 'Nevermind!',
              message: {
                title: 'Deleting all lists', 
                body: 'All of your lists will be deleted. ' 
                  + 'This cannot be reversed. Are you sure?'
              }
            }"
            variant="danger" 
          >
            Purge lists</b-btn>
        </b-button-group>
        <b-button-group
          class="ml-3" 
        >
        
          <b-btn 
            variant="primary"
            @click="toggleSort()"
          >
            Sort by {{ byDate ? 'name' : 'date' }}
          </b-btn>
          <b-btn 
            variant="success"
            @click="toggleDir()"
          >
            {{ sortAsc ? '&darr;' : '&uarr;' }}
          </b-btn>
        </b-button-group>
      </b-button-toolbar>
    </div>

    <b-modal
      id="makeList"
      title="Make a list"
      ok-title="Create"
      @ok="makeList(newListName, rankableGames)">
      <p>
        Creating a list with a pool of 
        {{ rankableGames.length }} rankable games.
      </p>
      <b-form-group
        label="List name"
        description="A name for your list.">
        <b-form-input
          v-model="newListName"
          :placeholder="'List #' + (lists.length + 1)"
          type="text"
        />
      </b-form-group>
    </b-modal>

    <b-list-group class="my-3 base">
      <transition-group 
        :duration="{out: 200, in: 200}"
        name="lists" 
        move-class="move" 
        enter-active-class="animated fadeIn" 
        leave-active-class="animated fadeOut"
      >

        <template v-for="list in lists">
          <b-list-group-item :key="list.id">
            <div class="mr-2 d-sm-inline-block d-block">
              <h3 class="d-inline">
                {{ list.name }}
              </h3>
              <b-badge class="align-top">
                ID {{ list.id }}
              </b-badge>
            </div>

            <b-button-toolbar 
              class="d-block my-3 d-md-inline float-none float-md-right align-bottom"
            >
              <b-button-group>
                <b-btn 
                  v-confirm="{
                    ok: d => deleteList({id: list.id}), 
                    okText: 'Delete',
                    cancelText: 'Nevermind!',
                    message: {
                      title: 'Deleting one list', 
                      body: list.name + 
                        ' will be deleted. This cannot be reversed. Are you sure?'
                    }
                  }" 
                  variant="danger"
                >
                  &times; delete
                </b-btn>
                <b-btn 
                  :to="'list/' + list.id" 
                  variant="info"><icon 
                    aria-hidden 
                    name="pencil"/> edit</b-btn>
              </b-button-group>
            </b-button-toolbar>
          

            <div class="d-block mt-3 text-secondary small">
              Created {{ list.created | formatDate }}.
              {{ list.games && list.games.length > 0 ? list.games.length : 'No' }} unranked games.
              {{ 
                list.list && list.list.length > 0 
                  ? list.list.length 
                  : 'No' 
              }} ranked games.
            </div>
          </b-list-group-item>
        </template>
        <b-list-group-item v-if="lists.length < 1">
          No lists yet.
        </b-list-group-item>
      </transition-group>
    </b-list-group>
    <rg-footer/>
  </div>

</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Icon from "vue-awesome";
import RgFooter from "../components/footer.vue";

export default {
  name: "Lists",
  components: { Icon, RgFooter },
  data: () => {
    return {
      newListName: "some list",
      byDate: false,
      sortAsc: true
    };
  },
  computed: {
    ...mapGetters(["getLists", "rankableGames"]),
    lists() {
      if (this.byDate) return this.listsByDate();
      return this.listsByName();
    }
  },
  methods: {
    ...mapMutations(["purgeLists", "deleteList"]),
    ...mapActions(["makeNewList"]),
    listsByName() {
      return this.sortAsc
        ? this.getLists.sort(function(a, b) {
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
          })
        : this.getLists.sort(function(a, b) {
            return b.name.toUpperCase() > a.name.toUpperCase() ? 1 : -1;
          });
    },
    listsByDate() {
      return this.sortAsc
        ? this.getLists.sort(function(a, b) {
            return a.created - b.created;
          })
        : this.getLists.sort(function(a, b) {
            return b.created - a.created;
          });
    },
    makeList(name) {
      this.makeNewList({ name });
    },
    toggleSort() {
      this.byDate = !this.byDate;
    },
    toggleDir() {
      this.sortAsc = !this.sortAsc;
    }
  }
};
</script>
<style lang="scss">
.move {
  transition: transform 1s;
}
</style>
