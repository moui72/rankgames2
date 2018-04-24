<template>
  <div id="app">
    <b-navbar 
      toggleable="md" 
      variant="primary" 
      type="dark">
      <b-navbar-toggle target="nav_dropdown_collapse"/>
      <b-navbar-brand href="#">
        {{ title }}
      </b-navbar-brand>
      <span class="warning float-right">
        Alpha
        <small>{{ version }}</small>
      </span>
      <b-collapse 
        id="nav_dropdown_collapse"
        is-nav 
      >
        <b-navbar-nav class="mr-auto">
          <b-nav-item to="/">
            <icon 
              name="home" 
              aria-hidden 
              label="home icon" 
              scale=".95"/>
            <span>Home</span>
          </b-nav-item>
          <b-nav-item to="/lists">
            <icon 
              name="list" 
              aria-hidden 
              label="lists icon" 
              scale=".95"/>
            <span>Lists</span>
          </b-nav-item>
          <b-nav-item 
            v-b-modal="'settings'" 
            title="settings">
            <icon 
              name="cog" 
              aria-hidden 
              label="settings icon" 
              scale=".95"/>
            <span>Settings</span>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav 
          v-if="!isHome()" 
          class="float-right">
          <b-nav-item @click="back">
            &larr; Back
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>

    <b-modal
      id="settings"
      title="Settings"
      ok-title="Close"
      ok-variant="primary"
      ok-only>
      <b-form-group
        label="Games per page"
        description="How many games to show on each page.
          Lower values may provide better performance.">
        <b-form-select 
          v-model="perPage"
          @change="setPerPage" 
        >
          <option 
            v-for="n in 9" 
            :value="n*12" 
            :key="n">
            {{ n * 12 }} items
          </option>
        </b-form-select>
      </b-form-group>
    </b-modal>

    <transition
      :duration="{in: 300, out:200}"
      name="page-change"
      appear
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutRight"
    >
      <router-view class="container-fluid"/>
    </transition>

    <div class="container-fluid"/>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import RgFooter from "./components/footer.vue";
import Icon from "vue-awesome";

//@TODO ROUTES!!!!11 (library, list)
export default {
  name: "App",
  components: {
    Icon,
    RgFooter
  },
  data() {
    return {
      title: "Rank Games",
      version: "1.0.1",
      focus: false,
      perPage: 24
    };
  },
  methods: {
    ...mapMutations(["setPerPage"]),

    back() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },

    isHome() {
      return this.$route.name == "Home";
    }
  }
};
</script>

<style lang="scss">
body,
html {
  background-color: #ccc;
}
.shadow {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.6);
}
.base {
  @extend .shadow;
  background-color: white;
  border-radius: 0.2rem;
}
.widget {
  @extend .base;
  padding: 1rem;
}
.collapse {
  .nav-item {
    vertical-align: bottom;
    .fa-icon {
      margin-top: 0.0125rem;
      color: transparentize(white, 0.25);
    }
  }
}
.warning {
  font-variant: small-caps;
  background-color: #339;
  color: #ee9;
  padding: 0.5rem;
  font-size: 0.6rem;
  border-radius: 0.5rem;
  small {
    font-variant: normal;
  }
}
</style>
