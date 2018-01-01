<template>
  <div class="row align-items-center">
    <div class="col-1 text-right" @click="prev">
      <icon name="angle-double-left" aria-hidden></icon>
      <span class="sr-only">previous page</span>
    </div>
    <div class="col-10">
      <div class="row justify-content-center">
        <div v-for="p in pages" class="col-1 page-wrap">
          <a class="page" v-on:click="changePage(p)" href="#">
            {{p}}
          </a>
        </div>
      </div>
    </div>
    <div class="col-1" @click="next">
      <icon name="angle-double-right" aria-hidden></icon>
      <span class="sr-only">next page</span>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome';
export default {
  name: 'PageControls',
  components: { Icon },
  props: { pages: Number },
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
  computed: {
    remainder() {
      return this.pages % 12;
    },
    offset() {
      return (12 - this.remainder) / 2;
    }
  }
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
    }
  }
</style>
