<!--
 NOTE THAT JQUERY IS ONLY USE IN PFD SECTION
 AND A VERY LITTLE KNOWLEDGE OF JQUERY IS REQUIRED
  -->

<template>
  <section
    class="grid grid-cols-1 md:grid-cols-[max-content,1fr] grid-rows-1 h-full max-h-full overflow-hidden"
  >
    <FileDeleted v-if="file.isDeleted" @cancel="canceled = true" />
    <div
      class="grid grid-cols-1 md:grid-cols-[max-content,1fr] grid-rows-1 h-full max-h-full overflow-hidden"
      id="pdf-page-vue"
      :style="`width: ${width}px`"
      v-else
    >
      <!-- pdf page aside has hidden md:grid -->
      <pdf-page-aside
        class="hidden md:block"
        @nextPage="nextPageHandler"
        @prevPage="prevPageHandler"
        :numPages="propsNumPages"
        :currentPage="currentPage"
        :pdf="pdf"
        @sideSetScrollPage="sideSetScrollPage"
        v-if="displayPDF"
      />
      <section class="flex justify-center w-full">
        <main
          v-if="displayPDF"
          class="grid grid-rows-[max-content,max-content,1fr] sm:gap-1 max-w-5xl w-full sm:px-[2%] sm:pb-[2%]"
        >
          <pdf-page-action-tray
            :file="file"
            @update-file="file = $event"
            :tools="tools"
            class="w-full"
            :isCreator="isCreator"
            @pinchZoomOut="pinchZoomOut"
            @tool-change="onToolChange"
            @isDeletedFunc="isDeletedFunc"
            :pdfContainerDimension="pdfContainerDimension"
            @publishFileFunction="publishFileFunction"
            @clearAnnotations="clearAnnotations"
            :canceled="canceled"
            :disablePublish="filteredAnnotationButton.length > 0"
          />
          <tool-bar
            @check-active-tools="scrollToSignInitial"
            :file="file"
            @tool-change="onToolChange"
            :selectedToolType="selectedToolType"
            @undo="undo"
            @update-file="file = $event"
            :tools="tools"
            :openSignType="openSignType"
            :openTypeSignModal="openTypeSignModal"
            :openTypeInitialModal="openTypeInitialModal"
            class="w-full"
            :isCreator="isCreator"
            :isLoading="pdfLoading"
            @cancel="canceled = true"
            @zoomIn="zoom *= 1.1"
            @zoomOut="zoom /= 1.1"
            @publishFileFunction="publishFileFunction"
            @pinchZoomOut="pinchZoomOut"
            @togglepdfViewScale="togglepdfViewScale"
            @confirmChecked="(value) => (isConfirmChecked = value)"
            @clearAnnotations="clearAnnotations"
            :inputValue="inputValue"
            :openAnnotationToolInput="openAnnotationToolInput"
            @creatorPublishFile="creatorPublishFile"
            :pdfWaterMark="pdfWaterMark"
          />
          <div
            class="pdf-editor-view relative custom-scrollbar overflow-scroll w-full flex justify-center flex-wrap"
            @scroll="setScrollPage"
            v-if="pdf"
            ref="scrollingElement"
          >
            <div
              v-if="!isMobile"
              class="pdf-pages-outer relative"
              ref="PagesOuter"
              id="PagesOuter"
            >
              <div
                class="pdf-single-pages-outer w-full transform_origin"
                ref="pdf-single-pages-outer"
                v-if="pdf"
              >
                <div
                  :class="[
                    'pdf-single-page-outer w-full',
                    { 'mt-1': pI > 0 && !downloadingPdf },
                  ]"
                  :ref="`pdf-single-page-outer-${pI + 1}`"
                  v-for="(page, pI) in pdf.numPages"
                  :key="pI"
                  v-hammer:pan="
                    (ev) => handlePanning(ev, undefined, undefined, pI + 1)
                  "
                  @mouseup="onMouseUp"
                  @mousedown="onMouseDown"
                  style="position: relative"
                >
                  <div
                    v-if="
                      filteredAnnotationButton.length > 0 &&
                      isSign &&
                      curSignInitialPage == 'sign' + (pI + 1) &&
                      isAgreedSign == 1
                    "
                    class="absolute hidden"
                    :style="signAlaram"
                  >
                    <div
                      class="bg-[#77B550] p-1 text-white text-[12px] border-rounded-lg"
                    >
                      {{ 'Sign ' + signNumber }}
                    </div>
                    <div
                      class="w-0 h-0 border-t-[14px] -ml-[1px] border-b-[14px] border-t-transparent border-b-transparent border-l-[14px] border-l-[#77B550]"
                    ></div>
                  </div>
                  <div
                    v-if="
                      filteredAnnotationButton.length > 0 &&
                      isSign &&
                      curSignInitialPage == 'initial' + (pI + 1) &&
                      isAgreedSign == 1
                    "
                    :style="signAlaram"
                    class="absolute flex hidden"
                  >
                    <div
                      class="bg-[#77B550] py-1 text-white text-[12px] border-rounded-lg"
                    >
                      {{ 'Initial ' + InitialNumber }}
                    </div>
                    <div
                      class="w-0 h-0 border-t-[14px] -ml-[1px] border-b-[14px] border-t-transparent border-b-transparent border-l-[14px] border-l-[#77B550]"
                    ></div>
                  </div>
                  <tool-wrapper
                    v-for="tool in fillteredTools(pI + 1)"
                    :toolLength="fillteredTools(pI + 1).length"
                    :key="tool.id"
                    :isCreator="isCreator"
                    @resetToolProp="resetToolProp"
                    :selectedToolType="selectedToolType"
                    :dragHandler="handlePanning"
                    @reAdjust="reAdjust"
                    :userTime="userTime"
                    :id="tool.id"
                    :tool="tool"
                    :type="tool.type"
                    :x1="tool.x1"
                    :y1="tool.y1"
                    :x2="tool.x2"
                    :y2="tool.y2"
                    :points="tool.points"
                    :deleteTool="deleteTool"
                    :handleIncrease="handleIncrease"
                    :mouseUp="mouseUp"
                    :handleDecrease="handleDecrease"
                    :fontSize="tool.fontSize"
                    :scale="scale"
                    @pos-change="onPosChange"
                    @resetJustMounted="resetJustMounted"
                    :activeToolId="activeToolId"
                    :setActiveToolId="setActiveToolId"
                    :pageNumber="pI + 1"
                    :value="tool.value"
                    :file="file"
                    :justMounted="tool.justMounted"
                    :lineStart="lineStart"
                    :drawingStart="drawingStart"
                    :showPublishModal="showPublishModal"
                    :generatePDF="generatePDF"
                    @toolWrapperBeforeChecked="toolWrapperBeforeChecked"
                    @toolWrapperAfterChecked="toolWrapperAfterChecked"
                    :userId="tool.user"
                    :inputValue="inputValue"
                    :setInitialSignType="setInitialSignType"
                    :parentOffset="parentOffset"
                    :toolDescriptionFunc="toolDescriptionFunc"
                  />
                  <!-- </div> -->
                  <pdf-page
                    :handlePanning="handlePanning"
                    :onCLickSinglePageOuter="onCLickSinglePageOuter"
                    :file="file"
                    :page-number="pI + 1"
                    :pdf="pdf"
                    :scale="scale"
                    @setPageHeight="setPageHeight"
                    :initialOrigin="setInitialOrigin"
                    @setPageWidth="onloadPdfquery"
                    :confirmDone="confirmDone"
                    :isCreator="isCreator"
                  />
                </div>
              </div>
            </div>

            <pinch-zoom
              v-if="isMobile"
              ref="pinch"
              :limitPan="true"
              :limitZoom="1000"
              overflow="scroll"
              backgroundColor="none"
              :disableZoomControl="'disable'"
              :listeners="'auto'"
            >
              <!-- <pinch-scroll-zoom
                ref="zoomer"
                :width="$refs.scrollingElement?.offsetWidth -4 || 0"
                :height="$refs.PagesOuter?.offsetHeight || 0"
                :scale="scale"
                :wheel="false"
                :minScale="0.5"
                @scaling="scalingHandler"
                style="overflow: hidden;"
              > -->
              <div
                class="pdf-pages-outer relative"
                v-if="isMobile"
                ref="PagesOuter"
                id="PagesOuter"
              >
                <div
                  class="pdf-single-pages-outer w-full transform_origin"
                  :style="zoomOptions"
                  ref="pdf-single-pages-outer"
                  v-if="pdf"
                >
                  <div
                    :class="[
                      'pdf-single-page-outer w-full',
                      { 'mt-1': pI > 0 && !downloadingPdf },
                    ]"
                    :ref="`pdf-single-page-outer-${pI + 1}`"
                    v-for="(page, pI) in pdf.numPages"
                    :key="pI"
                    v-hammer:pan="
                      (ev) => handlePanning(ev, undefined, undefined, pI + 1)
                    "
                    @mouseup="onMouseUp"
                    @mousedown="onMouseDown"
                    style="position: relative"
                  >
                    <div
                      v-if="
                        filteredAnnotationButton.length > 0 &&
                        isSign &&
                        curSignInitialPage == 'sign' + (pI + 1) &&
                        isAgreedSign == 1
                      "
                      class="absolute hidden"
                      :style="signAlaram"
                    >
                      <div
                        class="bg-[#77B550] p-1 text-white text-[12px] border-rounded-lg"
                      >
                        {{ 'Sign ' + signNumber }}
                      </div>
                      <div
                        class="w-0 h-0 border-t-[14px] -ml-[1px] border-b-[14px] border-t-transparent border-b-transparent border-l-[14px] border-l-[#77B550]"
                      ></div>
                    </div>
                    <div
                      v-if="
                        filteredAnnotationButton.length > 0 &&
                        isSign &&
                        curSignInitialPage == 'initial' + (pI + 1) &&
                        isAgreedSign == 1
                      "
                      :style="signAlaram"
                      class="absolute flex hidden"
                    >
                      <div
                        class="bg-[#77B550] py-1 text-white text-[12px] border-rounded-lg"
                      >
                        {{ 'Initial ' + InitialNumber }}
                      </div>
                      <div
                        class="w-0 h-0 border-t-[14px] -ml-[1px] border-b-[14px] border-t-transparent border-b-transparent border-l-[14px] border-l-[#77B550]"
                      ></div>
                    </div>
                    <tool-wrapper
                      v-for="tool in fillteredTools(pI + 1)"
                      :toolLength="fillteredTools(pI + 1).length"
                      :key="tool.id"
                      :isCreator="isCreator"
                      @resetToolProp="resetToolProp"
                      :selectedToolType="selectedToolType"
                      :dragHandler="handlePanning"
                      @reAdjust="reAdjust"
                      :userTime="userTime"
                      :id="tool.id"
                      :tool="tool"
                      :type="tool.type"
                      :x1="tool.x1"
                      :y1="tool.y1"
                      :x2="tool.x2"
                      :y2="tool.y2"
                      :points="tool.points"
                      :deleteTool="deleteTool"
                      :handleIncrease="handleIncrease"
                      :mouseUp="mouseUp"
                      :handleDecrease="handleDecrease"
                      :fontSize="tool.fontSize"
                      :scale="scale"
                      @pos-change="onPosChange"
                      @resetJustMounted="resetJustMounted"
                      :activeToolId="activeToolId"
                      :setActiveToolId="setActiveToolId"
                      :pageNumber="pI + 1"
                      :value="tool.value"
                      :file="file"
                      :justMounted="tool.justMounted"
                      :lineStart="lineStart"
                      :drawingStart="drawingStart"
                      :showPublishModal="showPublishModal"
                      :generatePDF="generatePDF"
                      @toolWrapperBeforeChecked="toolWrapperBeforeChecked"
                      @toolWrapperAfterChecked="toolWrapperAfterChecked"
                      :togglepdfViewScale="togglepdfViewScale"
                      :userId="tool.user"
                      :inputValue="inputValue"
                      :setInitialSignType="setInitialSignType"
                      :parentOffset="parentOffset"
                      :toolDescriptionFunc="toolDescriptionFunc"
                      :calculateScale="calculateScale"
                      :pdfWaterMark="pdfWaterMark"
                    />
                    <!-- </div> -->
                    <pdf-page
                      :handlePanning="handlePanning"
                      :onCLickSinglePageOuter="onCLickSinglePageOuter"
                      :file="file"
                      :page-number="pI + 1"
                      :pdf="pdf"
                      :scale="scale"
                      @setPageHeight="setPageHeight"
                      :initialOrigin="setInitialOrigin"
                      @setPageWidth="onloadPdfquery"
                      :confirmDone="confirmDone"
                      :isCreator="isCreator"
                    />
                  </div>
                </div>
              </div>

              <!-- </pinch-scroll-zoom>  -->
            </pinch-zoom>
            <!-- <button   @click="downloadPdf">download</button> -->
            <button
              class="w-full bg-paperdazgreen-400 py-2 text-white overflow-hidden duration-300"
              v-if="
                ($auth.loggedIn && !isCreator && isConfirmChecked) ||
                ($store.getters?.getFillAsGuest &&
                  !isCreator &&
                  isConfirmChecked)
              "
              id="confirmButtton"
              @click="comfirmedFile"
            >
              Confirm
            </button>
            <div id="bottom"></div>
          </div>
        </main>
      </section>
      <!-- Mobile Page Action -->
      <!-- <div class="flex sm:hidden bg-zinc-200 flex-row-reverse justify-between items-center p-1" v-if="!isSign && !isConfirm"> -->

      <div
        class="flex sm:hidden bg-zinc-200 flex-row-reverse justify-between items-center p-1"
        v-if="!isCreator && isComplete"
      >
        <div class="flex item-center justify-between h-12 px-1 py-0.5 w-full">
          <button
            @click="displayCompleteToolAction"
            :class="[activebottomTool == 1 ? 'z-[100000]' : null]"
            class="action-button_D"
          >
            A
          </button>
          <button @click="scaleIn" class="action-button_A text-[1.4em]">
            +
          </button>
          <button @click="$refs.pinch.toggleZoom()" class="action-button_A">
            <img
              src="@/components/pdf/assets/scale_icon.svg"
              class="w-[1.4em]"
            />
          </button>
          <button @click="scaleOut" class="action-button_A text-[1.6em]">
            -
          </button>
          <button
            @click="displayCompleteToolBar"
            :class="[activebottomTool == 2 ? 'z-[100000]' : null]"
            class="action-button_D"
          >
            T
          </button>
        </div>
      </div>
      <!-- <div v-else class="flex justify-center item-center h-12">
        <span class="flex items-center">{{ currentPage }} / {{ propsNumPages }}</span>
      </div> -->

      <ExistFileManagerModal
        :file="file"
        :tools="tools"
        @confirmExistFileManager="confirmExistFileManager"
        v-model="showExitFileManager"
      />

      <PublishPdfModal
        @startGeneratePdf="startGeneratePdf"
        @successFileFunction="successFileFunction"
        :file="file"
        :tools="tools"
        @trackSubmitTools="trackSubmitTools"
        v-model="showPublishModal"
        :pdfWaterMark="pdfWaterMark"
      />

      <BlockPrivateFile
        :file="file"
        v-model="showBlockPrivate"
        :permissionLoading="permissionLoading"
        v-if="!isCreator"
      />
      <BlockDonotPostFile
        :file="file"
        v-model="showBlockDonotPost"
        v-if="!isCreator"
      />
      <SuccessFileModal :file="file" v-model="showSuccesshModal" />
      <DoneModal :file="file" v-model="showDoneModal" />
      <GuestModal v-model="showGuestModal" />
      <AddToPageText v-model="showAddPageText" :name_type="nameType" />
      <FileManagerUser
        :file="file"
        :comfirmedFile="comfirmedFile"
        v-model="showFilemanagerusernam"
      />
      <TextSaveForMobile
        v-model="showSaveforMopbile"
        :toolDescriptionFunc="toolDescriptionFunc"
        :tools="tools"
        :activeToolId="activeToolId"
      />
      <CompleteToolBarVue
        v-model="showCompleteToolBar"
        @tool-change="onToolChange"
        :selectedToolType="selectedToolType"
        :setInitialSignType="setInitialSignType"
      />
      <CompleteToolAction
        v-model="showCompleteToolAction"
        @tool-change="onToolChange"
        :selectedToolType="selectedToolType"
        :setInitialSignType="setInitialSignType"
        @cancel="canceled = true"
        @publishFileFunction="publishFileFunction"
        @pinchZoomOut="pinchZoomOut"
        @undo="undo"
        @clear="clearAnnotations"
      />
    </div>
  </section>
