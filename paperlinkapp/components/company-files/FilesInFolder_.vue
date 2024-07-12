<template>
  <div class="relative">
   

    <div
      v-if="fileSpinner"
      class="absolute z-10 w-full h-full bg-transparent md:bg-white top-0 left-0 rounded-lg flex justify-center items-center"
    >
      <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
    </div>

    <div >
      <div class="border-b-[1px] border-gray-200 flex items-center py-3">
        <p
          class="sm:w-1/12 w-2/12 inline-block text-[0.7rem] lg:text-[0.9rem] font-bold text-center"
        >
          Order
        </p>
        <p
          class="text-left text-[0.7rem] lg:text-[0.9rem] inline-block font-bold w-4/12 sm:w-3/12"
        >
          File Name
        </p>
        <p
          class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold inline-block w-3/12 sm:w-1/12"
        >
          Pages <span class="pages">{{ getPages }}</span>
        </p>
        <p
          class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
        >
          Action Required
        </p>
        <p
          class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
        >
          Privacy
        </p>
        <p
          class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold hidden sm:inline-block w-2/12"
        >
          Date &amp; Time
        </p>
        <p
          class="text-center text-[0.7rem] lg:text-[0.9rem] font-bold inline-block w-3/12 sm:w-1/12"
        >
        <div
          :class="[
            showSearch
              ? 'absolute w-[100%]  top-[10px] left-0 flex justify-center     '
              : 'reletave w-auto',
          ]"
          class="mr-4"
        >
          <div
            :class="[showSearch ? 'w-[95%]' : ' w-auto']"
            class="flex sm:hidden items-center bg-[#F3F3F3] rounded-[20px]"
          >
            <input
              type="text"
              :class="[showSearch ? 'flex-1 ' : '!w-0 hidden']"
              class="h-8 ml-2 sm:h-10 transition bg-transparent ps-2 flex-1 border-[1px] border-transparent rounded-lg focus:border-transparent text-black outline-none"
              placeholder="Search file"
              v-model="search"
            />
            <button
              @click="showSearch = !showSearch"
              class="circle circle-16 sm:circle-18 bg-paperdazgreen-400 text-white hover:bg-paperdazgreen-70 scale-110 transition duration-0 hover:duration-150"
            >
              <search-icon width="16" height="16" currentcolor="white" />
            </button>
          </div>
        </div>
        </p>
      </div>

      <draggable
        v-model="allFolderFiles"
        group="paperlink"
        @change="onChange"
        class="px-0"
        @start="drag = true"
        @end="drag = false"
      >
       

        <div
          v-for="(file, i) in allFolderFiles"
          :key="file.id"
          handle=".handle"
          class="py-2 border-b-[1px] border-gray-200 list-none px-0 flex items-center w-full"
        >
          <div class="sm:w-1/12 w-2/12 inline-flex justify-center">
            <button :class="[drag ? '!cursor-grabbing' : '!cursor-grab']" class="handle">
              <DragIcon />
            </button>
          </div>
          <div class="text-left inline-block w-4/12 sm:w-3/12 truncate">
            <div class="flex items-center gap-3 sm:min-w-[150px] truncate">
              <div class="truncate">
                <p
                  class="truncate transition-all hover:text-paperdazgreen-700 hover:scale-95 capitalize underline !text-[0.8rem] md;text-base font-normal text-left sm:ml-1"
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
          >
            {{ file.pages }}
          </div>
          <div
            class="text-sm text-center capitalize hidden sm:inline-block w-2/12"
            :class="
              file.fileAction === FileAction.COMPLETE
                ? 'text-paperdazgreen-400'
                : file.fileAction === FileAction.SIGNED
                ? 'text-blue-400'
                : file.fileAction === FileAction.CONFIRM
                ? 'text-purple-400'
                : ''
            "
          >
            {{
              file.fileAction && file.fileAction !== FileAction.SHARED
                ? file.fileAction
                : ""
            }}
          </div>
          <div
            class="text-sm text-center capitalize hidden sm:inline-block w-2/12"
            @click="
              file.filePrivacy == 'private' && $emit('showPermission', true, file.id)
            "
            :class="
              file.filePrivacy === 'private '
                ? 'underline transition-all hover:scale-95 cursor-pointer'
                : '!text-black'
            "
          >
            {{ (file || {}).filePrivacy }}
          </div>
          <div class="text-center px-1 hidden sm:inline-block w-2/12 text-xs">
            {{ formatDateTime(file.updatedAt) }}
          </div>
          <div class="fixed-col right w-3/12 sm:w-1/12 text-center inline-block">
            <div class="w-full flex justify-end md:justify-center">
              <button
                class="sm:hidden w-8 h-8 cursor-pointer rounded-full"
                :class="[
                  createdByTeamMember(file.uploadedBy) && isTeam
                    ? 'bg-paperdazgreen-300/20'
                    : '',
                ]"
                @click="actionFileInFolder(file)"
              >
                <ellipsis-icon-vertical-icon />
              </button>
              <el-dropdown trigger="click">
                <button
                  class="hidden el-dropdown-link w-8 h-8 cursor-pointer sm:grid place-items-center rounded-full"
                  :class="[
                    createdByTeamMember(file.uploadedBy) && isTeam
                      ? 'bg-paperdazgreen-300/20'
                      : '',
                  ]"
                >
                  <ellipsis-icon-vertical-icon />
                </button>
                <el-dropdown-menu
                  slot="dropdown"
                  class="table-menu-dropdown-menu hidden sm:block"
                >
                  <ul class="min-w-[150px]">
                    <li class="dropdown-item" @click="showEditCompanyFileFunc(file)">
                      <div
                        class="flex justify-between items-center w-full border-t border-gray-200"
                      >
                        <div class="h-full inline-block w-[20px] float-left">
                          <PenIcon width="16" height="16" />
                        </div>

                        <p class="grid place-content-center">Edit</p>
                      </div>
                    </li>

                    <li
                      class="dropdown-item"
                      @click="showShareCompanyFileFunc(file)"
                      divided
                    >
                      <div
                        class="flex justify-between items-center w-full border-t border-gray-200"
                      >
                        <div class="h-full inline-block w-[20px] float-left">
                          <share-icon width="16" height="16" />
                        </div>

                        <p class="grid place-content-center">Share</p>
                      </div>
                    </li>

                    <li
                      class="dropdown-item"
                      @click="showMoveCompanyFileFunc(file)"
                      divided
                    >
                      <div
                        class="flex justify-between items-center w-full border-t border-gray-200"
                      >
                        <div class="h-full inline-block w-[20px] float-left">
                          <MoveIcon width="16" height="16" />
                        </div>

                        <p class="grid place-content-center">Move</p>
                      </div>
                    </li>

                    <li class="dropdown-item" @click="showRemoveCompanyFileFunc(file)">
                      <div
                        class="flex justify-between items-center w-full border-t border-gray-200"
                      >
                        <div class="h-full inline-block w-[20px] float-left">
                          <trash-can-icon width="16" height="16" class="" />
                        </div>

                        <p class="grid place-content-center">Remove</p>
                      </div>
                    </li>
                  </ul>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <div class="relative">
      <img
        v-show="!fileSpinner && allFolderFiles?.length === 0"
        src="../../assets/img/dashboard-bg.png"
        class="position-absolute mt-24 w-[150px] left-[50%] translate-x-[-50%] md:w-auto sm:w-[200px]"
      />
      <table
        v-show="!fileSpinner && allFolderFiles?.length === 0"
        key="3"
        ref="fileLedgerTable"
        class="custom-table px-2 py-2 rounded-md"
      >
        <thead>
         
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <td class="text-left fixed-col left">{{ i }}</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="fixed-col right"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-show="this.totalFile > 10 && fileLimit <= 10"
      class="flex justify-center items-center w-full"
    >
      <FilePagination :totalFile="totalFile" @setPage="setPage" />

      <button
        @click="seeAll()"
        class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150"
      >
        See all
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FileAction from "~/models/FileAction";
import dateFormat from "dateformat";
import UserTypeEnum from "~/models/UserTypeEnum";
import DragIcon from "../svg-icons/DragIcon.vue";
import EllipsisIconVerticalIcon from "../svg-icons/EllipsisIconVerticalIcon.vue";
import PenIcon from "../svg-icons/PenIcon.vue";
import MoveIcon from "../svg-icons/MoveIcon.vue";
import TrashCanIcon from "../svg-icons/TrashCanIcon.vue";
import SearchIcon from "../svg-icons/SearchIcon.vue";
import SpinnerDottedIcon from "../svg-icons/SpinnerDottedIcon.vue";
import ShareIcon from "../svg-icons/ShareIcon.vue";
import FilePagination from "../pagination/FilePagination.vue";

