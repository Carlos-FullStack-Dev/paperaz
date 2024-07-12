<template>
  <div>
    <img
      v-if="completed"
      class="absolute-image"
      :src="completedImgData"
      :width="`${
        55 * (tool.justMounted ? responsiveToolDim.width : responsiveDim.width)
      }px`"
    />
    <img
      v-if="!initialimgDisplay && isCreator"
      src="../../../assets/img/initial-icon.png"
      attr="initial"
      :elemFill="uploaded && initialimgDisplay"
      :uploaded="uploaded"
      ref="annotbutton"
      class="annot-button mt-2.5"
      :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'puls' : ' ',
        isAgreedSign !== 1 && isSign ? 'pointer-events-none' : '',
      ]"
      :width="(tool?.pageScaleY || 1) * 18 * responsiveToolDim.width"
    />

    <span
      v-if="!initialimgDisplay && !isCreator && !tool.justMounted"
      class="annot-button font-semibold arrow_down absolute mt-2.5 py-[2px] whitespace-nowrap"
      attr="initial"
      :elemFill="initialimgDisplay"
      :uploaded="uploaded"
      @click="selectIsCreatorDisplay"
      ref="annotbutton"
      :class="[
        $auth.loggedIn && !initialimgDisplay && !isCreator ? 'puls' : ' ',
        isAgreedSign !== 1 && isSign ? 'pointer-events-none' : '',
      ]"
      :style="stickerStyle"
    >
      Initials
    </span>

    <img
      v-else-if="theInitial && !isCreator"
      :width="`${68 * responsiveToolDim.width}px`"
      :style="`height: ${40 * responsiveToolDim.height}px; object-fit:fill`"
      :src="theInitial"
    />
  </div>
</template>

<script>
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'
import SaveSignatureInitialsMixin from '~/mixins/SaveSignatureInitialsMixin'
import mixins from 'vue-typed-mixins'
import { mapState } from 'vuex'
import DrawOrTypeModal from '~/components/modals/DrawOrTypeModal.vue'


export default mixins(SaveSignatureInitialsMixin).extend({
  props: {
    scale: Number,
    file: Object,
    completed: String,
    setInitialSignType: Function,
    tool: Object,
    isCreator: Boolean,
    responsiveDim: Object,
    responsiveToolDim: Object,
    isComplete: Boolean,
    isSign: Boolean
  },
  computed: {
    ...mapState(['loadedPdfFile']),
    isOwner() {
      return this.file.userId == this.$auth?.user?.id
    },
    theInitial() {
      return this.$store.getters?.getUserInitial
    },
    isAgreedSign() {
      return this.$store.state.agreeSign
    },
    uploaded() {
      switch (this.$auth.loggedIn) {
        case true:
          return this.$auth?.user?.initialURL !== null && !this.isCreator
        case false:
          return false
      }
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
        width: `${70 * this.responsiveDim.width}px`,
        height: `${
          (this.tool?.pageScaleY || 1) * 20 * this.responsiveDim.height
        }px`,
      }
    },
  },
  data() {
    return {
      showInitialModal: false,
      initial: null,
      initialimgDisplay: false,
      completedImgData: null,
      isFirstAction: false,
    }
  },
  components: { AddToPageDrawOrType, DrawOrTypeModal },
  methods: {
    checkToolIndex() {
      let bl = document.querySelectorAll('.annot-button')
      Array.from(bl).forEach((element, index) => {
        element == this.$refs.annotbutton &&
          index == 0 &&
          (this.isFirstAction = true)
      })
    },
    selectIsCreatorDisplay() {
      if (
        (this.isAgreedSign !== 1 && this.isSign)
      )
        return
      this.setInitialImgDisplay()
    },
    popUpIfNoinitial() {
      !this.theInitial && !this.isCreator && this.setInitialSignType('initials')
    },
    changeInitialToBase64(com) {
      const toDataURL = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
          )
      if (com) {
        this.$auth?.user?.initialURL &&
          toDataURL(com).then((dataUrl) => {
            this.completedImgData = dataUrl
          })
      }
      this.$auth?.user?.initialURL &&
        toDataURL(this.$auth?.user?.initialURL).then((dataUrl) => {
          this.initial = dataUrl
        })
    },
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit(
        isSignature ? 'signature-update' : 'initials-update',
        image
      )
      this.imageExported(image, isSignature)
      // this.uploaded = true
    },
    popInitial() {
      !this.isCreator && (this.initialimgDisplay = true)
      if (this.isCreator || !this.$auth.loggedIn) return
      if (!this.uploaded) this.showInitialModal = true
    },
    setInitialImgDisplay() {
      if (
        !this.$auth.loggedIn &&
        !this.$store.getters.getFillAsGuest &&
        this.theInitial
      )
        return
      this.initialimgDisplay = true
      !this.theInitial && this.setInitialSignType('initials')
    },
  },
  mounted() {
    this.changeInitialToBase64()
    console.log(this.initialimgDisplay, this.isCreator, this.tool.justMounted)
    this.completed && this.changeInitialToBase64(this.completed)
    !this.initialimgDisplay && !this.isCreator && this.tool.justMounted
      ? this.popUpIfNoinitial()
      : null
    // this.checkToolIndex()
  },
  watch: {
    initialimgDisplay() {
      if (this.theInitial)
        setTimeout(() => {
          !this.isComplete && this.$BUS.$emit('scroll-to-tools')
        }, 100)
    },
    theInitial() {
      !this.isComplete && this.$BUS.$emit('scroll-to-tools')
    },
    '$auth.user.initialURL': async function () {
      this.changeInitialToBase64()
    },
  },
})
</script>

<style scoped>
.absolute-image {
  transition: 0.25s;
  max-width: 200px;
  height: auto;
  @apply absolute top-0 left-[5%] opacity-100;
}
.toolTip {
  position: absolute;
  left: 100%;
  bottom: calc(100% - 4px);
  background-color: yellow;
  border-radius: 2px;
  font-size: 10px;
  color: red;
  font-weight: 600;
  padding: 3px 6px;
  padding-bottom: 8px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 19% 75%, 0 99%, 0% 75%);
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
