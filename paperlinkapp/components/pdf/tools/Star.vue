<template>
  <div
    class="text-field tool"
    attr="star"
    :elemFill="confirmStar"
    ref="starTool"
  >
    <img
      v-if="confirmStar && isCreator"
      :width="`${18 * responsiveToolDim.width}px`"
      src="../../../assets/img/require-icon.svg"
    />
    <span
      v-if="!confirmStar && !isCreator && !confirmNote"
      class="annot-button w-0 h-0 p-0 m-0 border-0"
    ></span>
    <span
      ref="tip"
      @click="confirmStar = false"
      v-if="confirmStar && !isCreator"
      class="annot-button"
    >
      <img
        src="../assets/note_icon.svg"
        :width="`${(tool?.pageScaleY || 1) * 18 * responsiveToolDim.width}px`"
      />
    </span>

    <span
      class="tip"
      ref="tip"
      v-if="!confirmStar && !isCreator && !confirmNote"
    >
      
    </span>
    <div
      v-if="!confirmStar && !isCreator && !confirmNote"
      :style="scaleStyle"
      ref="toolTip"
      class="w-[180px] text-[11px] arrow-head text-center bg-white p-2 rounded-md fade_in"
    >
      <div class="max-h-[200px] overflow-y-auto pt-1">
        {{
          tool.discription ||
          'please click check icon to confirm data is filled'
        }}
        <abbr @click="confirmStarAction" ref="check"
          class="lg:w-[20px] lg:h-[20px] w-[20px] h-[20px] bottom-[5px] right-[5px] absolute text-[10px] check-position z-10 fade_in class-check"
        > Ok? 
        </abbr>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalActive: false,
      confirmStar: true,
      isFirstAction: false,
      isActionIndex: null,
      hasAddedOffset: false,
      confirmNote: false,
    }
  },
  props: {
    scale: Number,
    file: { type: Object, required: true },
    isCreator: Boolean,
    tool: Object,
    responsiveDim: Object,
    responsiveToolDim: Object,
    textareaStyles: Object,
    calcTop: Number,
    calcLeft: Number,
    wrpStyle: Object,
    isComplete: Boolean
  },
  mounted() {
    this.checkToolIndex()
    setTimeout(() => {
      !this.hasAddedOffset
        ? !this.isCreator &&
          this.$emit('addOffset', 5 / this.responsiveDim.height)
        : null
      this.hasAddedOffset = true
      this.checkToolPosition()
    }, 300)
  },
  computed: {
    scaleStyle() {
      return {
        transform: `scale(${1 * this.responsiveToolDim.width})`,
      }
    },
    style() {
      return {
        width: `${(this.scale || 1) * 18 * this.responsiveDim.width}px`,
        height: `${(this.scale || 1) * 24 * this.responsiveDim.height}px`,
      }
    },
    notBtn() {
      return this.notClass
    },
  },
  methods: {
    addVerticalOffset() {
      this.hasAddedOffset = true
      this.checkToolPosition()
    },
    checkToolPosition() {
      let pageheight =
        document.querySelectorAll('.pdf-page')[this.tool.pageNumber - 1]
          .clientHeight
      let pagewidth =
        document.querySelectorAll('.pdf-page')[this.tool.pageNumber - 1]
          .clientWidth
      let elem = this.$refs.toolTip?.getBoundingClientRect()
      let top = Number(this.wrpStyle?.top.replace('px', ''))
      let left = Number(this.wrpStyle?.left.replace('px', ''))

      if (elem.height + top > pageheight) {
        this.$refs.toolTip.style.top = `-${elem.height + 22}px`
        this.$refs.tip.className = 'down_tip'
        this.$refs.check.style.transform = 'rotateZ(180deg)'
        this.$refs.toolTip.classList.add('transformOriginY_T')
      } else {
        this.$refs.toolTip.classList.add('transformOriginY_B')
      }
      if (elem.height + left > pagewidth) {
        this.$refs.toolTip.style.left = `-${elem.height - 12}px`
        this.$refs.toolTip.classList.add('transformOriginX_T')
      } else {
        this.$refs.toolTip.classList.add('transformOriginX_B')
      }
    },
    checkToolIndex() {
      let bl = document.querySelectorAll('.annot-button')
      Array.from(bl).forEach((element, index) => {
        element == this.$refs.annotbutton &&
          index == 0 &&
          (this.isFirstAction = true) &&
          (this.isActionIndex = index)
      })
    },
    overHandler: function () {
      this.isModalActive = true
    },
    leaveHandler: function () {
      this.isModalActive = false
    },
    confirmStarAction() {
      if (!this.$auth.loggedIn && !this.$store.getters.getFillAsGuest) return
      this.$store.commit('CLICK_TOOL_ACTION', this.isActionIndex)
      !this.isCreator && (this.confirmNote = true)
      this.notClass = ''
      setTimeout(() => {
        !this.isComplete && this.$BUS.$emit('scroll-to-tools')
      }, 200)
    },
  },
  watch: {
    confirmStar() {
      setTimeout(() => {
        this.addVerticalOffset()
      }, 300)
      // this.$BUS.$emit('scroll-to-tools')
    },
    '$store.getters.getClickAction'() {
      this.checkToolIndex()
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

.note-input {
  @apply w-full rounded-md outline-none text-sm bg-white p-2 resize-none md:shadow-md md:shadow-black/30
  min-h-[300px] max-h-[300px] overflow-auto;
}
.note-input-pc {
  @apply w-full rounded-md outline-none text-sm bg-white p-2 resize-none md:shadow-md md:shadow-black/30;
}
.note-input-pc[placeholder]:empty:before {
  content: 'Type here...';
  opacity: 0.5;
  color: #555;
}
.pop-label {
  @apply md:shadow-md md:shadow-black/30;
}
.input-wrapper {
  @apply rounded-md md:relative md:w-[180px] md:h-auto z-[100]  flex justify-center items-center;
}
.text-field:hover .pop-label {
  @apply block;
}
.arrow-head {
  @apply md:shadow-md md:shadow-black/30 border-[2px] border-paperdazgreen-300 absolute left-[-10px];
}

.tip {
  position: absolute;
  display: inline-block;
  bottom: -1px;
  left: -3px;
}
.tip::after {
  content: '';
  position: absolute;
  width: 13px;
  height: 20px;
  clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
  background: white;
  z-index: 9;
  bottom: calc(100% - 1px);
  right: calc(96% - 16px);
}
.tip::before {
  content: '';
  position: absolute;
  width: 17px;
  height: 26px;
  clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
  @apply bg-paperdazgreen-300;
  z-index: 8;
  bottom: calc(100% - 0.5px);
  right: calc(96% - 18px);
}
.down_tip {
  position: absolute;
  display: inline-block;
  top: -20px;
  left: 10px;
  z-index: 10;
  transform: rotateZ(180deg);
}

.down_tip::after {
  content: '';
  position: absolute;
  clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
  width: 13px;
  height: 20px;
  background: white;
  z-index: 9;
  bottom: calc(100% - 1px);
  right: calc(96% - 16px);
}
.down_tip::before {
  content: '';
  position: absolute;
  clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
  width: 17px;
  height: 26px;
  @apply bg-paperdazgreen-300;
  z-index: 8;
  bottom: calc(100% - 1px);
  right: calc(96% - 18px);
}
img {
  max-width: none;
}

.transformOriginX_T {
  -webkit-transform-origin-x: 100%;
  -ms-transform-origin-x: 100%;
}
.transformOriginX_B {
  -webkit-transform-origin-x: 0%;
  -ms-transform-origin-x: 0%;
}
.transformOriginY_T {
  -webkit-transform-origin-y: 100%;
  -ms-transform-origin-y: 100%;
}
.transformOriginY_B {
  -webkit-transform-origin-y: 0%;
  -ms-transform-origin-y: 0%;
}
.class-check {
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 50px;
  @apply bg-paperdazgreen-300;
  z-index: 10;
}
</style>
