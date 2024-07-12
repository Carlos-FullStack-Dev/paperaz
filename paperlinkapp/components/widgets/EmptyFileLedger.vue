<template>
  <div class="bg-white rounded-3xl px-1 sm:px-5 py-0 sm:py-10 grid place-items-center text-[#272727] position-relative">


    <!-- <img src="../../assets/img/dashboard-bg.png" class="position-absolute mt-24 md:left-[30%] md:w-auto sm:w-[200px]" /> -->
    <!-- <table key="3" ref="fileLedgerTable" class="file-ledger-table">
      <thead>
        <tr class="text-left">
          <th class="text-left fixed-col left">No</th>
          <th class="text-center">File Name</th>
          <th class="text-center">Action</th>
          <th class="text-center" v-if="isPaidUser">Action By</th>
          <th class="text-center">Date & Time</th>
          <th class="fixed-col right"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 10" :key="i">
          <td class="text-left fixed-col left">{{ i }}</td>
          <td class="text-center">

          </td>
          <td class="text-center">
          </td>
          <td class="text-center" v-if="isPaidUser">

          </td>
          <td class="text-center">
          </td>
          <td class="fixed-col right">

          </td>
        </tr>
      </tbody>
    </table> -->
    <span class="block w-full text-center py-4">
       No file found
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeIcon from '../svg-icons/TreeIcon.vue'
export default Vue.extend({
  components: { TreeIcon },
  props: {
    isPaidUser: Boolean
  },
  name: 'EmptyFileLedger',
})
</script>


<style lang="postcss" scoped>
.file-ledger-table {
  --background: white;
  @apply text-sm w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;

  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;

    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }

  & th {
    @apply pt-8 pb-3 sm:text-[12px] md:text-base;
    background: var(--background);
  }

  & td {
    @apply py-3 sm:text-[12px] md:text-base;
  }

  & td,
  & th {
    @apply px-2 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);

    &:first-child {
      @apply pl-5;
    }

    &:last-child {
      @apply pr-5;
    }

    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);

      &.left {
        left: -0.1px;

      }

      &.right {
        right: -0.1px;

      }
    }
  }
}

/* .search-input {
  & ~ .search-dropdown {
    @apply opacity-0 translate-y-[5%] pointer-events-none;
  }

  &:active,
  &:focus {
    & ~ .search-dropdown {
      @apply opacity-100 translate-y-0 pointer-events-auto;
    }
  }
} */
</style>
