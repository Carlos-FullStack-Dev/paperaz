<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 22 21" fill="none">
    <path d="M8.7883 20.5956C9.4535 21.2689 10.9351 21.0457 11.0946 19.987C12.0871 13.4143 17.0534 7.8694 20.8116 2.64442C21.8536 1.19652 19.4576 -0.178944 18.4291 1.25172C14.9947 6.02588 10.6661 11.0495 8.97269 16.8427C7.03751 14.865 5.09452 12.9061 2.92406 11.1682C1.5495 10.0672 -0.416737 12.0069 0.972637 13.1195C3.80049 15.3846 6.2443 18.0259 8.7883 20.5956Z" fill="currentColor"/>
    </svg>

</template>
<script>
import mixins from 'vue-typed-mixins'
import IconSizeMixin from '~/mixins/IconSizeMixin'
export default mixins(IconSizeMixin).extend({
  name: 'PdfTickIcon',
  data() {
    return {
      hwRatio: 35 / 36,
    }
  },
})
</script>
