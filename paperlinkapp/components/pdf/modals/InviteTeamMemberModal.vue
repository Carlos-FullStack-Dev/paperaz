<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    :close-on-click-modal="false"
    style=""
    :show-close="false"
    center
    class="relative"
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
      <h4 class="font-semibold text-xl text-gray-800 pt-0 text-center">
        Add Team Member
      </h4>
    </template>
    <!-- Start:: Body -->
    <form @submit.prevent>
      <div class="my-1">
        <el-input
          :disabled="true"
          placeholder="aamamun.xyz@gmail.com"
          type="email"
          v-model="email"
        />
      </div>
      <div class="my-2">
        <el-input
          :disabled="isLoading"
          placeholder="Name"
          type="text"
          v-model="name"
          required
        />
      </div>
      <div
        v-if="name && name.split(' ').length <= 1"
        class="text-[11px] text-red-500"
      >
        Please input full name
      </div>

      <div class="my-2">
        <el-input
          :disabled="isLoading"
          placeholder="Create password"
          type="password"
          v-model="password"
          required
        />
      </div>

      <div class="my-2">
        <el-input
          :disabled="isLoading"
          placeholder="Retype password"
          type="password"
          v-model="confirmPassword"
          required
        />
      </div>
      <div v-if="password != confirmPassword" class="text-[11px] text-red-500">
        Password does not match
      </div>

      <div class="flex justify-center my-2 mt-4">
        <button
          :class="[!isDisabled ? 'opacity-50' : 'opacity-100']"
          @click="resetTeamMember"
          class="w-10/12 py-2 text-center bg-paperdazgreen-300 text-white rounded-md flex items-center justify-center"
        >
          Continue
          <SpinnerDottedIcon
            v-if="isLoading"
            style="margin-left: 10px"
            class="animate-spin"
            width="20"
            height="20"
          />
        </button>
      </div>
    </form>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import AuthUser from '~/models/AuthUser'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'

export default Vue.extend({
  name: 'InviteTeamMemberModal',
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    reachLimit: {
      type: Boolean,
    },
  },
  data() {
    return {
      showModal: false,
      email: '',
      access: '',
      teamInviteLink: '',
      isLoading: false,
      name: '',
      password: '',
      confirmPassword: '',
      decodedUserInfo: {},
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
      this.teamInviteLink = `${window.location.origin}/register/?teamId=${this.$auth.user?.id}`
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  computed: {
    isDisabled() {
      return (
        (this.password === this.confirmPassword && this.name != '') ||
        this.isLoading
      )
    },
    teamPayload() {
      return {
        firstName: this.name.split(' ')[0],
        lastName: this.name.split(' ')[1],
        action: 'team_member_update_password',
        password: this.password,
      }
    },
  },
  mounted() {
    this.showModal = this.visible
    this.teamInviteLink = `${window.location.origin}/register/?teamId=${this.$auth.user?.id}`
    this.getTokenValue()
  },
  methods: {
    getTokenValue() {
      const teamParams = this.$route.query.team_reset_token
      if (!teamParams) return
      let encodedUser = jwt.verify(
        teamParams,
        process.env.NUXT_ENV_BACKEND_JWT_TOKEN
      )
      this.decodedUserInfo = encodedUser.data
      this.email = this.decodedUserInfo?.email
    },
    resetTeamMember() {
      this.isLoading = true
      this.$axios
        .patch(`users/${this.decodedUserInfo.userId}`, this.teamPayload)
        .then(() => {
          this.closeModal()
          this.logout()
          this.$router.push('/login')
        })
        .finally(() => (this.isLoading = true))
    },
    closeModal() {
      this.$emit('updateVisibility', false)
    },
  },
  components: { SpinnerDottedIcon },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 500px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}
* >>> .el-dialog__header {
  padding-bottom: 20px;
  border-bottom: 1px solid #dadada;
}

* >>> .el-dialog__footer {
  border-top: 1px solid #dadada;
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
