<template>
  <div>
    <library/>
    <rg-footer/>
  </div>
</template>
<script>
import Library from "../components/library.vue";
import RgFooter from "../components/footer.vue";

export default {
  name: "LibraryPage",
  components: {
    RgFooter,
    Library
  },
  props: { id: { type: Number, required: true } }
};
</script>
<style lang="scss"></style>
