<template>
  <div
    v-if="$store.getters.getToast.active"
    @click="removePopUp"
    ref="wrapper"
    class="fixed z-[99999] bg-black/30 backdrop-blur-sm top-0 left-0 w-[100vw] h-[100vh] justify-center flex pt-8 items-start"
  >
    <div class="bg-white py-3 px-4 rounded" v-html="$store.getters.getToast.msg"></div>
  </div>
</template>

<script>
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'

export default mixins(GlobalMixin).extend({
  methods: {
    removePopUp(event) {
      event.target == this.$refs.wrapper &&
        this.toggleToast({
          active: false,
          msg: ``,
        })
    },
  },
})
</script>

<style lang="scss" scoped></style>
