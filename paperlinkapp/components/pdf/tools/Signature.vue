<template>
  <div class="tool">
    <img :scaleDiff="scaleDiff" :src="theSignature" alt="" v-if="theSignature" :style="style" />
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
      !this.theSignature && !this.isCreator && this.setInitialSignType('sign')
    },
    setInitialImgDisplay() {
      !this.theSignature && this.setInitialSignType('sign')
    },
  },
  computed: {
    scaleDiff() {
      return ((this.scale || 1) * 30) - 30
    },
    theSignature(){
       return this.$store.getters?.getUserSignature 
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
