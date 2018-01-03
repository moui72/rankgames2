<template>
  <div>
    <div class="game">
      <div class="img-wrap">
        <b-img-lazy
          v-if="thumb"
          blank-src
          :alt="'Small image of box cover for '+name"
          :src="thumb"
          class="border-primary"/>
        <b-img v-else
          blank :alt="'No box cover image available for '+ name"
          :src="thumb" class="border-primary"
          height="170" blank-color="rgba(0,0,0,.15)"/>
      </div>
      <div>
        <div class="px-1">
          <h3 class="text-center">{{truncName}}</h3>
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
    thumb() {
      return this.getProp(this.id, 'thumbnail');
    },
    truncName() {
      if (this.name.length < 25) return this.name;
      if (this.name.split(' ').length < 6)
        return this.name.substr(0, 15) + '...' + this.name.substr(-5);
      let name = this.name.split(' ');
      let nameArr = name.slice(0, 3).concat(['...'], name.slice(-2));
      name = nameArr.join(' ');
      if (name.length < 25) return name;
      return name.substr(0, 15) + '...' + name.substr(-5);
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
    object-fit: cover;
    object-position: 50% 0;
    max-height: 170px;
  }
}

</style>
