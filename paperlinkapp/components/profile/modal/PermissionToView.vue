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
      <h4 class="text-center font-semibold text-xl">
        {{ file?.fileName?.replace('.pdf', '') }}
      </h4>
    </template>
    <!-- Start:: Body -->
    <p class="py-3 text-center text-paperdazgreen-300">Private Access</p>
    <form
      @submit.prevent="sendInvite"
      class="border-[1px] mr-4 border-paperdazgreen-300 rounded-md flex justify-between items-center p-[2px]"
    >
      <input
        v-model="invite_email"
        class="flex-1 py-2 px-2 rounded-md bg-transparent outline-none border-none"
        placeholder="Email"
        type="email"
        required
      />
      <button
        class="px-3 py-2 transition-all hover:bg-[#366425] bg-[#5FA347] text-white rounded-lg"
      >
        <span class="inline-flex items-center gap-3">
          <span v-show="!isLoading">Invite</span>
          <transition name="fade" :duration="100">
            <span v-show="isLoading" class="animate-spin">
              <spinner-dotted-icon height="22" width="22" />
            </span>
          </transition>
        </span>
      </button>
    </form>

    <div class="mt-10">
      <div v-if="loadingPermission" class="flex justify-center w-full py-8">
        <SquareLoader />
      </div>
      <div
        v-if="!loadingPermission"
        class="flex items-center w-full border-t-[1px] border-gray-100 py-3"
        v-for="invite in permissions"
        :key="index"
      >
        <div class="items-center flex w-[calc(100%-130px)]">
          <div class="text-[0.8rem] w-5/12 lg:text-[0.8rem] truncate">
            {{ invite.email ?? '' }}
          </div>
          <div class="text-[0.8rem] w-4/12 lg:text-[0.8] truncate">
            {{ invite.name ?? '' }}
          </div>
          <div
            class="text-[0.8rem] lg:text-[0.8rem] w-3/12 hidden sm:inline-block"
            :class="[
              invite.isGranted == 0 ? 'text-red-500' : 'text-paperdazgreen-300',
            ]"
          >
            {{ invite.isGranted == 0 ? 'Pending' : 'Approved' }}
          </div>
        </div>
        <div class="flex justify-end items-center w-[130px]">
          <button
            class="ml-4 w-[30px] flex justify-end"
            @click="approveInvite(invite.id)"
            v-if="invite.isGranted == 0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
            >
              <path
                d="M6.00016 11.1698L1.83016 6.99984L0.410156 8.40984L6.00016 13.9998L18.0002 1.99984L16.5902 0.589844L6.00016 11.1698Z"
                fill="#75C05F"
              />
            </svg>
          </button>
          <button
            class="ml-4 w-[25px] flex justify-end"
            @click="disApproveInvite(invite.id)"
          >
            <img class="h-[30px]" src="~/assets/icons/cross.svg" alt="" />
          </button>

          <button
            class="ml-4 w-[25px] flex justify-end"
            @click="deleteInvite(invite.id)"
          >
            <img class="h-[30px]" src="~/assets/icons/Delete.svg" alt="" />
          </button>
        </div>
      </div>
    </div>

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import SquareLoader from '~/components/loader/SquareLoader.vue'

export default Vue.extend({
  name: 'edit-company-folder',
  components: { SpinnerDottedIcon, SquareLoader },

  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    packagename: {
      type: String,
    },
    file: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isCreator: {
      type: Boolean,
    },
    fileId: {},
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      loadingPermission: false,
      folderInputData: '',
      permissions: [],
      folder: {},
      invite_email: '',
      isLoading: false,
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
    },
    showModal(val) {
      val ? this.getPermissions() : null
      this.$emit('updateVisibility', val)
      console.log(this.file)
    },
  },
  computed: {
    payload() {
      return {
        action: 'update_permission',
        isGranted: 1,
      }
    },
    DAP_payload() {
      return {
        isGranted: 0,
      }
    },
    sendInvitepayload() {
      return {
        action: 'invite_n_grant_permission',
        fileId: this.fileId,
        name: '',
        email: this.invite_email,
      }
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    async sendInvite() {
      this.isLoading = true
      this.$axios
        .post(`/permissions`, this.sendInvitepayload)
        .then(() => {
          this.invite_email = ''
          this.getPermissions()
          this.$notify.success({
            title: 'Invite',
            message: 'Invite sent successfully',
          })
        })
        .catch(() => {
          this.getPermissions()
          this.$notify.error({
            title: 'Error',
            message: 'Something went wrong',
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    async approveInvite(id) {
      try {
        await this.$axios.patch(`/permissions/${id}`, this.payload)
        this.getPermissions()
      } catch (error) {
        //..
      }
    },
    async disApproveInvite(id) {
      try {
        await this.$axios.patch(`/permissions/${id}`, this.DAP_payload)
        this.getPermissions()
      } catch (error) {
        //..
      }
    },
    async deleteInvite(id) {
      try {
        await this.$axios.delete(`/permissions/${id}`)
        this.getPermissions()
      } catch (error) {
        //..
      }
    },
    async getPermissions() {
      this.loadingPermission = true
      try {
        await this.$axios
          .get(`/permissions?fileId=${this.fileId}`)
          .then((res) => {
            this.permissions = res.data
          })
      } catch (error) {
        //
      } finally {
        this.loadingPermission = false
      }
    },
    filters: {
      removeExtension(filename) {
        return filename?.replace(/\.[^\/.]+$/, '')
      },
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    onSubmit() {
      event?.preventDefault()

      if (this.loading) return

      this.loading = true
      this.errorMessage = ''

      // return
      this.$axios
        .$patch(`/folders/${this.folder.id}`, { name: this.folderInputData })
        .then((response) => {
          this.$notify.success({
            title: 'Folder',
            message: 'Folder name changed successfully',
          })
          this.$emit('updateVisibility', false)
          this.$emit('refresh')
          this.$nuxt.refresh()
        })
        .catch((err) => {
          this.$notify.error({
            title: 'Folder',
            message: 'Unable to change folder name',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 616px !important;
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
