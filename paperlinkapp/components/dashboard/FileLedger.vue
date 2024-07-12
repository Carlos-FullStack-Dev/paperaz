<template>
  <div class="flex flex-col">
    <div
      class="ledger-container bg-white border-t-[5px] border-t-[#77C360] rounded-2xl flex-1 min-h-[50vh] lg:min-h-[40vh] position-relative pt-4"
    >
      <div class="search-container">
        <h3
          class="text-paperdazgray-700 font-semibold text-xl flex xs:items-center justify-between whitespace-nowrap px-3 mb-1"
          :class="[isPaidUser ? 'flex-col sm:flex-row' : 'flex-row gap-2']"
          v-if="!spinner"
        >
          <h5
            class="text-lg font-semibold text-[#272727] hidden sm:inline-flex items-center gap-2 sm:w-full"
            :class="[isPaidUser ? 'mb-2' : 'mb-0']"
          >
            {{ isPaidUser ? "File Ledger" : "Ledger" }}
          </h5>
          <div
            class="text-xs font-medium flex justify-end items-center gap-2 relative w-full"
          >
            <span class="el-dropdown-link left-roll1 flex-1">
              <input
                v-show="ledgerInput"
                @input="handleSearch"
                type="text"
                class="search-input h-8 sm:h-10 transition bg-transparent ps-2 flex-1 border-[1px] border-paperdazgreen-400 rounded-lg focus:border-paperdazgreen-700 outline-none float-right sm:w-3/4 w-full"
                placeholder="Search Files"
                v-model="searchParam"
              />
            </span>
            <button
              @click="ledgerInput = !ledgerInput"
              class="circle circle-16 sm:circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
            >
              <search-icon width="16" height="16" currentcolor="white" />
            </button>
          </div>
        </h3>
      </div>

      <div
        ref="ledgerContainer"
        :class="[
          // (files || []).length <= 0 || $fetchState.pending
          (pdfUser || []).length <= 0 || $fetchState.pending
            ? 'pb-4 pt-4 flex justify-center'
            : 'pb-4 overflow-x-auto custom-scrollbar',
        ]"
      >
        <div v-show="searchSpinner" class="p-6 flex justify-center items-center">
          <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
        </div>
        <div v-if="spinner" key="1" class="p-6 flex justify-center items-center">
          <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
        </div>
        <!-- Start:: empty file ledger -->
        <!-- End:: empty file ledger -->

        <section
          ref="fileLedgerTable"
          v-show="ledger.length != 0 && !spinner && !searchSpinner"
          class="px-0 w-full"
        >
          <div class="border-b-[1px] border-gray-200 flex items-center py-3">
            <p class="sm:w-1/12 w-2/12 inline-block text-[0.9rem] font-bold text-center">
              No
            </p>
            <p class="text-left text-[0.9rem] inline-block w-4/12 font-bold sm:w-3/12">
              File Name
            </p>
            <p
              class="text-center text-[0.9rem] inline-block w-3/12 font-bold sm:w-1/12"
            ></p>
            <p class="text-center text-[0.9rem] hidden sm:inline-block font-bold w-2/12">
              {{ isPaidUser ? "Action" : "Actions" }}
            </p>
            <p class="text-center text-[0.9rem] hidden sm:inline-block font-bold w-2/12">
              Action By
            </p>
            <p class="text-center text-[0.9rem] hidden sm:inline-block w-2/12 font-bold">
              Date &amp; Time
            </p>
            <p class="text-center text-[0.9rem] inline-block w-3/12 sm:w-1/12"></p>
          </div>

          <div
            v-for="(file, i) in ledger"
            :key="file.id"
            :class="{ highlight: file.id == highlightedFileId }"
            class="py-2 border-b-[1px] border-gray-200 list-none px-0 flex items-center w-full"
          >
            <div class="sm:w-1/12 w-2/12 inline-flex justify-center">
              {{ i + 1 + returnedDataPage }}
            </div>
            <div class="text-left inline-block w-4/12 sm:w-3/12 truncate">
              <div class="flex items-center gap-3 sm:min-w-[150px] truncate">
                <!-- <img src="../../assets/img/user-file-icon.svg" alt="" /> -->
                <div class="truncate">
                  <p
                    class="truncate capitalize !text-[0.8rem] md;text-base font-normal text-left sm:ml-1"
                  >
                    <span
                      class="cursor-pointer"
                      @click="routeToFileManager(`/pdf/${file.paperLink}`)"
                    >
                      {{ file.fileName | removeExtension }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="text-center w-3/12 sm:w-1/12 text-[0.8rem] px-1 inline-block md:text-xs"
            ></div>
            <div
              class="text-sm text-center capitalize hidden sm:inline-block w-2/12"
              :class="
                file?.action === FileAction.COMPLETE
                  ? 'text-paperdazgreen-400'
                  : file?.action === FileAction.SIGNED
                  ? 'text-blue-400'
                  : file?.action === FileAction.CONFIRM
                  ? 'text-purple-400'
                  : ''
              "
            >
              {{ `${file?.action}ed`.replace("ee", "e") }}
            </div>
            <div
              class="text-sm text-center capitalize hidden sm:inline-block w-2/12 cursor-pointer"
            >
              {{ file.guestName || "--" }}
            </div>
            <div class="text-center px-1 hidden sm:inline-block w-2/12 text-xs">
              {{ formatDateTime(file.updatedAt) }}
            </div>
            <div class="justify-end w-3/12 sm:w-1/12 text-center pr-4 flex">
              <button
                class="cursor-pointer hidden sm:block"
                @click="showShareCompanyFilesFunc(file)"
              >
                <share-outline-icon class="w-4 h-4" />
              </button>
              <button
                @click="actionFile = file"
                class="sm:hidden w-8 h-8 cursor-pointer rounded-full"
              >
                <ellipsis-icon-vertical-icon />
              </button>
              <!-- <div class="w-full flex justify-end">
                <button class="sm:hidden w-8 h-8 cursor-pointer rounded-full">
                  <ellipsis-icon-vertical-icon />
                </button>
                <el-dropdown trigger="click">
                  <button
                    class="hidden el-dropdown-link w-8 h-8 cursor-pointer sm:grid place-items-center rounded-full"
                  >
                    <ellipsis-icon-vertical-icon />
                  </button>
                  <el-dropdown-menu
                    slot="dropdown"
                    class="table-menu-dropdown-menu hidden sm:block"
                  >
                    <ul class="min-w-[150px]">
                      <li class="dropdown-item" divided>
                        <div class="flex justify-between w-full">
                          <span>Share</span>
                        </div>
                      </li>

                      <li class="dropdown-item">
                        <div class="flex justify-between w-full border-t border-gray-200">
                          <span>Remove</span>
                        </div>
                      </li>
                    </ul>
                  </el-dropdown-menu>
                </el-dropdown>
              </div> -->
            </div>
          </div>
        </section>

        <img
          v-show="!spinner && !searchSpinner && ledger.length === 0"
          src="../../assets/img/dashboard-bg.png"
          class="position-absolute mt-24 md:left-[30%] md:w-auto sm:w-[200px]"
        />
        <table
          v-show="!spinner && !searchSpinner && ledger.length === 0"
          key="3"
          ref="fileLedgerTable"
          class="file-ledger-table"
        >
          <thead>
            <tr class="text-left">
              <th class="text-left fixed-col left font-[500]">No</th>
              <th class="text-center font-[500]">File Name</th>
              <th class="text-center font-[500]">Action</th>
              <th class="text-center font-[500]" v-if="isPaidUser">Action By</th>
              <th class="text-center font-[500]">Date & Time</th>
              <th class="fixed-col right"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i">
              <td class="text-left fixed-col left">{{ i }}</td>
              <td class="text-center"></td>
              <td class="text-center"></td>
              <td class="text-center" v-if="isPaidUser"></td>
              <td class="text-center"></td>
              <td class="fixed-col right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- </transition> -->
    </div>

    <el-dialog
      :visible.sync="actionFile"
      :append-to-body="true"
      :show-close="false"
      center
      width="100%"
      top="100vh"
      custom-class="-translate-y-full sm:hidden bottom-sm-modal"
      class="bottom-0 overflow-hidden sm:hidden"
    >
      <div class="w-full flex flex-col p-0 -mt-8 -mb-4" v-if="actionFile">
        <!-- <div class="no-access" v-if="!createdByTeamMember(actionFolder.createdBy)">
          no access right
        </div> -->
        <div class="flex justify-center flex-col items-center">
          <p>{{ actionFile.name }}</p>
        </div>
        <ul>
          <li class="dropdown-item">
            <div class="flex justify-between items-center w-full py-2 text-center">
              <span>Action</span>
              <span> {{ `${actionFile?.action}ed`.replace("ee", "e") }}</span>
            </div>
          </li>
          <li class="dropdown-item">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Action By</span>
              <span>
                {{
                  actionFile.isGuest
                    ? "Guest"
                    : actionFile.user?.firstName + " " + actionFile.user?.lastName
                }}</span
              >
            </div>
          </li>
          <li class="dropdown-item">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Date</span>
              <span> {{ fDate(actionFile.updatedAt) }}</span>
            </div>
          </li>
          <li class="dropdown-item">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Time</span>
              <span> {{ fTime(actionFile.updatedAt) }}</span>
            </div>
          </li>
          <li class="dropdown-item" @click="showShareCompanyFilesFunc(actionFile)">
            <div
              class="flex justify-between items-center w-full border-t border-gray-200 py-2 text-center"
            >
              <span>Share</span>
              <span><img src="~/assets/icons/share-2.svg" alt="" /></span>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <div class="flex justify-center">
      <FilePagination :totalFile="totalFile" @setPage="setPage" />
    </div>
    <ShareFilesModal
      :userFile="userFile"
      @qrLoad="showQrcodeFileFunc"
      v-model="showShareCompanyFiles"
      :link="link"
    />
    <CreateCompanyFolder
      @refresh="setRefresh"
      :userFile="userFile"
      @resetUserFile="resetUserFile"
      v-model="showCreateCompanyFolder"
    />
    <upload-document-modal
      @resetUserFolder="resetUserFolder"
      :folder="fileProps"
      v-model="showUploadDocumentModal"
    />
    <QrcodeShare :userFile="userFile" v-model="showQrcodeFiles" />
    <CreateTeam @refresh="setRefresh" v-model="showCreateTeam" />
  </div>
</template>
<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import ScribbleIcon from "../svg-icons/ScribbleIcon.vue";
import SearchIcon from "../svg-icons/SearchIcon.vue";
import TreeIcon from "../svg-icons/TreeIcon.vue";
import DateFormatter from "~/utils/DateFormatter";
import ShareIcon from "../svg-icons/ShareIcon.vue";
import SpinnerDottedIcon from "../svg-icons/SpinnerDottedIcon.vue";
import HeartOutlineIcon from "../svg-icons/HeartOutlineIcon.vue";
import ShareOutlineIcon from "../svg-icons/ShareOutlineIcon.vue";
import ShareFilesModal from "../company-files/Tabs/ShareFilesModal.vue";
import QrcodeShare from "../company-files/Tabs/QrcodeShare.vue";
import FilePagination from "../pagination/FilePagination.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import FolderPlusIcon from "../svg-icons/FolderPlusIcon.vue";
import PlusIcon from "../svg-icons/PlusIcon.vue";
import AuthUser from "~/models/AuthUser";
import CreateCompanyFolder from "../company-files/Tabs/CreateCompanyFolder.vue";
import UploadDocumentModal from "./UploadDocumentModal.vue";
import CreateTeam from "../company-files/Tabs/CreateTeam.vue";
import EmptyFileLedger from "../widgets/EmptyFileLedger.vue";
import FileAction from "~/models/FileAction";
import _ from "lodash";
import LetterAvatar from "../widgets/LetterAvatar.vue";
import dateFormat from "dateformat";
import EllipsisIconVerticalIcon from "../svg-icons/EllipsisIconVerticalIcon.vue";

export default Vue.extend({
  components: {
    TreeIcon,
    FolderPlusIcon,
    EllipsisIconVerticalIcon,
    PlusIcon,
    ScribbleIcon,
    SearchIcon,
    ShareIcon,
    SpinnerDottedIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    ShareFilesModal,
    QrcodeShare,
    FilePagination,
    UploadDocumentModal,
    CreateCompanyFolder,
    CreateTeam,
    EmptyFileLedger,
    LetterAvatar,
  },
  props: ["searchContect"],
  filters: {
    removeExtension(filename) {
      return filename.replace(/\.[^\/.]+$/, "");
    },
    initialFirstName(name) {
      return name?.charAt(0).toUpperCase();
    },
  },
  async fetch() {},
  data() {
    return {
      searchParam: "",
      totalFile: null,
      returnedDataPage: 0,
      spinner: true,
      searchSpinner: false,
      show: false,
      showQrcodeFiles: false,
      showShareCompanyFiles: false,
      userFile: {},
      userId: this.$auth.user.id,
      filterTitle: "",
      searchValue: "",
      showScribble: false,
      files: [],
      fileProps: {},
      copyFiles: [],
      refresh: false,
      highlightedFileId: undefined,
      scrollObserver: undefined,
      showUploadDocumentModal: false,
      showCreateCompanyFolder: false,
      showCreateTeam: false,
      FileAction,
      debounceTimeout: null,
      ledger: [],
      ledgerInput: false,
      actionFile: null,
      link: "",
    };
  },
  mounted() {
    this.handleFileHighlight();
    this.handleShowingLedger();
    this.tableScrollObserver();
    this.fetchFiles(this.returnedDataPage, this.searchValue);
  },
  methods: {
    async handleSearch() {
      console.log("hello world");
      this.searchSpinner = true;
      this.fetchFiles(this.returnedDataPage, this.searchParam);
    },
    fTime(dateVal) {
      return dateFormat(dateVal, this.$store?.getters?.getTimeFormat);
    },
    fDate(dateVal) {
      return dateFormat(dateVal, this.$store?.getters?.getDateFormat);
    },
    routeToFileManager(val) {
      return;
      localStorage.setItem(
        "from_publicpage",
        JSON.stringify({ fromBusiness: true, prevRoute: "/file-ledger" })
      );
      this.$router.push(`/pdf/${val}`);
    },
    formatFileAction(fileAction, action) {
      let isEd = false;
      switch ((fileAction || "").toLowerCase()) {
        case FileAction.COMPLETE:
          isEd = true;
          break;
        case FileAction.SIGNED:
          isEd = true;
          if (action === FileAction.COMPLETE) {
            fileAction = FileAction.SIGNED;
            isEd = false;
          } else if (action === FileAction.CONFIRM) {
            fileAction = FileAction.CONFIRM;
          }
          break;
        case FileAction.CONFIRM:
          if (action === FileAction.COMPLETE) {
            isEd = false;
          } else {
            isEd = true;
          }
          break;
        default:
          return "";
      }

      fileAction = fileAction.charAt(0).toUpperCase() + fileAction.slice(1);
      if (isEd) {
        fileAction =
          fileAction.charAt(fileAction.length - 1) === "e"
            ? fileAction + "d"
            : fileAction + "ed";
      }
      return fileAction;
    },
    showCreateCompanyFolderFunc() {
      this.showCreateCompanyFolder = true;
    },
    showUploadModalFunction() {
      // if (!this.showUploadIcon) return
      // if (this.totalFile >= this.totalRegisteredPaperlink)
      //   this.showMaxPaperlinkModal = true
      // else
      this.showUploadDocumentModal = true;
    },
    setRefresh() {
      this.refresh = !this.refresh;
    },
    resetUserFolder() {
      this.fileProps = {};
    },
    resetUserFile() {
      this.userFile = {};
    },
    showCreateTeamFunc() {
      this.showCreateTeam = true;
    },
    searchFiles(event) {
      this.searchValue = event.target.value;
    },
    async ledgerFiles(page, search) {
      let ledgerParams = this.$store.getters.getLedgerParams;
      let paramsId = localStorage.getItem("team_id")
        ? localStorage.getItem("team_id")
        : this.$auth.user.id;

      let acct = `/ledger?userId=${paramsId}&$sort[updatedAt]=-1&fileName[$like]=${search}%&$skip=${page}${
        ledgerParams ? "&action=" + this.$store.getters.getLedgerParams : ledgerParams
      }`;
      await this.$axios
        .get(acct)
        .then((response) => {
          this.ledger = response.data.data;
          this.totalFile = response.data.total;
        })
        .finally(() => {
          this.spinner = false;
          this.searchSpinner = false;
        });
    },
    async fetchUserFiles(page, search) {
      let paramsId =
        this.$auth.user?.role == UserTypeEnum.TEAM
          ? this.$auth.user.teamId
          : this.$auth.user?.id;
      //<<---------------- START: fetching the user files --- ------>>
      await this.$axios
        .$get(
          `/files?userId=${paramsId}&fileName[$like]=${search}%&$skip=${page}&$sort[updatedAt]=-1`,
          {
            params: {
              isEditing: 0,
            },
          }
        )
        .then((response) => {
          this.$emit("setUploadpaperlink", response.total);
          const files = response.data.map((el) => {
            return el;
          });

          this.files = files;
          this.$store.commit("ADD_USER", files);
          this.totalFile = response.total;

          this.searchSpinner = false;
        })
        .finally(() => {
          this.spinner = false;
          this.searchSpinner = false;
        });
      //<<----------------END: fetching the user files --- ------>>
    },
    setPage(page) {
      this.returnedDataPage = page;
    },
    showShareCompanyFilesFunc(data) {
      this.userFile = data;
      this.link = `${window.origin}/pdf/${data.file.paperLink}`;
      this.showShareCompanyFiles = true;
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true;
    },
    async fetchFiles(page, search) {
      this.isPaidUser ? this.ledgerFiles(page, search) : this.ledgerFiles(page, search);
    },
    handleFileHighlight() {
      this.highlightedFileId = this.$nuxt.$route.query.highlight_file;
      setTimeout(() => {
        this.highlightedFileId = undefined;
      }, 20000);
    },
    shareFile(file) {
      const url = location.origin.replace(/\/+$/, "") + `/pdf/${file.id}`;
      navigator.share({
        url,
        title: file.file_name,
      });
    },
    async tableScrollObserver() {
      await this.$nextTick();
      if (this.scrollObserver) {
        try {
          this.scrollObserver.disconnect();
          this.scrollObserver = undefined;
        } catch (e) {}
      }
      const options = {
        root: this.$refs.ledgerContainer,
        // root: document,
        rootMargin: "0px",
        threshold: 1.0,
      };
      const callback = (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.classList.add("scrolled");
          } else {
            entry.target.classList.remove("scrolled");
          }
        });
      };
      const observer = new IntersectionObserver(callback, options);
      const fixedCols = document.querySelectorAll(".fixed-col");
      fixedCols.forEach((el) => {
        observer.observe(el);
      });
      this.scrollObserver = observer;
    },
    formatDateTime(dateVal) {
      let date = dateFormat(dateVal, this.$store?.getters?.getDateFormat);
      let time = dateFormat(dateVal, this.$store?.getters?.getTimeFormat);
      return `${date}, ${time}`;
    },
    handleShowingLedger() {
      const ledgerContainer = this.$refs.ledgerContainer;
      if (!ledgerContainer) return;
      const options = {
        root: null,
        threshold: 0.75,
        rootMargin: "0px",
      };
      const callback = (entries, _observer) => {
        entries.forEach((entry) => {
          if (entry.target === ledgerContainer) {
            if (entry.isIntersecting) {
              this.showScribble = true;
            } else {
              this.showScribble = false;
            }
          }
        });
      };
      const observer = new IntersectionObserver(callback, options);
      observer.observe(ledgerContainer);
    },
  },

  updated() {
    this.tableScrollObserver();
  },
  computed: {
    // getting state from the store
    ...mapState(["filterUser", "pdfUser"]),
    userType() {
      return UserTypeEnum;
    },
    isPaidUser() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return true;
        case UserTypeEnum.TEAM:
          return true;
        case UserTypeEnum.FREE:
          return false;
      }
    },
    mainUserLink() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return (this.$auth.user || {}).id;
        case UserTypeEnum.TEAM:
          return (this.$auth.user || {}).mainAccountId;
      }
      (this.$auth.user || {}).id;
    },
  },
  watch: {
    "$store.getters.getLedgerParams": async function () {
      this.returnedDataPage = 0;
      await this.fetchFiles(this.returnedDataPage, this.searchParam);
    },
    "$auth.user": function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.spinner = true;
        this.fetchFiles(this.returnedDataPage, this.searchParam);
      }, 500);
    },
    returnedDataPage: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.spinner = true;
        this.fetchFiles(this.returnedDataPage, this.searchParam);
      }, 500);
    },
    // searchParam: function () {
    //   // this.searchSpinner = true;

    //   if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    //   this.debounceTimeout = setTimeout(() => {
    //     this.fetchFiles(this.returnedDataPage, this.searchParam);
    //   }, 500); // delay for half second
    // },
    refresh: function () {
      this.$nuxt.refresh();
      this.fetchFiles(this.returnedDataPage, this.folderSearch);
      this.fetchFolder(this.returnedFolderPage, this.folderSearch);
    },
  },
});
</script>
<style lang="postcss" scoped>
.file-ledger-table {
  --background: white;
  @apply max-sm:text-xs sm:text-base w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;
  height: fit-content;
  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }
  & th {
    @apply max-sm:pt-4 max-sm:pb-1 sm:pt-8 sm:pb-3 max-sm:text-xs sm:text-base;
    background: var(--background);
  }
  & td {
    @apply py-3 max-sm:text-xs sm:text-base;
  }
  & td,
  & th {
    @apply px-1 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    &:first-child {
      @apply pl-5;
    }
    &:last-child {
      @apply pr-5;
    }
    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);
      &.left {
        left: -0.1px;
      }
      &.right {
        right: -0.1px;
      }
    }
  }
}

.search-input {
  @apply w-full px-4 text-[0.9rem] outline-none rounded-lg h-[40px] border-[1px] border-paperdazgray-200 mr-2 focus:border-paperdazgray-600;
}
/* .search-input {
  & ~ .search-dropdown {
    @apply opacity-0 translate-y-[5%] pointer-events-none;
  }
  &:active,
  &:focus {
    & ~ .search-dropdown {
      @apply opacity-100 translate-y-0 pointer-events-auto;
    }
  }
} */
</style>
