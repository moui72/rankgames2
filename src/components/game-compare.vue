<template>
  <div :class="{gc: true, left: left, right: !left}" @click="pick">
    <b-img-lazy
      blank-src
      :alt="'Small image of box cover for ' + name"
      :src="getProp(id, 'image')"
      class="border-primary"
      width="100%"/>
    <h2 class="name">{{name}}</h2>
    <b-btn variant="success" size="lg" class="btn-block">Pick</b-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import PropButton from './prop-button.vue';
import Icon from 'vue-awesome';

export default {
  name: 'GameCompare',
  props: { id: Number, left: Boolean },
  data() {
    return {};
  },
  components: {
    PropButton,
    Icon
  },
  computed: {
    ...mapGetters(['toggles', 'getProp', 'getGame']),
    name() {
      return this.getGame(this.id).name;
    },
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
      name = name.substr(0, 15) + '...' + name.substr(-5);
      return name.replace(/(\.\.\.)+/, '...');
    }
  },
  methods: {
    info: function(id) {
      console.log(id);
      console.log(this.getGame(id));
      this.$router.push('/game/' + id);
    },
    pick() {
      this.$emit('pick', id)
    }
  }
};
</script>
<style lang="scss">
.gc {
  border-radius: .2rem;
  position: relative;
  overflow: hidden;

  &.left {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:hover{
    opacity: .75;
  }

  .btn {
    border-radius: 0;
  }

  .name {
    background-color: rgba(0,0,0,.65);
    border-radius: .5rem;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: .5rem;
    font-size: 2rem;
  }

  img {
    display: inline;
    max-height: 250px;
    display: block;
    width: 100%;
    self-align: flex-start;
    object-fit: cover;
    object-position: 0 50%;

  }
}


</style>
