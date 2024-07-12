<template>
  <el-dialog
    :visible.sync="showModal"
    :close-on-click-modal="false"
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
        @click="closeModal(true)"
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
      <h4
        class="text-center font-semibold text-2xl text-gray-800 pb-2"
        v-if="!isCreator && !isConfirm && !isSign"
      >
        All Done?
      </h4>
    </template>
    <!-- Start:: Body -->
    <section v-if="isCreator">
      <div class="flex justify-center pb-2">
        <CheckedFillIcon width="90" />
      </div>
      <!-- <span v-if="!isCreator">Do you want these file to be saved as
        {{ `${(file.fileAction + 'ed').replace('ee', 'e')}` }}?</span> -->
      <span class="w-full text-center block py-0 px-2 pb-8 mb-6 text-[16px] break-normal"
        >Publish file as
        <span class="capitalize">
          {{ file.fileAction + " & " + file.filePrivacy.replace("p", "P") + "?" }}</span
        ></span
      >

      <div class="flex justify-around mt-0">
        <button
          class="h-10 text-xs w-[150px] max-w-[50%] rounded-lg shadow border-[#D9251E] mr-1"
          type="button"
          :disabled="isLoading"
          @click="closeModal(true)"
          :class="
            isConfirm
              ? 'bg-white border-[1px] text-[#D9251E]'
              : 'bg-white border-[1px] text-[#D9251E]'
          "
        >
          {{ isCreator ? "Cancel" : "Back" }}
        </button>
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400 ml-1"
          :disabled="isLoading"
          @click="onSubmit"
        >
          <span class="inline-flex gap-1 items-center">
            Yes
            <spinner-dotted-icon
              v-show="isLoading"
              height="20"
              width="20"
              class="animate-spin"
            />
          </span>
        </button>
      </div>
    </section>

    <section v-if="!isCreator && !isConfirm && !isSign">
      <div v-if="nonUserRecieveEmail">
        <p class="w-full text-center">Enter email for the copy to be sent to</p>
        <input
          v-model="externalGuestEmail"
          type="text"
          class="py-2 w-full rounded my-3 border-[1px] border-gray-200 px-2"
          placeholder="--Enter email--"
        />
        <p class="flex justify-center">
          <button
            class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400 ml-1"
            :disabled="isLoading"
            @click="onSubmit"
          >
            <span class="inline-flex gap-1 items-center">
              Send
              <spinner-dotted-icon
                v-show="isLoading"
                height="20"
                width="20"
                class="animate-spin"
              />
            </span>
          </button>
        </p>
      </div>

      <div class="flex justify-around mt-0" v-if="!nonUserRecieveEmail">
        <button
          class="h-10 text-xs w-[150px] max-w-[50%] rounded-lg shadow border-[#D9251E] mr-1"
          type="button"
          :disabled="isLoading"
          @click="closeModal()"
          :class="
            isConfirm
              ? 'bg-zinc-500 border-[0px] text-white'
              : 'bg-white border-[1px] text-[#D9251E]'
          "
        >
          {{ isCreator ? "Cancel" : "Back" }}
        </button>
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400 ml-1"
          :disabled="isLoading"
          @click="onSubmit"
        >
          <span class="inline-flex gap-1 items-center">
            Yes
            <spinner-dotted-icon
              v-show="isLoading"
              height="20"
              width="20"
              class="animate-spin"
            />
          </span>
        </button>
      </div>

      <div v-if="!nonUserRecieveEmail">
        <span
          v-if="file?.user?.allowCopy"
          class="w-full text-center block py-0 px-2 mb-8 text-[16px] pt-4"
        >
          <input v-model="nonUserRecieveEmail" type="checkbox" /> Click here if you want a
          copy
        </span>
      </div>
    </section>

    <section v-if="!isCreator && (isConfirm || isSign)">
      <form @submit.prevent="onSubmit" v-if="file?.user?.allowCopy">
        <p class="w-full text-center">Enter email for the copy to be sent to</p>
        <input
          v-model="externalGuestEmail"
          type="email"
          required
          class="py-2 w-full rounded my-3 border-[1px] border-gray-200 px-2"
          placeholder="--Enter email--"
        />
        <p class="flex justify-center">
          <button
            class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400 ml-1"
            :disabled="isLoading"
          >
            <span class="inline-flex gap-1 items-center">
              Send
              <spinner-dotted-icon
                v-show="isLoading"
                height="20"
                width="20"
                class="animate-spin"
              />
            </span>
          </button>
        </p>
      </form>

      <div class="flex justify-around mt-0" v-if="!file?.user?.allowCopy">
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[150px] max-w-[50%] text-white rounded-lg shadow bg-paperdazgreen-400 ml-1"
          :disabled="true"
        >
          <span class="inline-flex gap-1 items-center">
            generating
            <spinner-dotted-icon height="20" width="20" class="animate-spin" />
          </span>
        </button>
      </div>
    </section>
    <!-- end :: body -->

    <draw-or-type-modal
      v-model="showInitialModal"
      :src="$auth?.user?.signatureURL || ' '"
      @image-exported="imageExportedLocal($event, true)"
      use-default-button
    />
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import SaveSignatureInitialsMixin from "~/mixins/SaveSignatureInitialsMixin";
import mixins from "vue-typed-mixins";
import { file } from "@babel/types";
import CheckedFillIcon from "../../svg-icons/CheckedFillIcon.vue";
import FileAction from "~/models/FileAction";
import { ExtractFormPdf } from "~/types/extractFormPdf";
import TeamAccess from "~/models/TeamAccess";
import DrawOrTypeModal from "~/components/modals/DrawOrTypeModal.vue";
import AddToPageDrawOrType from "~/components/modals/AddToPageDrawOrType.vue";
import initialURL from "~/assets/img/initials.png";
import signatureURL from "~/assets/img/sign.png";
import moment from "moment"

