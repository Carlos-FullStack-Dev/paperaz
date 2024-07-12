<template>
  <div class="tool">
    <img :scaleDiff="scaleDiff" :src="theInitial" alt="" v-if="theInitial" :style="style" />
    <!-- <div class="no-signature" v-else>
      <p>No Signature</p>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    value: String,
    tool: Object,
    setInitialSignType: Function,
    isCreator: Boolean,
    responsiveDim: Object,
    responsiveToolDim: Object
  },
  mounted() {
    console.log({ tool: this.tool })
    this.popUpIfNoSign() 
  },
  methods: {
    popUpIfNoSign(){
      !this.theInitial && !this.isCreator && this.setInitialSignType('initial')
    },
    setInitialImgDisplay() {
      !this.theInitial && this.setInitialSignType('initial')
    },
  },
  computed: {
    scaleDiff() {
      return ((this.scale || 1) * 30) - 30
    },
    theInitial(){
       return this.$store.getters?.getUserInitial 
    },
    style() {
      return {
        width: `${55 * this.responsiveToolDim.width}px`,
        objectFit: "contain"
      }
    },
  },
  watch: {
    scale: function () {
    }
  }
}

</script>

<style>

</style>
