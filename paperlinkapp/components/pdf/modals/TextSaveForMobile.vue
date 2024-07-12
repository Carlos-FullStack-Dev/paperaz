<template>
  <el-dialog
    :visible.sync="showModal"
    :appendToBody="true"
    style="padding:0"
    :close-on-click-modal="false"
    :showClose="false"
    center
  >
    <div class="w-full h-full flex justify-center items-center">
      <div
        class="flex items-center rounded-md w-full h-[200px] relative"
      >
        <textarea
          v-model.lazy="discribe"
          contenteditable="true"
          class="note-input outline-none w-full h-full p-2 resize-none rounded-lg"
          placeholder="Type Message here"
        ></textarea>
        <button
        @click="saveDiscription"
          class="ml-1 absolute bottom-[5px] right-[5px] w-10 h-10 bg-paperdazgreen-300 rounded-full flex justify-center items-center text-white" 
        >
          Ok?
      </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import PdfTickIcon from '~/components/svg-icons/PdfTickIcon.vue'

export default Vue.extend({
  name: 'DrawOrTypeModal',
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  components: { PdfTickIcon },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tools: {type: Array},
    activeToolId:{type: Number},
    isCreator: {type: Boolean},
    toolDescriptionFunc: { type: Function}
  },
  data() {
    return {
      showModal: false,
      discribe: ""
    }
  },
  watch: {
    visible(val) {
      // this.$emit("updateVisibility", val)
      this.showModal = val
      let index = this.tools.findIndex((item)=> item.id == this.activeToolId)
      index && (this.discribe = this.tools[index].discription) 
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  computed: {},
  methods: {
    saveDiscription(){
      console.log("::::::::",this.discribe)
      this.toolDescriptionFunc(this.discribe)
      this.closeModal()
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },

  },
})
</script>

<style lang="postcss" scoped>
* >>> .el-dialog {
  width: 600px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
  background: #f6f6f6;
}
* >>> .el-dialog__header {
  padding: 0;
}
.el-dialog__body{
  padding: 0 !important
}
* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
  padding-top: 0;
}

/* * >>> .el-dialog__body { */
/* padding-top: 0 !important;
    padding-bottom: 0 !important; */
/* background: #fcfcfd; */
/* } */

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.tab-container {
  @apply w-full py-2 border-b border-paperdazgreen-400/30 text-center bg-paperdazgreen-300 text-white text-base;
}

.tab-button {
  @apply bg-[#858383]/80 text-white tracking-wider font-medium text-sm flex-1 px-2 py-3 transition  hover:bg-[#858383] border-none relative;
  &:not(:last-child)::after {
    @apply bg-paperdazgreen-400/30;
    content: '';
    position: absolute;
    height: 80%;
    width: 1px;
    top: 50%;
    right: 0;

    transform: translate(50%, -50%);
  }
  &.active {
    @apply text-white bg-paperdazgreen-400/80;
  }
}

.el-dialog--center .el-dialog__body {
   padding: 0px !important; 
}
</style>
