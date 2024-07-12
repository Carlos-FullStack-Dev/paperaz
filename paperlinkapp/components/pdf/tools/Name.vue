<template>
  <div class="tool">
    <p :style="style">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    tool: Object,
  },
  // data: () => ({
  //   text: `${this.$auth.user.firstName} ${this.$auth.user.lastName}`,
  // }),
  computed: {
    text() {
      return `${this.$auth?.user?.firstName || 'No name'} ${this.$auth?.user?.lastName || ""}`
    },
    style() {
      return {
        // fontSize: `${this.fontSize || 11}px`,
        fontSize: `${(this.fontSize || 11)*(this.tool?.pageScaleX || 1)}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