</template>

<script>
// import demoPdf from '@/assets/pdf/sample.pdf'
import * as pdfJs from 'pdfjs-dist/build/pdf'
import * as worker from 'pdfjs-dist/build/pdf.worker.entry'
// import * as pdfJs from '~/services/build/pdf'
// import * as worker from '~/services/build/pdf.worker'
pdfJs.GlobalWorkerOptions.workerSrc = worker

import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom'
import PinchZoom from 'vue-pinch-zoom'

import jsPDF from 'jspdf'

import PdfPage from '@/components/pdf/PdfPage'
import ToolWrapper from '@/components/pdf/ToolWrapper'
import ToolBar from '@/components/pdf/ToolBar'
// import PdfPageAsideVue from '~/components/pdf/PdfPageAside.vue'

import TOOL_TYPE from '@/components/pdf/data/toolType'
import TOOL_DIRECTION from '@/components/pdf/data/toolDragDirection'

import TextIdentifier from '@/components/pdf/tools_identifiers/Text'
import TickIdentifier from '@/components/pdf/tools_identifiers/Tick'
import CrossIdentifier from '@/components/pdf/tools_identifiers/Cross'
import DotIdentifier from '@/components/pdf/tools_identifiers/Dot'
import CircleIdentifier from '@/components/pdf/tools_identifiers/Circle'
import LineIdentifier from '@/components/pdf/tools_identifiers/Line'
import DrawIdentifier from '@/components/pdf/tools_identifiers/Draw'
import HighlightIdentifier from '@/components/pdf/tools_identifiers/Highlight'
import DateIdentifier from '@/components/pdf/tools_identifiers/Date'
import NameIdentifier from '@/components/pdf/tools_identifiers/Name'
import InitialIdentifier from '@/components/pdf/tools_identifiers/Initial'
import SignatureIdentifier from '@/components/pdf/tools_identifiers/Signature'
import StarIdentifier from '@/components/pdf/tools_identifiers/Star'
import AppendSignature from '~/components/pdf/tools_identifiers/AppendSignature.vue'
import AppendInitial from '~/components/pdf/tools_identifiers/AppendInitial.vue'
import GuestModal from '~/components/pdf/modals/GuestModal.vue'

