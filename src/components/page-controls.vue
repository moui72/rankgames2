<template>
  <div class="row align-items-center no-gutters">
    <div class="col page-wrap pgr"
      @click="prev"
      @keyup.left="prev"
      @keyup.right="next">
      <a :href="page <= 1 ? false : '#'">
        <icon name="angle-double-left" aria-hidden></icon>
        <span class="sr-only">previous page</span>
      </a>
    </div>
    <div class="col-10">
      <div class="row no-gutters justify-content-center">
        <div v-for="p in pages"
          class="col-2 col-sm-1 page-wrap px-xs-0 px-1 px-md-2 px-lg-3">
          <a
            @click="changePage(p)"
            @keyup.left="prev" @keyup.right="next"
            href="#"
            :class="{current: p == page, page: true}">
            {{p}}
          </a>
        </div>
      </div>
    </div>
    <div class="col h-100 page-wrap pgr"
      @click="next"
      @keyup.left="prev"
      @keyup.right="next">
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
  }
};
</script>

<style lang="scss">
  .page-wrap {
    font-size: .875rem;
    text-align: center;

    a {
      text-align: center;
      display: block;
      width: 100%;
      height: 100%;
      padding: .5rem 0;
      border-radius: 1rem;
      &:hover {
        background-color: #ccf;
      }
      &.current{
        background-color: #339;
        color: #fff;
        &:hover {
          color: #fff;
        }

      }
    }
    .pgr {
      display: block;
    }
  }
</style>