export default mixins(SaveSignatureInitialsMixin).extend({
  name: "PublishPdfModal",
  components: {
    SpinnerDottedIcon,
    CheckedFillIcon,
    DrawOrTypeModal,
    AddToPageDrawOrType,
  },
  model: {
    prop: "visible",
    event: "updateVisibility",
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    pdfWaterMark: String,
    tools: { type: Array },
    file: { type: Object },
    startGeneratePdf: { type: Function },
    successFileFunction: { type: Function },
    trackSubmitTools: { type: Function },
  },
  computed: {
    dateFormat(){
      return this.$auth?.user?.timezone || 'MM/DD/YYYY, hh:mm'
    },
    curentTime(){
      return moment().format(this.dateFormat).replace(/-/g, '').replace(/:/g, '').replace(/,/g, '')
    },
    waterMark(){
      return  this.pdfWaterMark ? this.pdfWaterMark.replace(/:/g, '').replace(/, /g, '').replace(/-/g, '') :
      this.curentTime
    },
    signature() {
      return this.$auth.user?.signatureURL || signatureURL;
    },
    initial() {
      return this.$auth.user?.initialURL || initialURL;
    },
    pdfOffsetY() {
      return this.$store.state.pdfOffset_y;
    },
    pdfOffsetX() {
      return this.$store.state.pdfOffset_x;
    },
    isSign() {
      return this.file.fileAction == FileAction.SIGNED;
    },
    isConfirm() {
      return String(this.file.fileAction).toLowerCase() === FileAction.CONFIRM;
    },
    isCreator() {
      if (this.$store.getters.getFrombusinessPage) return false;
      else if(this.$_teamId){
         return true
      }
      return (
        this.file.userId == this.$auth?.user?.id ||
        (this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
          this.$auth?.user?.teamId == this.file.userId)
      );
    },
    signLabel() {
      return `${this.waterMark}${
        (this.$store.getters.getAddToPageTextvalue.split(" ")[0].charAt(0) || "")}${
        (this.$store.getters.getAddToPageTextvalue.split(" ")[1].charAt(0) || "")}`
        .toUpperCase().trim()
    },
    confirmAnnotation() {
      return {
        signaturePath:
          this.$store.getters.getUserSignature ?? this.$auth?.user?.signatureURL,
        text: this.signLabel,
        fileAction: this.file?.fileAction,
      };
    }
  },
  data() {
    return {
      showModal: false,
      isLoading: false,
      base64: null,
      proceedToSendEmail: false,
      generatedPdf: {},
      showInitialModal: false,
      nonUserRecieveEmail: false,
      externalGuestEmail: undefined,
      hasBeenPublished: false
    };
  },
  watch: {
    "$store.getters.getAddToPageTextvalue"() {
      if (!this.isConfirm) return;
      else {
        this.showModal = true;
        this.file?.user?.allowCopy ? null : this.onSubmit();
      }
    },
    visible(val) {
      this.showModal = val;
      val && !this.file?.user?.allowCopy && this.isSign && this.$store.getters.getAddToPageTextvalue ? this.onSubmit() : null;
    },
    showModal(val) {
      this.$emit("updateVisibility", val);
      // val &&
      //   this.isSign &&
      //   !this.file?.user?.allowCopy &&
      //   !this.isCreator &&
      //   this.onSubmit();
    },
    "$auth.user": function () {
      this.convertImageToBase64(this.$auth?.user?.signatureURL);
    },
  },
  mounted() {
    this.showModal = this.visible;
  },
  methods: {
    imageExportedLocal(image, isSignature) {
      this.$BUS.$emit("signature-update", image);
      // this.imageExported(image, 'signature-update')
      this.imageExported(image, isSignature);
    },
    confirmCheckedTools() {
      return this.tools.filter((item, index) => item.isChecked == false).length > 0;
    },
    convertToDoubleString(val) {
      return Number(val) < 10 ? `0${val}` : val;
    },
    async convertImageToBase64(src) {
      const response = await fetch(src);
      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64data = reader.result;
        this.base64 = base64data;
      };
    },
    appendConfirmSign() {
      // console.log(
      //   'appendConfirmSign',
      //   ExtractFormPdf({
      //     downloadLink: this.file.downloadLink,
      //     file: this.confirmAnnotation,
      //     pdfOffset_y: this.pdfOffsetY,
      //     pdfOffset_x: this.pdfOffsetX,
      //   })
      // )
    },
    confirmAllSignAndInitials() {
      if (this.$auth?.user?.id == this.file?.userId) return true;
      else
        return (
          ExtractFormPdf(this.file?.downloadLink)[0].data.filter(
            (item) => item.hasOwnProperty("uploaded") && item.uploaded == null
          ).length < 1
        );
    },
 
    allowLoadingAllAnnotations(ms) {
      return new Promise((resolve) => {
        setTimeout(function () {
          resolve();
        }, ms);
      });
    },
    async publishAsGuest() {
      if(this.hasBeenPublished) return
      const extractedPdfData = {
        ...ExtractFormPdf({
          downloadLink: this.file?.downloadLink,
          file: this.confirmAnnotation,
          pdfOffset_y: 0,
          pdfOffset_x: 0,
          signLabel: this.signLabel,
        })[0],
      };
      const payload = {
        data: JSON.stringify(extractedPdfData.data),
        pdfHeight: extractedPdfData.pdfHeight,
        pdfWidth: extractedPdfData.pdfHeight,
        pdf_url: extractedPdfData.pdf_url,
        fileName: this.file?.fileName,
        action: this.file?.fileAction,
        fileId: this.file?.id,
        fileOwnerId: this.file?.userId,
        fileOwner: 0,
        isGuest: true,
        userId: this.$auth?.user?.id ?? this.file.userId,
        guestName: this.$store.getters.getAddToPageTextvalue,
        fileOwnerEmail: this.file?.user?.email,
        guestEmail: this.externalGuestEmail,
      };
      this.$axios
        .post("/handle-file-que", payload)
        .then(() => {
          this.$store.commit("SET_PDF_EXIT", true);
          this.toggleToast({
            active: true,
            msg: `Thank you for ${this.file.fileAction.replace(
              "te",
              "t"
            )}ing a Paperlink!`,
            msg_mobile: "Thank You",
            delay: 2000,
          });
          this.$auth.loggedIn && this.isCreator
            ? this.$nuxt.$router.push("/paperlink-pages")
            : this.$nuxt.$router.push(`/${this.file?.user?.businessPage}`);
        })
        .catch((error) => {
          this.$notify.error({
            title: "Request",
            message: "Request Failed",
          });
        })
        .finally(() => {
          this.closeModal();
          this.isLoading = false;
          this.proceedToSendEmail = false;
        });

        this.hasBeenPublished = true
    },
    publishAsCreator() {
      let filteredTools = this.tools.filter((e) => e.isDeleted != true);

      if(this.hasBeenPublished) return

      this.$axios
        .patch(`/files/${this.file?.id}`, {
          fileAction: this.file?.fileAction,
          annotaions: JSON.stringify(filteredTools),
          filePrivacy: this.file?.filePrivacy,
        })
        .then(() => {
          this.$notify.success({
            message: "File published successfully",
          });
          this.closeModal();
          this.$store.commit("SET_PDF_EXIT", true);
          this.$nuxt.$router.push("/paperlink-pages");
        })
        .catch(() => {
          this.$notify.error({
            message: "Error occcured, could not save file",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
        this.hasBeenPublished = true
    },
    closeModal(val) {
      this.$emit("updateVisibility", false);
      if((!this.nonUserRecieveEmail || this.isSign) && !this.isCreator)  this.onSubmit()
      else if((this.nonUserRecieveEmail || this.isConfirm) && !this.isCreator)  this.onSubmit()
    },
    successAction() {
      this.$emit("successFileFunction");
      this.closeModal();
    },
    onSubmit() {
      if (!this.confirmAllSignAndInitials()) {
        this.$notify.error({
          message: "Input all signs and initial to save",
        });
        return;
      }
      if (
        !this.isCreator &&
        !this.$auth.user?.signatureURL &&
        !this.$store.getters.getUserSignature &&
        this.file?.fileAction == FileAction.CONFIRM
      ) {
        this.showInitialModal = true;
        return;
      }
      this.$emit("startGeneratePdf", true);
      this.appendConfirmSign();
      this.isLoading = true;
      // this.proceedToSendEmail = false
      if (!this.isCreator) {
        this.$notify.info({
          message: "Pdf generating.....",
          duration: 1000 * 2,
        });
        this.allowLoadingAllAnnotations(500).then(() => {
          this.publishAsGuest();
          this.$emit("startGeneratePdf", false);
        });
      } else {
        this.publishAsCreator();
      }
      this.$emit("trackSubmitTools", this.tools);
    },
  },
});
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
