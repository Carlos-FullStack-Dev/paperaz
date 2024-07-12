<template>
  <div class="tool">
    <p ref="datebox"
    :initialFontSize="initialFontSize"
    :scalefactor="responsiveToolDim.width"
    class="whitespace-nowrap" :textImageContent="svgToImageData" :style="style">{{ displayTime }}</p>
  </div>
</template>

<script>
import dateFormat from "dateformat";
import moment from "moment"

export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    value: String,
    generatePDF: Boolean,
    tool: Object,
    responsiveToolDim: Object,
    userTime: String
  },
  data() {
    return {
      svgToImageData: ''
    }
  },
  computed: {
    dateFormat(){
      return this.$auth?.user?.timezone || 'MM/DD/YYYY'
    },
    displayTime(){
      const timeFormat = this.$store?.getters?.getDateFormat.toUpperCase() || this.dateFormat
      return moment(this.userTime).format(timeFormat) ?? moment.format(timeFormat)
    },
    initialFontSize(){
       return (this.fontSize || 12)*(this.tool?.pageScaleX || 1) 
    },
    computedFontSize(){
     return `${(this.fontSize || 12)*(this.tool?.pageScaleX || 1) * this.responsiveToolDim.width}px`
    },
    style() {
      return {
        // fontSize: `${this.fontSize || 11}px`,
        fontSize: this.computedFontSize,
        lineHeight: this.computedFontSize,
        fontWeight: 400,
        fontFamily: "helvetica !important",
      }
    },
  },
  methods: {
    formatDate(val){
      return dateFormat(val,  this.$store?.getters?.getDateFormat )
    },
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.datebox)
        .then(function (dataUrl) {
          dataPAz = dataUrl;
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });

      this.svgToImageData = dataPAz
    },
  },
  watch: {
    generatePDF: function () {
      // if (this.generatePDF)
        // this.svgToImage()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
