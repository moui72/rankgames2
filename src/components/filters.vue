<template>
  <div class="filters">
    <div  v-show="getActiveFilters.length" >
      <h4>active filters</h4>
      <template v-for="filter in getActiveFilters">
        <b-btn
          v-if="filter.substr(0,3) == 'pcf'"
          @click="clearPCF"
          size="sm"
          variant="danger"
          >
          &times;
          <span class="sr-only">Remove filter:</span>
          {{getFilter('pcf').text}}
          {{pcfArgs(filter)}}
        </b-btn>
        <b-btn v-else-if="filter.substr(0,2) == 'ur'"></b-btn>
        <b-btn
          v-else
          @click="setFilter(filter)"
          :title="'remove \'' + getFilter(filter).text + '\' filter'"
          size="sm" variant="danger">
          <span class="align-top">
            &times;
            <span class="sr-only">Remove filter:</span>
            {{getFilter(filter).text}}
          </span>
        </b-btn>
      </template>
    </div>
    <div v-show="!getActiveFilters.length">
      <h4>no active filters</h4>

    </div>
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
h4 {
  font-size: 1rem;
  color: rgba(0,0,0,.6)
}
.filters{
  text-align:right;
  font-size: .65rem;

  .btn-sm{
    font-size: .65rem;
  }
  .fa-icon {
    height: .65rem;
  }

  .btn{
    margin-left: .5rem;
    margin-bottom: .5rem;
  }
}

</style>
