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
  name: "Home",
  components: {
    Library,
    RgFooter
  }
};
</script>

<style lang="scss">

</style>
