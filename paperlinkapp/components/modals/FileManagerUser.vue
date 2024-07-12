<template>
    <el-dialog
      v-if="v_show"
      :visible.sync="showModal"
      :appendToBody="true"
      style=""
      :close-on-click-modal="false"
      :showClose="false"
      center
    >
      <template #title>
        <div class="tab-container">
           <button v-if="isConfirm" class="mx-3"><img class="w-6" @click="closeModal" src="@/assets/img/Arrow-back.svg"/></button>
           <span class="flex w-full justify-center">{{ isConfirm ? 'Done?' : 'Type Name of person on file' }} </span>
           <button @click="exitFileManager" class="mr-2">&#x2715;</button>
        </div>
      </template>
  
      <!-- Body -->
      <transition mode="out-in" name="fade" :duration="200">
        <div class="w-full text-center" key="updating">
          <p v-if="isConfirm" class="w-full text-center">If so, type Name of person on file</p>
            <input
            type="text"
            ref="inputElement"
            placeholder="First Name "
            v-model="firstNameValue"
            id="pdf-signature-type-input-box"
            class="w-11/12 bg-white border-b-0 border-paperdazgreen-400 cursor-text mt-2 py-[10px] px-2 rounded outline-none text-base caret-paperdazgreen-400 "
          />
          <input
          type="text"
          ref="inputElement"
          placeholder="Last Name"
          v-model="lastNameValue"
          id="pdf-signature-type-input-box"
          class="w-11/12 bg-white border-b-0 border-paperdazgreen-400 cursor-text mt-2 py-[10px] px-2 rounded outline-none text-base  caret-paperdazgreen-400 "
        />
        </div>
      </transition>
      <!-- End:: Body -->
  
      <!-- Start:: Footer section -->
      <template #footer>
        <div class="flex items-center justify-center gap-4">
  
          <div class="flex items-center justify-end gap-4">
            <button
              class="h-9 rounded border border-gray-100 bg-paperdazgreen-300 text-base text-white px-8 hover:shadow-md"
              @click="exportText"
              :class="[isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer']"
            >
              SAVE
            </button>
          </div>
        </div>
      </template>
      <!-- End:: Footer section -->
      <!-- End:: Body -->
    </el-dialog>
  </template>
  
  <script>
  import Vue from 'vue'
  import SignatureDrawBodyTab from './pdfsignature/SignatureDrawBodyTab.vue'
  import SignatureTypeBodyTabVue from './pdfsignature/SignatureTypeBodyTab.vue'
  import FileAction from '~/models/FileAction'


  export default Vue.extend({
    name: 'DrawOrTypeModal',
    model: {
      prop: 'visible',
      event: 'updateVisibility',
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
       file: { type: Object},
       comfirmedFile: { type: Function}
    },
    data() {
      return {
        v_show: true,
        showModal: false,
        firstNameValue: "",
        lastNameValue: "",
        activeTab: 'draw',
        tabs: [
          {
            label: 'Draw',
            value: 'draw',
            component: SignatureDrawBodyTab,
          },
          {
            label: 'Type',
            value: 'type',
            component: SignatureTypeBodyTabVue,
          },
        ],
      }
    },
    watch: {
    "$store.getters.getUserSignature"(){
       if(!this.isConfirm) return
       else {
        this.showModal = true
      //  this.file?.user?.allowCopy ? null : this.onSubmit()
       }
    },
      visible(val) {
        // this.$emit("updateVisibility", val)
        this.showModal = val
      },
      showModal(val) {
        this.$emit('updateVisibility', val)
      },
    },
    mounted() {
      this.showModal = this.visible
    },
    computed: {
      isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM
    },
    isDisabled(){
      return (!this.lastNameValue.length || !this.firstNameValue.length)
    }
    },
    methods: {
      closeModal() {
        this.$emit('updateVisibility', false)
      },
      exitFileManager(){
        this.$store.commit('SET_PDF_EXIT', true)
        this.$nuxt.$router.go(-1)
      },
      clear() {
        this.textValue = "";
        this.$refs.inputElement.focus()
      },
      exportText(){
        if(this.isDisabled) return
        this.$store.commit("SET_SAVE_PAGE_TEXT_VALUE", { text: this.lastNameValue, type: 'last_name'})
        this.$store.commit("SET_SAVE_PAGE_TEXT_VALUE", { text: this.firstNameValue, type: 'first_name'})
        this.$store.commit("SET_SAVE_PAGE_TEXT_VALUE", { text: `${this.firstNameValue} ${this.lastNameValue}`, type: 'name'})
        this.closeModal()
        this.isConfirm && this.comfirmedFile()
        this.v_show = false
      }
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
    @apply w-full py-2 border-b border-paperdazgreen-400/30 text-center bg-paperdazgreen-300 text-white text-base flex items-center;
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
  </style>
  