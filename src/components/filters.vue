<template>
  <div v-show="getActiveFilters.length" class="filters">
    <span>filtering:</span>
    <template v-for="filter in getActiveFilters">

      <b-btn
        @click="clearPCF"
        size="sm"
        variant="danger"
        v-if="filter.substr(0,3) == 'pcf'">
        <icon name="close"></icon>
        <span class="sr-only">Remove filter:</span>
        {{getFilter('pcf').text}}
        {{pcfArgs(filter)}}
      </b-btn>
      <b-btn v-else-if="filter.substr(0,2) == 'ur'"></b-btn>
      <b-btn
        v-else
        @click="setFilter(filter)"
        :title="'remove \'' + getFilter(filter).text + '\' filter'"
        size="sm" variant="danger"
        class="filter">
        <span class="align-top">
          <icon name="close" class="my-auto"></icon>
          <span class="sr-only">Remove filter:</span>
          {{getFilter(filter).text}}
        </span>
      </b-btn>
    </template>
  </div>
</template>

<script>
import Icon from 'vue-awesome';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Filters',
  components: { Icon },
  computed: {
    ...mapGetters(['getActiveFilters', 'getFilter'])
  },
  methods: {
    ...mapMutations(['setFilter', 'clearPCF']),
    pcfArgs(f) {
      let arr = f.split('-');
      if (arr[0] == 'pcf') {
        return '(' + arr[1] + (arr.length > 2 ? '-' + arr[2] : '') + ')';
      } else {
        return null;
      }
    }
  }
};
</script>
<style lang="scss">
.filters{
  text-align:right;
  font-size: .65rem;

  .btn-sm{
    font-size: .65rem;
  }
  .fa-icon {
    height: .65rem;
  }

  .filter{
    margin-left: 1rem;
  }
}

</style>
