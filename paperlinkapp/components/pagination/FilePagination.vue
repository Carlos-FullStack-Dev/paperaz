<template>
  <!-- Start:: Pagination -->

  <div class="py-5" v-if="totalFile > eachPageTotal">
    <div>
      <paginate
        :page-count="arrayPages.length"
        :click-handler="buttonFilePage"
        :prev-text="''"
        :next-text="''"
        :container-class="'paginate'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
  </div>

  <!-- End:: Pagination -->
</template>

<script>
import AuthUser from "~/models/AuthUser";
import ArrowDownIcon from "../svg-icons/ArrowDownIcon.vue";

export default {
  name: "filePagination",
  props: {
    setPage: {
      type: Function,
    },
    totalFile: {},
  },
  data() {
    return {
      returnedDataPage: 0,
      eachPageTotal: 10,
    };
  },

  components: { ArrowDownIcon },
  methods: {
    buttonFilePage(val) {
      this.returnedDataPage = this.eachPageTotal * (val - 1);
      this.$emit("setPage", this.returnedDataPage);
    },
  },
  watch: {
    returnedDataPage: () => {},
  },
  computed: {
    availablePages() {
      return Math.ceil(this.totalFile / this.eachPageTotal);
    },
    arrayPages() {
      let initialArray = [];
      for (let i = 1; i <= this.availablePages; i++) {
        initialArray.push(i);
      }
      return initialArray;
    },
  },
};
</script>

<style scoped>
.page-item {
  background: red !important;
}
.pagination-arrow-left {
  @apply text-xs h-9 min-w-[36px] rounded px-3 font-medium;
  transform: rotateZ(90deg);
}
.pagination-arrow-right {
  @apply text-xs h-9 min-w-[36px] rounded px-3 font-medium;
  transform: rotateZ(-90deg);
}
</style>
