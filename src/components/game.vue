<template>
  <div>
    <div class="game">
      <img :src="getProp(id, 'thumbnail')" class="border-primary"/>

      <div class="game-body">
        <div>
          <h3>{{name}}</h3>
        </div>
        <div class="controls align-bottom">
          <b-button-group>
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
    ...mapGetters(['toggles', 'getProp'])
  },
  methods: {
    info: function(id) {
      console.log(id);
    }
  }
};
</script>
<style lang="scss">
.game {
  box-shadow: 0px 0px 20px rgba(0,0,0,.9);
  text-align: center;
  height: 100%;
  width: 100%;
  img {
    width: 100%;
    border-bottom: 1rem solid;
  }
  .controls{
    display: inline;
  }
  .btn {
    margin-bottom: 1rem;
  }
}

</style>
