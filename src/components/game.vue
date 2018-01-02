<template>
  <div>
    <div class="game">
      <div>
        <img :src="getProp(id, 'thumbnail')" class="border-primary"/>
      </div>
      <div>
        <div class="px-1">
          <h3 class="text-center">{{shortName}}</h3>
        </div>
      </div>
      <div class="align-bottom">
        <div class="c">
          <b-button-group class="mx-auto align-bottom">
            <template v-for="prop in toggles">
              <prop-button
              :property="prop"
              :value="getProp(id, prop)"
              :id="id">
            </prop-button>
          </template>
          <b-btn variant="info" @click="info(id)">
            <icon name="info-circle"></icon>
            <span class="sr-only">view details for {{name}}</span>
          </b-btn>
        </b-button-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import PropButton from './prop-button.vue';
import Icon from 'vue-awesome';

export default {
  name: 'Game',
  props: { id: Number, name: String },
  data() {
    return {};
  },
  components: {
    PropButton,
    Icon
  },
  computed: {
    ...mapGetters(['toggles', 'getProp', 'getGame']),
    shortName() {
      let name = this.name.replace(/ [aA]nd /, '&').split(' ');
      if (name[0].toLowerCase() == 'the') name.shift();
      if (name.length < 5) return name.join(' ');

      let shortName = name.slice(0, 2).concat(['...'], name.slice(-2));
      console.log(shortName);
      return shortName.join(' ');
    }
  },
  methods: {
    info: function(id) {
      console.log(id);
      console.log(this.getGame(id));
    }
  }
};
</script>
<style lang="scss">
.game {
  box-shadow: 0px 0px 20px rgba(0,0,0,.9);
  text-align: center;
  display: table;
  height: 100%;
  width: 100%;
  padding: 0 0 1rem 0;

  >div {
    display: table-row;
    >div {
      display: table-cell;
      vertical-align: middle;

      &:last-child{
        vertical-align: bottom;
      }
    }
  }
  h3{
    width: 100%;
    font-size: 1.3rem;
  }
  img {
    display: block;
    border-bottom: 1rem solid;
    width: 100%;
    self-align: flex-start;
  }
}

</style>
