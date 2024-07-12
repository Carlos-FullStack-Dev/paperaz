<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit">
      <span
        class="circle circle-12 bg-white cursor-pointer text-red-600"
        @click="closeModal()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042"
          />
        </svg>
      </span>
    </div>
    <!--End:: Close Button -->
    <template #title>
      <h4 class="text-center font-semibold text-xl">QR-Code</h4>
    </template>
    <!-- Start:: Body -->
    <div class="flex justify-center">
      <QRCodeGenerator ref="childRef" :url="link" />
      <!-- <canvas ref="qrcancas" width="200" height="200" class="object-contain"></canvas> -->
    </div>

    <div class="flex justify-around pt-2">
      <button
        class="h-10 text-[0.5rem] xxs:text-[0.58rem] sm:text-xs mr-4 flex-1 px-2 shadow-md text-white rounded-xl bg-paperdazgreen-400 flex justify-center items-center mt-3"
        @click="copylink"
      >
        Copy QR-Code
      </button>

      <button
        class="h-10 text-[0.5rem] xxs:text-[0.58rem] sm:text-xs flex-1 px-2 shadow-md text-white rounded-xl bg-paperdazgreen-400 flex justify-center items-center mt-3"
        @click="downloadQRCode"
      >
        Download QR-Code
      </button>
    </div>

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import QRCode from "qrcode";
import DocumentIcon from "~/components/svg-icons/DocumentIcon.vue";
import DownloadIconNew from "../../svg-icons/DownloadIconNew.vue";
import QRCodeGenerator from "~/components/QRCodeGenerator.vue";

export default Vue.extend({
  name: "edit-company-folder",
  components: { DocumentIcon, DownloadIconNew, QRCodeGenerator },

  model: {
    prop: "visible",
    event: "updateVisibility",
  },
  props: {
    packagename: {},
    userFile: {},
    link: {},
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      fileInfo: {},
    };
  },
  watch: {
    visible(val) {
      this.showModal = val;
      // setTimeout(() => {
      //   this.generateQR();
      // }, 500);
    },
    showModal(val) {
      this.$emit("updateVisibility", val);
    },
    userFile: function () {
      this.fileInfo = this.userFile;
    },
  },
  mounted() {
    this.showModal = this.visible;
  },
  methods: {
    copylink() {
      navigator.clipboard.writeText(this.link);
      this.$notify.success({
        message: "QR-Code copied successfully",
      });
    },
    downloadQRCode() {
      return this.$refs.childRef.childFunction();
    },

    closeModal() {
      this.$emit("updateVisibility", false);
    },
  },
});
</script>

<style scoped>
.color-white {
  fill: white !important;
}
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
