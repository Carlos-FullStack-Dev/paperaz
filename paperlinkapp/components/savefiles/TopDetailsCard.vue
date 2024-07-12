<template>
  <div class="details-card" :class="{ active: isActive }">
    <span class="icon-container">
      <slot name="icon">
        <note-and-pen-icon />
      </slot>
    </span>
    <div
      class="text-content inline-flex flex-col justify-between items-center sm:items-end mt-2"
    >
      <span class="font-bold text-xl sm:text-2xl">
        <slot name="count">800</slot>
      </span>
      <span class="font-medium text-paperdazgray-400 text-xxs sm:text-xs capitalize"
        ><slot name="name">Ledger</slot></span
      >
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import NoteAndPenIcon from '../svg-icons/NoteAndPenIcon.vue'
export default Vue.extend({
  components: { NoteAndPenIcon },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="postcss" scoped>
.details-card {
  @apply cursor-pointer bg-white rounded-lg sm:rounded-2xl flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-center p-2 sm:px-4 sm:py-3.5;
  border: 0.97221px solid rgba(119, 181, 80, 0.15);
  transition: all 0.3s ease-in-out;
  &.active,
  &:hover {
    
    @apply bg-paperdazgreen-300;
    & * {
      @apply text-white;
    }
  }
}

.icon-container {
  @apply h-8
        w-8
        sm:h-12
        sm:w-12
        p-1.5
        sm:p-0
        rounded
        sm:rounded-md
        bg-paperdazgreen-50 bg-opacity-50
        inline-flex
        items-center
        justify-center
        text-paperdazgreen-500;
}
</style>
