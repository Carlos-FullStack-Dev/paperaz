<template>
  <div class="tool">
    <svg ref="crossbox" :style="style" viewBox="0 0 19 19" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAR1JREFUSEu119ERwjAIBmA6mW6iTma7iaN5eEHRC/BDsC/2jPIdaULJRp/rSkQnIrqp7zpvdyJ6EBF/0jYiM3of9zzQjXPMy4jPsXeGNSoZduIalfg3hmcD/IMO3Ip9yFT/AzdRnmWBJUN5DnpRVTJ3Ub249LNdxUN0Bq9mDqEWXMVh1IOzeAqNYBRPowgc4bwrZovxGIXJLLl6O3l12cpq9p8QRTOOtprGITQLe9POYzDaDacqHPqMo2zTbzUUziwuKHME9vYpZ1qq7RGMFIfSK9WDETTaaua0W3AGLeEzuIKm8V94BU3hSOuTqkhDDxdc1OxVUChzr71dQUPcaug7UA9/NfR86dNEJzrD30cYGWT8HHUOXrcQjH0d2p4VnGYebW62SwAAAABJRU5ErkJggg==" options="fill"
        d="M19 17.0864L17.0864 19L9.5 11.4136L1.91357 19L0 17.0864L7.58643 9.5L0 1.91357L1.91357 0L9.5 7.58643L17.0864 0L19 1.91357L11.4136 9.5L19 17.0864Z"
        fill="black" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    scale: Number,
    elemScale: Number,
    generatePDF: Boolean,
    tool: Object,
    responsiveToolDim: Object,
  },
  computed: {
    style() {
      return {
        // width: `${(this.scale || 1) * 11}px`,
        // height: `${(this.scale || 1) * 11}px`,
        width: `${(this.elemScale || 1) * 15 * this.responsiveToolDim.width}px`,
        height: `${(this.elemScale || 1) * 15 * this.responsiveToolDim.height}px`,
      }
    },
  },
  watch: {
    // generatePDF: function () {
    //   if (this.generatePDF)
    //     this.svgToImage()
    // },
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  methods: {
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.crossbox)
        .then(function (dataUrl) {
          dataPAz = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });

      this.svgToImageData = dataPAz
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
