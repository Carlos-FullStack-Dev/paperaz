<template>
  <div class="pdf-page single_pdf_page" ref="PdfPage" >
    <div class="annotationLayer" ref="annotationLayer"></div>
    <canvas  @click="e => onCLickSinglePageOuter(e, pageNumber)" ref="canvas" class="pdf-canvas"></canvas>
  </div>
</template>

<script>
import * as PDFJS from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'
import FileAction from '~/models/FileAction'

export default {
  props: {
    scale: Number,
    pageNumber: Number,
    pdf: Object,
    handlePanning: Function,
    onCLickSinglePageOuter: Function,
    onMouseMoveOnPages: Function,
    setPageHeight: Function,
    setPageWidth: Function,
    file: Object,
    confirmDone: Function,
    isCreator: Boolean
  },
  data: () => ({
    scaleZ: 3,
    currentPage: 1,
    offsetX: 0,
    offsexY: 0
  }),
  mounted() {
    this.getPage()
    let pdfPage = document.getElementsByClassName('pdf-editor-view')[0]
    pdfPage.addEventListener('scroll', this.onScroll)
  },
  computed: {
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    responsiveToolDim() {
      return {
        width: this.$store.getters.getPdfpagesDim.parentWidth / 805,
        height: this.$store.getters.getPdfpagesDim.parentHeight / 1243,
      }
    },
  },
  methods: {
    async getPage() {
      let page = await this.pdf.getPage(this.pageNumber)
      // this.$store.commit('SET_PDF_OFFSET_X', page.view[1])
      this.$store.commit('SET_PDF_OFFSET_X', 0)
      this.$store.commit('SET_PDF_OFFSET_Y', 0)
      // this.$store.commit('SET_PDF_OFFSET_Y', page.view[0])
      this.$store.commit('SET_PDF_OFFSET_W', page.view[2])
      this.$store.commit('SET_PDF_OFFSET_H', page.view[3])

      // this.offsetX = 

      let canvas = this.$refs.canvas

      let context = canvas.getContext('2d')

      // let dpr = window.devicePixelRatio || 1
      // let bsr =
      //   context.webkitBackingStorePixelRatio ||
      //   context.mozBackingStorePixelRatio ||
      //   context.msBackingStorePixelRatio ||
      //   context.oBackingStorePixelRatio ||
      //   context.backingStorePixelRatio ||
      //   1
      // let ratio = dpr / bsr
      // let originalviewport = page.getViewport({ scale: this.scaleZ })
      // var viewport = page.getViewport({
      //   scale: this.$refs.PdfPage.clientWidth / originalviewport.width
      // })
      // viewport = originalviewport
      // canvas.width = viewport.width * ratio
      // canvas.height = viewport.height * ratio
      // this.$emit('setPageHeight', canvas.height)
      // canvas.style.width = '100%'
      // canvas.style.height = '100%'
      // context.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Get the current view


      var viewport = page.getViewport(2.0);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.classList.add('page')


      page.render({
            canvasContext: context,
            viewport: viewport
          }).promise.then(function(){
            console.log('pdf is rendered')
          });



      this.renderAnnotation(page)
      this.$emit('setPageWidth', { width: canvas.width, height: canvas.height })
    },
    async renderAnnotation(page) {
      let annotationLayer = this.$refs.annotationLayer
      let annotations = await page.getAnnotations();
      this.$store.commit('SET_PDF_ANNOTATIONS', annotations)
      var unscaledViewport = page.getViewport({ scale: 1 });

      let v = page.getViewport({ scale: this.$refs.PdfPage.clientWidth / unscaledViewport.width })
      await PDFJS.AnnotationLayer.render({
        viewport: v.clone({ dontFlip: true }),
        div: annotationLayer,
        page,
        annotations: annotations,
        renderInteractiveForms: true
      });
    },
    onScroll() {
      let pdfPage = document.getElementsByClassName('pdf-editor-view')[0]
      if (pdfPage.scrollTop + pdfPage.getBoundingClientRect().height + 5 >= pdfPage.scrollHeight && this.isConfirm) {
        pdfPage.removeEventListener('scroll', this.onScroll)
        this.$store.commit('SET_PDF_PAGE_BOTTOM')
        // !this.isCreator && this.confirmDone();
      }
      // else {
      //   this.$store.commit('SET_NOT_PDF_PAGE_BOTTOM')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

.page{
  width: 100%;
  animation: pageIn 1s ease;
  transition: all 1s ease, width 0.2s ease;
}
.annotationLayer{
  width: 100%;
  height: 100%;
  color: rgb(187, 198, 239)
}
</style>
