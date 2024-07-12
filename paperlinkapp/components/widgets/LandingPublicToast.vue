<template>
  <div
    v-if="$store.getters.getToast.active"
    @click="removePopUp"
    ref="wrapper"
    class="fixed z-[99999] md:bg-white/10 bg-black/10 backdrop-blur-sm top-0 left-0 w-[100vw] h-[100vh] justify-center flex pt-8 items-start"
  >
    <div
      class="py-3 bg-paperdazgreen-300 px-4 rounded text-white shadow-lg self-start md:block hidden"
      v-html="$store.getters.getToast.msg"
    ></div>
    <div
      v-html="$store.getters.getToast.msg_mobile"
      class="py-3 text-paperdazgreen-300 px-4 rounded bg-white shadow-lg self-center font-[600] text-3xl md:hidden block capitalize"
    ></div>
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
