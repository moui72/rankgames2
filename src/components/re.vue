<template>
  <div class="widget mt-3">
    <h1>Welcome back</h1>
    <p>Use the shortcuts below for your conveneience</p>
    <b-btn 
      variant="primary" 
      to="/lib"
    >
      Library</b-btn>
    <b-btn 
      variant="info" 
      to="/lists"
    >
      Lists</b-btn>
    <b-btn 
      v-if="getLists.length > 0"
      :to="'/list/' + mostRecentList.id" 
      variant="success"
    >
      Most recent list ({{ mostRecentList.name }})
    </b-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Re",
  computed: {
    ...mapGetters(["getLists"]),
    mostRecentList() {
      console.log(this.getLists);
      return this.getLists.slice().sort((a, b) => {
        return b.modified - a.modified;
      })[0];
    }
  }
};
</script>
<style lang="scss">

</style>