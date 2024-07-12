<template>
  <div
    class="text-field tool"
  >
  <!-- v-if="(isActive || justMounted) && !isCreator && isBlur" -->
    <p
      type="text"
      contenteditable="true"
      :style="style"
      :textImageContent="svgToImageData"
      :initialFontSize="initialFontSize"
      :scalefactor="responsiveToolDim.width"
      class="annotationText input-annotation whitespace-nowrap flex items-center"
      placeholder="Type here..."
      ref="text_box"
      @input="getValue"
      @click="scaleOutProps"
      @focus="isFocus = true"
      @blur="isFocus = false"
    ></p>
    <canvas ></canvas>

    <!-- <p v-else ref="textbox" @click="isBlur = !isBlur" :style="style" class="whitespace-nowrap">{{ text || 'Type here...' }}</p> -->
    <!-- <span :style="hideStyle" ref="text_hidden">{{ text || 'Type here...' }}</span> -->
  </div>
</template>

<script>
import TeamAccess from '~/models/TeamAccess'

export default {
  props: {
    isActive: Boolean,
    fontSize: Number,
    file: Object,
    justMounted: Boolean,
    tool: Object,
    generatePDF: Boolean,
    responsiveToolDim: Object,
    togglepdfViewScale: Function
  },
  data: () => ({
    text: null,
    inputWidth: 0,
    svgToImageData: '',
    isBlur: false,
    isFocus: false,
    adjustedInputWidth: undefined
  }),
  created () {
    this.text 
  },
  mounted(){
    this.$refs.text_box && this.$refs.text_box.focus()
  },
  methods: {
    scaleOutProps(){
      // this.$notify.error({
      //   title: '',
      //   message: 'Zoom is not supported for Text field'
      // })
      // this.$store.commit("SET_ACTIVE_TOOL_VALUE", this.tool.value)
      // this.togglepdfViewScale()
    },
    touchStart(event){
      event.preventDefault();
    },
    async getValue(event){
      this.text = event.target.textContent ?? ""
        this.$store.commit("SET_ACTIVE_TOOL_VALUE", this.text)
    },
    keyUp(e){
      var keyCode = event.which || event.keyCode;
      keyCode === 13 && event.preventDefault();
    },
    changeWidth(){
      this.adjustedInputWidth = this.$refs?.text_box.scrollWidth
    },
    setBlur(){
      this.$emit('onBlur')
      this.isBlur = !this.isBlur
    },
    onBlur: () => {
      console.log("onBlur")
    },
    async svgToImage() {
      this.svgToImageData = '';
      let dataPAz = ''
      await htmlToImage.toPng(this.$refs.text_box)
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
    // generatePDF: function () {
    //   // if (this.generatePDF)
    //     // this.svgToImage()
    // },

    text (v) {
      this.$emit('input', v)
    },
    "tool.value": function(val) {
       !this.isFocus && (this.$refs.text_box.innerHTML = val)
    },
    fontSize() {
      if (this.$refs.text_box && this.$refs.text_hidden) {
        const extra = this.fontSize || 11
        const inputWidth = this.$refs.text_hidden.clientWidth + extra
        this.$refs.text_box.style.width = `${inputWidth}px`
        this.inputWidth = inputWidth
      }
    }
  },
  computed: {
    initialFontSize(){
        return (this.fontSize || 12)*(this.tool?.pageScaleX || 1) 
    },
    computedFontsize(){
        return `${(this.fontSize || 12)*(this.tool?.pageScaleX || 1) * this.responsiveToolDim.width}px`
    },
    isCreator () {
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      )
    },
    style () {
      return {
        // fontSize: `${this.fontSize || 11}px`,
        fontSize: this.computedFontsize,
        background: 'transparent',
        fontWeight: 400,
        width: this.adjustedInputWidth ? this.adjustedInputWidth : 'auto',
        fontFamily: "helvetica !important",
        lineHeight: this.computedFontsize
        // width: `${this.inputWidth}px`
      }
    },
    hideStyle () {
      return {
        fontSize: `${this.fontSize || 11}px`,
        visibility: 'hidden',
        position: 'absolute',
        background: 'transparent'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.input-annotation:focus {
  border:none;
  border-left: 1px solid #5FA348;
  border-bottom: 1px solid transparent;
  background: transparent;
}
 .input-annotation{
  outline: none;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
 }
.input-annotation:blur {
  border: transparent;
}
.input-annotation[placeholder]:empty:before {
  content: 'Type here...';
  opacity: 0.5;
  color: #555;
}
</style>
