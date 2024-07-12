<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
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
      <h4 class="font-semibold text-xl text-center">Add Member</h4>
    </template>
    <!-- Start:: Body -->
    <div class="flex items-center font-medium mb-6 whitespace-none w-full">
      <div
        class="border-[1px] flex justify-between border-paperdazgreen-300 rounded w-full"
      >
        <input
          type="text"
          class="search-input w-[35%] h-10 transition pl-4 border-r-0 bg-transparent flex-1 focus:border-r-0 outline-none"
          placeholder="Email"
          v-model="email"
        />
        <select
          class="h-10 border-l-0 bg-transparent text-[#878686] text-[12px] -ml-1 mr-2 outline-none text-right"
        >
          <option class="rounded w-[50px]">Manage Company Files</option>
          <option class="rounded w-[50px]">Own Files</option>
          <option class="rounded w-[50px]">Remove Files</option>
        </select>
      </div>
      <button
        class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-[100px] shadow-md ml-3 text-white rounded bg-paperdazgreen-400"
        :disabled="loading"
        @click="sendInviteLink"
      >
        <span class="inline-flex gap-1 items-center text-[16px]">
          Invite
          <spinner-dotted-icon
            v-show="loading"
            height="20"
            width="20"
            class="animate-spin"
          />
        </span>
      </button>
    </div>
    <p class="text-[18px] font-semibold mb-4"> Copy Link</p>
    <ul>
      <li class="flex justify-between mb-3 items-center">
        <div class="flex items-center">
          <span
            class="p-0.5 border-[1px] border-paperdazgreen-400 circle circle-17"
          >
            <img
              src="/img/placeholder_picture.png"
              alt=""
              class="w-full h-full rounded-full"
            />
          </span>
          <p class="text-base font-medium text-[#414142] truncate pt-[6px]">
            <span to="pdf" class="ml-2">
              {{ `${this.$auth.user.companyName}` }}
            </span>
          </p>
        </div>
        <span class="capitalize"> Owner </span>
      </li>
      <li
        v-for="teamMember in teamMembers"
        :key="teamMember.id"
        class="flex justify-between mb-3 items-center"
      >
        <div class="flex items-center">
          <span
            class="p-0.5 border-[1px] border-paperdazgreen-400 circle circle-17"
          >
            <img
              src="/img/placeholder_picture.png"
              alt=""
              class="w-full h-full rounded-full"
            />
          </span>
          <p class="text-base font-medium text-[#414142] truncate pt-[6px]">
            <span to="pdf" class="ml-2">
              {{ `${teamMember?.firstName} ${teamMember?.lastName}` }}
            </span>
          </p>
        </div>
        <span class="capitalize">
          {{ `${(teamMember?.teamAccess || '').replace(/_/g, ' ')}` }}
        </span>
      </li>
    </ul>
    <div class="flex justify-around">
      <div class="w-full text-left border-t-2 border-gray-200 py-3 mt-4">
        <button @click="copyTeamLink" class="flex items-center">
          <link-icon
            width="21"
            height="21"
            color="rgb(59, 130, 246 )"
            class="ml-2"
          />
           Copy Link
        </button>
      </div>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import LinkIcon from '~/components/svg-icons/LinkIcon.vue'

export default Vue.extend({
  name: 'create-team',
  components: { SpinnerDottedIcon, LinkIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      teamMembers: {},
      totalMembers: null,
      email: '',
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
      val ? this.getTeamMember(0) : null
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  computed: {
    teamInviteLink() {
      return `${window.location.origin}/register/?teamId=${this.$auth.user.id}`
    },
  },
  methods: {
    copyTeamLink() {
      navigator.clipboard.writeText(this.teamInviteLink)
      this.$notify.info({
        message: 'Copied',
      })
    },
    async sendInviteLink() {
      if (this.loading) return
      this.loading = true

      let requestData = {
        action: 'invite_link',
        emails: this.email,
        link: this.teamInviteLink,
      }

      await this.$axios
        .$post(`/request`, requestData)
        .then(() => {
          this.$notify.success({
            message: 'Invite sent successfully',
          })
          this.closeModal()
        })
        .catch(() => {
          this.$notify.error({
            message: 'Invite sent failed',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTeamMember(val) {
      this.$axios
        .$get(
          `/users?teamId=${this.$auth.user.id}&$sort[createdAt]=-1&$skip=${val}`
        )
        .then((response) => {
          this.teamMembers = response.data
          this.totalMembers = response.total
        })
        .catch(() => {
          this.$notify.error({
            title: 'teams',
            message: 'Error, could not get teams',
          })
        })
        .finally(() => {
          ;(this.teamSpinner = false), (this.updateTeamSpiunner = false)
        })
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  @apply !w-[90%] sm:!w-[550px] md:!w-[620px];
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