export default {
  components: {
    draggable,
    DragIcon,
    EllipsisIconVerticalIcon,
    PenIcon,
    MoveIcon,
    TrashCanIcon,
    SearchIcon,
    SpinnerDottedIcon,
    ShareIcon,
    FilePagination,
  },
  // props: ["FilesInFolerContent"],
  props: {
    actionFileInFolder: {
      type: Function,
      required: true,
    },
    showMoveCompanyFileFunc: {
      type: Function,
      required: true,
    },
    showShareCompanyFileFunc: {
      type: Function,
      required: true,
    },
    showEditCompanyFileFunc: {
      type: Function,
      required: true,
    },
    showRemoveCompanyFileFunc: {
      type: Function,
      required: true,
    },
    emitPrivateModal: {
      type: Function,
      required: true,
    },
    FilesInFolerContent: {
      type: Object,
      required: true,
    },
    refresh: {
      type: Object,
      required: true,
    },
    search: {
      type: String,
    },
  },
  data() {
    return {
      FileAction,
      allFolderFiles: [{ pages: 0 }],
      fileSpinner: true,
      fileLimit: 10,
      totalFile: 0,
      returnedDataPage: 0,
      drag: false,
      showSearch: false,
    };
  },
  computed: {
    userType() {
      return UserTypeEnum;
    },
  },
  mounted() {
    this.getAllFilesInFolder();
  },
  activated() {
    this.getAllFilesInFolder();
  },
  computed: {
    getPages() {
      if (this.allFolderFiles.length > 0)
        return this.allFolderFiles
          .map((item) => item.pages)
          .reduce((prev, next) => prev + next);
    },
  },
  methods: {
    setPage(page) {
      this.returnedDataPage = page;
    },
    seeAll() {
      this.returnedDataPage = 0;
      this.fileLimit = 1000000;
    },
    getAllFilesInFolder() {
      this.fileSpinner = true;
      this.$axios
        .get(
          `/files?folderId=${this.FilesInFolerContent.id}&$sort[positionInFolder]=1&$skip=${this.returnedDataPage}&$limit=${this.fileLimit}&fileName[$like]=%${this.search}%&isDeleted=0`
        )
        .then((res) => {
          this.allFolderFiles = res.data.data;
          this.totalFile = res.data.total;
        })
        .finally(() => {
          this.fileSpinner = false;
        });
    },
    routeToFileManager(val) {
      this.$router.push(val);
      localStorage.setItem("from_publicpage", JSON.stringify({ fromBusiness: false }));
    },
    onChange() {
      let orders = this.allFolderFiles.map((item, index) => {
        return {
          fileId: item.id,
          positionInFolder: ++index,
        };
      });

      let payload = {
        action: "orderFilesInFolder",
        order: orders,
      };
      this.$forceUpdate();
      this.$axios.post("/files", payload);
    },
    formatDateTime(dateVal) {
      let date = dateFormat(dateVal, this.$store?.getters?.getDateFormat);
      let time = dateFormat(dateVal, this.$store?.getters?.getTimeFormat);
      return `${date}, ${time}`;
      // return `${DateFormatter.getDateString(
      //   dateVal
      // )}  ${DateFormatter.getFormattedTime(dateVal)}`
    },
    createdByTeamMember(val) {
      switch (this.$auth.user.role) {
        case UserTypeEnum.TEAM:
          if (this.$auth.user.teamAccess == TeamAccess.COMPANY_FILE) return true;
          else if (this.$auth.user.teamAccess == TeamAccess.OWN_FILE)
            return this.$auth.user.id == val;
        case UserTypeEnum.PAID:
          return true;
      }
    },
  },
  filters: {
    removeExtension(filename) {
      return filename?.replace(/\.pdf$/i, "");
    },
  },
  watch: {
    fileLimit: function () {
      this.getAllFilesInFolder();
    },
    refresh: function () {
      this.getAllFilesInFolder();
    },
    returnedDataPage: function () {
      this.fileSpinner = true;
      this.getAllFilesInFolder();
    },
    search: function () {
      this.fileSpinner = true;
      this.getAllFilesInFolder();
    },
    showSearch: function () {
     if(this.showSearch === false) {
      this.search = ''

     }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  @apply text-paperdazgreen-300 ml-1 text-sm;
}
</style>
