<template>
  <div
    v-if="showModal"
    @click="$emit('count')"
    ref="wrapper"
    class="fixed z-[99999] bg-black/30 backdrop-blur-sm top-0 left-0 w-[100vw] h-[100vh] pt-8"
  >
    <slot />
  </div>
</template>

<script>
import mixins from "vue-typed-mixins";
import GlobalMixin from "~/mixins/GlobalMixin";

export default mixins(GlobalMixin).extend({
  props: ["showModal"],
  methods: {
    removePopUp(event) {
      event.target == this.$refs.wrapper &&
        this.toggleToast({
          active: false,
          msg: ``,
        });
    },
  },
});
</script>

<style lang="scss" scoped></style>
