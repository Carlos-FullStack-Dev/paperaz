<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="fontSize * hwRatio"
    :width="fontSize / hwRatio"
    viewBox="0 0 25 24"
  >
  <path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M8.9834 6C8.9834 4.20507 10.4385 2.75 12.2334 2.75C14.0283 2.75 15.4834 4.20507 15.4834 6C15.4834 7.79493 14.0283 9.25 12.2334 9.25C10.4385 9.25 8.9834 7.79493 8.9834 6ZM12.2334 1.25C9.61005 1.25 7.4834 3.37665 7.4834 6C7.4834 8.62335 9.61005 10.75 12.2334 10.75C14.8568 10.75 16.9834 8.62335 16.9834 6C16.9834 3.37665 14.8568 1.25 12.2334 1.25ZM9.0334 13.25C5.96822 13.25 3.4834 15.7348 3.4834 18.8C3.4834 20.9815 5.25187 22.75 7.4334 22.75H17.0334C19.2149 22.75 20.9834 20.9815 20.9834 18.8C20.9834 15.7348 18.4986 13.25 15.4334 13.25H9.0334ZM15.4334 14.75C17.6702 14.75 19.4834 16.5632 19.4834 18.8C19.4834 20.1531 18.3865 21.25 17.0334 21.25H7.4334C6.0803 21.25 4.9834 20.1531 4.9834 18.8C4.9834 16.5632 6.79665 14.75 9.0334 14.75H15.4334Z" fill="currentColor"/>
  </svg>
</template>

<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'UserProfileSolidIcon',
  data() {
    return {
      hwRatio: 1,
    }
  },
})
</script>
