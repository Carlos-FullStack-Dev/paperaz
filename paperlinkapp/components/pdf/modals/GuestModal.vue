<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <template #title>
      <span class="text-center font-semibold text-xl w-full block">Select</span>
    </template>
    <!-- Start:: Body -->
    <div class="text-center pb-2">
      <button
        @click="routeToLogin"
        class="block w-full border-2 my-2 bg-white border-gray-200 rounded-md py-2 text-paperdazgreen-500"
      >
        Login
      </button>
      <button
        @click="functionASGuest"
        class="block w-full border-1 mt-4 bg-paperdazgreen-400 border-gray-400 rounded-md py-2 text-white"
      >
        Guest
      </button>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import CheckedFillIcon from '../../svg-icons/CheckedFillIcon.vue'

export default Vue.extend({
  name: 'SuccessFileModal',
  components: { SpinnerDottedIcon, CheckedFillIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    file: { type: Object },
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      newSaveData: {},
      // file: {},
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
    functionASGuest() {
      this.$store.commit('SET_FILL_AS_GUEST', true)
      this.closeModal()
    },
    routeToLogin() {
      this.$store.commit('SET_PDF_EXIT', true)
      this.$nuxt.$router.push('/login')
      localStorage.setItem(
        'isGuest',
        JSON.stringify({ isGuest: true, path: this.$route.fullPath })
      )
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