import moment from 'moment'
import $ from 'jquery'
import PdfRequestModal from '~/components/pdf/modals/PdfRequestModal.vue'
import FileAction from '~/models/FileAction'
import mixins from 'vue-typed-mixins'
import PdfAuth from '~/mixins/PdfAuth'
import { ExtractFormPdf } from '~/types/extractFormPdf'
import TeamAccess from '~/models/TeamAccess'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'
import ExistFileManagerModal from '~/components/pdf/modals/ExistFileManagerModal.vue'
import PublishPdfModal from '../../components/pdf/modals/PublishPdfModal.vue'
import SuccessFileModal from '../../components/pdf/modals/SuccessFileModal.vue'
import DoneModal from '../../components/pdf/modals/DoneModal.vue'
import BlockPrivateFile from '../../components/pdf/modals/BlockPrivateFile.vue'
import FilePrivacy from '~/models/FilePrivacy'
import BlockDonotPostFile from '~/components/pdf/modals/BlockDonotPostFile.vue'
import { mapState } from 'vuex'
import AddToPageDrawOrType from '~/components/modals/AddToPageDrawOrType.vue'
import GlobalMixin from '~/mixins/GlobalMixin'
import AddToPageText from '~/components/modals/AddToPageText.vue'
import { AppendKeypressActionOnInput } from '~/types/AppendKeyPressAction'
import TextSaveForMobile from '~/components/pdf/modals/TextSaveForMobile.vue'
import FileManagerUser from '~/components/modals/FileManagerUser.vue'
import CompleteToolBarVue from '~/components/pdf/modals/CompleteToolBar.vue'
import CompleteToolAction from '~/components/pdf/modals/CompleteToolAction.vue'
import FileDeleted from '~/components/pdf/FileDeleted.vue'

