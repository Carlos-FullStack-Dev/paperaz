<template>
  <nav
    class="px-3 px-lg-5 bg-white lg:rounded-lg w-full flex items-center justify-between shadow"
    :class="[compact ? 'py-1 h-12' : 'min-h-[60px] sm:min-h-[70px] py-4 h-16']"
  >
    <p
      class="capitalize inline-flex items-center gap-3"
      :class="[compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl']"
    >
      <span
        class="inline-block lg:hidden mr-3 sm:mr-4 cursor-pointer"
        @click="$emit('open-sidebar')"
        ><hamburger-icon class="hidden md:inline-block" /></span
      ><abbr class="whitespace-nowrap">{{
        switchedAccount || $auth.user.companyName
          ? switchedAccount.companyName || $auth.user.companyName
          : ''
      }}</abbr>
    </p>

    <div v-if="$auth.loggedIn" class="h-full self-stretch flex items-center">
      <!-- Start:: search -->

      <!-- container for user name -->
      <div
        v-if="login || false"
        class="hidden lg:flex flex-col mr-3 text-sm leading-[15px] flex-wrap justify-end"
      >
        <span class="text-black text-[13px] font-[600] capitalize text-right">
          {{ switchedAccount.email || user.email }}
        </span>
      </div>
      <!-- end of container for user name -->

      <!-- <--- START: navbar dropdown --- -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="flex items-center el-dropdown-link">
          <letter-avatar
            v-if="
              (switchedAccount.id && !switchedAccount.profilePicture) ||
              (!$auth.user.profilePicture && !switchedAccount.id)
            "
            style="width: 43px; height: 43px"
            class="h-[28px] w-[28px] rounded-1 object-cover cursor-pointer mr-1"
            :username="
              extractedUserName(
                switchedAccount.id
                  ? switchedAccount.companyName
                  : userCompanyName || userFullName
              )
            "
          />
          <span
            v-else
            class="border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative text-center"
            :class="[
              isPaidUser
                ? 'w-[45px] h-[45px] rounded-md'
                : 'circle-20 rounded-full',
            ]"
            style="borderwidth: 1px"
          >
            <img
              v-if="isPaidUser"
              :src="switchedAccount.profilePicture || profilePhoto"
              class="w-full h-full profilePhoto"
              alt=""
              :class="[isPaidUser ? 'rounded-md' : 'rounded-full']"
            />
          </span>
          <span class="text-black"
            ><arrow-down-icon class="h-2 w-3 sm:h-2.5 sm:w-4"
          /></span>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="flex items-center"
            v-for="team in account.filter((v) => v.isMainAccount)"
            :key="team.id"
          >
            <span
              class="inline-flex gap-2 items-center border-b-2 border-gray-200 mb-2 pb-2"
              @click="setTeams(team)"
            >
              <letter-avatar
                v-if="!team.profilePicture"
                style="width: 33px; height: 33px"
                class="h-[20px] w-[20px] rounded-1 object-cover cursor-pointer mr-1"
                :username="
                  team.companyName || team.firstName + ' ' + team.lastName
                "
              />
              <span
                v-else
                class="border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative text-center w-[33px] h-[33px] rounded-md"
                style="borderwidth: 1px"
              >
                <img
                  :src="team.profilePicture"
                  class="w-full h-full profilePhoto rounded-md"
                  alt=""
                />
              </span>
              {{
                team.companyName
                  ? team.companyName
                  : team.firstName + ' ' + team.lastName
              }}</span
            >
          </el-dropdown-item>
          <el-dropdown-item
            class="flex items-center"
            v-for="team in account"
            :key="team.id"
          >
            <span
              class="inline-flex gap-2 items-center py-1"
              @click="setTeams(team)"
            >
              <letter-avatar
                v-if="!team.companyProfilePicture"
                style="width: 33px; height: 33px"
                class="h-[20px] w-[20px] rounded-1 object-cover cursor-pointer mr-1"
                :username="getNames(team)"
              />
              <span
                v-else
                class="border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative text-center w-[33px] h-[33px] rounded-md"
                style="borderwidth: 1px"
              >
                <img
                  :src="team.companyProfilePicture"
                  class="w-full h-full profilePhoto rounded-md"
                  alt=""
                />
              </span>
              {{
                team.companyName
                  ? team.companyName
                  : team.companyFirstName + ' ' + team.companyLastName
              }}</span
            >
          </el-dropdown-item>
          <el-dropdown-item
            v-if="!switchedAccount.id"
            divided
            command="profile"
          >
            <span class="inline-flex gap-2 items-center">
              <user-profile-solid-icon height="14" width="14" />
              Profile</span
            >
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <span class="text-red-600 inline-flex gap-2 items-center">
              <sign-out-icon height="14" width="14" />
              Logout</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
        <!-- <--- END: navbar dropdown --- -->
      </el-dropdown>
    </div>

    <landing-page-search-modal v-model="showLandingPageSearchModal" />
  </nav>
