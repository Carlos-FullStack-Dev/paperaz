<template>
  <div
    class="bg-paperdazgreen-300/70 sm:bg-transparent py-2 flex items-center lg:px-0 px-2 text-black justify-between w-[104%]"
  >
    <div class="flex items-center gap-lg-4 flex-1 justify-between flex-wrap">
      <!-- If authenticated user is created -->
      <span v-if="!isCreator" class="hidden md:inline capitalize font-medium">{{
        file.fileAction
      }}</span>
      <!-- else -->
      <div v-else>
        <el-dropdown
          v-if="!isMobile"
          trigger="click"
          class="hidden md:flex font-medium"
          @command="handleActionChange"
        >
          <span class="el-dropdown-link capitalize">
            {{ file.fileAction }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="complete" :disabled="file.fileAction == 'complete'"
              >Complete</el-dropdown-item
            >
            <el-dropdown-item command="confirm" :disabled="file.fileAction == 'confirm'">
              Confirm</el-dropdown-item
            >
            <el-dropdown-item command="sign" :disabled="file.fileAction == 'sign'"
              >Sign
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- If authenticated user is created -->
      <span v-if="!isCreator" class="hidden md:inline capitalize font-medium">{{
        access
      }}</span>

      <!-- -- the content below is v-else if previous is v-if - -->
      <div v-else>
        <!-- <span @click="showFilePrivacies = true" v-if="isMobile" class="el-dropdown-link capitalize">
          {{ access }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span> -->
        <el-dropdown
          v-if="!isMobile"
          trigger="click"
          class="font-medium flex"
          @command="handleAccessChange"
        >
          <span class="el-dropdown-link capitalize">
            {{ access }} <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="private">Private</el-dropdown-item>
            <el-dropdown-item command="public">Public</el-dropdown-item>
            <el-dropdown-item command="doNotPost">Do-not-post</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div
        class="flex-1 flex items-center gap-5 justify-end text-xs font-medium"
      > -->

      <span class="font-normal md:max-w-[30%] max-w-[calc(100%-100px)] truncate text-[14px]">
        {{ file?.fileName.replace(".pdf", "") ?? "" }}
      </span>

      <div class="flex items-center md:hidden" v-if="isCreator">
        <span
          class="w-8 h-8 inline-flex justify-center items-center rounded-full bg-white mr-2"
          @click="showFilePrivacies = true"
          ><img src="./assets/eye_icon.svg"
        /></span>
        <span
          class="w-8 h-8 inline-flex justify-center items-center rounded-full bg-white"
          @click="showFileFunctions = true"
          >
          <img src="./assets/action_icon.svg"/>
          </span
        >
      </div>


      <div class="flex items-center sm:hidden" v-if="!isCreator">
        <span class="cursor-pointer" @click="showPdfInfo = true">
          <img :src="require('~/assets/icons/info-circle.svg')" />
        </span>

        <span 
        v-if="file.fileAction != 'complete'"
        class="cursor-pointer h-full px-[6px] bg-red-600 text-white ml-2" @click="cancelPublish">
          &#x2715;
        </span>
      </div>
    </div>

    <!-- <div class="hidden sm:flex items-center justify-end pe-lg-4" v-if="$auth.loggedIn && !isSign"> -->
    <div class="hidden sm:flex items-center justify-end lg:pl-6">
      <button
        v-if="($auth.loggedIn || $store.getters?.getFillAsGuest) && isCreator && !isFileActionConfirm"
        :disabled="!canClear"
        @click="clearAnnotations"
        class="mr-2 text-xs text-white bg-paperdazgreen-400 rounded px-3 h-7 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Clear
      </button>
      <button
        v-if="($auth.loggedIn || $store.getters?.getFillAsGuest) && isCreator"
        @click="saveChanges"
        class="mr-2 text-xs text-white bg-paperdazgreen-400 rounded px-3 h-7 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Publish
      </button>
      <button
        v-if="
          (($auth.loggedIn || $store.getters?.getFillAsGuest) &&
            !isCreator &&
            !isConfirm &&
            !isSign) ||
          ($store.getters.getUserSignature && isConfirm)
        "
        @click="saveChanges"
        class="mr-2 text-xs text-white bg-paperdazgreen-400 rounded px-3 h-7 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Done
      </button>

      <button
        @click="cancelPublish"
        class="text-xs text-red-500 bg-white border rounded px-3 h-7 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>

    <ShareFilesModal
      :pdfContainerDimension="pdfContainerDimension"
      :userFile="file"
      v-model="showShareCompanyFiles"
      @qrLoad="showQrcodeFileFunc"
    />
    <RequestModal
      :pdfContainerDimension="pdfContainerDimension"
      :userFile="file"
      v-model="showRequestModal"
    />
    <pdf-c-c-flow-modal :file="file" v-model="showCCFlowModal" />
    <pdf-papertags-modal :file="file" v-model="showPapertagsModal" />
    <!-- <save-pdf-modal :pdfContainerDimension="pdfContainerDimension" :sendAction="saveFunction" :file="file" v-model="showSaveModal" /> -->
    <QrcodeShare :userFile="file" v-model="showQrcodeFiles" />

    <RemoveFileModal :fileId="file.id" v-model="showRemoveModal" />

    <AddToPageDrawOrType
      :src="$auth?.user?.initialURL || ' '"
      @image-exported="imageExportedLocal($event, false)"
      use-default-button
    />

    <FileActions :handleActionChange="handleActionChange" v-model="showFileFunctions" />
    <FilePrivacies :handleAccessChange="handleAccessChange" v-model="showFilePrivacies" />
    <!-- v-model="showInitialModal" -->

    <el-dialog
      :visible.sync="showPdfInfo"
      :append-to-body="true"
      :show-close="false"
      center
      width="100%"
      top="100vh"
      custom-class="-translate-y-full sm:hidden bottom-sm-modal"
      class="bottom-0 overflow-hidden sm:hidden"
    >
      <div class="w-full flex flex-col p-0 -mt-8 -mb-4">
        <div class="border-b flex items-center justify-between py-2">
          <span class="font-bold">Action</span>
          <span class="capitalize">{{ file.fileAction }}</span>
        </div>
        <div class="border-b flex items-center justify-between py-2">
          <span class="font-bold">Privacy</span>
          <span class="capitalize">{{ access }}</span>
        </div>
        <div class="border-b flex items-center justify-between py-2">
          <span class="font-bold">Business</span>
          <span class="">{{ businessName }}</span>
        </div>
        <div class="border-b flex items-center justify-between py-2">
          <span class="font-bold">Date</span>
          <span class="">{{ (file.updatedAt || "").substring(0, 10) }}</span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="font-bold">Time</span>
          <span class="">{{ (file.updatedAt || "").substring(11, 16) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import EllipsisIconVerticalIcon from "../svg-icons/EllipsisIconVerticalIcon.vue";
import ExportIcon from "../svg-icons/ExportIcon.vue";
import _ from "lodash";
import ShareIcon from "../svg-icons/ShareIcon.vue";
import RequestIcon from "../svg-icons/RequestIcon.vue";
import CopyIcon from "../svg-icons/CopyIcon.vue";
import TrashCanSolidIcon from "../svg-icons/TrashCanSolidIcon.vue";
import TrashCanIcon from "../svg-icons/TrashCanIcon.vue";
import PdfShareModal from "./modals/PdfShareModal.vue";
import PdfCCFlowModal from "./modals/PdfCCFlowModal.vue";
import PdfPapertagsModal from "./modals/PdfPapertagsModal.vue";
import AuthUser from "~/models/AuthUser";
import UserTypeEnum from "~/models/UserTypeEnum";
import ShareFilesModal from "../company-files/Tabs/ShareFilesModal.vue";
import RequestModal from "../company-files/Tabs/RequestModal.vue";
import QrcodeShare from "../company-files/Tabs/QrcodeShare.vue";
import TeamAccess from "~/models/TeamAccess";
import PublishPdfModal from "./modals/PublishPdfModal.vue";
import FilePrivacy from "~/models/FilePrivacy";
import FileAction from "~/models/FileAction";
import RemoveFileModal from "./modals/RemoveFileModal.vue";
import AddToPageDrawOrType from "../modals/AddToPageDrawOrType.vue";
import { mapState, mapActions } from "vuex";
import { isMobile } from "mobile-device-detect";
import FileActions from "./modals/FileActions.vue";
import FilePrivacies from "./modals/FilePrivacies.vue";

export default Vue.extend({
  components: {
    EllipsisIconVerticalIcon,
    ExportIcon,
    ShareIcon,
    RequestIcon,
    CopyIcon,
    TrashCanSolidIcon,
    TrashCanIcon,
    PdfShareModal,
    PdfCCFlowModal,
    PdfPapertagsModal,
    ShareFilesModal,
    RequestModal,
    QrcodeShare,
    PublishPdfModal,
    RemoveFileModal,
    AddToPageDrawOrType,
    FileActions,
    FilePrivacies,
  },
  beforeMount() {
    // if(!this.$auth.loggedIn){
    //   this.$nuxt.$router.push("/login")
    // }
  },
  name: "PdfPageActionTray",
  props: {
    file: { type: Object, required: true },
    pdfContainerDimension: { type: Object },
    tools: { type: Array },
    successFileFunction: { type: Function },
    isDeletedFunc: { type: Function },
    canceled: {
      type: Boolean,
      default: false,
    },
    disablePublish: {
      type: Boolean,
      default: false,
    },
    isCreator: Boolean
  },
  data() {
    return {
      showShareCompanyFiles: false,
      showRequestModal: false,
      showCCFlowModal: false,
      showPapertagsModal: false,
      showSaveModal: false,
      showQrcodeFiles: false,
      fullName: "",
      saveFunction: "",
      showPublishModal: false,
      showRemoveModal: false,
      showPdfInfo: false,
      showFileFunctions: false,
      showFilePrivacies: false,
    };
  },
  computed: {
    ...mapState(["upload_state"]),
    isFree() {
      return this.$auth?.user?.role == UserTypeEnum.FREE;
    },
    canClear() {
      return this.tools.length;
    },
    isMobile() {
      return isMobile;
    },
    isPaid() {
      return this.$auth?.user?.role == UserTypeEnum.PAID;
    },
    isTeam() {
      return this.$auth?.user?.role == UserTypeEnum.TEAM;
    },
    FrombusinessPage() {
      return (
        JSON.parse(localStorage.getItem("from_publicpage") || "{}")?.fromBusiness ?? true
      );
    },
    teamAccess() {
      return (
        this.$auth?.user?.teamAccess == TeamAccess.COMPANY_FILE &&
        this.$auth?.user?.teamId == this.file.userId
      );
    },
    access() {
      return this.file.filePrivacy;
    },
    isFileActionConfirm(){
      return this.file.fileAction == FileAction.CONFIRM
    },
    isConfirm() {
      return this.file.fileAction == FileAction.CONFIRM && !this.isCreator;
    },
    hasAccess() {
      return this.file.filePrivacy == FilePrivacy.PRIVATE && !this.isCreator;
    },
    businessName() {
      return this.file.user.company_name || "N/A";
    },
    uploadedBy() {
      return this.file.uploadedBy || "N/A";
    },
    isSign() {
      return String(this.file.fileAction).toLowerCase() === FileAction.SIGNED;
    },
    userRole() {
      return this.$auth.user?.role;
    },
    isAgreedSign() {
      return this.$store.state.agreeSign;
    },
  },
  methods: {
    cancelPublish() {
      // Toolbar function - cancelConfrim
      let localRoute = JSON.parse(localStorage.getItem("from_publicpage"));
      if (localRoute?.prevRoute) {
        this.$nuxt.$router.push(localRoute.prevRoute);
        localStorage.setItem("from_publicpage", "{}");
        return;
      }
      if (this.isConfirm) {
        this.$store.commit("SET_PDF_EXIT", true);
        this.$auth.loggedIn && this.isCreator
          ? this.$nuxt.$router.push("/paperlink-pages")
          : this.$nuxt.$router.push(`/${this.file?.user?.businessPage}`);
        return;
      }
      if (this.upload_state) {
        this.$store.commit("SET_UPLOAD_STATE", false);
        this.$store.commit("SET_PDF_EXIT", true);
        this.$auth.loggedIn && this.isCreator
          ? this.$nuxt.$router.push("/paperlink-pages")
          : this.$nuxt.$router.push(`/${this.file?.user?.businessPage}`);
      } else {
        this.$store.commit("SET_UPLOAD_STATE", false);
        this.$store.commit("SET_PDF_EXIT", true);
        this.$auth.loggedIn && this.isCreator
          ? this.$nuxt.$router.push("/paperlink-pages")
          : this.$nuxt.$router.push(`/${this.file?.user?.businessPage}`);
        localStorage.removeItem("store_public_profile_path");
      }
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true;
    },
    async handleActionChange(command) {
      const fileTemp = { ...this.file };
      fileTemp.fileAction = command.toLowerCase();
      this.$emit("update-file", fileTemp);
      this.$BUS.$emit("reset-tools");
      this.$emit("tool-change", null);
    },
    handleAccessChange(command) {
      const fileTemp = { ...this.file };
      fileTemp.filePrivacy = String(command).toLowerCase();
      this.$emit("update-file", fileTemp);
    },
    checkFilePrivacy() {},
    handleCommand(command) {
      switch (String(command).toLowerCase()) {
        case "save":
          this.saveChanges();
          break;
        case "share":
          this.showShareCompanyFiles = true;
          break;
        case "request":
          this.showRequestModal = true;
          break;
        case "carbon-copy":
          this.showCCFlowModal = true;
          break;
        case "papertag":
          this.showPapertagsModal = true;
          break;
        case "remove":
          this.showRemoveModal = true;
          break;
      }
    },
    saveChanges() {
      this.$emit("pinchZoomOut");
      this.$store.commit("SET_UPLOAD_STATE", false);
      this.saveFunction = "saved";
      this.$emit("publishFileFunction");
    },
    clearAnnotations() {
      this.$emit("clearAnnotations");
    },
  },
  mounted() {
    this.checkFilePrivacy();
  },
  watch: {
    "$auth.user": function () {
      this.fullName = this.$auth?.user?.firstName + " " + this.$auth?.user?.lastName;
    },
    "$store.state.upload_state": function () {
      this.upload_state = this.$store.state.upload_state;
    },
    canceled: function () {
      this.cancelPublish();
    },
  },
});
</script>
