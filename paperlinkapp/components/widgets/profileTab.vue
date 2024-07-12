<template>
  <div class="sticky z-20 h-14 ease-in-out lg:bg-transparent max-sm:bg-white shadow" :class="{
    // 'shadow-md': scrolled,
    // 'bg-white': scrolled,
    // 'bg-transparent': !scrolled
  }" style="top: -0.1px">
    <nav class="h-full flex items-center justify-between full-nav bg-white px-3 lg:py-8 lg:rounded-lg">
      <div class="flex items-center gap-1 font-bold">Business Profile</div>
      <div
        class="transition left-0 transform text-sm font-medium gap-4 fixed top-0 bottom-0 w-56 bg-white flex flex-col p-6 shadow-lg lg:shadow-none lg:items-center lg:gap-9 lg:p-0 lg:relative lg:bg-transparent lg:w-auto lg:flex-row lg:translate-x-0"
        :class="[collapsed ? 'translate-x-0' : '-translate-x-56']">
        <div class="flex justify-end lg:hidden">
          <span class="circle circle-15 bg-paperdazgray-100 cursor-pointer" @click="collapsed = false">&times;</span>
        </div>


        <div class="flex flex-col items-center gap-4 lg:hidden" v-if="!$auth.loggedIn">
          <nuxt-link to="/login" class="text-paperdazgreen-300 mt-5">Sign in</nuxt-link>
        </div>
        <div class="grid w-full place-items-center lg:hidden">
          <el-dropdown trigger="click" @command="handleCommand" v-if="$auth.loggedIn">
            <span class="flex items-center el-dropdown-link">
              <span class="border border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative" :class="[
                isPaidUser
                  ? 'w-[45px] h-[45px] rounded-md'
                  : 'circle-20 rounded-full'
              ]">
                <img :src="profilePhoto" class="w-[45px] h-full profilePhoto" alt=""
                  :class="[isPaidUser ? 'rounded-md' : 'rounded-full']" />
              </span>
              <span class="text-gray-500"><arrow-down-icon class="h-1 w-1.5 sm:h-2.5 sm:w-4" /></span>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="dashboard">
                <span class="inline-flex gap-2 items-center"> Dashboard</span>
              </el-dropdown-item>
              <el-dropdown-item command="profile" divided>
                <span class="inline-flex gap-2 items-center">
                  <user-profile-solid-icon height="14" width="14" />
                  Profile</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <span class="inline-flex gap-2 items-center">
                  <gear-icon height="14" width="14" />
                  Settings</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span class="text-red-600 inline-flex gap-2 items-center">
                  <sign-out-icon height="14" width="14" />
                  Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="flex items-center gap-1.5 xs:gap-3 sm:gap-5 text-xs xs:text-sm sm:text-base md:text-ls">
        <button
          v-if="!$store.getters.getFillAsGuest && !$auth.loggedIn"
          @click="showGuestModal = true"
          class="bg-paperdazgreen-300 text-white h-7 xs:h-8 rounded shadow px-4 sm:px-3 hidden sm:flex items-center justify-center whitespace-nowrap mx-2"
          >Start</button>

          <div v-if="$store.getters.getFillAsGuest && !$auth.loggedIn" class="flex items-center">
            <span class="mr-3">Guest</span>
            <img src="https://paperdaz.com/img/placeholder_picture.png" class="rounded-full mr-2 w-[30px]"/>
        </div>
       
        <el-dropdown trigger="click" @command="handleCommand" v-if="$auth.loggedIn">
          <span class="flex items-center el-dropdown-link">
            <div class="mr-2">
              <p class="text-grey">{{ userInfo.companyName }} </p>
              <p class="text-slate-400 text-sm">{{ userInfo.firstName }} </p>
            </div>
            <span class="border border-paperdazgreen-300 mr-2 p-0.5 overflow-hidden relative text-center" :class="[
              isPaidUser
                ? 'w-[45px] h-[45px] rounded-md'
                : 'circle-20 rounded-full'
            ]">
              <img
                :src="profilePhoto"
                class="w-full h-full profilePhoto"
                alt=""
                :class="[isPaidUser ? 'rounded-md' : 'rounded-full']"
              />
              <!-- <span class="text-3xl font-bold w-full h-full text-center text-paperdazgreen-300"
                style="text-shadow: 1px 2px 3px grey;">{{ (userInfo.companyName || '').charAt(0).toUpperCase() }}</span> -->
            </span>
            <span class="text-gray-500"><arrow-down-icon class="h-1 w-1.5 sm:h-2.5 sm:w-4" /></span>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="dashboard">
              <span class="inline-flex gap-2 items-center">
                <!-- <dashboard-icon height="14" width="14" /> -->
                Dashboard</span>
            </el-dropdown-item>
            <el-dropdown-item command="profile" divided>
              <span class="inline-flex gap-2 items-center">
                <user-profile-solid-icon height="14" width="14" />
                Profile</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <span class="inline-flex gap-2 items-center">
                <gear-icon height="14" width="14" />
                Settings</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <span class="text-red-600 inline-flex gap-2 items-center">
                <sign-out-icon height="14" width="14" />
                Logout</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </nav>

    <landing-page-search-modal v-model="showLandingPageSearchModal" />
    <GuestModal v-model="showGuestModal" />
  </div>
</template>

<script>
import ArrowDownIcon from '../svg-icons/ArrowDownIcon.vue'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import UserProfileSolidIcon from '../svg-icons/UserProfileSolidIcon.vue'
import GearIcon from '../svg-icons/GearIcon.vue'
import SignOutIcon from '../svg-icons/SignOutIcon.vue'
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'
import LandingPageSearchModal from '../landing/LandingPageSearchModal.vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import GuestModal from '../pdf/modals/GuestModal.vue'

export default mixins(GlobalMixin).extend({
  name: 'ProfileTab',
  components: {
    SearchIcon,
    ArrowDownIcon,
    GearIcon,
    SignOutIcon,
    UserProfileSolidIcon,
    LandingPageSearchModal,
    GuestModal
  },
  data() {
    return {
      scrolled: false,
      collapsed: false,
      showLandingPageSearchModal: false,
      userInfo: {},
      showGuestModal: false
    }
  },
  watch: {
    $route(formerVal, currentVal) {
      if (formerVal.fullPath !== currentVal.fullPath) {
        this.collapsed = false
      }
    },
    '$auth.user'() {
      this.userInfo = this.$auth.user
    }
  },
  computed: {
    routeName() {
      return (this.$nuxt.$route.name || '').replace(/-/g, ' ')
    },
    user() {
      return this.$auth.user
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto
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
    }
  },
  mounted() {
    const self = this
    this.scrollObserver()
    document.addEventListener('scroll', () => {
      if (self.collapsed) self.collapsed = false
    })
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'profile':
          this.$nuxt.$router.push('/public/profile')
          break
        case 'dashboard':
          this.$nuxt.$router.push('/dashboard')
          break
        case 'settings':
          this.$nuxt.$router.push('/settings')
          break
      }
    },
    scrollObserver() {
      const options = {
        rootMargin: '0px',
        threshold: 1.0
      }

      const self = this
      const callback = (
        entries,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        observer
      ) => {
        entries.forEach(entry => {
          self.scrolled = !entry.isIntersecting
        })
      }

      const observer = new IntersectionObserver(callback, options)
      observer.observe(this.$el)
    }
  }
})
</script>

<style scoped>

</style>