</template>

<script>
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'
import ArrowDownIcon from '../svg-icons/ArrowDownIcon.vue'
import BellIcon from '../svg-icons/BellIcon.vue'
import GearIcon from '../svg-icons/GearIcon.vue'
import HamburgerIcon from '../svg-icons/HamburgerIcon.vue'
import HeartOutlineIcon from '../svg-icons/HeartOutlineIcon.vue'
import NotificationDropdownIcon from '../svg-icons/NotificationDropdownIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import ShareOutlineIcon from '../svg-icons/ShareOutlineIcon.vue'
import SignOutIcon from '../svg-icons/SignOutIcon.vue'
import UserProfileIcon from '../svg-icons/UserProfileIcon.vue'
import UserProfileSolidIcon from '../svg-icons/UserProfileSolidIcon.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import login from '@/mixins/login'
import TrashCanIcon from '../svg-icons/TrashCanIcon.vue'
import SpinnerDottedIcon from '../svg-icons/SpinnerDottedIcon.vue'
import StatusUser from '~/models/StatusUser'
import LandingPageSearchModal from '../landing/LandingPageSearchModal.vue'
import SearchInput from './SearchInput.vue'
import LetterAvatar from '../widgets/LetterAvatar.vue'

// email-acout emauil,password-referal-code
export default mixins(GlobalMixin, login).extend({
  name: 'DashboardNavbar',
  components: {
    SearchIcon,
    BellIcon,
    GearIcon,
    ArrowDownIcon,
    HamburgerIcon,
    SignOutIcon,
    UserProfileIcon,
    UserProfileSolidIcon,
    NotificationDropdownIcon,
    HeartOutlineIcon,
    ShareOutlineIcon,
    TrashCanIcon,
    SpinnerDottedIcon,
    SpinnerDottedIcon,
    SearchIcon,
    LandingPageSearchModal,
    SearchInput,
    LetterAvatar,
  },
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  filters: {
    removeExtension(filename) {
      return filename?.replace(/\.[^\/.]+$/, '')
    },
  },
  data() {
    return {
      profile: '',
      account: [],
      notification: [],
      notificationSpinner: false,
      notificationPage: 0,
      totalNotification: null,
      notificationPerPage: 10,
      isLoadedSuccess: false,
      isRead: true,
      showLandingPageSearchModal: false,
      _cancleReloadUsers: false,
      teams: [],
    }
  },
  computed: {
    routeName() {
      return (this.$nuxt.$route.name || '').replace(/-/g, ' ')
    },
    switchedAccount() {
      return JSON.parse(localStorage.getItem('team_prop')) || {}
    },
    user() {
      return this.$auth?.user
    },
    loadMoreNotifications() {
      return (
        this.totalNotification > this.notificationPage &&
        this.totalNotification > this.notificationPerPage
      )
    },
    isPaidUser() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return true
        case UserTypeEnum.TEAM:
          return true
        case UserTypeEnum.FREE:
          return this.switchedAccount?.id ? true : false
      }
    },

    userFullName() {
      return this.isPaidUser
        ? this.user?.firstName + ' ' + this.user?.lastName
        : (this.user || {})?.email
    },
    userCompanyName() {
      return this.isPaidUser
        ? (this.user || {})?.companyName
        : this.user?.firstName + ' ' + this.user?.lastName
    },
    login() {
      return this.$auth?.loggedIn
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto
    },
  },
  methods: {
    extractedUserName(val) {
      return (val || '').split(' ').slice(0, 2).join(' ')
    },
    getNames(val) {
      let name = val.companyName
        ? `${val.companyName}`
        : `${val?.firstName} ${val.lastName}`
      return (name || '').split(' ').slice(0, 2).join(' ')
    },
    filterOutActiveTeamAccount() {
      let id = localStorage.getItem('team_id')
      this.account = this.account.filter((v) => v.ownersId != id)
    },
    isAccountPaid(val) {
      return val == UserTypeEnum.FREE
    },
    setTeams(v) {
      if (v.isOwner) {
        localStorage.removeItem('team_id')
        localStorage.removeItem('team_prop')
        this.$router.push('/paperlink-pages')
        window.location.reload()
        return
      }
      localStorage.setItem('team_id', v.ownersId)
      localStorage.setItem('team_prop', JSON.stringify(v))
      this.$router.push('/paperlink-pages')
      window.location.reload()
    },
    checkStatus(val) {
      switch (val) {
        case StatusUser.ACTIVE:
          return 'activeIcon'
        case StatusUser.DISABLE:
          return 'disableIcon'
        case StatusUser.PENDING:
          return 'pendingIcon'
      }
    },
    _refetchNotification() {
      if (this.totalNotification >= this.notificationPage)
        this.notificationPage = this.notificationPage + this.notificationPerPage
    },
    _isStatusActive(account) {
      return account.status == StatusUser.ACTIVE
    },
    readNotification() {
      if (this.notification[0]?.isRead == 1 || this.notification.length < 1)
        return
      this.$axios.patch(`/notification/${(this.notification[0] || []).id}`, {
        isRead: 1,
      })
      this.isRead = true
    },
    async deleteNotification(id) {
      this.notificationSpinner = true
      await this.$axios
        .$delete(`/notification/${id}`)
        .then(async () => {
          this.notification = this.notification.filter((el) => el.id != id)
        })
        .finally(() => {
          this.notificationSpinner = false
        })
      // this.getUserNotification()
    },
    async fetchMainTeam() {
      // if (this._cancleReloadUsers) return;
      await this.$axios
        .get(`/teammembers?userId=${this.$auth.user?.id}`)
        .then((response) => {
          this.account = response.data.data
          this.filterOutActiveTeamAccount()
        })
    },
    async getUserNotification(page) {
      await this.$axios
        .$get(
          `/notification?$sort[createdAt]=-1&userId=${this.$auth?.user?.id}&$skip=${page}`
        )
        .then((response) => {
          this.notification = [...this.notification, ...response.data]
          this.isRead = this.notification[0]?.isRead == 1
          this.totalNotification = response.total
          this.isLoadedSuccess = true
        })
    },
    async switchAccount(val, status) {
      if (this.$route.path.includes('pdf')) {
        this.$notify.error({
          title: '',
          message: `Cannot switch account in file manager`,
        })
        return
      }
      if (StatusUser.ACTIVE != status) {
        this.$notify.error({
          title: '',
          message: `Oops cannot switch, account is ${status} contact team`,
        })
        return
      }

      let filteredAccount = this.account.filter(
        (element) => element.id == val
      )[0]

      if (
        this.$auth?.user?.role == UserTypeEnum.TEAM ||
        this.$auth?.user?.role == UserTypeEnum.PAID
      ) {
        this.$auth.strategy.token.set(
          localStorage.getItem('main_user_paperdaz_token')
        )
        localStorage.setItem('paperdaz_userID', filteredAccount.id)
        window.location.assign('/paperlink-pages')
        return
      }
      // get switching account user details
      let user = {
        email: filteredAccount.email,
        password: this.$auth?.user?.referralCode,
        strategy: 'local',
      }
      // making axios request to login
      await this.$axios
        .$post(`/authentication`, user)
        .then(async (response) => {
          this.$auth.strategy.token.set(response.accessToken)
          localStorage.setItem('paperdaz_userID', response.user.id)
          window.location.assign('/paperlink-pages')
          // this.$auth.strategy.token.set('...')
          //@ts-ignore
          // await this.loginUser(response)
        })
        .catch((error) => {})
        .finally(() => {
          // this.isLoading = false
        })
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          localStorage.removeItem('redirect_paperdaz_path')
          this.logout()
          break
        case 'profile':
          this.$nuxt.$router.push('/settings?tab=account')
          break
        case 'dashboard':
          this.$nuxt.$router.push('/paperlink-pages')
          break
        case 'settings':
          this.$nuxt.$router.push('/settings')
          break
      }
    },
    setProfileDisplay(data) {
      this.profile = data
    },
  },
  watch: {
    teams(val) {
      if (this.$auth.user.role != UserTypeEnum.PAID) {
        localStorage.setItem('team_prop', JSON.stringify(val[0]))
        localStorage.setItem('team_id', JSON.stringify(val[0].id))
      }
    },
    $route(to, from) {
      if (to.name.includes('profile')) {
        this.setProfileDisplay(true)
      } else {
        this.setProfileDisplay(false)
      }
    },
    '$auth.user': function () {
      this.fetchMainTeam()
      this.getUserNotification(this.notificationPage)
    },
    notificationPage: function () {
      this.getUserNotification(this.notificationPage)
    },
  },
  mounted() {
    if (!this.user?.id) return
    this.fetchMainTeam()
    this.getUserNotification()
  },
})
</script>

<style scoped lang="scss">
.profile-circle {
  --circle-size: 20;
  height: calc(2px * var(--circle-size));
  width: calc(2px * var(--circle-size));
  min-height: calc(2px * var(--circle-size));
  min-width: calc(2px * var(--circle-size));

  @media screen and (min-width: 640px) {
    --circle-size: 22;
  }
}

.notifyBox:hover .trash-box {
  transition: 0.3s;
  right: 0px;
}

.activeIcon {
  @apply bg-green-400;
  box-shadow: 0 0 0 1px rgb(74 222 128);
}

.disableIcon {
  @apply bg-[#909090];
  box-shadow: 0 0 0 1px #909090;
}

.pendingIcon {
  @apply bg-[#5078b5];
  box-shadow: 0 0 0 1px #5078b5;
}

.el-dropdown-indicator {
  @apply absolute w-[10px] h-[10px] rounded-full bg-red-500 top-[2px] left-2 border-[2px] border-white;
}
</style>
