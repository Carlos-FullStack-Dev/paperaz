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
      {{ this.$store.getters.getAddToPageLastName }}
    </p>
    <!-- <svg v-if="!confirmStar" :style="style" viewBox="0 0 37 36" fill="black" xmlns="http://www.w3.org/2000/svg" @mouseover="overHandler" @mouseleave="leaveHandler">
            <path options="fill"
              d="M36.9676 13.9046C36.8894 13.6713 36.6821 13.5012 36.4324 13.4658L24.4516 11.7717L19.0937 1.20887C18.9825 0.988492 18.752 0.849304 18.5003 0.849304C18.2487 0.849304 18.0175 0.988492 17.9069 1.20887L12.5484 11.7723L0.567584 13.4664C0.317902 13.5019 0.111268 13.6713 0.0324561 13.9052C-0.0450315 14.1379 0.0192104 14.3943 0.200015 14.5651L8.87002 22.7875L6.82289 34.3981C6.7805 34.6397 6.88249 34.8839 7.08582 35.0283C7.29046 35.1739 7.56134 35.1926 7.7832 35.0772L18.5003 29.5961L29.2161 35.0772C29.3128 35.1269 29.4195 35.1513 29.5248 35.1513C29.6619 35.1513 29.7983 35.1101 29.9142 35.0283C30.1182 34.8839 30.2202 34.6397 30.1771 34.3981L28.1307 22.7881L36.8007 14.5651C36.9808 14.393 37.0457 14.1372 36.9676 13.9046Z"
              fill="#FFCF27" />
          </svg> -->
    <span
      v-if="!confirmStar && !isCreator"
      class="annot-button font-semibold arrow_down absolute top-0 py-[2px] whitespace-nowrap"
      @click="confirmStarAction"
      :style="stickerStyle"
    >
          Last Name
        </span>
    <img
      v-if="!confirmStar && isCreator"
      :width="`${18 * responsiveToolDim.width}px`"
      src="../../../assets/img/last_name_tool.svg"
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
      return this.$store.getters.getAddToPageLastName != undefined
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
      !this.hasTextvalue && this.$BUS.$emit('addTextToPage', 'last_name')
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
