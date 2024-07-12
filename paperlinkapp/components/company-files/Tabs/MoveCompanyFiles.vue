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

    <div class="absolute top-3 left-3" v-if="loading">
      <spinner-dotted-icon
        ref="spinnerIcon"
        height="30"
        width="30"
        class="animate-spin text-paperdazgreen-400"
      />
    </div>

    <!--End:: Close Button -->
    <template #title>
      <h4 class="text-center font-bold text-xl">Move Files</h4>
    </template>
    <!-- Start:: Body -->

    <!-- <p
      class="text-centerfont-medium flex justify-center items-center w-[] mx-auto mb-6 whitespace-none"
    >
      <input
        class="w-[280px] w-min-[150px] py-2 px-4 border-[1px] border-paperdazgrey-200 rounded-md disabled:cursor-not-allowed"
        placeholder="Enter Folder Name"
        v-model="searchValue"
      />
     <button
           @click="popUpFolderCreate"
          class="ml-2 circle circle-18 bg-paperdazgreen-400 text-xl text-white"
        >
          <folder-plus-icon />
        </button> 
    </p> -->

    <div class="w-[100%] md:w-[90%] md:ml-[5%] relative">
      <ul
        class="mb-3 max-h-[330px] h-auto overflow-auto sm:px-2"
        ref="scrollContainer"
        @scroll="checkScrollBottom"
      >
        <li
          class="w-full flex items-center py-2 folder_list transition duration-100 rounded"
        >
          <span class="mx-2"> </span>
          <img class="w-[28px] mr-2" src="~/assets/img/Vector.png" />
          <p
            class="text-[15px] font-semibold flex items-center text-grey w-[85%] pr-3 truncate"
          >
            <button class="mr-1"></button>
            <span class="truncate inline-block pr-2 py-2">Main Folder</span>
          </p>
          <button
            @click="onSubmit(null)"
            class="w-auto whitespace-nowrap rounded px-3 text-paperdazgreen py-1 items-center folder_button hidden"
          >
            <!-- <img
          @click="transferFileFunction(file)"
          class="w-[33px]"
          src="~/assets/icons/file-move-icon.svg"
        /> -->
            move
          </button>
        </li>
        <li
          v-for="(file, i) in folderProps"
          :key="'file' + i"
          class="w-full flex items-center py-2 folder_list transition duration-100 rounded"
        >
          <span class="mx-2 whitespace-nowrap w-8">
            {{ file.files.length }}
          </span>
          <img class="w-[28px] mr-2" src="~/assets/img/Vector.png" />
          <p
            class="text-[15px] font-semibold flex items-center text-grey w-[85%] pr-3 truncate"
          >
            <button class="mr-1"></button>
            <span :title="file.name" class="truncate inline-block pr-2 py-2">{{
              file.name
            }}</span>
          </p>
          <button
            @click="transferFileFunction(file)"
            class="w-auto whitespace-nowrap rounded px-3 text-paperdazgreen py-1 items-center folder_button hidden"
          >
            <!-- <img
              @click="transferFileFunction(file)"
              class="w-[33px]"
              src="~/assets/icons/file-move-icon.svg"
            /> -->
            move
          </button>
        </li>
      </ul>
      <!-- <div class="w-full flex justify-center" v-if="folderSpinner"><SquareLoader /></div> -->
    </div>
    <!-- <FilePagination :totalFile="totalFile" @setPage="setPage"/> -->
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import SearchIcon from "~/components/svg-icons/SearchIcon.vue";
import PaperdazIcon from "../../svg-icons/PaperdazIcon.vue";
import FileIcon from "~/components/svg-icons/FileIcon.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import FilePagination from "~/components/pagination/FilePagination.vue";
import FolderPlusIcon from "../../svg-icons/FolderPlusIcon.vue";
import SquareLoader from "~/components/loader/SquareLoader.vue";

