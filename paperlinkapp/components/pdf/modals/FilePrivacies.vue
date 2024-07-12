<template>
    <el-dialog
      :visible.sync="showModal"
      :append-to-body="true"
      style=""
      :show-close="false"
      center
      class="relative text-[#414042]"
    >
      <!-- Start:: Body -->
   
      <div class="">
        <button @click="setFilePrivacy('public')" class="flex items-center gap-5 justify-center icon_action w-full py-3 rounded-lg">
          <abbr class="mr-3 w-7">
            <PublicIcon /></abbr>  
          <span class="w-20 text-left	">Public</span>
          
      </button>

         <button @click="setFilePrivacy('private')" class="flex items-center gap-5 justify-center icon_action w-full py-3 rounded-lg">
          <abbr class="mr-3 w-7">
            <PrivateIcon /></abbr>  
            <span class="w-20 text-left	">Private</span>
          </button>

          <button @click="setFilePrivacy('doNotPost')" class="flex items-center gap-5 justify-center icon_action w-full py-3 rounded-lg">
            <abbr class="mr-3 w-7">
              <DoNotPost /></abbr>  
          <span class="w-20 text-left	">Do Not Post</span>

          </button>
      </div>
      <!-- end :: body -->
    </el-dialog>
  </template>
  
  <script>
  import Vue from 'vue'
  import PublicIcon from "../assets/PublicIcon.vue"
  import PrivateIcon from "../assets/PrivateIcon.vue"
  import DoNotPost from "../assets/DoNotPosticon.vue"

  export default Vue.extend({
    name: 'AlertModal',
    model: {
      prop: 'visible',
      event: 'updateVisibility',
    },
    components: {PublicIcon, PrivateIcon, DoNotPost },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      handleAccessChange: {type: Function}
    },
    data() {
      return {
        showModal: false,
        errorMessage: '',
        loading: false,
        newSaveData: {},
        sendAction: null,
      }
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
     setFilePrivacy(val){
       this.handleAccessChange(val)
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
    width: 416px !important;
    max-width: 95% !important;
    border-radius: 20px !important;
    border-radius: 8px !important;
    position: relative !important;
    overflow: hidden;
  }
  * >>> .el-dialog__header {
    padding-bottom: 20px;
  }
  
  * >>> .el-dialog__header,
  * >>> .el-dialog__footer {
    text-align: left !important;
  }
  
  * >>> .el-dialog__body {
    /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
    background: #fcfcfd;
  }
  
  * >>> .el-select .el-input__inner {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  </style>
  