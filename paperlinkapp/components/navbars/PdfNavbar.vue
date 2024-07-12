<template>
  <nav
    class="px-2 sm:px-3 px-lg-5 bg-white w-full flex items-center justify-between shadow"
    :class="[compact ? 'py-1 h-12' : 'min-h-[60px] sm:min-h-[70px] py-4 h-16']"
  >
    <div
      class="capitalize inline-flex items-center gap-2 lg:gap-3"
      :class="[compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl']"
    >
      <div class="inline-flex items-center gap-1">
        <!-- <a :href="`/public/profile/${title.route}`"  target="_blanck">{{ title.name || routeName }}</a> -->
        <span
          v-if="!isCreator"
          class="border border-paperdazgreen-300 mr-2 p-0.5 w-[40px] h-[40px] rounded-md flex justify-center items-center overflow-hidden relative"
        >
          <img
            v-if="companyPhoto != null"
            :src="companyPhoto"
            class="w-full h-full profilePhoto"
            alt=""
            :class="[isPaidUser ? 'rounded-md' : 'rounded-full']"
          />
          <abbr class="font-bold text-2xl text-paperdazgreen-300" v-else>{{
            (businessName || '').charAt(0)
          }}</abbr>
        </span>
        <span
          v-else
          class="text-3xl font-bold w-full h-full text-center text-paperdazgreen-300 rounded-md"
          style="text-shadow: 1px 2px 3px rgb(200, 200, 200)"
        >
          <img src="/icon.png" class="mr-3" width="23" height="23" />
        </span>

        <!-- <div  class="lg:hidden flex flex-col text-sm leading-[15px] justify-end">
            
          </div> -->

        <span
          v-if="isCreator"
          class="text-black text-[13px] font-[600] text-nowrap capitalize text-left"
        >
          File Manager
        </span>
        <span
          v-else
          class="text-black text-[13px] font-[600] text-nowrap capitalize text-left"
        >
          {{ businessName }}
        </span>
      </div>
    </div>

    <div
      v-if="!FrombusinessPage && $auth.loggedIn"
      class="h-full self-stretch flex items-center"
    >
      <!-- container for user name -->
      <div
        v-if="login || false"
        class="hidden lg:flex flex-col mr-3 text-sm leading-[15px] flex-wrap justify-end"
      >
        <span class="text-black text-[13px] font-[600] capitalize text-right">
          {{ user.email }}
        </span>
      </div>
      <!-- end of container for user name -->

      <!-- <--- START: navbar dropdown --- -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="flex items-center el-dropdown-link">
          <letter-avatar
            :src="
              $auth.user.profilePicture || $_teamOwner?.companyProfilePicture
            "
            style="width: 40px; height: 40px"
            class="h-[28px] w-[28px] rounded-1 object-cover cursor-pointer mr-1"
            :username="user?.companyName || $_teamOwner?.companyName"
          />
          <!-- <span
                    v-else
                        class="border border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative"
                        :class="[
                            isPaidUser
                                ? 'w-[40px] h-[40px] rounded-md'
                                : 'circle-20 rounded-full',
                        ]"
                    >
                        <img
                            :src="profilePhoto"
                            class="w-full h-full profilePhoto"
                            alt=""
                            :class="[
                                isPaidUser ? 'rounded-md' : 'rounded-full',
                            ]"
                        />
                    </span> -->
          <span class="text-black"
            ><arrow-down-icon class="h-2 w-3 sm:h-2.5 sm:w-4"
          /></span>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="logout">
            <span class="text-red-600 inline-flex gap-2 items-center">
              <sign-out-icon height="14" width="14" />
              Logout</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
        <!-- END: navbar dropdown -->
      </el-dropdown>
    </div>

    <div v-else class="flex items-center">
      <span class="mr-3">Guest</span>
      <img
        src="~/assets/img/user-file-icon.svg"
        width="30"
        class="rounded-full mr-2"
      />
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
import SearchShare from '../search-strips/component/SearchShare.vue'
import LetterAvatar from '../widgets/LetterAvatar.vue'

