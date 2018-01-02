<template>
  <div class="row align-items-center">
    <div class="col-1 text-right" @click="prev">
      <a :href="page <= 1 ? false : '#'">
        <icon name="angle-double-left" aria-hidden></icon>
        <span class="sr-only">previous page</span>
      </a>
    </div>
    <div class="col-10">
      <div class="row justify-content-center">
        <div v-for="p in pages" class="col-1 page-wrap">
          <a
            v-on:click="changePage(p)"
            :href="p == page ? false : '#'"
            :class="{current: p == page, page: true}">
            {{p}}
          </a>
        </div>
      </div>
    </div>
    <div class="col-1" @click="next">
      <a href="#" :href="page >= pages ? false : '#'">
        <icon name="angle-double-right" aria-hidden></icon>
        <span class="sr-only">next page</span>
      </a>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome';
export default {
  name: 'PageControls',
  components: { Icon },
  props: { pages: Number, page: Number },
  methods: {
    changePage(p) {
      this.$emit('pageChange', p);
    },
    next() {
      this.$emit('next');
    },
    prev() {
      this.$emit('prev');
    }
  },
  computed: {}
};
</script>

<style lang="scss">
  .page-wrap {
    text-align: center;
    a {
      display: block;
      width: 100%;
      height: 100%;
      &:hover {
        background-color: #ccf;
      }
      &.current{
        background-color: #cfc;

      }
    }
  }
</style>
