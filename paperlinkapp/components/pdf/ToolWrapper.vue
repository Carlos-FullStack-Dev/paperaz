<template>
  <div
    class="tool-wrapper text-field"
    :class="{ 'pointer-events-none': selectedToolType }"
    :style="wrpStyle"
    ref="Wrp"
    :id="getToolWrapperId"
  >
    <!-- <div class="tool-wrapper" :style="wrpStyle" ref="Wrp" :id="getToolWrapperId"> -->
    <div
      class="h-8 border text-black inline-flex items-center gap-1.5 px-1 backdrop-blur-sm bg-white/30 absolute tool-menu z-[1000] transition duration-150"
      ref="toolMenu"
      v-if="isActive && canShowTool"
      v-show="
        tool.user != file.userId ||
        (tool.user == file.userId && tool.justMounted) ||
        (isCreator && tool.user == file.userId && !tool.justMounted)
      "
      v-hammer:pan="handleDrag"
    >
      <button class="h-full cursor-move">
        <Move-icon />
      </button>

      <button
        class="text-sm px-0.5 h-full"
        @click="dec"
        v-show="isMenuVisible('increase')"
        @mouseover="draggingMouseover"
      >
        A
      </button>
      <button
        class="text-lg px-0.5 h-full"
        @click="inc"
        v-show="isMenuVisible('increase')"
        @mouseover="draggingMouseover"
      >
        A
      </button>
      <button
        class="px-0.5 h-full flex items-center relative text-[15px]"
        @click="openCalendar"
        v-if="type == TOOL_TYPE.date"
        @mouseover="draggingMouseover"
      >
        <calendar-icon />
        <el-date-picker
          ref="datePicker"
          type="date"
          placeholder="Pick a day"
          v-model="calendarValue"
          :default-value="new Date()"
          id="sdfadf"
          style="height: 0; width: 0; max-width: 0; margin-0; padding:0; overflow:hidden; position:absolute; top: 100%; right: 50%; transform: translateX(-50%)"
        >
        </el-date-picker>
      </button>
      <button
        class="px-0.5 h-full"
        @click="handleDelete"
        @mouseover="draggingMouseover"
      >
        <trash-x-icon />
      </button>
      <!-- <button class="px-0.5 h-full" @click="onOutSideClick" @mouseover="draggingMouseover">
        <check-circle-icon />
      </button> -->
    </div>

    <div @click="onClick" class="tool-holder">
      <div v-if="type == 'star' && tool.completed">
        <svg
          width="18"
          viewBox="0 0 37 36"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            options="fill"
            d="M36.9676 13.9046C36.8894 13.6713 36.6821 13.5012 36.4324 13.4658L24.4516 11.7717L19.0937 1.20887C18.9825 0.988492 18.752 0.849304 18.5003 0.849304C18.2487 0.849304 18.0175 0.988492 17.9069 1.20887L12.5484 11.7723L0.567584 13.4664C0.317902 13.5019 0.111268 13.6713 0.0324561 13.9052C-0.0450315 14.1379 0.0192104 14.3943 0.200015 14.5651L8.87002 22.7875L6.82289 34.3981C6.7805 34.6397 6.88249 34.8839 7.08582 35.0283C7.29046 35.1739 7.56134 35.1926 7.7832 35.0772L18.5003 29.5961L29.2161 35.0772C29.3128 35.1269 29.4195 35.1513 29.5248 35.1513C29.6619 35.1513 29.7983 35.1101 29.9142 35.0283C30.1182 34.8839 30.2202 34.6397 30.1771 34.3981L28.1307 22.7881L36.8007 14.5651C36.9808 14.393 37.0457 14.1372 36.9676 13.9046Z"
            fill="#84C870"
          />
        </svg>
      </div>
      <div
        v-else-if="type == 'appendSignature' && tool.completed && isCreator"
        ref="apinital"
      >
        <img :src="tool.completed" style="height: 25px" />
      </div>
      <div
        v-else-if="type == 'appendInitial' && tool.completed && isCreator"
        ref="apsign"
      >
        <img :src="tool.completed" style="height: 25px" />
      </div>
      <component
        v-else
        :scalefactor="responsiveDim.width"
        :is="`${type}-tool`"
        :x1="x1"
        :y1="y1"
        :x2="x2"
        :y2="y2"
        :id="id"
        :tool="tool"
        :elemScale="elemScale"
        :incDecCount="incDecCount"
        :points="points"
        :isActive="isActive"
        :fontSize="fontSize"
        :scale="scale"
        :file="file"
        :value="value"
        :justMounted="justMounted"
        @input="onInp"
        :generatePDF="generatePDF"
        :showPublishModal="showPublishModal"
        :selectedToolType="selectedToolType"
        :mouseUp="mouseUp"
        :lineStart="lineStart"
        :toolLength="toolLength"
        :drawingStart="drawingStart"
        :setInitialSignType="setInitialSignType"
        @onBlur="onBlur"
        :isCreator="isCreator"
        :responsiveDim="responsiveDim"
        :responsiveToolDim="responsiveToolDim"
        :addOffset="addOffset"
        :userTime="userTime"
        :isMobile="isMobile"
        @setLabel="setLabel"
        :textareaStyles="textareaStyles"
        :wrpStyle="wrpStyle"
        :togglepdfViewScale="togglepdfViewScale"
        :isSign="isSign"
        :isComplete="isComplete"
        :pdfWaterMark="pdfWaterMark"
      />
      <!-- <div :class="[
          'dr__right',
          { line: type == TOOL_TYPE.line },
          { 'line-alt': (x1 < x2 && y1 < y2) || (x1 > x2 && y1 > y2) },
        ]" ref="drRight" v-hammer:pan="(ev) => handleToolDrag(ev, TOOL_DIRECTION.right)"
          v-if="isAvailableDrRight && isCreator"></div>
        <div :class="[
          'dr__left',
          { line: type == TOOL_TYPE.line },
          { 'line-alt': (x1 < x2 && y1 < y2) || (x1 > x2 && y1 > y2) },
        ]" v-hammer:pan="(ev) => handleToolDrag(ev, TOOL_DIRECTION.left)" v-if="isAvailableDrLeft && isCreator"></div>
       -->
    </div>
    <div
      v-show="
        discribe.length &&
        !editTitle &&
        this.tool.type == this.TOOL_TYPE.star &&
        isActive &&
        !checkIsMobile
      "
      class="rounded-md hidden pop-label"
      ref="popUpTitle"
      :style="scaleStyle"
    >
      <p class="popper-up">
        {{ this.discribe }}
        <img
          @click="resetDiscribe"
          src="./assets/delete_icon.svg"
          class="absolute bottom-2 right-2 bg-white rounded-full cursor-pointer"
        />
      </p>
    </div>

    <div
      v-show="
        editTitle && !checkIsMobile && this.tool.type == this.TOOL_TYPE.star
      "
      v-if="isCreator"
      class="input-wrapper transition duration-150"
      ref="textareaContainer"
      style="textArea"
      :style="scaleStyle"
    >
      <div
        class="md:flex items-center rounded-md w-[180px] absolute top-full hidden box-shadow bg-white"
      >
        <p
          ref="textarea"
          contenteditable="true"
          class="note-input-pc font-[300] tracking-wide"
          placeholder="Type Message here"
        >{{ tool.discription || ""}}</p>
        <button
        @click="saveDiscription"
          class="ml-1 absolute bottom-[5px] right-[5px] text-xs w-6 h-6 bg-paperdazgreen-300 rounded-full flex justify-center items-center text-white" 
        >
          Ok?
      </button>
      </div>
    </div>
  </div>
