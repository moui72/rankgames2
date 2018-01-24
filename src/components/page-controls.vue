<template>
  <div class="row align-items-center no-gutters">
    <div class="col page-wrap pgr"
      @click="prev"
      @keyup.left="prev"
      @keyup.right="next">
      <a :href="page <= 1 ? false : '#' + id" :class="{active: page > 1}">
        <icon name="angle-double-left" aria-hidden></icon>
        <span class="sr-only">previous page</span>
      </a>
    </div>
    <div class="col-10 px-3">
      <b-row class="text-center">
        <b-col v-for="p in pages" class="my-1 page-wrap" :key="p">
          <a
            @click="changePage(p)"
            @keyup.left="prev" @keyup.right="next"
            :href="'#' + id"
            :class="{current: p == page, page: true}">
            {{p}}
          </a>
        </b-col>
      </b-row>
    </div>
    <div
      class="col h-100 page-wrap pgr"
      @click="next"
      @keyup.left="prev"
      @keyup.right="next">
      <a :href="page >= pages ? false : '#' + id" :class="{active: page < pages}">
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
  props: { pages: Number, page: Number, id: String },
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
        padding: .5rem 0;
        border-radius: 1rem;
        text-decoration: underline;

        &.current{
          text-decoration: none;
          color: #000;
          &:hover {
            cursor: default;
            color: #000;
          }

        }

    }
    &.pgr {
      display: block;
      a {
        &.active {
          &:hover{
            background-color: rgba(50,150,255,.2);
            border: 1px solid rgba(50,150,255,.5);
          }
        }

      }
    }
  }
</style>
