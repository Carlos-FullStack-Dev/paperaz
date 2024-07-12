<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    width="100%"
    top="100vh"
    custom-class="-translate-y-full sm:hidden bottom-sm-modal bg-transparent"
    class="bottom-0 overflow-hidden sm:hidden"
  >
    <!-- Start:: Body -->
    <div class="">
      <div class="flex flex-wrap justify-between mb-[9rem]">
        <button
          class="tools"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          class="tools"
          @click="undo"
        >
          <img src="../../svg-icons/UndoIcon.svg" class="w-[15px] mr-2" />
          Undo
        </button>
        <button
          class="tools"
          @click="clear"
        >
          Clear
        </button>
        <button
          class="tools"
          @click="saveChanges"
        >
          Done
        </button>
      </div>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import PdfTickIcon from '../../svg-icons/PdfTickIcon.vue'
import PdfTimesIcon from '../../svg-icons/PdfTimesIcon.vue'
import SolidCircleIcon from '../../svg-icons/SolidCircleIcon.vue'
import PdfTextToolIcon from '../../svg-icons/PdfTextToolIcon.vue'
import PdfPenToolIcon from '../../svg-icons/PdfPenToolIcon.vue'
import CalendarIcon from '../../svg-icons/CalendarIcon.vue'
import TOOL_TYPE from '../data/toolType'

export default Vue.extend({
  name: 'AlertModal',
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  components: {
    PdfTickIcon,
    PdfTimesIcon,
    SolidCircleIcon,
    PdfTextToolIcon,
    PdfPenToolIcon,
    CalendarIcon,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedToolType: {},
    setInitialSignType: Function,
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    TOOL_TYPE() {
      return TOOL_TYPE
    },
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    undo() {
      this.$emit('undo')
      this.$forceUpdate()
      this.closeModal()
    },
    clear(){
      this.$emit('clear')
      this.closeModal()
    },
    cancel() {
      this.$emit('cancel')
      this.closeModal()
    },
    saveChanges() {
      this.$emit('pinchZoomOut')
      this.$store.commit('SET_UPLOAD_STATE', false)
      this.$emit('publishFileFunction')
      this.closeModal()
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 100% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 0px;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  /* padding-top: 0 !important;
      padding-bottom: 0 !important; */
  background: transparent;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.tools {
  @apply flex items-center bg-white px-3 py-1 rounded-md mx-2 my-2;
}
.active {
  @apply bg-paperdazgreen-300 text-white;
}
</style>
