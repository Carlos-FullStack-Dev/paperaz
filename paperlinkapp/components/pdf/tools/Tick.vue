<template>
  <div class="text-field tool">
    <svg ref="tickbox" :style="style" viewBox="0 0 22 21" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path svgToImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAa1JREFUSEvFl+ExBEEQhb+LABnIgAwQASJwMiACREAGTgZE4C4CRIAIkIF6WzNXXX2zu71qZ3XV/Tim502/fv1mbsY/xWwi3G3gGHgDXoU5BbBAn4H9VOQ5sJgC+DFVm8l9AOa1gS+AW9fOI2BZE1jUvjjQG+C6Zo/VV4HuGuAVcJi/16rY9/UnHeK7JvAcuC/11f5t7IrVV42OqM6x7mtNYJnDXltfawFLrVdmc/VVDHyU3HEsqqVWUWzjFJDIijEWsKf4CTjpugfGAPYUfyaK16PTRbUG/Sz1Q14aDeW9941OG7CS5TJ5BBaAbpBIaK0OnKOX4rxQVJeEsQQkji66fF6nin0Vucf+5FonwegmaQPX4Q7MhkWjiKi6BC5QgTevBhO+txte3Ncnr+qSz5bA/SEHVatDlcapD1wi/HIV7fToYYOAtjkW+B2wZTJy5bJBe/s0T5k+atvEVcoTgATkweW9+eGmvE5rjIgrCm7XSVT2CgwXHrHMUuWDDWMI1XZtyWT0/8ukhXCl1rmiSaEnTXSzCNV2L6t2/RyxIotiNuuGAitHrqWPFP/n+AUe81UfyAqaIQAAAABJRU5ErkJggg==" options="fill"
        d="M8.7883 20.5956C9.4535 21.2689 10.9351 21.0457 11.0946 19.987C12.0871 13.4143 17.0534 7.8694 20.8116 2.64442C21.8536 1.19652 19.4576 -0.178944 18.4291 1.25172C14.9947 6.02588 10.6661 11.0495 8.97269 16.8427C7.03751 14.865 5.09452 12.9061 2.92406 11.1682C1.5495 10.0672 -0.416737 12.0069 0.972637 13.1195C3.80049 15.3846 6.2443 18.0259 8.7883 20.5956Z"
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
    responsiveToolDim: Object
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  watch: {
    // generatePDF: function () {
    //   if (this.generatePDF)
    //     this.svgToImage()
    // },
  },
  computed: {
    style() {
      return {
        // width: `${(this.scale || 1) * 11}px`,
        // height: `${(this.scale || 1) * 11}px`,
        width: `${(this.elemScale  || 1) * 15 * this.responsiveToolDim.width}px`,
        height: `${(this.elemScale  || 1) * 15 * this.responsiveToolDim.height}px`,
      }
    },
  },
  methods: {
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.tickbox)
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
input {
  border: 0.5px solid #e9e9e9;
  background-color: transparent;
  border-radius: 4px;
}
</style>
