<template>
  <div :class="{ gc: true, left: left, right: !left }">
    <img
      v-if="useImage"
      :alt="'Image of box cover for ' + name"
      :src="image"
      class="border-primary bgimg"
      height="400"
    />
    <div v-else class="spacer" />
    <h2 class="name">{{ name }}</h2>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueImgLoader from "vue-img-loader";
import PropButton from "./prop-button.vue";
import Icon from "vue-awesome";

export default {
  name: "GameCompare",
  components: {
    PropButton,
    Icon,
    VueImgLoader
  },
  props: {
    id: { type: Number, required: true },
    left: { type: Boolean, required: true },
    useImage: { type: Boolean, default: true }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["toggles", "getProp", "getGame"]),
    name() {
      if (!this.id) return "loading";
      return this.getGame(this.id).name;
    },
    image() {
      if (!this.id) return "";
      return this.getProp(this.id, "image");
    },
    thumb() {
      if (!this.id) return "";
      return this.getProp(this.id, "thumbnail");
    }
  },
  methods: {
    info: function(id) {
      if (!this.id) return;
      this.$router.push("/game/" + id);
    }
  }
};
</script>
<style lang="scss">
.gc {
  border-radius: 0.2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: #396;
    .name {
      color: #0f0;
      box-shadow: 0px 1px 5px rgb(0, 255, 0);
    }
  }

  &.left {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: rgb(255, 145, 0);
  }
  &.right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: rgb(0, 145, 255);
  }

  .btn {
    border-radius: 0;
  }

  .name {
    background-color: rgba(0, 0, 0, 0.65);
    border-radius: 0.5rem;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5rem;
    font-size: 2rem;
  }

  .bgimg {
    display: block;
    width: 100%;
    self-align: flex-start;
    object-fit: cover;
  }

  .spacer {
    height: 400px;
  }
}
</style>
