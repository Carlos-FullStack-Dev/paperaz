<template>
  <div class="rounded-2xl reltive w-full md:min-w-[300px] overflow-x-auto custom-scrollbar relative mt-4 bg-white">
    <div v-if="fileSpinner "  class=" w-full absolute h-[100px]">
      <!-- START: spinner container -->
      <div class="  w-full h-full rounded-lg flex justify-center items-center">
        <spinner-dotted-icon class="text-paperdazgreen-400 animate-spin" />
      </div>
      <!-- END: spinner container -->
    </div>
    <table class="custom-table py-2">
      <thead class="text-[#414142]">
        <tr>
          <!-- <th class="w-12 text-center fixed-col left">No</th> -->
          <th class="text-left font-[700] hidden md:table-cell ">File Name </th>

          <th class="hidden md:table-cell">Action</th>
          <th class="hidden md:table-cell">Privacy</th>
          <!-- <th v-show="allFiles.length > 10" class=" font-[700]  right"> -->
          <!-- <form  @submit.prevent
                  class="flex flex-1 justify-end items-center gap-2 text-xs text-gray-800 relative">
                  <span v-if="showFile" class="el-dropdown-link max-sm:flex-1 absolute top-[-30px] ">
                    <input type="text" placeholder="Search any file..."
                      class="rounded-lg border !border-paperdazgreen-400 px-2 h-7 w-full sm:w-[165px] md:w-48  placeholder:italic"
                      v-model="searchFileParam" />
                  </span>
                  <button @click="showFile = !showFile" type="button"
                    class="circle circle-15 bg-paperdazgreen-400 text-white">
                    <search-icon width="14" height="14" currentcolor="white" />
                  </button>
                </form> -->
          <!-- </th> -->
        </tr>
      </thead>
      <tbody class="text-[#505050]">
        <tr v-for="(item, i) in allFiles" :key="i">
          <!-- <td class="w-12 text-center fixed-col left">{{ i + 1 }}</td> -->
          <td class="row">
            <div class="flex  items-center">
              <img src="/icon.png" class="mr-3" width="23" height="23" />
              <div class="">
                <p class="text-[#414142] whitespace-nowrap truncate text-[15px]">
                <p @click="routeToFileManager(`/pdf/${item.paperLink}`, item.filePrivacy, item.id)"
                  class="cursor-pointer  transition-all hover:text-paperdazgreen-700 hover:scale-95 capitalize">
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
                  <p @click="shareLinkFF(item.paperLink, item.fileName)" class="capitalize  text-[#1400FF]">
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
            <div @click="shareLinkFF(item.paperLink, item.fileName)"
              class=" w-[100px] hidden md:flex cursor-pointer sm:w-full   justify-end ">
              <ShareOutlineIcon />
            </div>
          </td>
        </tr>
      </tbody>
    </table>


    <div v-show="this.totalFile > 10 && fileLimit <= 10" class="flex justify-center items-center flex-wrap  w-full">
      <FilePagination :totalFile="totalFile" @setPage="setFilePage" />
      <button @click="seeAll()"
        class="px-3 py-2 ml-[-30px] border-2 rounded-[8px] border-solid boder-[1px] text-paperdazgreen-400 text-[0.8rem] border-paperdazgreen-400 bg-transparent hover:bg-paperdazgreen-70 transition duration-0 hover:duration-150">
        See all
      </button>
    </div>

  </div>
</template>

<script>
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import FilePrivacy from '~/models/FilePrivacy';
import FilePagination from '~/components/pagination/FilePagination.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'



export default {
  components: {
    ShareOutlineIcon,
    FilePagination,
    SpinnerDottedIcon,
  },
  data() {
    return {
      allFiles: [],
      returnedDataPage: 0,
      totalFile: null,
      fileLimit: 10,
      fileSpinner: true,
    }
  },
  filters: {
    removeExtension(filename) {
      return (filename || "").replace(/\.[^\/.]+$/, '');
    }
  },
  mounted() {
    this.getAllFilesInFolder(this.returnedDataPage,)

  },
  activated() {
    this.getAllFilesInFolder(this.returnedDataPage,)
  },
  props: ['currentFolder'],
  methods: {
    seeAll() {
      this.returnedDataPage = 0;
      this.fileLimit = 1000000;
    },
    setFilePage(page) {
      this.fileSpinner = true
      this.returnedDataPage = page
    },
    getAllFilesInFolder(page) {
      this.fileSpinner = true
      this.$axios.get(`/files?folderId=${this.currentFolder.id}&$sort[positionInFolder]=1&$skip=${page}&$limit=${this.fileLimit}`)
        .then((res) => {
          this.allFiles = res.data.data
          this.totalFile = res.data.total
        }).catch(() => {
          this.$notify.error({
            title: '',
            message: "Could not fetch files in folder"
          })
        })
        .finally(() => {
          this.fileSpinner = false
        })
    },
    shareLinkFF(val, type) {
      let link = `${window.location.origin}/pdf/${val}`
      this.$emit("handleShareInFolderFile", link, type)
    },
    routeToFileManager(val, privacy, id, item) {
      this.fileId = id
      if (privacy == FilePrivacy.PRIVATE) this.$emit('emitPrivateModal', item)
      else {
        localStorage.setItem('store_public_profile_path', this.$route.fullPath)
        this.$router.push(val)
        localStorage.setItem("from_publicpage", JSON.stringify({ fromBusiness: true }))
      }
    },
    shareLink(val, type) {
      this.link = val
      this.type = type
      this.showShareCompanyName = true
    },
  },

  watch: {
    fileLimit: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.fileSpinner = true;
        this.getAllFilesInFolder(this.returnedDataPage,);
      }, 500);
    },
    returnedDataPage() {
      this.getAllFilesInFolder(this.returnedDataPage,);
    }
  }
}
</script>

<style lang="scss" scoped></style>