// email-acout emauil,password-referal-code
export default mixins(GlobalMixin, login).extend({
  name: 'PdfNavbar',
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
    SearchShare,
    LetterAvatar,
  },
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
    title: {},
  },
  data() {
    return {
      searchString: '',
      profile: '',
      account: [],
      notification: [],
      notificationSpinner: false,
      notificationPage: 0,
      totalNotification: null,
      topSearchContent: [],
      notificationPerPage: 10,
      isLoadedSuccess: false,
      isRead: true,
      showLandingPageSearchModal: false,
      _cancleReloadUsers: false,
    }
  },
  computed: {
    FrombusinessPage() {
      return (
        JSON.parse(localStorage.getItem('from_publicpage') || '{}')
          ?.fromBusiness ?? true
      )
    },
    file() {
      return this.$store.state?.file
    },
    isCreator() {
      if (this.FrombusinessPage == null) return false
      else if (this.FrombusinessPage) {
        return false
      } else if (
        !this.FrombusinessPage &&
        this.file.userId == this.$auth.user?.id
      ) {
        return true
      } else {
        return false
      }
    },
    searchResult() {
      if (!this.searchString) return []
      return [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
      ]
    },
    routeName() {
      return (this.$nuxt.$route.name || '').replace(/-/g, ' ')
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
          return false
      }
    },

    userFullName() {
      return this.isPaidUser
        ? (this.user || {}).firstName
        : (this.user || {}).email
    },
    userCompanyName() {
      return this.isPaidUser
        ? (this.user || {}).companyName
        : (this.user || {}).firstName
    },
    login() {
      return this.$auth?.loggedIn
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto
    },
    companyPhoto() {
      return this.$store.state?.file?.user?.profile_picture
    },
    businessName() {
      return this.$store.state.file.user
        ? this.$store.state?.file?.user?.company_name
        : ''
    },
  },
  methods: {
    isAccountPaid(val) {
      return val == UserTypeEnum.FREE
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
    async fetchMainTeam(val) {
      if (this._cancleReloadUsers) return
      let fetchUserArray = []

      ;[...val].forEach(async (element) => {
        let fetAccounts =
          element.role == UserTypeEnum.TEAM
            ? element.teamId
            : element.mainAccountId
        await this.$axios.get(`users/${fetAccounts}`).then((response) => {
          if (
            (element.role == UserTypeEnum.TEAM ||
              element.role == UserTypeEnum.PAID) &&
            element.id == this.$auth.user.id
          )
            return

          if (
            element.role == UserTypeEnum.PAID &&
            this.$auth.user.role == UserTypeEnum.FREE
          )
            return

          if (element.role == UserTypeEnum.TEAM) {
            element.teamName =
              response.data.companyName || response.data.firstName
            element.teampicture = response.data.profilePicture
          }

          fetchUserArray.push(element)
          this.account.push(element)
          this._cancleReloadUsers = true
        })
      })

      this.account = [...this.account, ...fetchUserArray]
    },
    async fetchUsersInitialAccount() {
      if (this._cancleReloadUsers) return
      this.account = []
      let initialAccount = {}
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          let paidAcc = await this.$axios.$get(
            `users/${this.$auth?.user?.mainAccountId}&$sort[createdAt]=-1`
          )
          initialAccount = [{ ...paidAcc }]
          break

        case UserTypeEnum.TEAM:
          let teamAcc = await this.$axios.$get(
            `users/${this.$auth?.user?.mainAccountId}&$sort[createdAt]=-1`
          )
          initialAccount = [{ ...teamAcc }]
          break

        case UserTypeEnum.FREE:
          let freeAcct = await this.$axios.$get(
            `users/?mainAccountId=${this.$auth?.user?.id}&$sort[createdAt]=-1`
          )
          initialAccount = freeAcct.data
          break
      }

      this.account = initialAccount.filter(
        (item) => item.role != UserTypeEnum.TEAM
      )
    },
    async getUsersAccount() {
      // return
      let acccountId =
        this.$auth?.user?.role != UserTypeEnum.FREE
          ? this.$auth?.user?.mainAccountId
          : this.$auth?.user?.id
      let userAccount = await this.$axios.$get(
        `users/?mainAccountId=${acccountId}&$sort[createdAt]=-1`
      )
      let accounts = userAccount.data || [{ ...userAccount }]
      await this.fetchMainTeam(accounts)
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
        window.location.assign('/dashboard')
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
          window.location.assign('/dashboard')
        })
        .catch((error) => {})
        .finally(() => {
          // this.isLoading = false
        })
    },
    querySearch(_queryString, cb) {
      cb(this.searchResult)
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$store.commit('SET_PDF_EXIT', true)
          this.logout()
          localStorage.removeItem('redirect_paperdaz_path')
          break
      }
    },
    setProfileDisplay(data) {
      this.profile = data
    },
  },
  watch: {
    $route(to, from) {
      if (to.name.includes('profile')) {
        this.setProfileDisplay(true)
      } else {
        this.setProfileDisplay(false)
      }
    },
    '$auth.user': function () {
      this.fetchUsersInitialAccount()
      this.getUsersAccount()
    },
  },
  mounted() {
    if (!this.user?.id) return
    this.fetchUsersInitialAccount()
    this.getUsersAccount()
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
