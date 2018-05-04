<template>
  <div class="widget mt-3">
    <h1>Welcome!</h1>
    <p>Ready to make some ranked lists of games? Here's how to get started!</p>
    <p>
      First, you'll import your (or someone else's) collection from 
      <a href="http://boardgamegeek.com">BoardGameGeek</a>. Then, you'll filter 
      your collection down to just those games you think might make your list. 
    </p>
    <p>
      Once your collection is as lean as can be, you'll create a new list with 
      those games and start making comparisons. When you've made all the needed 
      choices, you'll have a ranked list of games!
    </p>
    <div class="text-center">

      <b-btn 
        variant="success" 
        class="text-center"
        size="lg"
        to="lib"
      >
        Let's get started!
      </b-btn>
    </div>
    <b-form-group
      description="If you want this message to be replaced by shortcuts, 
      uncheck this box. If you want to turn it back on you can do so in 
      settings."
    >
      <b-form-checkbox 
        :checked="!wasIntroduced"
        @change="setIntroduced"
      > 
        Show welcome message
      </b-form-checkbox>
    </b-form-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Intro",
  computed: {
    ...mapGetters(["wasIntroduced"])
  },
  methods: {
    ...mapActions(["setIntroduced"])
  }
};
</script>
<style lang="scss">

</style>