<template>
  <div class="widget my-3 text-center rg-footer">
    <b-row v-once>
      <b-col>
        <b-btn variant="link" href="https://github.com/moui72/vue-rankgames">
          <icon name="github" label="GitHub repo for this app." color="black"></icon><br/>GitHub
        </b-btn>
      </b-col>
      <b-col>
        <b-btn variant="link" href="https://ty-pe.com">
          <icon name="user" label="App author's website." color="black"></icon><br/>Tyler Peckenpaugh (Author)
        </b-btn>
      </b-col>
      <b-col>
        <b-btn variant="link" href="https://ty-pe.com">
          <icon name="code" label="Link to Vue.js." color="black"></icon><br/>Built with Vue.js
        </b-btn>
      </b-col>
      <b-col>
        <b-btn variant="link" href="https://opensource.org/licenses/MIT">
          <icon name="gavel" label="Link to license"></icon><br/>MIT License
        </b-btn>
      </b-col>
    </b-row>
    <div class="mt-3 small">
      Copyright &copy; Tyler Peckenpaugh 2017-2018
    </div>
  </div>
</template>
<script>
import Icon from 'vue-awesome';

export default {
  name: 'RgFooter',
  components: { Icon },
  data() {
    return {};
  }
};
</script>
<style lang="scss">
.rg-footer {
  .btn {
    font-size: 0.7rem;
    .fa-icon {
      color: #036;
    }
  }
  .small {
    font-size: 0.6rem;
  }
}
</style>
