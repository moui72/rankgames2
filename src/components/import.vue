<template>
  <div>
    <h2>Import collection</h2>
    <div>
      {{message}}
    </div>
    <spinner v-show="loading"></spinner>
    <div v-show="!loading">
      <input
        type="text"
        name="username"
        v-model="username"
        placeholder="BGG Username"/>
      <button @click="getCollection()">
        <icon name="download"></icon> Import
      </button>
    </div>
  </div>
</template>

<script>
import Game from './game.vue';
import { mapActions } from 'vuex';
import Icon from 'vue-awesome';
import Spinner from 'vue-simple-spinner';

export default {
  name: 'Import',

  components: { Icon, Spinner },

  data() {
    return {
      username: '',
      message: '',
      loading: false,
      attempts: 0,
      maxAttempts: 5
    };
  },

  methods: {
    ...mapActions['getCollection'],
    getCollection(retry = false) {
      if (retry) this.attempts++;

      this.loading = true;
      this.message = 'Request submitted';
      this.$store.dispatch('getCollection', { username: this.username }).then(
        response => {
          this.message = 'Request complete.';
          this.loading = false;
        },
        error => {
          console.log(error);
          this.message = error;
          if (error.includes('queued') && this.attempts < this.maxAttempts) {
            // @TODO update user on retry
            this.message += ' Retry #' + this.attempts + '.';
            setTimeout(this.getCollection(true), 2000);
          } else {
            this.loading = false;
          }
        }
      );
    }
  },

  created: function() {}
};
</script>

<style></style>