</template>

<script>
import TextTool from './tools/Text'
import TickTool from './tools/Tick'
import CrossTool from './tools/Cross'
import DotTool from './tools/Dot'
import CircleTool from './tools/Circle'
import LineTool from './tools/Line'
import DrawTool from './tools/Draw'
import HighlightTool from './tools/Highlight'
import DateTool from './tools/Date'
import NameTool from './tools/Name'
import InitialTool from './tools/Initial'
import SignatureTool from './tools/Signature'
import StarTool from './tools/Star'
import TOOL_DIRECTION from '@/components/pdf/data/toolDragDirection'
import TOOL_TYPE from '@/components/pdf/data/toolType'
import MoveIcon from '../svg-icons/MoveIcon.vue'
import CalendarIcon from '../svg-icons/CalendarIcon.vue'
import TrashXIcon from '../svg-icons/TrashXIcon.vue'
import CheckCircleIcon from '../svg-icons/CheckCircleIcon.vue'
import AppendSignatureTool from './tools/AppendSignature'
import AppendInitialTool from './tools/AppendInitial'
import AppendDateTool from './tools/InitialDate.vue'
import moment from 'moment'
import { mapState } from 'vuex'
import TeamAccess from '~/models/TeamAccess'
import AppendNameTool from './tools/AppendName.vue'
import AppendFirstNameTool from './tools/AppendFirstName.vue'
import AppendLastNameTool from './tools/AppendLastName.vue'
import { isMobile } from 'mobile-device-detect'
import FileAction from '~/models/FileAction'


