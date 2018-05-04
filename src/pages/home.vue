<template>
  <div>
    <transition
      :duration="{in: 300, out:150}"
      name="page-change"
      appear
      mode="out-in"
      enter-active-class="animated slideInLeft"
      leave-active-class="animated slideOutLeft"
    >
      <intro v-if="!wasIntroduced"/>
      <re v-else/>
    </transition>
    
    <rg-footer/>
  </div>
</template>

<script>
import Intro from "../components/intro.vue";
import Re from "../components/re.vue";
import Library from "../components/library.vue";
import RgFooter from "../components/footer.vue";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Library,
    RgFooter,
    Intro,
    Re
  },
  computed: {
    ...mapGetters(["wasIntroduced"])
  }
};
</script>

<style lang="scss">

</style>
