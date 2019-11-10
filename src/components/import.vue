<template>
  <b-modal
    id="import"
    ref="importer"
    :busy="loading"
    title="Importing games"
    ok-only
    ok-title="Close"
    ok-variant="warning"
  >
    <b-alert :show="message.length" 
:variant="alertType">{{ message }}</b-alert>
    <spinner v-show="loading" />
    <div v-show="!loading" 
@keyup.enter="fetch()">
      <div v-show="preImportGames.length < 1">
        <b-form-group
          label="Import from BGG"
          description="Enter the BGG username attached to the collection you want to import. If you import another collection subsequently, any new games in that collection will be added."
        >
          <b-input
            ref="focusMe"
            v-model="username"
            type="text"
            name="username"
            placeholder="BGG Username"
          />
        </b-form-group>
        <b-button variant="primary" 
@click="fetch()">
          <icon name="download" 
aria-hidden />Import
        </b-button>
      </div>

      <div v-if="preImportGames.length > 0" 
class="pre-import-games-list">
        <h3>Found {{ preImportGames.length }} unique games</h3>
        <p>
          You may either merge these games into your existing collection
          or replace the current set of games with this set.
        </p>
        <p>
          If you want to discard the just imported games and start over, click
          cancel.
        </p>
        <p>Games that would be added if merged: {{ newGames.length }}.</p>
        <p>Games that would be dropped if replaced: {{ droppedGames.length }}.</p>
        <b-button variant="info" 
@click="merge()">Merge</b-button>
        <b-button variant="danger" 
@click="replace()">Replace</b-button>
        <b-button variant="warning" 
@click="cancel()">Cancel</b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Icon from "vue-awesome";
import Spinner from "vue-simple-spinner";

export default {
  name: "Import",

  components: { Icon, Spinner },

  data() {
    return {
      username: "",
      message: "",
      alertType: "info",
      messageArchive: [],
      loading: false,
      attempts: 0,
      maxAttempts: 5,
      previewGames: []
    };
  },
  computed: {
    ...mapGetters(["games", "preImportGames", "newGames", "droppedGames"])
  },
  methods: {
    ...mapActions(["importGames", "getCollection"]),
    cancel() {
      this.importGames({ mode: "importCancel" });
    },
    merge() {
      this.importGames({ mode: "importMerge" });
      this.$refs.importer.hide();
    },
    replace() {
      this.importGames({ mode: "importReplace" });
      this.$refs.importer.hide();
    },
    fetch(retry = false) {
      let message = "";

      if (retry) this.attempts++;
      else {
        this.attempts = 1;
        message = "Request submitted.";
        this.report(message);
      }

      this.loading = true;
      this.getCollection(this.username).then(
        response => {
          this.alertType = "info";
          message = "Request completed";
          if (this.attempts > 1) {
            message += ` after ${this.attempts} attempts`;
          }
          message += ".";
          if (response.data.length > 0) {
            message += ` Received ${response.data.length} game${
              response.data.length > 1 ? "s" : ""
            } from server.`;
          }
          this.report(message);
          this.loading = false;
        },
        error => {
          message = error;
          this.alertType = "warning";
          if (error.includes("queued")) {
            if (this.attempts < this.maxAttempts) {
              message += " Retry #" + this.attempts + ".";
              let ref = this;
              this.report(message);
              setTimeout(function() {
                ref.fetch(true);
              }, 2000);
            } else {
              message = `Request still queued after ${this.attempts} attempts. Server likely under heavy load. Please try again later.`;
              this.report(message);
              this.alertType = "warning";
              this.loading = false;
              return false;
            }
          } else {
            this.alertType = "danger";
            this.report(message);
            this.loading = false;
          }
        }
      );
    },
    report(str) {
      this.messageArchive.push({ message: str, time: Date.now() });
      this.message = str;
    }
  }
};
</script>

<style lang="scss">
.pre-import-games-list {
  margin-top: 2rem;
}
</style>