export default Vue.extend({
  name: "move-company-file",
  components: {
    SpinnerDottedIcon,
    SearchIcon,
    PaperdazIcon,
    FileIcon,
    FolderPlusIcon,
    FilePagination,
    FolderPlusIcon,
    SquareLoader,
  },
  model: {
    prop: "visible",
    event: "updateVisibility",
  },
  props: {
    packagename: {
      type: String,
    },
    userFile: {},
    visible: {
      type: Boolean,
      default: false,
    },
    folderProps: {
      type: Array,
    },
  },
  data() {
    return {
      showModal: false,
      errorMessage: "",
      loading: false,
      fileInfo: {},
      files: [],
      getFolderId: undefined,
      totalFile: null,
      searchValue: "",
      returnedFolderPage: 0,
      folderSpinner: true,
      debounceTimeout: null,
      folderProps: [],
    };
  },
  watch: {
    visible(val) {
      this.showModal = val;
      val ? this.fetchFiles() : null;
      if (!val) {
        this.returnedFolderPage = 0;
        this.files = [];
        this.totalFile = null;
      }
    },
    showModal(val) {
      this.$emit("updateVisibility", val);
    },
    userFile() {
      this.fileInfo = this.userFile;
    },
    payloadCheck() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.folderSpinner = true;
        this.fetchFiles(this.returnedFolderPage, this.searchValue);
      }, 500);
    },
    searchValue() {
      this.returnedFolderPage = 0;
      this.files = [];
      this.totalFile = null;
    },
  },
  computed: {
    folders() {
      return Array.from(new Set(this.files.map(JSON.stringify)))
        .map(JSON.parse)
        .filter((item, index) => item.id !== this.userFile?.folderId)
        .sort((a, b) => a.updatedAt - b.updatedAt);
    },
    payloadCheck() {
      return {
        search: this.searchValue,
        page: this.returnedFolderPage,
      };
    },
  },
  mounted() {
    this.showModal = this.visible;
  },
  methods: {
    checkScrollBottom() {
      if (
        this.$refs.scrollContainer.scrollTop + this.$refs.scrollContainer.clientHeight >=
        this.$refs.scrollContainer.scrollHeight - 10
      ) {
        if (this.returnedFolderPage > this.totalFile) return;
        this.returnedFolderPage = this.returnedFolderPage + 10;
        console.log("Scrolled to the bottom!");
      }
    },
    setPage(val) {
      this.returnedFolderPage = val;
    },
    popUpFolderCreate() {
      this.$emit("createFolderEmit");
      this.$emit("updateVisibility", false);
    },
    transferFileFunction(file) {
      this.onSubmit(file.id);
    },
    async fetchFiles(page, search) {
      let paramsId =
        this.$auth.user.role == UserTypeEnum.TEAM
          ? this.$auth.user.teamId
          : this.$auth.user.id;

      await this.$axios
        .$get(
          `/folders/?userId=${paramsId}&name[$like]=%${
            search || ""
          }%&$sort[updatedAt]=-1&$skip=${page || 0}`
        )
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el;
          });
          this.totalFile = response.total;
          page == 0 && (this.files = []);
          // set the data.file
          this.files = [...this.files, ...filesData];
          console.log("from-modal-folder", this.files);
        })
        .finally(() => {
          this.folderSpinner = false;
        });
    },

    closeModal() {
      this.$emit("updateVisibility", false);
    },
    onSubmit(index, event) {
      event?.preventDefault();

      if (this.loading) return;

      this.loading = true;

      // return
      this.$axios
        .$patch(`/files/${this.fileInfo.id}`, {
          folderId: index,
        })
        .then(() => {
          this.$notify.success({
            title: "File",
            message: "Moved successfully",
          });
          this.$emit("updateVisibility", false);
          this.$emit("refresh");
          this.$emit("resetUserFile");
        })
        .catch((err) => {
          this.$notify.error({
            title: "Package",
            message: "Unable to move file",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

<style scoped>
* >>> .el-dialog {
  width: 600px !important;
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

::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  background-color: #77c360;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-paperdazgreen-400;
}
.folder_list:hover .folder_button {
  display: inline-block;
}
.folder_list:hover {
  @apply bg-paperdazgreen-300/30;
}
</style>
