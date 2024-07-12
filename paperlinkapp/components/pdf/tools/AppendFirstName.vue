<template>
  <div class="text-field tool" attr="star">
    <p
      v-if="confirmStar && hasClicked && hasTextvalue"
      :style="style"
      :textImageContent="svgToImageData"
      :initialFontSize="initialFontSize"
      ref="name_box"
      placeholder="Type here..."
      class="annotationText text-container whitespace-nowrap flex items-center fade_in"
    >
      {{ this.$store.getters.getAddToPageFirstName }}
    </p>
    <span
      v-if="!confirmStar && !isCreator"
      class="annot-button font-semibold arrow_down absolute top-0 py-[2px] whitespace-nowrap"
      @click="confirmStarAction"
      :style="stickerStyle"
    >
      First Name
    </span>
    <img
      v-if="!confirmStar && isCreator"
      :width="`${18 * responsiveToolDim.width}px`"
      src="../../../assets/img/first_name_tool.svg"
    />
    <!-- <span v-show="!confirmStar" class="toolTip hidden">Name</span> -->
    <!-- <div v-if="!isCreator && isModalActive && !confirmStar"
            class="w-[240px] h-[26px] z-10 bg-white rounded-[12px] text-[12px] absolute border-[2px] border-[#84C870] px-2 ml-[-16px] mt-[-50px]">
            Click on star when this line is completed.</div> -->
  </div>
</template>

<script>
import moment from 'moment'
import FileAction from '~/models/FileAction'
import AddToPageText from '~/components/modals/AddToPageText.vue'

export default {
  data() {
    return {
      isModalActive: false,
      confirmStar: false,
      inputText: '',
      focus: true,
      svgToImageData: '',
      showAddPageText: false,
      importedValue: '',
      hasClicked: false,
      hasAddedOffset: false,
      isMobile: false,
    }
  },
  props: {
    scale: Number,
    file: { type: Object, required: true },
    generatePDF: Boolean,
    tool: Object,
    isCreator: Boolean,
    responsiveDim: Object,
    responsiveToolDim: Object,
    addOffset: Function,
    isComplete: Boolean
  },
  components: {
    AddToPageText,
  },
  watch: {
    hasClicked(val) {
      if (val && this.hasTextvalue) {
        setTimeout(() => {
          !this.isComplete && this.$BUS.$emit('scroll-to-tools')
        }, 100)
      }
    },
    hasTextvalue() {
      setTimeout(() => {
        !this.isComplete && this.$BUS.$emit('scroll-to-tools')
      }, 100)
    },
    generatePDF: function () {
      // if (this.generatePDF) this.svgToImage()
    },
  },
  mounted() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      this.isMobile = true;
    }else{
      this.isMobile = false;
    }
    this.confirmStar && this.$refs.name_box.focus()
  },
  computed: {
    hasTextvalue() {
      return this.$store.getters.getAddToPageFirstName != undefined
    },
    isSign() {
      return String(this.file?.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isAgreedSign() {
      return this.$store.state?.agreeSign
    },
    nowDate() {
      return moment().format('YYYY-MM-DD')
    },
    initialFontSize() {
      return (this.fontSize || 11) * (this.tool?.pageScaleX || 1)
    },
    stickerStyle() {
      return {
        background: 'rgb(249,254,0)',
        color: 'rgb(251,82,17)',
        lineHeight: `${
          (this.fontSize || 11) *
          (this.tool?.pageScaleX || 1) *
          this.responsiveToolDim.width
        }px`,
        fontSize: `${(this.fontSize || 11) * this.responsiveToolDim.width}px`,
        paddingLeft: `${7 * this.responsiveToolDim.width}px`,
        paddingRight: `${7 * this.responsiveToolDim.width}px`,
      }
    },
    style() {
      return {
        // fontSize: `${this.fontSize || 11}px`,
        top: this.isMobile ? '5px' : '10px',
        position: 'relative',
        fontWeight: 400,
        fontFamily: 'helvetica !important',
        lineHeight: `${
          (this.fontSize || 11) *
          (this.tool?.pageScaleX || 1) *
          this.responsiveToolDim.width
        }px`,
        fontSize: `${
          (this.fontSize || 11) *
          (this.tool?.pageScaleX || 1) *
          this.responsiveToolDim.width
        }px`,
      }
    },
    notBtn() {
      return this.notClass
    },
  },
  methods: {
    // async svgToImage() {
    //   this.svgToImageData = ''
    //   let dataPAz = ''
    //   await htmlToImage
    //     .toPng(this.$refs.namebox)
    //     .then(function (dataUrl) {
    //       dataPAz = dataUrl
    //     })
    //     .catch(function (error) {
    //       console.error('oops, something went wrong!', error)
    //     })

    //   this.svgToImageData = dataPAz
    // },
    overHandler: function () {
      this.isModalActive = true
    },
    leaveHandler: function () {
      this.isModalActive = false
    },
    confirmStarAction() {
      if (
        (!this.$auth.loggedIn && !this.$store.getters.getFillAsGuest) ||
        (this.isAgreedSign !== 1 && this.isSign)
      )
        return
      !this.hasTextvalue && this.$BUS.$emit('addTextToPage', 'first_name')
      this.hasClicked = true
      // !this.confirmStar &&
      //   this.hasClicked &&
      //   !this.isCreator &&
      //   this.addOffset(7)
      !this.isCreator && (this.confirmStar = true)
      this.notClass = ''
    },
  },
}
</script>

<style lang="scss" scoped>
input {
  border: 0.5px solid #e9e9e9;
  background-color: transparent;
  border-radius: 4px;
}
.text-container {
  @apply outline-none border-none border-l-[1px] border-paperdazgreen-300/50 whitespace-nowrap;
}
.text-container[placeholder]:empty:before {
  content: 'Type here...';
  opacity: 0.5;
  color: #555;
}
.arrow_down::before {
  content: '';
  top: 100%;
  @apply md:border-[7px] border-[4px];
  border-top-color: rgb(249, 254, 0);
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  position: absolute;
  display: inline-block;
}
</style>
