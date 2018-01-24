<template>
  <div>
    <b-card
      class="game my-3"
      header-bg-variant="dark"
      header-text-variant="light"
      header-tag="header"
      :sub-title="game.id"
      :img-src="game.image"
      :img-alt="game.name + ' box cover'"
      footer-tag="footer"
      >
      <header slot="header" class="row">
        <div class="col-8">
          <span class="game-name">{{game.name}}</span>
          <b-badge
            :href="'http://boardgamegeek.com/thing/'+id"
            v-b-tooltip.hover :title="'BGG ID for ' + game.name"
            class="ml-1 align-top" variant="light" size="sm">{{id}}
          </b-badge>
        </div>
        <div class="col-4 text-right">
          <b-button-group class="align-bottom">
            <template v-for="prop in toggles">
              <prop-button
                :property="prop"
                :value="getProp(id, prop)"
                :id="id">
              </prop-button>
            </template>
            <b-btn variant="info" @click="close">
              &times;
              <span class="sr-only">close "{{game.name}}" details screen</span>
            </b-btn>
          </b-button-group>
        </div>

      </header>

      <p>
        This game is {{!game.visible ? 'not' : ''}} visible and
        {{!game.visible ? 'not' : ''}} rankable.
        See more info on <a :href="'http://boardgamegeek.com/thing/'+id">
        BoardGameGeek.com</a>.
      </p>

      <div class="clearfix">

      </div>
      <b-list-group>
        <template v-for="(value, property) in gameInfo">
          <b-list-group-item v-if="value && value != -1" class="row"
            :variant="variant(property, value)">
            <label>
              {{property}}
            </label>
            <span class="value" >
              {{value}}<span v-if="property.indexOf('rating') >= 0">/10</span>
            </span>
          </b-list-group-item>
        </template>
      </b-list-group>
      <div slot="footer" class="text-center">
        <b-button-group class="mx-auto align-bottom">
          <template v-for="prop in toggles">
            <prop-button
            size="lg"
            :property="prop"
            :value="getProp(id, prop)"
            :id="id">
          </prop-button>
        </template>
        <b-btn variant="info" @click="close">
          &times;
          <span aria-hidden>Close</span>
          <span class="sr-only">close "{{game.name}}" details screen</span>
        </b-btn>
      </b-button-group>
      </div>
    </b-card>
  </div>

</template>
<script>
import { mapGetters } from 'vuex';
import PropButton from '../components/prop-button.vue';
import Icon from 'vue-awesome';

export default {
  name: 'GameDetail',
  data: function() {
    return {};
  },
  components: { PropButton, Icon },
  computed: {
    ...mapGetters(['toggles', 'getProp', 'getGame']),
    game() {
      console.log(this.getGame(this.id));
      return this.getGame(this.id);
    },
    id() {
      return this.$route.params.id * 1;
    },
    gameInfo() {
      let info = {
        'Year published': this.game.yearPublished,
        description: this.game.description,
        'BGG rank': this.game.rank,
        'BGG average rating': this.game.averageRating,
        'Player count': this.game.minPlayers + ' to ' + this.game.maxPlayers,
        'Play time': this.game.playingTime
      };
      for (const prop in this.game.ratings) {
        info[prop + "'s rating"] = this.game.ratings[prop];
      }
      return info;
    }
  },
  methods: {
    close() {
      this.$router.back();
    },
    variant(p, v) {
      if (p.indexOf('rating') < 0) return 'default';
      if (v <= 4) {
        return 'danger';
      }
      if (v <= 5) {
        return 'warning';
      }
      if (v <= 7) {
        return 'info';
      }
      return 'success';
    }
  }
};
</script>
<style lang="scss">
.game {
  .game-name{
    font-size: 1.5rem;
  }
  .badge {
    font-size: .675rem;
  }
  label{
    margin: 0;
    color: rgba(0,0,0,.675);
    font-weight: bold;
    font-size: .675rem;
    display:block;
    text-transform: uppercase;
  }
}
</style>