export default mixins(PdfAuth).extend({
  mixins: [GlobalMixin],
  layout: 'pdf',
  name: 'SinglePdfPage',
  auth: false,
  components: {
    PdfPage,
    ToolWrapper,
    ToolBar,
    TextIdentifier,
    TickIdentifier,
    CrossIdentifier,
    DotIdentifier,
    CircleIdentifier,
    LineIdentifier,
    HighlightIdentifier,
    DrawIdentifier,
    DateIdentifier,
    NameIdentifier,
    InitialIdentifier,
    SignatureIdentifier,
    StarIdentifier,
    PdfRequestModal,
    AppendSignature,
    AppendInitial,
    ExistFileManagerModal,
    PublishPdfModal,
    SuccessFileModal,
    BlockPrivateFile,
    BlockDonotPostFile,
    AddToPageDrawOrType,
    DoneModal,
    PinchScrollZoom,
    PinchZoom,
    GuestModal,
    AddToPageText,
    TextSaveForMobile,
    FileManagerUser,
    CompleteToolBarVue,
    CompleteToolAction,
    FileDeleted,
  },
  data: () => ({
    showGuestModal: false,
    pdf: null,
    tools: [],
    selectedToolType: null,
    toolIdentifierPosition: { top: 0, left: 0 },
    showToolIdentifier: false,
    pdfLoading: true,
    signNumber: 1,
    InitialNumber: 1,
    propsNumPages: null,
    setInitialOrigin: 0,
    pageHeight: null,
    currentPage: 1,
    proceedRoute: false,
    pageReachBottom: false,
    setContainerPage: 0,
    setContainerPdfHeight: 0,
    showRequestModal: false,
    saveFunction: '',
    pageGapBetween: 24,
    blockAnnotationRender: false,
    pdfContainerDimension: {},
    showExitFileManager: false,
    nextRoute: null,
    drawingStart: false,
    initialTools: [],
    showPublishModal: false,
    showSuccesshModal: false,
    showDoneModal: false,
    isBottom: false,
    generatePDF: false,
    mouseUp: false,
    mouseDown: false,
    lineStart: false,
    showBlockPrivate: false,
    filePermission: true,
    displayPDF: false,
    showBlockDonotPost: false,
    initialFileAnnotation: [],
    keepErrorCount: 0,
    hasDeleted: false,
    filteredAnnotationButton: [],
    isConfirmChecked: false,

    lastPosX: 0,
    lastPosY: 0,
    isPanning: false,

    selectedToolId: null,

    signature: null,
    initial: null,
    // data populated from asyncData
    file: {},

    scale: 1,
    zoom: 1,
    stack: [],
    undoStack: [],

    activeToolId: null,

    toolId: 0,
    downloadingPdf: false,
    showSaveModal: false,
    signAlaram: {
      top: '0px',
      left: '0px',
    },
    curSignInitialPage: 0,
    openTypeSignModal: false,
    openTypeInitialModal: false,

    canceled: false,
    isResetTools: false,
    completeTools: [],
    signTools: [],
    confirmTools: [],
    isMobile: false,
    saveUser: {},
    width: 0,
    is_equal: true,
    permissionLoading: { type: true, msg: 'checking permission...' },
    showAddPageText: false,
    AllPdfParentPage: [],
    AllPdfParentPageDim: [],
    nameType: '',
    userTime: '',
    showSaveforMopbile: false,
    showFilemanagerusernam: false,
    openSignType: '',
    scaleFactor: 1,
    openAnnotationToolInput: false,
    showCompleteToolBar: false,
    showCompleteToolAction: false,
    activebottomTool: undefined,
    pdfWaterMark: '',
  }),
  created() {
    this.fetchPdf()
    this.$BUS.$on('is-deleted', this.isDeletedFunc)
    this.$BUS.$on('download-pdf', this.downloadPdf)
    this.$BUS.$on('scroll-to-tools', this.scrollToSignInitial)
    this.$BUS.$on('reset-tools', this.resetToolsToDefault)
    this.$BUS.$on('scrollToSignInitial', this.deactivateSignInitial)
    this.$BUS.$on('signature-update', (v) => (this.signature = v))
    this.$BUS.$on('initials-update', (v) => (this.initial = v))
    this.$BUS.$on('addTextToPage', this.addTopagetextFunc)
    this.$BUS.$on('openSaveDiscription', () => (this.showSaveforMopbile = true))
    window.addEventListener('resize', this.resizeHandler)
    this.getUserTime()
  },
  mounted() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.width = window.innerWidth
    this.setIsFromBusinessPage()
    document.addEventListener('keyup', this.keyupHandler)
    window.onresize = () => {
      this.handleScale()
      this.pdfBoundingRect()
    }
    this.checkFilePrivacyOnload()
    this.$store.commit('SET_GUEST_MODAL_FUNCTION', this.showGuestModalFunc)
    if (JSON.parse(localStorage.getItem('isGuest'))?.isGuest)
      localStorage.removeItem('isGuest')
    this.preventZoom()
  },
  destroyed() {
    document.removeEventListener('keyup', this.keyupHandler)
    this.$store.state.pdfExit && this.clearBusinessData()
  },

  beforeDestroy() {
    this.$BUS.$off('download-pdf')
    this.$BUS.$off('signature-update')
    this.$BUS.$off('initials-update')
    this.$BUS.$off('scrollToSignInitial')
    this.$BUS.$off('scroll-to-tools')
    this.$BUS.$off('reset-tools')
    this.$BUS.$off('openSaveDiscription')
    this.$store.commit('SET_EDIT_ANNOTATION', true)
    this.$store.commit('SET_FILE_SIGNATURE', null)
    this.$store.commit('SET_FILE_INITIAL', null)
    this.$store.commit('SET_AGREE_SIGN', -1)
    this.$BUS.$off('addTextToPage')
    window.removeEventListener('resize', this.resizeHandler)
  },
  async asyncData({ $axios, params, error, store }) {
    const file = await $axios
      .$get(`/files/?paperLink=${params.id}`)
      .then((response) => {
        const [file] = response.data
        file.fileAction = file.fileAction || 'complete'
        return file
      })
      .catch((err) => {
        error({
          statusCode: 404,
          message: err.message || FileAction.COMPLETE,
        })
      })

    const user = await $axios
      .$get(`/users/${localStorage.getItem('paperdaz_userID')}`)
      .then((response) => {
        return response
      })
      .catch((err) => {})

    store.commit('SET_FILE', file)
    return { file, user }
  },

  updated() {
    this.handleScale()
    this.file.fileAction == FileAction.COMPLETE &&
      (this.completeTools = this.tools)
    this.file.fileAction == FileAction.SIGNED && (this.signTools = this.tools)
    this.file.fileAction == FileAction.CONFIRM &&
      (this.confirmTools = this.tools)
  },
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

  computed: {
    ...mapState(['pageName']),
    getAllPdfPages() {
      return document.querySelectorAll('.pdf-single-page-outer').length
    },
    FrombusinessPage() {
      return (
        JSON.parse(localStorage.getItem('from_publicpage') || '{}')
          ?.fromBusiness ?? true
      )
    },
    isCreator() {
      if (this.FrombusinessPage == null) return false
      else if (!this.FrombusinessPage && this.$_teamId) {
        return true
      } else if (this.FrombusinessPage) {
        return false
      } else if (
        !this.FrombusinessPage &&
        this.file.userId == this.$auth.user?.id
      ) {
        return true
      } else {
        return false
      }
      // return (
      //   this.file.userId == this.$auth?.user?.id ||
      //   (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
      //     this.$auth?.user?.teamId == this.file.userId)
      // )
    },
    isAgreedSign() {
      return this.$store.state.agreeSign
    },
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    isComplete() {
      return String(this.file.fileAction).toLowerCase() === FileAction.COMPLETE
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED
    },

    TOOL_TYPE() {
      return TOOL_TYPE
    },
    TOOL_DIRECTION() {
      return TOOL_DIRECTION
    },
    TOOL_THRESHOLD() {
      return {
        [TOOL_TYPE.text]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 3 : 12, left: 2 },
        },
        [TOOL_TYPE.tick]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 3, left: 2 },
        },
        [TOOL_TYPE.cross]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 2, left: 3 },
        },
        [TOOL_TYPE.dot]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 2.7, left: 2.7 },
        },
        [TOOL_TYPE.circle]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 5, left: 6 },
        },
        [TOOL_TYPE.line]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 0, left: 0 },
        },
        [TOOL_TYPE.highlight]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 5, left: 0 },
        },
        [TOOL_TYPE.draw]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 0, left: 0 },
        },
        [TOOL_TYPE.date]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 3 : 12, left: 2 },
        },
        [TOOL_TYPE.name]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 12, left: 0 },
        },
        [TOOL_TYPE.initial]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 6, left: 5 },
        },
        [TOOL_TYPE.signature]: {
          identifier: { top: 20, left: 0 },
          tool: { top: 23, left: 0 },
        },
        [TOOL_TYPE.star]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
        [TOOL_TYPE.appendSignature]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: 5 },
        },
        [TOOL_TYPE.appendDate]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
        [TOOL_TYPE.appendInitial]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
        [TOOL_TYPE.appendName]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
        [TOOL_TYPE.appendFirstName]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
        [TOOL_TYPE.appendLastName]: {
          identifier: { top: 20, left: 0 },
          tool: { top: this.isMobile ? 10 : 23, left: this.isMobile ? 5 : 10 },
        },
      }
    },
    selectedTool() {
      this.selectedToolIndex < 0 ? null : this.tools[this.selectedToolIndex]
    },
    isScrollBottom() {
      return this.$store.state.scrollPosition
    },
    panable() {
      return this.lineStart || this.drawingStart
    },
    zoomOptions() {
      return {
        transformOrigin: '0 0',
        transform: `scale(${this.scaleFactor})`,
      }
    },
  },
  methods: {
    calculateScale() {
      return this.$refs.pinch.getScale()
    },
    displayCompleteToolAction() {
      this.showCompleteToolAction
        ? (this.showCompleteToolAction = false)
        : (this.showCompleteToolAction = true)
      this.activebottomTool = 1
    },
    displayCompleteToolBar() {
      this.showCompleteToolBar
        ? (this.showCompleteToolBar = false)
        : (this.showCompleteToolBar = true)
      this.activebottomTool = 2
    },
    getUserTime() {
      fetch('https://worldtimeapi.org/api/ip')
        .then((res) => res.json())
        .then((response) => {
          this.pdfWaterMark = moment(response.datetime).format(
            'MM:DD:YYYY, HH:mm'
          )
          this.userTime = response?.datetime
        })
        .catch(() => {
          const currentDate = new Date()

          // Extract individual date components
          const year = currentDate.getFullYear()
          const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Add 1 to month since it's 0-indexed
          const day = String(currentDate.getDate()).padStart(2, '0')
          const hours = String(currentDate.getHours()).padStart(2, '0');
          const minutes = String(currentDate.getMinutes()).padStart(2, '0');


          // Format the date in "MM/DD/YYYY" format
          const formattedDateTime = `${month}-${day}-${year}, ${hours}:${minutes}`;

          this.pdfWaterMark = formattedDateTime
          this.userTime = formattedDateTime
        })
    },
    clearAnnotations() {
      this.tools = []
      this.completeTools = []
      this.signTools = []
      this.confirmTools = []
    },
    inputValue(val, tool) {
      const index = tool
        ? this.tools.findIndex((v) => v == tool)
        : this.activeToolId
      this.tools[index].value = val
    },
    parentOffset(val, id) {
      let ind = this.tools.findIndex((item) => item.id == id)
      let newTop = this.tools[ind].top + val
      this.tools[ind].top = newTop
      //  this.$forceUpdate()
    },
    addTopagetextFunc(val) {
      this.nameType = val
      this.showAddPageText = true
    },
    scalingHandler(e) {
      //code here..
    },
    pinchZoomOut() {
      // this.$refs.pinch.setScale(1.0)
    },
    resizeHandler() {
      // this.width =  window.innerWidth;
    },
    setIsFromBusinessPage() {
      let getBusinesspage = JSON.parse(
        localStorage.getItem('from_publicpage') || '{}'
      )
      if (getBusinesspage.fromBusiness) {
        this.$store.commit('SET_BUSINESS_PAGE', true)
      } else {
        this.$store.commit('SET_BUSINESS_PAGE', false)
      }
    },
    creatorPublishFile() {
      this.setToinitialScale()
      this.showPublishModal = true
    },
    resetToolsToDefault() {
      switch (this.file.fileAction) {
        case FileAction.COMPLETE:
          this.tools = this.completeTools
          break
        case FileAction.SIGNED:
          this.tools = this.signTools
          break
        case FileAction.CONFIRM:
          this.tools = this.confirmTools
          break
      }
      this.$forceUpdate()
    },
    showGuestModalFunc() {
      this.showGuestModal = !this.showGuestModal
    },
    onMouseDown: function () {
      this.mouseDown = true
      this.mouseUp = false
    },
    onMouseUp: function () {
      this.mouseUp = true
      this.mouseDown = false
      this.isPanning = false
      this.lastPosX = 0
      this.lastPosY = 0
      setTimeout(() => {
        this.drawingStart = false
        this.lineStart = false
        let tool = this.tools.find((t) => t.id == this.selectedToolId)
        switch (this.selectedToolType) {
          case this.TOOL_TYPE.draw:
            if (tool.points) {
              tool.top = Math.min(...tool.points.filter((v, i) => i % 2 == 1))
              tool.left = Math.min(...tool.points.filter((v, i) => i % 2 == 0))
              tool._top = Math.min(...tool.points.filter((v, i) => i % 2 == 1))
              tool._left = Math.min(...tool.points.filter((v, i) => i % 2 == 0))
            }
            break
          case this.TOOL_TYPE.line:
            if (tool.y1 != null && tool.y2 != null) {
              if (tool.y2 < tool.y1) tool._top = tool.y2
              else tool._top = tool.y1
            }
            if (tool.x1 != null && tool.x2 != null) {
              if (tool.x2 < tool.x1) tool._left = tool.x2 + 3
              else tool._left = tool.x1 - 3
            }
            break
          case this.TOOL_TYPE.highlight:
            tool._left = Math.min(tool.x1, tool.x2)
            break
          default:
            return
        }
      }, 50)
    },

    setInitialSignType: function (type) {
      if (type == 'sign') {
        this.openTypeSignModal = true
      } else if (type == 'initials') {
        this.openTypeInitialModal = true
      } else {
        return
      }
      this.openSignType = type
    },

    deactivateSignInitial(type = '') {
      if (this.isCreator || !this.$auth.loggedIn) return

      setTimeout(() => {
        let annotationButton = document.querySelectorAll('.annot-button')
        Array.from(annotationButton).forEach((element) => {
          if (element) element.classList.remove('pulse')
        })

        this.filteredAnnotationButton = Array.from(annotationButton).filter(
          (item, index) => !item.hasAttribute('elemFill')
        )
        if (type == 'mounted' && this.filteredAnnotationButton.length > 0) {
          let signNum = 0,
            initialNum = 0
          this.filteredAnnotationButton.map((val, ind) => {
            let twrap = val.parentElement.parentElement.parentElement
            if (twrap.id.indexOf('sign') > -1) {
              signNum++
            }
            if (twrap.id.indexOf('initial') > -1) {
              initialNum++
            }
          })
          this.signNumber = signNum
          this.InitialNumber = initialNum
        }
      }, 100)
    },

    scrollToSignInitial(type = '') {
      if (type == 'mounted') return
      if (
        this.isCreator ||
        (!this.$auth.loggedIn && !this.$store.getters?.getFillAsGuest)
      )
        return
      if (this.isAgreedSign !== 1 && this.isSign) return

      let annotationButton = document.querySelectorAll('.annot-button')
      Array.from(annotationButton).forEach((element, index) => {
        if (element) element.classList.remove('pulse')
      })
      this.filteredAnnotationButton = Array.from(annotationButton).filter(
        (item, index) => !item.hasAttribute('elemFill')
      )
      // if (this.filteredAnnotationButton.length == 0 && this.isSign && type === "appendsigninitial") {
      //   this.showDoneModal = true;
      // }
      // if (type == 'mounted' && this.filteredAnnotationButton.length > 0) {
      //   let signNum = 0,
      //     initialNum = 0
      //   this.filteredAnnotationButton.map((val, ind) => {
      //     let twrap = val.parentElement.parentElement.parentElement
      //     if (twrap.id.indexOf('sign') > -1) {
      //       signNum++
      //     }
      //     if (twrap.id.indexOf('initial') > -1) {
      //       initialNum++
      //     }
      //   })
      //   this.signNumber = signNum
      //   this.InitialNumber = initialNum
      // }
      if (this.filteredAnnotationButton.length) {
        if (this.isAgreedSign !== 1 && this.isSign) return
        this.filteredAnnotationButton[0].classList.add('pulse')
        window.selem = this.filteredAnnotationButton[0]
        // this.filteredAnnotationButton[0].scrollIntoView({ block: 'center' })
        type !== 'mounted' &&
          !(
            (type === 'appendsign' || type === 'appendinitial') &&
            this.isComplete
          ) &&
          this.filteredAnnotationButton[0].scrollIntoView({ block: 'center' })

        // let toolwrapper =
        //   this.filteredAnnotationButton[0].parentElement.parentElement
        //     .parentElement
        // this.signAlaram.top = toolwrapper.style.top
        // this.curSignInitialPage = toolwrapper.id
        // type === 'appendsign' && this.signNumber--
        // type === 'appendinitial' && this.InitialNumber--
        // this.signAlaram.left = this.filteredAnnotationButton[0].parentElement.parentElement.parentElement.style.left
      }
    },
    isDeletedFunc() {
      this.hasDeleted = true
    },
    showPrivateFunc() {
      if (!this.isCreator) {
        this.displayPDF = false
        this.showBlockPrivate = true
        this.checkUserPermission()
      } else {
        this.displayPDF = true
      }
    },
    showDonotPostFunc() {
      this.displayPDF = true
    },
    confirmDone() {
      this.showDoneModal = true
    },
    checkFilePrivacyOnload() {
      switch (this.file.filePrivacy) {
        case FilePrivacy.PUBLIC:
          this.displayPDF = true
          break
        case FilePrivacy.PRIVATE:
          this.showPrivateFunc()
          break
        case FilePrivacy.DO_NOT_POST:
          this.showDonotPostFunc()
          break
      }
    },
    trackSubmitTools(val) {
      this.initialFileAnnotation = val
    },
    startGeneratePdf(val) {
      this.generatePDF = val
      console.log('val', val)
    },
    comfirmedFile() {
      if (this.isConfirm && !this.$store.getters?.getUserSignature) {
        this.openTypeSignModal = true
      } else if (!this.$store.getters.getAddToPageTextvalue) {
        this.showFilemanagerusernam = true
      } else {
        this.publishFileFunction()
      }
    },
    publishFileFunction() {
      this.setToinitialScale()
      this.scrollToSignInitial()
      if (!this.$store.getters.getAddToPageTextvalue && !this.isCreator) {
        this.comfirmedFile()
        return
      }
      if (this.filteredAnnotationButton.length > 0) {
        this.toggleToast({
          msg: 'Click on sticker displayed before you are done',
          active: true,
        })
        this.scrollToSignInitial()
        return
      }
      this.showPublishModal = true
    },
    showBlockPrivateFunc() {
      this.showBlockPrivate = true
    },
    showBlockDonotPostFunc() {
      this.showBlockPrivate = true
    },
    successFileFunction() {
      // this.showSuccesshModal = true
      this.showDoneModal = true
      this.showPublishModal = false
    },
    checkForPrivateFile() {
      if (this.isPrivate) {
        this.showBlockPrivate = true
      }
    },
    exitFileManager(val) {
      this.is_equal =
        this.file.annotaions == JSON.stringify(this.tools) ||
        JSON.stringify(this.tools) == JSON.stringify(this.initialFileAnnotation)
      if (this.is_equal) {
        this.nextRoute = val
        this.$nuxt.$router.push(val)
      } else this.showExitFileManager = true
    },
    confirmExistFileManager(val) {
      val ? '' : (this.nextRoute = undefined)
      if (!this.nextRoute) return
      this.$nuxt.$router.push(this.nextRoute)
    },
    _scrollToConfirm() {
      if (this.file.fileAction == FileAction.CONFIRM && !this.isCreator) {
        let pdfPage = document.querySelectorAll('.pdf-single-page-outer')

        setTimeout(() => {
          this.isBottom = true
        }, 200 * pdfPage.length)

        $('.pdf-editor-view').animate(
          { scrollTop: $('#bottom').offset().top },
          200
        )
      }
    },
    getALlInput() {
      setTimeout(() => {
        let inputs = $('.pdf-editor-view').find(':input')
        let filterInputs = this.$store.getters.getPdfAnnotations
        Array.from(inputs).forEach(async (element, index) => {
          const elemID =
            element.parentElement.getAttribute('data-annotation-id')
          await element.setAttribute(
            'name',
            filterInputs.find((element) => element.id == elemID)?.fieldName
          )
        })
      }, 2000)
    },
    checkUserPermission() {
      let permissionQuery = this.$route.query?.permissiontoken
      if (!permissionQuery) {
        this.permissionLoading = { type: true, msg: 'permission denied' }
        return
      }
      this.$axios
        .get(`/permissions?permissionUniqueId=${permissionQuery}`)
        .then((response) => {
          if (response.data[0]?.isGranted == 1) {
            this.permissionLoading = { type: false, msg: 'permission granted' }
            this.displayPDF = true
            this.showBlockPrivate = false
          } else {
            this.permissionLoading = { type: true, msg: 'permission denied' }
          }
        })
        .catch(() => {
          this.permissionLoading = { type: true, msg: 'Error Occured' }
        })
    },
    async onloadPdfquery(val) {
      const { user } = this.file
      this.$store.commit('SET_PDF_EXIT', false)
      this._setPdfToolBarCompanyName()

      let parentWidth = document
        .querySelector('.pdf-single-page-outer')
        .getBoundingClientRect().width
      let parentHeight = document
        .querySelector('.pdf-single-page-outer')
        .getBoundingClientRect().height
      this.AllPdfParentPage = Array.from(
        document.querySelectorAll('.pdf-single-page-outer')
      )
      this.AllPdfParentPageDim = this.AllPdfParentPage.map((v) => {
        return {
          width: v.getBoundingClientRect().width,
          height: v.getBoundingClientRect().height,
        }
      })
      this.$store.commit('SET_PDF_DIMENSIONS', { parentWidth, parentHeight })
      let getAllPdfPages = document.querySelectorAll('.pdf-single-page-outer')
      // this._scrollToConfirm()

      let { width, height } = val
      this.pdfContainerDimension = val
      this.setContainerPage = width
      this.setContainerPdfHeight = height

      this.pdfLoading = false

      this.blockAnnotationRender = true

      //scroll to sign or initials button
      setTimeout(() => {
        this.scrollToSignInitial('mounted')
        this.isComplete &&
          !this.isCreator &&
          (this.showFilemanagerusernam = true)
        this.isSign && !this.isCreator && (this.showFilemanagerusernam = true)
        this.keepFirmToPlaceTools()
        this.setToolsFromFileAnnotations()
      }, 1000)
      await this.pdfBoundingRect()
      await this.getALlInput()
      await AppendKeypressActionOnInput(this.togglepdfViewScale)
    },
    setPageHeight(val) {
      this.pageHeight = val
    },
    nextPageHandler() {
      if (this.currentPage <= this.pdf.numPages - 1) {
        document
          .querySelectorAll('.pdf-page')
          [this.currentPage].scrollIntoView(true)
      }
    },
    _setPdfToolBarCompanyName() {
      this.$axios.get(`/users/?id=${this.file.userId}`).then((response) => {
        const company = response.data.data[0]
        this.$store.commit('SET_PDF_PAGE_NAME', {
          name:
            company.companyName || company.firstName + ' ' + company.lastName,
          route: this.file.userId,
        })
      })
    },
    prevPageHandler() {
      if (this.currentPage <= 1) return
      try {
        this.currentPage = this.currentPage - 2
        document
          .querySelectorAll('.pdf-page')
          [this.currentPage].scrollIntoView(true)
      } catch (err) {}
    },
    setToolsFromFileAnnotations() {
      this.tools = JSON.parse(this.file?.annotaions ?? `[]`)
      this.tools = this.tools.map((_el, index) => {
        if (_el.type === 'appendSignature' || _el.type === 'appendInitial')
          return {
            ..._el,
            id: index + 1,
            justMounted: false,
            reAdjust: false,
            // completed: await this.toDataURL(_el.completed),
          }
        else
          return { ..._el, id: index + 1, justMounted: false, reAdjust: false }
      })

      this.initialFileAnnotation = JSON.parse(this.file.annotaions || `[]`).map(
        (_el, index) => {
          return { ..._el, id: index + 1 }
        }
      )
      // console.log({ tools: this.tools, initialFileAnnotation: this.initialFileAnnotation, file: this.file })
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
    setScrollPage() {
      let current =
        Number(
          document.querySelector('.pdf-editor-view').scrollTop -
            (this.currentPage * this.pageGapBetween - this.pageGapBetween)
        ) / Number(document.querySelector('.pdf-page').clientHeight)

      this.currentPage = Math.floor(current) + 1
    },

    sideSetScrollPage(val) {
      this.currentPage = val
      document
        .querySelectorAll('.pdf-page')
        [this.currentPage - 1].scrollIntoView(true)
    },
    setToinitialScale() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer'].getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (curParentWidth > iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },
    togglepdfViewScale(val) {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer']?.getBoundingClientRect().width
      let curParent = this.$refs['pdf-single-pages-outer']
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (val === 'none') {
        this.$refs.pinch.toggleZoom()
        return
      }
      if (curParentWidth == iniParentWidth) {
        // this.$refs.pinch.toggleZoom()
      } else if (curParentWidth > iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },

    scaleOut() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer']?.getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (curParentWidth > iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },
    scaleIn() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer']?.getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      if (curParentWidth == iniParentWidth) {
        this.$refs.pinch.toggleZoom()
      }
    },
    preventZoom() {
      document.addEventListener('gesturestart', function (e) {
        e.preventDefault()
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99
      })

      document.addEventListener('gesturechange', function (e) {
        e.preventDefault()
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99
      })

      document.addEventListener('gestureend', function (e) {
        e.preventDefault()
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99
      })
    },
    keepFirmToPlaceTools(val) {
      let getAllPdfPages = document.querySelectorAll('.pdf-single-page-outer')
      if (
        val == this.TOOL_TYPE.draw ||
        val == this.TOOL_TYPE.highlight ||
        val == this.TOOL_TYPE.line
      ) {
        Array.from(getAllPdfPages).forEach((element) => {
          element.style.setProperty('touch-action', 'auto', 'important')
        })

        Array.from(getAllPdfPages).forEach((element) => {
          element.style.setProperty('touch-action', 'none', 'important')
        })
      } else {
        Array.from(getAllPdfPages).forEach((element) => {
          element.style.setProperty('touch-action', 'auto', 'important')
        })
      }
    },
    isScaleDefault() {
      let curParentWidth =
        this.$refs['pdf-single-pages-outer'].getBoundingClientRect().width
      let iniParentWidth = this.$store.getters.getPdfpagesDim.parentWidth
      return curParentWidth === iniParentWidth
    },
    confirmDocument() {
      this.scrollToSignInitial()

      // if (this.filteredAnnotationButton.length > 0) {
      //   // this.toggleToast({
      //   //   msg: 'Click on sticker displayed before you are done',
      //   //   active: true,
      //   // })
      //   this.scrollToSignInitial()
      //   return
      // }
      this.showPublishModal = true
    },

    toolWrapperBeforeChecked(val) {
      if (val == undefined) return
      this.tools.map((item) => {
        return (item.isChecked = true)
      })
      this.tools[val - 1].isChecked = false
    },
    toolWrapperAfterChecked(val) {
      if (val == undefined) return
      this.tools[val - 1].isChecked = true
    },
    resetJustMounted(val) {
      this.tools[val - 1].justMounted = false
    },
    resetToolProp(val, index) {
      this.tools[index] = { ...this.tools[index], ...val }
    },
    reAdjust(val, id) {
      let index = this.tools.findIndex((tl) => tl.id == id)
      let IND_Page = this.AllPdfParentPageDim[this.tools[index].pageNumber - 1]
      this.tools[index].reAdjust = val
      this.tools[index].justMounted = true
      this.tools[index].parentWidth = IND_Page.width
      this.tools[index].parentHeight = IND_Page.height
    },
    toolDescriptionFunc(val, id) {
      let index = this.tools.findIndex((tl) => tl.id == id ?? this.activeToolId)
      val && (this.tools[index].discription = val)
    },
    keyupHandler(event) {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyZ') {
        this.redo()
      } else if (event.ctrlKey && event.code === 'KeyZ') {
        this.undo()
      } else if (event.ctrlKey && event.code === 'KeyY') {
        this.undo()
      }
    },
    async undo() {
      let lastId = this.stack.pop()
      if (lastId) {
        let index = this.tools.findIndex((t) => t.id == lastId)
        if (index >= 0) {
          this.undoStack.push(lastId)
          this.tools[index].isDeleted = !this.tools[index].isDeleted
          await this.$nextTick()
          this.$forceUpdate()
        }
      }
    },
    redo() {
      let lastId = this.undoStack.pop()
      if (lastId) {
        let index = this.tools.findIndex((t) => t.id == lastId)
        if (index >= 0) {
          this.stack.push(lastId)
          this.tools[index].isDeleted = !this.tools[index].isDeleted
        }
      }
    },
    setActiveToolId(v, tool) {
      this.activeToolId = v
      tool.type == TOOL_TYPE.text && (this.openAnnotationToolInput = true)
      tool.type != TOOL_TYPE.text && (this.openAnnotationToolInput = false)
    },
    onPosChange({ dx, dy, id }) {
      let index = this.tools.findIndex((t) => t.id == id)
      let type = this.tools[index].type
      if (type == this.TOOL_TYPE.line) {
        this.tools[index].x1 -= dx
        this.tools[index].x2 -= dx
        this.tools[index].y1 -= dy
        this.tools[index].y2 -= dy
      } else if (type == this.TOOL_TYPE.highlight) {
        this.tools[index].x1 -= dx
        this.tools[index].x2 -= dx
        this.tools[index].y1 -= dy
        this.tools[index].y2 -= dy
      } else if (type == this.TOOL_TYPE.draw) {
        this.tools[index].points = this.tools[index].points.map((p, i) =>
          i % 2 == 0 ? p - dx : p - dy
        )
      } else {
        this.tools[index].left = dx
        this.tools[index].top = dy
      }
    },
    handleIncrease(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      let tool = this.tools[index]
      if (
        tool.type == this.TOOL_TYPE.text ||
        tool.type == this.TOOL_TYPE.date ||
        tool.type == this.TOOL_TYPE.name
      ) {
        let fontSize = tool.fontSize || 11
        this.tools[index].fontSize = ++fontSize
      } else if (
        tool.type == this.TOOL_TYPE.tick ||
        tool.type == this.TOOL_TYPE.cross ||
        tool.type == this.TOOL_TYPE.dot ||
        tool.type == this.TOOL_TYPE.circle ||
        tool.type == this.TOOL_TYPE.signature ||
        tool.type == this.TOOL_TYPE.star ||
        tool.type == this.TOOL_TYPE.initial
      ) {
        let scale = tool.scale || 1
        scale += 0.1
        this.tools[index].scale = scale
      }
      this.$forceUpdate()
    },
    handleDecrease(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      let tool = this.tools[index]
      if (
        tool.type == this.TOOL_TYPE.text ||
        tool.type == this.TOOL_TYPE.date ||
        tool.type == this.TOOL_TYPE.name
      ) {
        let fontSize = tool.fontSize || 12
        this.tools[index].fontSize = --fontSize
      } else if (
        tool.type == this.TOOL_TYPE.tick ||
        tool.type == this.TOOL_TYPE.cross ||
        tool.type == this.TOOL_TYPE.dot ||
        tool.type == this.TOOL_TYPE.circle ||
        tool.type == this.TOOL_TYPE.signature ||
        tool.type == this.TOOL_TYPE.initial ||
        tool.type == this.TOOL_TYPE.star
      ) {
        let scale = tool.scale || 1
        scale -= 0.1
        this.tools[index].scale = scale
      }
      this.$forceUpdate()
    },
    fillteredTools(pageNumber) {
      return this.tools.filter(
        (t) => !t.isDeleted && t.pageNumber == pageNumber
      )
    },
    async downloadPdfToLocal(source, name) {
      const arrayBuffer = await fetch(source)
      const blob = await arrayBuffer.blob()
      const url = URL.createObjectURL(blob)

      const anchorElement = document.createElement('a')
      anchorElement.href = url
      anchorElement.download = `Papeerdaz-file-${Date.now()}--${name}`
      anchorElement.target = '_blank'

      anchorElement.click()
      anchorElement.remove()
      URL.revokeObjectURL(url)
    },

    async downloadPdf() {
      await htmlToImage
        .toPng(document.querySelector('#sai'))
        .then(function (dataUrl) {})
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
    },
    async deleteTool(id) {
      let index = this.tools.findIndex((t) => t.id == id)
      this.selectedToolId = null
      this.activeToolId = null
      this.stack.push(id)
      this.tools[index].isDeleted = true
      await this.$nextTick()
      this.$forceUpdate()
    },
    async handlePanning(
      event,
      id = undefined,
      direction = undefined,
      pageNumber
    ) {
      // if(!this.mouseDown) return;

      var elem = this.$refs['pdf-single-pages-outer']
      if (!this.isPanning && id == undefined) {
        this.isPanning = true
        this.lastPosX = elem.offsetLeft
        this.lastPosY = elem.offsetTop
        if (this.selectedToolType == this.TOOL_TYPE.line) {
          this.lineStart = true
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
          this.drawingStart = true
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
          this.drawingStart = true
          await this.placeTool(event.srcEvent, pageNumber)
          this.selectedToolId = this.tools[this.tools.length - 1].id
        }
      } else if (id != undefined && this.selectedToolId != id) {
        let index = this.tools.findIndex((t) => t.id == id)
        this.selectedToolId = id
        this.selectedToolType = this.tools[index].type
      }

      const getPointPos = () => {
        let parent = this.$refs[`pdf-single-page-outer-${pageNumber}`]

        if (Array.isArray(parent)) parent = parent[0]
        let { x, y } = this.pointerPos(event.srcEvent, parent)

        if (y < 0) y = 0
        if (y > elem.clientHeight) y = elem.clientHeight
        if (x < 0) x = 0
        if (x > elem.clientWidth) x = elem.clientWidth

        return { x, y }
      }

      let index = this.tools.findIndex((t) => t.id == this.selectedToolId)
      if (this.selectedToolType == this.TOOL_TYPE.line) {
        let { x, y } = getPointPos()
        if (direction && direction == this.TOOL_DIRECTION.left) {
          this.tools[index].x1 = x
          this.tools[index].y1 = y
        } else {
          this.tools[index].x2 = x
          this.tools[index].y2 = y
        }
        this.$forceUpdate()
      } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
        let { x, y } = getPointPos()
        if (direction && direction == this.TOOL_DIRECTION.left) {
          this.tools[index].x1 = x
        } else {
          this.tools[index].x2 = x
        }
        this.tools[index].y2 = this.tools[index].y1 + 15
        this.$forceUpdate()
      } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
        let { x, y } = getPointPos()
        this.tools[index].points = this.tools[index].points.concat([x, y])
        this.$forceUpdate()
      }
      if (event.isFinal) {
        this.isPanning = false
        this.lastPosX = 0
        this.lastPosY = 0
      }
    },
    onMouseEnterOnPages() {
      if (window.innerWidth < 800) return
      this.showToolIdentifier = true
    },
    onMouseLeaveFromPages() {
      if (window.innerWidth < 800) return
      this.showToolIdentifier = false
    },
    onToolChange(type) {
      this.selectedToolType = type
    },
    pointerPos(event, parent) {
      let initialtool = null,
        initialToolId = null

      const elParent =
        parent ||
        event.currentTarget.parentElement ||
        this.$refs.scrollingElement

      let index = this.AllPdfParentPage.findIndex((item) => item == parent)

      event = event || window.event
      const parentElement = elParent
      const rect = parentElement.getBoundingClientRect()
      const zoomLevelW = rect.width / this.AllPdfParentPageDim[index].width // example zoom level
      const zoomLevelH = rect.height / this.AllPdfParentPageDim[index].height // example zoom level
      const x = (event.clientX - rect.left) * zoomLevelW
      const y = (event.clientY - rect.top) * zoomLevelH

      // console.log(`Mouse position relative to zoomed parent element: (${zoomLevelW}, ${zoomLevelH}), indx${index} ofx:${event.offsetX}, ofy:${event.offsetY}, clx:${event.clientX}, cly:${event.clientY}`, parentElement, event.target)

      // const scrollingElement =
      //   parent ||
      //   this.$refs.scrollingElement ||
      //   document.scrollingElement ||
      //   document.body

      // const boundingRect = scrollingElement.getBoundingClientRect()

      //if there is no clientX or there is no clientY on event
      // return 0, 0
      // if (!(event.clientX && event.clientY)) return { x: 0, y: 0 }
      if (!(event.offsetX && event.offsetY)) return { x: 0, y: 0 }

      // cursor relative to the scrollingElement
      // const mouseXRelativeToScrollingElement =
      //   event.clientX - (boundingRect.left || 0)
      // const mouseYRelativeToScrollingElement =
      //   event.clientY - (boundingRect.top || 0)

      // const x =
      //   mouseXRelativeToScrollingElement + (scrollingElement.scrollLeft || 0)
      // const y =
      //   mouseYRelativeToScrollingElement + (scrollingElement.scrollTop || 0)

      // console.log({
      //   x: x / this.scale,
      //   y: y / this.scale,
      //   offX: event.offsetX,
      //   offY: event.offsetY,
      //   scale: this.scale
      // })

      // return { x, y }
      // return { x: x / this.scale, y: y / this.scale }
      return { x: event.offsetX, y: event.offsetY }
    },
    previousPointerPos(event, parent) {
      let eventDoc, doc, body
      event = event || window.event
      let x = 0
      let y = 0
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document
        doc = eventDoc.documentElement
        body = eventDoc.body

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0)
      }

      x = event.pageX
      y = event.pageY - 70

      if (parent) {
        x = x - parent.offsetLeft
        y = y - parent.offsetTop
      }

      let pdfEditorView = document.querySelector('.pdf-editor-view')

      if (pdfEditorView) {
        x += pdfEditorView.scrollLeft
        y += pdfEditorView.scrollTop
      }

      return { x, y }
    },
    onCLickSinglePageOuter(event, pageNumber) {
      // if(!this.selectedToolId){
      //   this.activeToolId = null
      // }
      if (
        !this.selectedToolType ||
        this.selectedToolType == this.TOOL_TYPE.line ||
        this.selectedToolType == this.TOOL_TYPE.highlight ||
        this.selectedToolType == this.TOOL_TYPE.draw
      )
        return
      this.placeTool(event, pageNumber)
      if (
        !(
          this.selectedToolType == this.TOOL_TYPE.line ||
          this.selectedToolType == this.TOOL_TYPE.highlight ||
          this.selectedToolType == this.TOOL_TYPE.draw
        )
      ) {
      }
    },
    placeTool(e, pageNumber, initialPoint) {
      // this.setToinitialScale()
      // if(!this.isScaleDefault()) return
      // this.selectedToolType == this.TOOL_TYPE.text && this.togglepdfViewScale()

      let parent = this.$refs[`pdf-single-page-outer-${pageNumber}`]
      if (Array.isArray(parent)) parent = parent[0]

      let parentWidth = this.AllPdfParentPageDim[pageNumber - 1].width
      let parentHeight = this.AllPdfParentPageDim[pageNumber - 1].height

      let { x, y } = !initialPoint
        ? this.pointerPos(e, parent || this.$refs.scrollingElement)
        : // ? this.pointerPos(e, parent || this.$refs['pdf-single-page-outer'])
          initialPoint

      this.toolId = this.tools?.length
      let obj = {
        parentWidth,
        parentHeight,
        reAdjust: false,
        type: this.TOOL_TYPE[this.selectedToolType],
        top: y - this.TOOL_THRESHOLD[this.selectedToolType].tool.top,
        left: x - this.TOOL_THRESHOLD[this.selectedToolType].tool.left,
        _top: y - this.TOOL_THRESHOLD[this.selectedToolType].tool.top,
        _left: x - this.TOOL_THRESHOLD[this.selectedToolType].tool.left,
        pageScaleX: 1,
        pageScaleY: 1,
        isDeleted: false,
        id: ++this.toolId,
        pageNumber,
        isChecked: true,
        user: this.$auth?.user?.id,
        justMounted: true,
        discription: '',
      }
      if (this.selectedToolType == this.TOOL_TYPE.line) {
        obj.x1 = obj.left
        obj.y1 = obj.top
        delete obj.left
        delete obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
        obj.x1 = obj.left
        obj.y1 = obj.top
        delete obj.left
        delete obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
        obj.points = [obj.left, obj.top]
      } else if (this.selectedToolType == this.TOOL_TYPE.star) {
        obj.points = [obj.left, obj.top]
      } else if (this.selectedToolType == this.TOOL_TYPE.date) {
        obj.value = moment().format('YYYY-MM-DD')
      } else if (this.selectedToolType == this.TOOL_TYPE.signature) {
        obj.value = this.signature
      } else if (this.selectedToolType == this.TOOL_TYPE.initial) {
        obj.value = this.initial
      } else if (this.selectedToolType == this.TOOL_TYPE.appendSignature) {
        obj.x1 = obj.left
        obj.y1 = obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.appendDate) {
        obj.x1 = obj.left
        obj.y1 = obj.top
      } else if (this.selectedToolType == this.TOOL_TYPE.text) {
        obj.value = ''
      }
      this.tools.push(obj)
      this.stack.push(this.toolId)
      this.activeToolId = this.tools.findIndex((v) => v == obj)
      obj.type == TOOL_TYPE.text && (this.openAnnotationToolInput = true)
      obj.type != TOOL_TYPE.text && (this.openAnnotationToolInput = false)
      if (this.selectedToolType == this.TOOL_TYPE.star) {
        this.selectedToolType = undefined
      }
    },
    async handleScale() {
      await this.$nextTick()
      let scrollingElem = this.$refs.scrollingElement
      let pagesOuter = this.$refs.PagesOuter
      if (scrollingElem && pagesOuter) {
        let s = scrollingElem.clientWidth / pagesOuter.clientWidth
        if (s != this.scale) {
          this.scale = s

          this.$forceUpdate()
        }
      }
    },
    pdfBoundingRect() {
      if (!this.pdf) return
      const canvasBoundingRects = []
      for (let i = 0; i < this.propsNumPages; i++) {
        let el = this.$refs[`pdf-single-page-outer-${i + 1}`]
        if (Array.isArray(el)) el = el[0]
        canvasBoundingRects.push({
          pageNumber: i + 1,
          width: el?.offsetWidth || 0,
          height: el?.offsetHeight || 0,
        })
      }
      // this.renderScaledAnnotations(canvasBoundingRects)
    },
    renderScaledAnnotations(canvasBoundingRects) {
      let zoomFactor = this.$refs.pinch.getScale()
      console.log('zoomFactor', zoomFactor)
      this.tools = this.tools.map((tool) => {
        const obj = { ...tool }
        const pdf = canvasBoundingRects.find(
          (val) => val.pageNumber === tool.pageNumber
        )

        // obj.top = obj._top * (pdf.height / obj.pdfHeight) // * 1.08
        // obj.left = obj._left * (pdf.width / obj.pdfWidth) // * 0.95
        // obj.pageScaleX = pdf.width / obj.pdfWidth
        // obj.pageScaleY = pdf.height / obj.pdfHeight

        if (this.selectedToolType == this.TOOL_TYPE.line) {
          obj.x1 = obj.left / zoomFactor
          obj.y1 = obj.top / zoomFactor
          delete obj.left
          delete obj.top
        } else if (this.selectedToolType == this.TOOL_TYPE.highlight) {
          obj.x1 = obj.left / zoomFactor
          obj.y1 = obj.top / zoomFactor
          delete obj.left
          delete obj.top
        } else if (this.selectedToolType == this.TOOL_TYPE.draw) {
          obj.points = [obj.left / zoomFactor, obj.top / zoomFactor]
        } else if (this.selectedToolType == this.TOOL_TYPE.appendSignature) {
          obj.x1 = obj.left / zoomFactor
          obj.y1 = obj.top / zoomFactor
        }

        return obj
      })
    },
    async fetchPdf() {
      this.$store.commit('SET_LOADED_PDF', this.file)
      // let res = await fetch(demoPdf)
      let res = await fetch(this.file.downloadLink).catch((error) => {
        this.$notify.error({
          title: 'Pdf',
          message: error.message || 'Unable to fetch pdf, check connection',
        })
        if (this.keepErrorCount < 2) {
          this.fetchPdf()
          this.keepErrorCount = this.keepErrorCount + 1
        }
      })

      if (!res) return
      let blob = await res.blob()
      let pdfAsDataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })

      let pdfAsArray = this.convertDataURIToBinary(pdfAsDataUri)
      let doc = pdfJs.getDocument(pdfAsArray)
      doc.promise.then(
        (pdf) => {
          this.pdf = pdf
          this.propsNumPages = pdf._pdfInfo.numPages
        },
        (error) => {
          this.$notify.error({
            title: 'Pdf',
            message: error.message || 'Unable to fetch pdf, check connection',
          })
        }
      )
    },
    convertDataURIToBinary(dataURI) {
      console.log('pafdata', dataURI)
      let BASE64_MARKER = ';base64,'
      var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
      var base64 = dataURI.substring(base64Index)
      var raw = window.atob(base64)
      var rawLength = raw.length
      var array = new Uint8Array(new ArrayBuffer(rawLength))

      for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i)
      }
      return array
    },
    scalingHandler(e) {
      // console.log(e)
    },
  },
  watch: {
    selectedToolType(val) {
      // this.setToinitialScale()
      this.keepFirmToPlaceTools(val)
    },
    isConfirmChecked(val) {
      $('.pdf-editor-view').animate(
        { scrollTop: $('.pdf-editor-view')[0].scrollHeight },
        200
      )
      this.isConfirm = true
    },
    setContainerPage: function () {
      // this.$refs.PagesOuter.style.setProperty('width', `${this.setContainerPage + 'px'}`, 'important');
    },
    '$auth.user': function () {
      this.checkFilePrivacyOnload()
      this.fetchPdf()
    },
    pdf(v) {
      this.handleScale()
      this.$nextTick(() => {
        this.pdfBoundingRect()
      })
    },
    filteredAnnotationButton(value, oldValue) {
      if (
        value.length === 0 &&
        oldValue.length > 0 &&
        (this.isSign || this.isComplete)
      ) {
        this.$store.commit('SET_UPLOAD_STATE', false)
        this.saveFunction = 'saved'
        !this.isComplete && this.publishFileFunction()
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.pdfExit == true) {
      localStorage.setItem(
        'from_publicpage',
        JSON.stringify({ fromBusiness: true })
      )
      setTimeout(() => {
        this.$store.commit('RESET_PDF_STATE')
      }, 2000)
      return next(true)
    }
    if (!this.displayPDF) {
      localStorage.setItem(
        'from_publicpage',
        JSON.stringify({ fromBusiness: true })
      )
      this.$store.commit('RESET_PDF_STATE')
      return next(true)
    }
    if (this.isCreator) {
      this.nextRoute
        ? localStorage.setItem(
            'from_publicpage',
            JSON.stringify({ fromBusiness: true })
          )
        : null
      this.$store.commit('RESET_PDF_STATE')
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    } else {
      this.nextRoute
        ? localStorage.setItem(
            'from_publicpage',
            JSON.stringify({ fromBusiness: true })
          )
        : null
      this.$store.commit('RESET_PDF_STATE')
      this.nextRoute ? next(true) : next(false)
      this.exitFileManager(to.fullPath)
      this.nextRoute = to.fullPath
    }
  },
})
</script>

<style lang="scss" scoped>
.pdf-editor-view {
  background-color: #e9e9e9;

  .pdf-pages-outer {
    width: 100%;
    position: relative;
    max-width: 800px;
  }
}

#pdf-page-vue {
  background: #e0e0e0;
}

@media screen and (min-width: 768px) {
  .custom-scrollbar {
    /* Handle */
    &::-webkit-scrollbar {
      width: 20px !important; /* adjust this value to change the width */
      margin: 3px !important;
    }

    &::-webkit-scrollbar-track {
      @apply bg-gray-500;
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb {
      @apply bg-white;
      border-radius: 10px !important;
      border: 5px solid rgb(107 114 128);
    }
  }
}

.transform_origin {
  transform-origin: 0 0;
}
.action-button_D {
  @apply w-[40px] h-[40px] rounded-full bg-paperdazgreen-300 text-white inline-flex justify-center items-center font-[600];
}
.action-button_A {
  @apply w-[40px] h-[40px] rounded-full bg-white inline-flex justify-center items-center font-[300];
}
</style>