export default {
  props: {
    userTime: String,
    tool: Object,
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    deleteTool: Function,
    points: Array,
    dragHandler: Function,
    id: Number,
    type: String,
    handleIncrease: Function,
    handleDecrease: Function,
    setInitialSignType: Function,
    fontSize: Number,
    scale: Number,
    signature: String,
    activeToolId: Number,
    setActiveToolId: Function,
    pageNumber: Number,
    file: Object,
    showPublishModal: Boolean,
    generatePDF: Boolean,
    toolWrapperBeforeChecked: Function,
    toolWrapperAfterChecked: Function,
    justMounted: Boolean,
    mouseUp: Boolean,
    selectedToolType: String,
    drawingStart: Boolean,
    value: undefined,
    lineStart: Boolean,
    toolLength: Number,
    userId: Number,
    inputValue: Function,
    toolDescriptionFunc: Function,
    isCreator: Boolean,
    togglepdfViewScale: Function,
    parentOffset: Function,
    calculateScale: Function,
    pdfWaterMark: String
  },
  components: {
    TextTool,
    TickTool,
    CrossTool,
    DotTool,
    CircleTool,
    LineTool,
    DrawTool,
    HighlightTool,
    DateTool,
    NameTool,
    InitialTool,
    SignatureTool,
    MoveIcon,
    CalendarIcon,
    TrashXIcon,
    CheckCircleIcon,
    StarTool,
    AppendSignatureTool,
    AppendInitialTool,
    AppendDateTool,
    AppendNameTool,
    AppendFirstNameTool,
    AppendLastNameTool,
  },
  data: () => ({
    lastPosX: 0,
    lastPosY: 0,
    isDragging: false,
    isDragFinal: false,
    top: 100,
    left: 0,
    textareaStyles: {
      top: '',
      left: '',
      bottom: '',
      right: '',
    },
    calendarValue: undefined,
    altDirection: false,
    incDecCount: 7,
    incDecMax: 15,
    incDecMin: 7,
    toolWrapperId: '',
    pageScale: 1,
    firstRender: false,
    editTitle: true,
    discribe: '',
    justMountedNoAction: true,
    canShowTool: false,
    canShowNoteEditor: true,
  }),
  head() {
    return {
      script: [
        // ...
        {
          integrity:
            'sha512-IetiMzopsrb75HtZydIM8zRv1mlSmV42P0iZVT4sPHxDnhM0I9O8/75bFqlfWoCKTnDB+pFqvoQrlnkgUeShaA==',
          src: '/html-to-png/htmlToPng.js',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer',
        },
      ],
    }
  },
  created() {
    this.checkAndSetPosition()
    this.clcPos()
  },
  watch: {
    x1() {
      this.clcPos()
    },
    y1() {
      this.clcPos()
    },
    x2() {
      this.clcPos()
    },
    y2() {
      this.clcPos()
    },
    points() {
      this.clcPos()
    },
    activeToolId(v) {
      if (v == this.id) this.toolMenuPosCalculation()
    },
    calendarValue(v) {
      this.$emit('input', moment(new Date(v).getTime()).format('YYYY-MM-DD'))
    },
    fontSize() {
      this.toolMenuPosCalculation()
    },
    tool: {
      handler: function () {
        this.checkAndSetPosition()
      },
      deep: true,
    },
    wrpStyle(val){
      console.log("wrapppppppppp-------", val, this.getCurrentPageDim(), this.responsiveDim)
    }
  },
  computed: {
    ...mapState(['editAnnotation']),
    getToolWrapperId() {
      if (this.type == 'appendSignature') {
        return 'sign' + this.pageNumber
      } else if (this.type == 'appendInitial') {
        return 'initial' + this.pageNumber
      } else {
        return ''
      }
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isMobile() {
      return isMobile
    },
    checkIsMobile() {
      return isMobile
    },
    scaleStyle() {
      return {
        transform: `scale(${1 * this.responsiveToolDim.width})`,
        transformOrigin: '0 0',
      }
    },
    isActive() {
      return this.id == this.activeToolId
    },
    FrombusinessPage() {
      return (
        JSON.parse(localStorage.getItem('from_publicpage'))?.fromBusiness ??
        true
      )
    },

    elemScale() {
      return this.incDecCount / 11
    },
    responsiveDim() {
      return {
        width:
          this.$store.getters.getPdfpagesDim.parentWidth /
          this.tool.parentWidth,
        height:
          this.$store.getters.getPdfpagesDim.parentHeight /
          this.tool.parentHeight,
      }
    },
    responsiveToolDim() {
      return {
        width: this.$store.getters.getPdfpagesDim.parentWidth / 805,
        height: this.$store.getters.getPdfpagesDim.parentHeight / 1243,
      }
    },
    wrpStyle() {
      if (this.justMountedNoAction) {
        this.top = this.tool.top
        this.left = this.tool.left
        this.justMountedNoAction = false
      }
      if (this.tool.type == "appendSignature" || this.tool.type == "appendInitial" ) {
        this.top = this.tool.top-10
        this.left = this.tool.left-10
      } 
      let top = this.top
      let left = this.left

      return {
        top: `${(top * (this.firstRender ? 1 : this.getCurrentPageDim().height || this.responsiveDim.height))}px`,
        left: `${(left * (this.firstRender ? 1 : this.getCurrentPageDim().width || this.responsiveDim.width))}px`,
      }
    },
    TOOL_TYPE() {
      return TOOL_TYPE
    },
    TOOL_DIRECTION() {
      return TOOL_DIRECTION
    },
    isAvailableDrRight() {
      return (
        this.isActive &&
        (this.type == this.TOOL_TYPE.line ||
          this.type == this.TOOL_TYPE.highlight)
      )
    },
    isAvailableDrLeft() {
      return (
        this.isActive &&
        (this.type == this.TOOL_TYPE.line ||
          this.type == this.TOOL_TYPE.highlight)
      )
    },
  },
  methods: {
    resetDiscribe() {
      if (!this.$refs.textarea) return
      this.$refs.textarea.innerHTML = ''
      this.discribe = ''
      this.$emit('setToolDiscription', '')
    },
    saveDiscription() {
      if (!this.$refs.textarea) return
      this.discribe = this.$refs.textarea.textContent
      this.editTitle = false
      this.toolDescriptionFunc(this.discribe, this.tool.id)
    },
    setLabel() {
      if (this.type !== TOOL_TYPE.star) return
      this.checkIsMobile && this.$BUS.$emit('openSaveDiscription')
      this.editTitle = true
    },
    getCurrentPageDim() {
      if (!this.$refs.Wrp) return {}
      let all_PGD = this.$refs.Wrp?.parentElement?.getBoundingClientRect() ?? {}

      return {
        width: all_PGD.width / this.tool.parentWidth,
        height: all_PGD.height / this.tool.parentHeight,
      }
    },
    handleDelete() {
      if (this.isDragFinal) {
        this.isDragFinal = !this.isDragFinal
        return
      }
      // this.setActiveToolId(null)
      this.deleteTool(this.id)
    },
    async toDataURL(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      return await new Promise((resolve, _) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    },
    inc(event) {
      if (this.isDragFinal) {
        this.isDragFinal = !this.isDragFinal
        return
      }
      if (this.incDecCount == this.incDecMax) return
      ++this.incDecCount
      this.handleIncrease(this.id)
    },
    dec() {
      if (this.isDragFinal) {
        this.isDragFinal = !this.isDragFinal
        return
      }
      if (this.incDecCount == this.incDecMin) return
      --this.incDecCount
      this.handleDecrease(this.id)
    },
    openCalendar() {
      if (this.isDragFinal) {
        this.isDragFinal = !this.isDragFinal
        return
      }
      this.$refs.datePicker.focus()
    },
    isMenuVisible(type) {
      if (
        (type == 'increase' || type == 'decrease') &&
        [
          this.TOOL_TYPE.line,
          this.TOOL_TYPE.highlight,
          this.TOOL_TYPE.draw,
          this.TOOL_TYPE.appendInitial,
          this.TOOL_TYPE.appendSignature,
          this.TOOL_TYPE.appendDate,
          this.TOOL_TYPE.star,
          this.TOOL_TYPE.appendName,
          this.TOOL_TYPE.appendFirstName,
          this.TOOL_TYPE.appendLastName,
        ].includes(this.type)
      )
        return false
      return true
    },

    onClick() {
      if (!this.tool.justMounted && !this.isCreator) return
      this.setLabel()
      this.setActiveToolId(this.id, this.tool)
      this.canShowTool = true
      this.canShowNoteEditor = false
      return
      this.$emit('resetJustMounted', this.id)
      if (!this.isCreator) return
      this.setActiveToolId(this.id)
      this.$emit('toolWrapperBeforeChecked', this.id)
      // this.$BUS.$emit('tool-comp-click', this.id)
    },
    onOutSideClick() {
      if (this.isDragFinal) {
        this.isDragFinal = !this.isDragFinal
        return
      }
      if (!this.isCreator) return
      this.$emit('toolWrapperAfterChecked', this.id)
      // this.setActiveToolId(null)
    },
    clcPos() {
      let top = this.top
      let left = this.left
      if (this.points) {
        top = Math.min(...this.points.filter((v, i) => i % 2 == 1))
        left = Math.min(...this.points.filter((v, i) => i % 2 == 0))
      } else {
        if (this.y1 != null && this.y2 != null) {
          if (this.y2 < this.y1) top = this.y2
          else top = this.y1
        }
        if (this.x1 != null && this.x2 != null) {
          if (this.x2 < this.x1) left = this.x2 + 3
          else left = this.x1 - 3
        }
      }
      this.top = top
      this.left = left
    },
    checkAndSetPosition() {
      if (this.tool.top) this.top = this.tool.top
      if (this.tool.left) this.left = this.tool.left
    },
    addOffset(val) {
      if (
        this.tool.type == this.TOOL_TYPE.appendDate ||
        this.tool.type == this.TOOL_TYPE.appendName ||
        this.tool.type == this.TOOL_TYPE.appendFirstName ||
        this.tool.type == this.TOOL_TYPE.appendLastName ||
        this.tool.type == this.TOOL_TYPE.star
      )
        this.parentOffset(val, this.id)
    },
    draggingMouseover(event) {
      if (this.isDragging) {
        event.target.style.cursor = 'move'
      } else {
        event.target.style.cursor = 'pointer'
      }
    },
    async handleDrag(event) {
      this.firstRender = true
      var elem = this.$refs.Wrp
      if (!this.tool.justMounted) this.$emit('reAdjust', true, this.id)

      if (!this.isDragging) {
        this.isDragging = true
        this.lastPosX = elem.offsetLeft
        this.lastPosY = elem.offsetTop
        // console.log(elem.parentElement.getBoundingClientRect().width / elem.parentElement.clientWidth)
        this.pageScale =
          elem.parentElement?.getBoundingClientRect()?.width /
          elem.parentElement?.clientWidth
      } else {
        elem.style.cursor = 'move'
      }

      let posX = event.deltaX / this.pageScale + this.lastPosX
      let posY = event.deltaY / this.pageScale + this.lastPosY

      // Set Boundary
      if (posX > 0 && posX + elem?.clientWidth < elem.parentElement?.clientWidth)
        this.left = posX
      if (
        posY > 0 &&
        posY + elem?.clientHeight < elem.parentElement?.clientHeight
      )
        this.top = posY

      if (event.isFinal) {
        this.isDragging = false
        let dx, dy
        if (
          this.tool.type == this.TOOL_TYPE.line ||
          this.tool.type == this.TOOL_TYPE.highlight ||
          this.tool.type == this.TOOL_TYPE.draw
        ) {
          dx = this.lastPosX - this.left
          dy = this.lastPosY - this.top
        } else {
          dx = this.left
          dy = this.top
        }

        this.$emit('pos-change', {
          dx,
          dy,
          id: this.id,
        })

        // Tool Menu Position Calculation
        this.toolMenuPosCalculation()
      }
      this.isDragFinal = event.isFinal
    },
    async toolMenuPosCalculation() {
      await this.$nextTick()
      var elem = this.$refs.Wrp
      var textareaContainer = this.$refs.textareaContainer
      var popUpTitle = this.$refs.popUpTitle
      let editorWidth = textareaContainer?.getBoundingClientRect()?.width
      let editorHeight = textareaContainer?.getBoundingClientRect()?.width
      let left = Number(this.wrpStyle.left.replace('px', ''))
      let top = Number(this.wrpStyle.top.replace('px', ''))

      let toolMenuHeight = this.$refs.toolMenu.clientHeight + 2
      let toolMenuWidth = this.$refs.toolMenu.clientWidth
      const initFontSize = 11
      const fontSize = this.fontSize || initFontSize
      if (top < toolMenuHeight) {
        this.$refs.toolMenu.style.top = 'unset'
        this.$refs.toolMenu.style.bottom = `-${
          toolMenuHeight + fontSize - initFontSize
        }px`
      } else {
        this.$refs.toolMenu.style.top = `-${
          toolMenuHeight + fontSize - initFontSize
        }px`
        this.$refs.toolMenu.style.bottom = 'unset'
      }
      //
      if (
        elem.parentElement.clientHeight - top <
        toolMenuHeight + this.$refs.textarea?.getBoundingClientRect().height
      ) {
        textareaContainer.style.top = 'unset'
        textareaContainer.style.bottom = `${
          toolMenuHeight +
          this.$refs.textarea?.getBoundingClientRect().height +
          fontSize -
          initFontSize
        }px`
        popUpTitle.style.top = 'unset'
        popUpTitle.style.bottom = `${
          toolMenuHeight +
          this.$refs.textarea?.getBoundingClientRect().height +
          fontSize -
          initFontSize
        }px`
      } else {
        textareaContainer.style.top = `unset`
        textareaContainer.style.bottom = 'unset'
        popUpTitle.style.top = 'unset'
        popUpTitle.style.bottom = 'unset'
      }
      // move the tool menu base on the closeness to the parent element
      if (Math.abs(left - elem.parentElement.clientWidth) < toolMenuWidth) {
        this.$refs.toolMenu.style.left = `${elem.clientWidth - toolMenuWidth}px`
      } else {
        this.$refs.toolMenu.style.left = `0px`
      }

      // move the text-box base on the closeness to the parent element
      if (
        Math.abs(elem.parentElement.clientWidth - left) <
        toolMenuWidth + editorWidth - 10
      ) {
        textareaContainer.style.left = `-${editorWidth}px`
        popUpTitle.style.left = `-${editorWidth}px`
      } else {
        textareaContainer.style.left = `0px`
        popUpTitle.style.left = '0px'
      }

      // move the popup-box base on the closeness to the parent element
      if (
        Math.abs(elem.parentElement.clientWidth - left) <
        toolMenuWidth + (popUpTitle ? popUpTitle.clientWidth : 0) - 10
      ) {
        popUpTitle.style.left = `-${editorWidth}px`
      } else {
        // textareaContainer.style.left = `0px`
        popUpTitle.style.left = '0px'
      }

      // this.$refs.textareaContainer.style.left = `${elem.clientWidth - toolMenuWidth}px`
    },
    onInp(v) {
      this.inputValue(v, this.tool)
      // this.$emit('input', ...v)
    },
    onBlur() {
      this.onOutSideClick()
    },
  },
  mounted: function () {
    this.getCurrentPageDim()
    !this.tool.justMounted && ( this.editTitle = false )
    if(this.$refs.textarea){
      (this.$refs.textarea.innerHTML = this.tool.discription)
      this.tool.justMounted && this.$refs.textarea.focus()
    }
  },
}
</script>

<style lang="scss" scoped>
@import './scss/tools.scss';

.tool-menu {
  height: 27px;
  position: absolute;
  top: -27px;
  z-index: 1000;
}

.tool-holder {
  position: relative;
  cursor: pointer;

  .dr {
    position: absolute;
    width: 7px;
    height: 7px;
    background-color: #77c360;
    border-radius: 50%;
    cursor: pointer;

    &__right {
      @extend .dr;
      right: -10px;
      top: calc(50% - 3.5px);

      &.line {
        top: 0;
        right: -5px;

        &.line-alt {
          top: unset;
          bottom: 0;
        }
      }
    }

    &__left {
      @extend .dr;
      left: -10px;
      top: calc(50% - 3.5px);

      &.line {
        top: unset;
        bottom: 0;

        &.line-alt {
          bottom: unset;
          top: 0;
        }
      }
    }
  }
}
.note-input {
  @apply w-full rounded-md outline-none text-sm bg-white p-2 resize-none md:shadow-md
  min-h-[300px] max-h-[300px] overflow-auto;
}
.note-input-pc {
  @apply w-full rounded-md outline-none text-sm bg-white p-2 resize-none max-h-[200px] overflow-y-auto;
}
.note-input-pc[placeholder]:empty:before {
  content: 'Type here...';
  opacity: 0.5;
  color: #555;
}
.pop-label {
  @apply md:shadow-md md:shadow-black/30 absolute;
}
.input-wrapper {
  @apply rounded-md md:w-[180px] md:h-auto z-[100]  flex justify-center items-center absolute;
}
.text-field:hover .pop-label {
  @apply block;
}
.popper-up {
  @apply w-[180px] bg-white break-words p-2 pb-3 relative rounded-md text-sm font-[300] tracking-wide max-h-[200px] overflow-y-auto;
}
.box-shadow {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
