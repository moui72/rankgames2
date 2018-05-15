<template>
  <div id="app">
    <b-navbar 
      class="sans"
      toggleable="md" 
      variant="primary" 
      type="dark">
      <b-navbar-toggle target="nav_dropdown_collapse"/>
      <b-navbar-brand 
        to="/" 
        class="brand">
        <img 
          :alt="title" 
          src="img/rg-logo-ico.png"
          height="50px"
        >
        <span class="ml-2">{{ title }}</span>
      </b-navbar-brand>
      <span class="version mr-2">
        <small>v{{ version }}</small>
      </span>
      <b-collapse 
        id="nav_dropdown_collapse"
        is-nav 
      >
        <b-navbar-nav class="mr-auto">
          <b-nav-item
            v-b-modal="'load'" 
          
          >
            <icon 
              name="upload" 
              aria-hidden 
              label="upload icon" 
              scale=".95"/>
            <span>Load from file</span>
          </b-nav-item>
          <b-nav-item
            v-b-modal="'export'" 
          
          >
            <icon 
              name="download" 
              aria-hidden 
              label="download icon" 
              scale=".95"/>
            <span>Export</span>
          </b-nav-item>
          <b-nav-item to="/lib">
            <icon 
              name="book" 
              aria-hidden 
              label="book icon" 
              scale=".95"/>
            <span>Library</span>
          </b-nav-item>
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
      <b-form-group
        label="Show welcome message"
        description="If you want the welcome message to show on the homepage again, click this box."
      >
        <b-form-checkbox 
          :checked="!wasIntroduced"
          @change="setIntroduced"
        > 
          Show welcome message
        </b-form-checkbox>
      </b-form-group>
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

    <b-modal 
      id="export" 
      title="Export data"
      @ok="saveData"
      
    >
      <b-form-group
        label="Filename" 
        description="Enter a name for the export file. Do not include a file 
        extension. The data are json, so the file will be a .json file."
      >
        <p 
          v-show="error.length > 0" 
          class="text-danger"
        >
          {{ error }}
        </p>
        <b-input 
          v-model="fileName"
          type="text" 
        />
      </b-form-group>
    </b-modal>

    <b-modal 
      id="load" 
      title="Load data from"
      @ok="loadSavedData(preloadedData)"
    >
      <b-form-group
        label="Load from file" 
        description="Select a previously exported file to load into the app."
      >
        <p 
          class="text-info"
        >
          {{ preview }}
        </p>
        <p 
          v-show="error.length > 0" 
          class="text-danger"
        >
          {{ error }}
        </p>
        <b-form-file 
          v-model="file"
          type="file"
          accept="application/json" 
        />

      </b-form-group>
      <p 
        v-show="!!file && !error" 
        class="text-warning">Be warned that clicking OK will overwrite your current data. You may want to export the current data first.
      </p>
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

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RgFooter from "./components/footer.vue";
import Icon from "vue-awesome";
import * as fileSaver from "file-saver";

// @TODO add ability to export/import data from file
export default {
  name: "App",
  components: {
    Icon,
    RgFooter
  },
  data() {
    return {
      title: "Rank Games 2",
      version: "[AIV]{version}[/AIV]",
      focus: false,
      fileName: "my-rg-data",
      error: "",
      file: null,
      preloadedData: { games: [], lists: [], exported: Date.now() },
      preview: ""
    };
  },
  computed: {
    ...mapGetters([
      "getPerPage",
      "getUseImgComparisons",
      "getBackgroundLoad",
      "export",
      "wasIntroduced"
    ])
  },
  watch: {
    file: function() {
      this.preloadData();
    }
  },
  methods: {
    // @TODO make action to use here instead of using mutation directly
    ...mapActions([
      "setPerPage",
      "setUseImgComparisons",
      "setBackgroundLoad",
      "setIntroduced",
      "loadSavedData"
    ]),
    preloadData() {
      if (!this.file || this.file.type !== "application/json") {
        this.error = "Invalid file type.";
        return;
      }
      let reader = new FileReader();
      var vm = this;
      var preload = null;

      reader.onload = function() {
        try {
          preload = JSON.parse(reader.result);
        } catch (e) {
          vm.error = "Failed to parse JSON (" + e + ").";
          console.error(e);
          return e;
        }
        if (!preload.games && !preload.lists) {
          vm.error = "File is invalid.";
          return;
        }
        let prev = "";
        prev += "Saved " + preload.exported + ". ";
        prev +=
          "File contains collection of " +
          (!!preload.games && preload.games.length > 0
            ? preload.games.length + " games "
            : "no games. ");
        prev +=
          !!preload.lists && preload.lists.length > 0
            ? "as well as " + preload.lists.length + " lists."
            : "but no lists.";
        vm.error = "";
        vm.preview = prev;
        vm.preloadedData = preload;
        return preload;
      };
      reader.readAsText(this.file);
    },
    loadData() {},
    saveData(bvtEvt) {
      if (!/^[a-z0-9_.@()-]+$/i.test(this.fileName)) {
        bvtEvt.preventDefault();
        this.error = "Enter a valid filename.";
        return;
      }
      this.error = "";
      fileSaver.saveAs(
        new Blob([this.export], { type: "text/plain;charset=utf-8" }),
        this.fileName + ".json"
      );
    },
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
@import url(https://cdn.jsdelivr.net/npm/animate.css@3.5.1);
$theme-colors: (
  "primary": #0033a7,
  "danger": #ff4136,
  "secondary": rgb(180, 90, 200),
  "other": #12580c,
  "info": rgb(220, 100, 180),
  "brand": rgb(255, 255, 155)
);
$body-bg: "#ccc";
@import url("https://fonts.googleapis.com/css?family=Abel|Bitter|Teko");

@import "node_modules/bootstrap/scss/bootstrap";
$font-family-sans-serif: "Abel", "Helvetica", "Tahoma", "-apple-system",
  sans-serif;
$font-family-serif: "Bitter", "Times New Roman", serif;
$font-family-title: "Teko", "Helvetica", "Tahoma", sans-serif;
$sans: $font-family-sans-serif;
$serif: $font-family-serif;
body,
html {
  background-color: #ccc;
  font-family: $font-family-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: $font-family-sans-serif;
  font-weight: bolder;
}
.sans {
  font-family: $font-family-sans-serif;
}
.brand {
  font-family: $font-family-title;
  color: theme-color("brand") !important;
  font-size: 1.5rem;
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
.btn,
.badge {
  font-family: $font-family-sans-serif;
}

.version {
  font-family: $font-family-serif;
  background-color: lighten(theme-color("secondary"), 10%);
  color: theme-color("black");
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 0.25rem;
  margin: 0;

  small {
    font-variant: normal;
    font-weight: bold;
  }
}
.move {
  transition: transform 1s;
}
legend {
  font-weight: 600;
}

html {
  background-color: $body-bg;
}
</style>
