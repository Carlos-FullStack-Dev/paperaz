<template>
  <div class="mt-[70px] lg:mt-0 px-2">
    <!-- <DownloadPwa /> -->

    <ProfileTopInfo :userInfo="userInfo"
      @openShare="handleCompanyNameShare(userInfo?.companyName, userInfo?.businessPage)" />

    <div class="h-full ml-3 mt-8  flex">
      <div @click="changeTab(1)" :class="[tabNumber === 1 ? 'active-tab' : 'tab']" class="mr-4">
        <p>Files</p>
      </div>
      <div :class="[tabNumber === 2 ? 'active-tab' : 'tab']" @click="changeTab(2)" class="tab">
        <p>Folders</p>
      </div>
    </div>

    <div v-if="fileSpinner && totalFile === null" class=" h-[300px]">
      <!-- START: spinner container -->
      <div class="absolute z-10 w-full h-full top-0 left-0 rounded-lg flex justify-center items-center">
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- END: spinner container -->
    </div>

    <div v-if="folderSpinner && totalFolder === null" class="   h-[300px]">
      <!-- START: spinner container -->
      <div class="absolute z-10 w-full h-full top-0 left-0 rounded-lg flex justify-center items-center">
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- END: spinner container -->
    </div>








    <!-- Start:: Files -->
    <div v-if="isFetched && !showFolderFiles"
      class="border-t-[5px] lg:border-t-[5px] bg-white border-t-[#77C360] min-h-[67vh] rounded-xl pb-8 px-2"
      :class="{ 'hidden sm:block': showFolders }">
      <div v-show="tabNumber === 2" class="mt-4  bg-white mb-6 rounded-xl">
        <div class="overflow-x-auto custom-scrollbar relative">
          <div v-if="folderSpinner" class=" w-full absolute h-[100px]">
            <!-- START: spinner container -->
            <div class="  w-full h-full rounded-lg flex justify-center items-center">
              <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
            </div>
            <!-- END: spinner container -->
          </div>
          <!-- START: spinner container -->

          <section class="px-0 w-full">
            <div class="border-b-[1px] hidden lg:flex  w-full  items-center py-3">
              <p class=" pl-2 hidden   w-2/12  lg:inline-block text-[0.7rem] lg:text-[0.9rem] font-bold text-left">
                Order
              </p>
              <p class="text-left text-[0.7rem] lg:text-[0.9rem] hidden lg:inline-block font-bold w-4/12 lg:w-5/12 ">
                Folder name
              </p>
              <p class="text-center text-[0.7rem] lg:text-[0.9rem] hidden lg:inline-block font-bold  w-4/12 lg:w-5/12 ">
                Files
              </p>

            </div>

            <div v-for="(folder, i) in folders" :key="folder.id"
              class="py-3 border-b-[1px] border-gray-200 list-none px-0 flex items-center w-full">
              <div class="hidden w-2/12 pl-2  lg:inline-flex justify-start">
                <img width="23" height="23" src="~/assets/img/Vector.png" />
              </div>
              <div class="text-left  inline-block w-8/12 lg:w-5/12 truncate">
                <div class="flex items-center gap-3 sm:min-w-[150px] truncate">
                  <img src="~/assets/img/Vector.png" class="md:hidden " width="23" height="23" />
                  <div class="truncate">
                    <p class="truncate capitalize  !text-[0.8rem] md;text-base font-normal text-left ">
                      <span class="cursor-pointer" @click="showFolderFilesFunc(folder)">
                        {{ folder.name }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="flex   justify-end lg:justify-center w-4/12 lg:w-5/12  text-[1rem] px-1 items-center md:text-xs">
                <p> {{ folder.files.length }}</p>
              </div>

            </div>
          </section>

          <!-- <FilePagination :totalFile="totalFile" @setPage="setPage" /> -->
        </div>

        <div v-show="this.totalFolder > 10 && folderLimit <= 10 && tabNumber === 2"
          class="flex justify-center items-center flex-wrap  w-full">
          <FilePagination :totalFile="totalFolder" @setPage="setFolderPage" />
          <button @click="seeAllFolder()"
            class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150">
            See all
          </button>
        </div>


      </div>
      <!-- End:: Folders -->
      <div v-show="tabNumber === 1"
        class="relative rounded-2xl w-full md:min-w-[300px] overflow-x-auto custom-scrollbar ">
        <div v-if="fileSpinner" class=" w-full absolute h-[100px]">
          <!-- START: spinner container -->
          <div class="  w-full h-full rounded-lg flex justify-center items-center">
            <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
          </div>
          <!-- END: spinner container -->
        </div>
        <table class="custom-table py-2">
          <thead class="text-[#414142]">
            <tr>
              <th class="text-left font-[700] hidden md:table-cell ">File Name </th>

              <th class="hidden md:table-cell">Action</th>
              <th class="hidden md:table-cell">Privacy</th>
              <th v-show="files.length > 10" class=" font-[700]  right">
                <form @submit.prevent class="flex flex-1 justify-end items-center gap-2 text-xs text-gray-800 relative">
                  <span v-if="showFile" class="el-dropdown-link max-sm:flex-1 absolute top-[-30px] ">
                    <input type="text" placeholder="Search any file..."
                      class="rounded-lg border !border-paperdazgreen-400 px-2 h-7 w-full sm:w-[165px] md:w-48  placeholder:italic"
                      v-model="searchFileParam" />
                  </span>
                  <button @click="showFile = !showFile" type="button"
                    class="circle circle-15 bg-paperdazgreen-400 text-white">
                    <search-icon width="14" height="14" currentcolor="white" />
                  </button>
                </form>
              </th>
            </tr>
          </thead>
          <tbody class="text-[#505050]">
            <tr v-for="(item, i) in files" :key="i">
              <!-- <td class="w-12 text-center fixed-col left">{{ i + 1 }}</td> -->
              <td class="row">
                <div class="flex  items-center">
                  <img src="/icon.png" class="mr-3" width="23" height="23" />
                  <div class="">
                    <p
                      class="text-[#414142] whitespace-nowrap transition-all hover:text-paperdazgreen-700 hover:scale-95 truncate text-[15px]">
                    <p @click="routeToFileManager(`/pdf/${item.paperLink}`, item.filePrivacy, item.id)"
                      class="cursor-pointer capitalize  transition-all hover:text-paperdazgreen-700 hover:scale-95">
                      {{ ((item || {}).fileName || ' ') | removeExtension }}
                    </p>


                    <div class="flex  md:hidden items-center mt-1 text-[0.65rem] text-[#707070]">
                      <p v-show="((item || {}).fileAction) != 'doNotPost'" class="capitalize"> {{ ((item || {}).fileAction
                        ||
                        '') }}</p>

                      <div class="w-1 h-1 mx-2 rounded-[50%] bg-black"></div>

                      <p class="capitalize  ">
                        {{ ((item || {}).filePrivacy || '') }}
                      </p>
                      <div class="w-1 h-1 mx-2 rounded-[50%] bg-black"></div>
                      <p @click="shareLinkFunc(item.paperLink, item.fileName)" class="capitalize  text-[#1400FF]">
                        share
                      </p>
                    </div>
                    </p>
                  </div>
                </div>
              </td>
              <td class="hidden md:table-cell">
                <p v-show="((item || {}).fileAction) != 'doNotPost'" class="capitalize"> {{ ((item || {}).fileAction ||
                  '') }}</p>
              </td>
              <td>
                <p class="capitalize hidden md:table-cell">
                  {{ ((item || {}).filePrivacy || '') }}
                </p>
              </td>
              <td class=" flex justify-end">
                <div @click="shareLinkFunc(item.paperLink, item.fileName)"
                  class=" w-[100px] hidden cursor-pointer md:flex   sm:w-full   justify-end ">
                  <ShareOutlineIcon />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-show="this.totalFile > 10 && fileLimit <= 10 && tabNumber === 1"
          class="flex justify-center items-center flex-wrap  w-full">
          <FilePagination :totalFile="totalFile" @setPage="setFilePage" />
          <button @click="seeAll()"
            class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150">
            See all
          </button>
        </div>



        <div v-if="files.length === 0 && isFetched" class="flex items-center justify-center py-4">
          <p>No Item Found</p>
        </div>
      </div>
    </div>

    <div v-if="showFolderFiles"
      class="border-t-[8px] lg:border-t-[5px] bg-white border-t-[#77C360] min-h-[67vh] rounded-xl pb-8 px-2">
      <div class="flex items-center w-full pt-2 px-4 mb-[-20px] ">
        <button class="px-2 py-1 bg-paperdazgreen-300 text-white rounded-md sm:inline-block hidden"
          @click="showFolderFiles = false">
          Back
        </button>
        <button class="h-2 w-3 outline-none border-none inline-block sm:hidden" @click="showFolderFiles = false">
          <arrow-down-icon class="h-3 w-4 rotate-90" />
        </button>
        <div class="flex-1 flex justify-center text-paperdazgreen-300 font-semibold text-base">
          {{ currentFolder.name }}
        </div>
      </div>
      <BusinessPageFilesInFolder :currentFolder="currentFolder" @handleShareInFolderFile="shareLink"
        @emitPrivateModal="emitPrivateModal" />
    </div>


    <PopUpWrapper @count="increaseCount" :showModal="showGuideModal">
      <component :is="popUps[keepCount]" />
    </PopUpWrapper>


    <PrivateFileModal v-model="showPrivateModal" :fileId="fileId" :userInfo="userInfo" />
    <ShareCompanyLinkModal :link="link" :type="type" v-model="showShareCompanyName" />
  </div>
</template>


<script>
import Vue from 'vue'
import PenIcon from '~/components/svg-icons/PenIcon.vue'
import QRCode from 'qrcode'
import SearchIcon from '~/components/svg-icons/SearchIcon.vue'
import FolderIcon from '~/components/svg-icons/FolderIcon.vue'
import FolderSolidIcon from '~/components/svg-icons/FolderSolidIcon.vue'
import ShareIcon from '~/components/svg-icons/ShareIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import ForwardOutlineIcon from '~/components/svg-icons/ForwardOutlineIcon.vue'
import SpinnerDottedIcon from '../components/svg-icons/SpinnerDottedIcon.vue'
import ArrowDownIcon from '~/components/svg-icons/ArrowDownIcon.vue'
import FilePagination from '~/components/pagination/FilePagination.vue'
import ShareFileOptions from '~/components/profile/components/ShareFileOptions.vue'
import ShareIconFunc from '~/components/search-strips/component/ShareIconFunc.vue'
import ShareFolder from '~/components/search-strips/component/ShareFolder.vue'
import PrivateFileModal from '~/components/profile/modal/PrivateFileModal.vue'
import FilePrivacy from '~/models/FilePrivacy'
import ShareCompanyLinkModal from '~/components/company-files/ShareCompanyLinkModal.vue'
import PopUpWrapper from '~/components/dashboard/PopUps/PopUpWrapper.vue'
import PG_Tutorial_1 from "~/components/profile/modal/PopUps/PG_Tutorial_1.vue"
import PG_Tutorial_2 from "~/components/profile/modal/PopUps/PG_Tutorial_2.vue"
import PG_Tutorial_3 from "~/components/profile/modal/PopUps/PG_Tutorial_3.vue"
import PG_Tutorial_4 from "~/components/profile/modal/PopUps/PG_Tutorial_4.vue"
import PG_Tutorial_5 from "~/components/profile/modal/PopUps/PG_Tutorial_5.vue"
import PG_Tutorial_6 from "~/components/profile/modal/PopUps/PG_Tutorial_6.vue"
import PG_Tutorial_7 from "~/components/profile/modal/PopUps/PG_Tutorial_7.vue"
import PG_Tutorial_8 from "~/components/profile/modal/PopUps/PG_Tutorial_8.vue"
import DownloadPwa from "~/components/DownloadPwa.vue"
import UserTypeEnum from '~/models/UserTypeEnum'
import BusinessPageFilesInFolder from '~/components/profile/components/BusinessPageFilesInFolder.vue'
import EllipsisIconVerticalIcon from "../components/svg-icons/EllipsisIconVerticalIcon.vue";
import FileAction from "~/models/FileAction";



export default Vue.extend({
  components: {
    PenIcon,
    SearchIcon,
    FolderIcon,
    FolderSolidIcon,
    ShareIcon,
    ShareOutlineIcon,
    HeartOutlineIcon,
    ForwardOutlineIcon,
    SpinnerDottedIcon,
    ArrowDownIcon,
    FilePagination,
    ShareFolder,
    ShareFileOptions,
    ShareIconFunc,
    PrivateFileModal,
    ShareCompanyLinkModal,
    ShareOutlineIcon,
    PopUpWrapper,
    PG_Tutorial_1,
    PG_Tutorial_2,
    PG_Tutorial_3,
    PG_Tutorial_4,
    PG_Tutorial_5,
    PG_Tutorial_6,
    PG_Tutorial_7,
    PG_Tutorial_8,
    BusinessPageFilesInFolder,
    EllipsisIconVerticalIcon,
    DownloadPwa
  },
  name: 'PublicProfilePage',
  layout: 'profile',
  auth: false,
  // middleware: ['paid-user'],
  async asyncData({ store, params, $axios, error }) {
    store.commit('SET_PAGE_NAME', { name: 'Profile' })
    const userInfo = await $axios
      .$get(`users/?businessPage=${params?.id}`)
      .then((response) => {
        const [userInfo] = response.data
        if (!userInfo) error({ statusCode: 404 })
        return userInfo
      })
      .catch((err) => {
        error({
          statusCode: 404,
          message: err.message,
        })
      })

    return { userInfo }
  },

  mounted() {
    this.getUserFiles(this.returnedDataPage, this.searchFileParam)
    this.fetchFolder(this.returnedFolderPage)
    this.generateQR()
    window.addEventListener('beforeinstallprompt', event => {
      console.log(event)

      // Prevent the default event to not show the browser's install prompt
      // event.preventDefault();
      // Store the event for later use
      this.$store.commit('setDeferredPrompt', event);
      // Set a flag to indicate that the user can install the PWA
      this.$store.commit('setCanInstallPWA', true);
    });
    // document.body.style.overflow = 'auto'
  },
  computed: {
    isAuthor() {
      return this.$auth?.user?.id == this.userInfo?.id
    },
  },
  filters: {
    removeExtension(filename) {
      return (filename || "").replace(/\.[^\/.]+$/, '');
    }
  },

  data() {
    return {
      returnedDataPage: 0,
      returnedFolderPage: 0,
      totalFile: null,
      totalFolder: null,
      searchFolderParam: '',
      searchFileParam: '',
      folders: [],
      files: [],
      show: false,
      showFile: false,
      fileSpinner: true,
      folderSpinner: true,
      checkWEmptyFileFolder: false,
      showFolders: false,
      showSearch: false,
      isFetched: false,
      showPrivateModal: false,
      showShareCompanyName: false,
      isCompanyShare: false,
      link: "",
      keepCount: 0,
      showGuideModal: false,
      type: "",
      permissionDecode: undefined,
      folderSpinner: false,
      totalFolder: 0,
      currentFolder: {},
      showFolderFiles: false,
      tabNumber: 1,
      isFolderTabSelected: false,
      FileAction,
      fileLimit: 10,
      folderLimit: 10,

      popUps: [
        'PG_Tutorial_1',
        'PG_Tutorial_2',
        'PG_Tutorial_3',
        'PG_Tutorial_4',
        'PG_Tutorial_5',
        'PG_Tutorial_6',
        "PG_Tutorial_7",
        'PG_Tutorial_8'
      ],
      fileId: ''
    }
  },
  methods: {

    seeAll() {
      this.returnedDataPage = 0;
      this.fileLimit = 1000000;
    },
    seeAllFolder() {
      this.returnedFolderPage = 0;
      this.folderLimit = 1000000;
    },
    changeTab(num) {
      this.tabNumber = num;
      // this.setRefresh();
      if (num === 1) return (this.showFolderFiles = false);
    },
    emitPrivateModal(val) {
      this.fileId = val.id
      this.showPrivateModal = true
    },
    showFolderFilesFunc(val) {
      this.currentFolder = val
      this.showFolderFiles = true
    },
    async increaseCount() {
      this.keepCount = this.keepCount + 1
      if (this.keepCount == this.popUps.length) {
        this.showGuideModal = false
        // await this.updateTutorialStatus()
        // await this.filterUsers()
        document.body.style.overflow = 'auto'
      }
    },
    handleCompanyNameShare(name, link) {
      this.isCompanyShare = true
      let linkRX = `${window.location.origin}/${link}`
      this.shareLink(linkRX, name)
    },
    shareLinkFunc(val, type) {
      this.shareLink(`${window.location.origin}/pdf/${val}`, type)
    },
    shareLink(val, type) {
      this.link = val
      this.type = type
      this.showShareCompanyName = true

    },
    routeToFileManager(val, privacy, id) {
      // return console.log(val, 'privacy changes to have')
      this.fileId = id
      if (privacy === FilePrivacy.PRIVATE) this.showPrivateModal = true
      else {
        localStorage.setItem('store_public_profile_path', this.$route.fullPath)
        this.$router.push(val)
        localStorage.setItem("from_publicpage", JSON.stringify({ fromBusiness: true }))
      }
    },
    // getMainPaidUser(val) {
    //   this.$axios.get(`/users/?mainAccountId=${val}&role=${UserTypeEnum.PAID}`)
    //     .then((response) => {
    //       this.userInfo = response.data.data[0]
    //     })
    // },
    setFilePage(page) {
      this.fileSpinner = true
      this.returnedDataPage = page
    },
    setFolderPage(page) {
      this.folderSpinner = true
      this.returnedFolderPage = page
    },
    async getUserFiles(page, search) {
      await this.$axios
        .$post(`/files`, {
          action: "filesWithoutFolder",
          skip: page,
          limit: this.fileLimit,
          userId: this.userInfo?.id,

        })
        .then((response) => {
          const filesData = response.data.map((el) => {
            return el
          })
          this.files = filesData
          this.isFetched = true

          console.log(response, 'file data found')

          this.checkWEmptyFileFolder = filesData <= 0
          this.totalFile = response.total
        })
        .finally(() => {
          this.fileSpinner = false;
        });
    },
    async fetchFolder(page) {
      this.folderSpinner = true;
      await this.$axios
        .$get(`/folders/?userId=${this.userInfo?.id}&$skip=${page}&isPrivate=0&$sort[createdAt]=-1&$limit=${this.folderLimit}`)
        .then((response) => {
          console.table(response.data, 'table data')
          this.totalFolder = response.total;
          this.folders = response.data;
          this.folderSpinner = false
        })
        .finally(() => {
          this.folderSpinner = false;
        });
    },
    async generateQR() {
      QRCode.toCanvas(this.$refs.qrcancas, location.href, function () { })
      await this.$nextTick()
    },
  },
  watch: {
    fileLimit: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.fileSpinner = true;
        this.getUserFiles(this.returnedDataPage,);
      }, 500);
    },
    folderLimit: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.fetchFolder(this.returnedFolderPage)
      }, 500);
    },
    "$auth.user.id": function () {
      this.getUserFiles(this.returnedDataPage, this.searchFileParam)
      this.$auth.setUser({})
    },
    returnedFolderPage: function () {
      this.fetchFolder(this.returnedFolderPage)
    },
    searchFileParam() {
      this.getUserFiles(this.returnedDataPage, this.searchFileParam)
    },
    returnedDataPage() {
      this.getUserFiles(this.returnedDataPage, this.searchFileParam)
    }
  },
})
</script>
<style lang="scss">
.el-notification {
  z-index: 999999 !important;
}

.folder-border {
  @apply border-b border-[#DCDCDC];

  &:nth-last-child(1) {
    border: none
  }
}

.tab {
  @apply w-[70px] md:w-[120px] text-[0.8rem] md:text-[0.9rem] cursor-pointer flex font-[500] items-center pl-[8px] text-[#000] border-[#77B550] rounded-t-[10px] shadow-lg border-[2px] h-[25px] bg-[#fff];
}

.active-tab {
  @apply text-sm tab text-white;
  background-color: #77B550;
  color: #fff;

}

#bottom-nav {
  display: none !important;
}
</style>