<template>
  <nav class="flex flex-col bg-white h-full w-full rounded-2xl">
    <div>
      <div class="flex justify-end px-8">
        <span
          class="py-2 mb-3 cursor-pointer inline-block lg:hidden"
          @click="$emit('close')"
        >
          <times-icon width="12" height="12" />
        </span>
      </div>
      <div
        @click="setAndLand"
        class="flex items-center justify-center mb-4 px-8 cursor-pointer"
      >
        <logo-with-text class="h-14 w-auto" />
      </div>
    </div>

    <section
      class="text-white overflow-hidden bg-[#77B550] h-full rounded-[inherit] flex-1 flex flex-col"
    >
      <!-- SCANNER CONTAINER -->
      <div class="flex justify-center py-4">
        <canvas
          v-show="false"
          ref="qrcancas"
          width="200"
          height="200"
          class="object-contain rounded-[20px]"
        ></canvas>
        <div class="bg-white p-2 rounded-md"><QRcodeX :url="qrCodeurl"/></div>
      </div>

      <!-- END OF SCANNER CONTAINER -->

      <div class="flex-1 flex flex-col text-center px-2 relative">
        <div class="row-span-2 flex-3 h-[60%]">
          <p class="py-[2em] font-[700] text-center text-[19px]">
            Paperless Paper
          </p>
          <span class="py-1 text-[18px]"
            >Keep everyone <br />
            safe and the <br />
            world green.</span
          >
        </div>

        <div class="flex-1 flex item-end justify-center">
          <div class="flex justify-center items-end pb-4">
            <nuxt-link
              to="/login"
              target="_blank"
              class="font-[600] text-center text-[20px] hover:text-white"
              >Paperlink Console</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
  </nav>
</template>

<script>
import Vue from 'vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import LogoWithText from '../LogoWithText.vue'
import EnvelopeIcon from '../svg-icons/EnvelopeIcon.vue'
import FacebookIcon from '../svg-icons/FacebookIcon.vue'
import LinkedInIcon from '../svg-icons/LinkedInIcon.vue'
import ReditIcon from '../svg-icons/ReditIcon.vue'
import SvgIcon from '../svg-icons/SvgIcon.vue'
import TimesIcon from '../svg-icons/TimesIcon.vue'
import TwitterIcon from '../svg-icons/TwitterIcon.vue'
import WhatsappIcon from '../svg-icons/WhatsappIcon.vue'
import QRCode from 'qrcode'
import InstagramIcon from '../svg-icons/InstagramIcon.vue'
import QRcodeX from '@/components/widgets/QRCode.vue'

export default Vue.extend({
  name: 'ProfileSidebar',
  components: {
    LogoWithText,
    SvgIcon,
    FacebookIcon,
    LinkedInIcon,
    EnvelopeIcon,
    TwitterIcon,
    WhatsappIcon,
    ReditIcon,
    TimesIcon,
    InstagramIcon,
    QRcodeX,
  },
  data() {
    return {
      links: [
        { label: 'Dashboard', icon: 'DashboardIcon', link: '/dashboard' },
        // { label: 'Profile', icon: 'UserProfileIcon', link: '/profile' },
        // { label: 'My Files', icon: 'FileIcon', link: '/my-files' },
        // { label: 'Team', icon: 'HoldingHandsIcon', link: '/team' },
        { label: 'Home', icon: 'HomeIcon', link: '/', exact: true },
        { label: 'Packages', icon: 'NewsPaperIcon', link: '/packages' },
        { label: 'FAQ', icon: 'ConversationIcon', link: '/faq' },
        // {
        //   label: 'Public Profile',
        //   icon: 'UserProfileIcon',
        //   link: '/public/profile',
        // },
        { label: 'Contact us', icon: 'CustomerCareIcon', link: '/contact-us' },
      ],
    }
  },
  computed: {
    qrCodeurl() {
      return `${window.location.href}`
    },
  },
  beforeMount() {
    if (this.$store.getters.userType === UserTypeEnum.PAID) {
      this.links.splice(1, 0, {
        label: 'Team',
        icon: 'HoldingHandsIcon',
        link: '/team',
      })
      this.links.splice(1, 0, {
        label: 'Company Files',
        icon: 'DocumentIcon',
        link: '/company-files',
      })
    } else if (this.$store.getters.userType === UserTypeEnum.FREE) {
      this.links.splice(1, 0, {
        label: 'My Files',
        icon: 'FileIcon',
        link: '/my-files',
      })
    }
  },
  mounted() {},
  '$auth.user': function () {},
  methods: {
    socialShareFunction(val) {
      switch (val) {
        case 'linkedin':
          window.open(`https://www.linkedin.com/company/80987259/`)
          break
        case 'whatsapp':
          window.open(`whatsapp://send?text=${window.location.origin}`)
          break
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${window.location.origin}`
          )
          break
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`
          )
          break
        case 'instagram':
          window.open(`https://www.instagram.com/paperdaz_/`)
          break
      }
    },
    setAndLand() {
      this.$store.commit('SET_ISBACK')
      this.$router.push('/')
    },
  },
})
</script>

<style lang="postcss" scoped>
.nav-item {
  @apply flex items-center whitespace-nowrap gap-4 text-paperdazgray-300 text-sm py-4 px-4 rounded-xl transition ease-in-out overflow-hidden;
  background: transparent;

  & > * {
    position: relative;
    z-index: 1;
  }

  &.active {
    @apply text-white bg-paperdazgreen-300;
    box-shadow: 0px 5px 7px 2px rgba(95, 201, 63, 0.25);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      height: 13px;
      width: 13px;
      border-radius: 50%;
      top: 8px;
      right: 15%;
      background: rgba(255, 255, 255, 0.2);
    }

    &::after {
      content: '';
      position: absolute;
      height: 45px;
      width: 45px;
      border-radius: 50%;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(10%, 20%);
    }
  }
}

.middle-space-divider {
  @apply w-full;
  height: calc(100vh - 10em - 18em);
}

a:hover {
  color: inherit;
}
</style>
