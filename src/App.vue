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
            <span v-html="'&larr;'"/> Back
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>

    <b-modal
      id="settings"
      title="Settings"
      ok-title="Close"
      ok-variant="primary"
      ok-only
      
    >
      <div
        class="form-group"
      >
        <legend 
          for="sel" 
          class="col-form-label pt-0"
        >
          Games per page
        </legend>
        <select 
          id="sel"
          class="form-control"
          aria-describedby="perPageDescription"
          @change="setPerPage"
        >
          <option
            v-for="n in 9"
            :selected="n * 12 == getPerPage" 
            :value="n*12" 
            :key="n"
          >
            {{ n * 12 }} items
          </option>
        </select>
        <small 
          id="perPageDescription" 
          class="form-text text-muted"
        >
          How many games to show on each page.
          Lower values may provide better performance.
        </small>
      </div>

      <b-form-group
        label="Images in game comparison widget"
        description="Not using images may improve performance and will reduce 
        load times, but will degrade the sighted user's experience to some 
        extent."
      >
        <b-form-checkbox 
          :checked="getUseImgComparisons"
          @change="setUseImgComparisons"
        > 
          Use images in comparisons 
        </b-form-checkbox>
      </b-form-group>

      <b-form-group
        label="Background loading"
        description="This setting will allow you to make comparisons without 
        waiting for images to cache. Images will not be shown until they are 
        done loading. This setting requires that images are turned on."
      >
        <b-form-checkbox 
          :checked="getBackgroundLoad && getUseImgComparisons"
          :disabled="!getUseImgComparisons"
          @change="setBackgroundLoad"
        > 
          Load images in background
        </b-form-checkbox>
      </b-form-group>

    </b-modal>

    <transition
      :duration="{in: 300, out:150}"
      name="page-change"
      appear
      mode="out-in"
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <router-view class="container-fluid"/>
    </transition>

    <div class="container-fluid"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RgFooter from "./components/footer.vue";
import Icon from "vue-awesome";

// @TODO add ability to export/import data from file
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
      focus: false
    };
  },
  computed: {
    ...mapGetters(["getPerPage", "getUseImgComparisons", "getBackgroundLoad"])
  },
  methods: {
    // @TODO make action to use here instead of using mutation directly
    ...mapActions(["setPerPage", "setUseImgComparisons", "setBackgroundLoad"]),

    setSelect() {
      this.$refs.sel.$el.selectedIndex = this.getPerPage / 12 - 1;
    },

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
.move {
  transition: transform 1s;
}
legend {
  font-weight: 600;
}
</style>
