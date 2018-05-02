<template>
  <div>
    <div class="game-box">
      <div class="img-wrap">
        <slot name="picture">
          <b-img-lazy
            v-if="thumb"
            :alt="'Small image of box cover for ' + name"
            :src="thumb"
            blank-src
            class="border-primary"/>
          <b-img 
            v-else
            :alt="'No box cover image available for '+ name" 
            :src="thumb"
            blank 
            class="border-primary"
            height="170" 
            blank-color="rgba(0,0,0,.15)"/>
        </slot>
      </div>
      <div>
        <div class="px-1 mt-1">
          <h3 class="game-name d-block text-truncate">
            {{ name }}
          </h3>
        </div>
      </div>
      <div class="align-bottom">
        <div class="c">
          <slot name="controls">
            <b-button-group class="mx-auto align-bottom">
              <template v-for="prop in toggles">
                <prop-button
                  :key="prop"
                  :property="prop"
                  :value="getProp(id, prop)"
                  :id="id"
                  class="mx-1"/>
              </template>
              <div class="mx-1">
                <b-btn 
                  variant="info" 
                  @click="info(id)">
                  <icon name="info-circle"/>
                  <span class="sr-only">view details for {{ name }}</span>
                </b-btn>
              </div>
            </b-button-group>
          </slot>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import PropButton from "./prop-button.vue";
import Icon from "vue-awesome";

export default {
  name: "Game",
  components: {
    PropButton,
    Icon
  },
  props: { id: { type: Number, required: true } },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["toggles", "getProp", "getGame"]),
    name() {
      return this.getGame(this.id).name;
    },
    thumb() {
      return this.getProp(this.id, "thumbnail");
    },
    truncName() {
      if (this.name.length < 25) return this.name;
      if (this.name.split(" ").length < 6)
        return this.name.substr(0, 15) + "..." + this.name.substr(-5);
      let name = this.name.split(" ");
      let nameArr = name.slice(0, 3).concat(["..."], name.slice(-2));
      name = nameArr.join(" ");
      if (name.length < 25) return name;
      name = name.substr(0, 15) + "..." + name.substr(-5);
      return name.replace(/(\.\.\.)+/, "...");
    }
  },
  methods: {
    info: function(id) {
      this.$router.push("/game/" + id);
    }
  }
};
</script>
<style lang="scss" >
.game-box {
  text-align: center;
  display: table;
  height: 100%;
  width: 100%;
  padding: 0 0 1rem 0;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.9);
  background-color: white;
  border-radius: 0.2rem;

  .img-wrap {
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
  }

  > div {
    display: table-row;
    > div {
      display: table-cell;
      vertical-align: middle;

      &:last-child {
        vertical-align: bottom;
      }
    }
  }
  h3 {
    width: 100%;
    max-width: 190px;
    font-size: 1.2rem;
    margin: 0.75rem auto;
  }
  img {
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
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
