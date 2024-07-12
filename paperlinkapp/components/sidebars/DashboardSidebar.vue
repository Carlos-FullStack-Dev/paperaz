<template>
  <nav class="flex flex-col bg-white h-full w-full rounded-tr-2xl rounded-br-2xl py-8">
    <div class="flex justify-end px-8">
      <span
        class="py-2 mb-3 cursor-pointer inline-block lg:hidden"
        @click="$emit('close')"
      >
        <times-icon width="12" height="12" />
      </span>
    </div>
    <nuxt-link to="/" class="flex items-center justify-center mb-14 px-8">
      <logo-with-text class="h-8 w-auto" />
    </nuxt-link>
    <ul class="overflow-y-auto overflow-x-hidden flex-1 px-4 custom-scrollbar">
      <li>
        <div
          v-for="(link, i) in links"
          :key="i"
          class="nav-item cursor-pointer"
          @click="shuffleRoute(i, link.link, link.label, link.openNew)"
          :class="[
            link.className,
            {
              active: link.exact,
              // ? $nuxt.$route.path == link.link
              // : $nuxt.$route.fullPath.startsWith(link.link),
            },
          ]"
        >
          <div class="w-5 h-5">
            <svg-icon
              class="h-full w-full"
              height="100%"
              width="100%"
              :value="link.icon"
            />
          </div>
          <span>{{ link.label }} <abbr></abbr></span>
          <label v-show="link.label == 'Paperlink Pages'">{{
            subscription?.paperlink || ""
          }}</label>
        </div>
      </li>
    </ul>
    <div
      v-show="showModal"
      class="fixed bg-[#0000006f] flex items-center justify-center w-full h-full top-0 left-0 z-30"
    >
      <div class="w-[95%] lg:w-[50%] !rounded-[1.5rem] lg:!rounded-[0rem] bg-white">
        <div class="w-full">
          <div
            class="bg-[#77B550] lg:border-t-4 lg:border-[#E6AF23] lg:bg-transparent mb-4 lg:!mb-0 flex relative justify-center lg:justify-start items-center h-[60px] w-full"
          >
            <button
              @click="closeModal()"
              class="absolute top-[50%] right-4 translate-y-[-50%]"
            >
              <img src="../../assets/icons/x_white.svg" alt="" />
            </button>
            <p class="text-white lg:hidden text-[1.2rem]">Contact Us</p>
            <p class="text-[1.2rem] px-4 hidden lg:block">CONTACT</p>
          </div>
          <p class="text-[1rem] text-center lg:!text-left px-4 mb-3 text-[#8E8E8E]">
            We will reply in 24 hours.
          </p>
        </div>

        <div class="justify-center px-4 input-fill pb-2">
          <form ref="form" @submit.prevent="onSubmit">
            <message-alert-widget
              :message="'Message sent '"
              v-show="messageSent"
              type="success"
              class="mb-8"
            />
            <input
              required
              v-model="partner.firstName"
              type="text"
              placeholder="First Name"
              class="contac-input mb-8"
            />
            <input
              required
              v-model="partner.lastName"
              type="text"
              placeholder="Last Name"
              class="contac-input mb-8"
            />

            <input
              required
              v-model="partner.email"
              type="text"
              placeholder="Email"
              class="contac-input mb-8"
            />
            <textarea
              required
              v-model="partner.message"
              type="text"
              placeholder="Message"
              class="contac-input min-h-[100px]"
            />

            <div class="flex mt-4 justify-center md:justify-end">
              <button
                @click="closeModal()"
                type="button"
                class="outline-btn-sm flex-1 md:flex-none text-[#F93120] border-[#F93120] mr-4"
              >
                CANCEL
              </button>
              <button
                :class="[isLoading ? 'opacity-60' : 'opacity-100']"
                :disabled="isLoading"
                class="outline-btn-sm flex-1 md:flex-none justify-center flex text-white bg-[#77C360]"
              >
                <span v-if="!isLoading" class="mr-2">SEND</span>
                <transition v-else name="fade" :duration="100">
                  <span class="animate-spin">
                    <SpinnerDottedIcon height="18" width="22" />
                  </span>
                </transition>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <div class="px-8">
      <p class="text-center text-[#909090] mb-6 font-medium">Find us on</p>
      <div class="flex flex-wrap items-center gap-2 justify-center">
        <span @click="socialShareFunction('facebook')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white">
          <facebook-icon height="12" />
        </span>
        <span @click="socialShareFunction('linkedin')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white">
          <linked-in-icon height="12" />
        </span>
        <span @click="socialShareFunction('linkedin')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white">
          <instagram-icon height="11" />
        </span>
        <span @click="socialShareFunction('twitter')"
          class="circle circle-10 cursor-pointer bg-paperdazgreen-300 text-white">
          <twitter-icon height="11" />
        </span>
      </div>
      <p class="text-paperdazgreen-300 text-[11px] mt-3 text-center">
        powered by
        <span class="font-semibold uppercase text-[15px]">Paperdaz</span>
      </p>
    </div> -->
  </nav>
</template>
<script>
import Vue from "vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import AuthUser from "~/models/AuthUser";
import LogoWithText from "../LogoWithText.vue";
import EnvelopeIcon from "../svg-icons/EnvelopeIcon.vue";
import FacebookIcon from "../svg-icons/FacebookIcon.vue";
import LinkedInIcon from "../svg-icons/LinkedInIcon.vue";
import ReditIcon from "../svg-icons/ReditIcon.vue";
import SvgIcon from "../svg-icons/SvgIcon.vue";
import TimesIcon from "../svg-icons/TimesIcon.vue";
import TwitterIcon from "../svg-icons/TwitterIcon.vue";
import WhatsappIcon from "../svg-icons/WhatsappIcon.vue";
import InstagramIcon from "../svg-icons/InstagramIcon.vue";
import GearLightIcon from "../svg-icons/GearLightIcon.vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";

import TeamAccess from "~/models/TeamAccess";
export default Vue.extend({
  name: "DashboardSidebar",
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
    GearLightIcon,
    SpinnerDottedIcon,
  },
  data() {
    return {
      routeIndex: 1,
      filteredLinks: [],
      subscription: {},
      showModal: false,
      isLoading: false,
      errorMessage: "",
      partner: {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        type: "customer",
      },
      links: [
        {
          label: "File Ledger",
          icon: "DashboardIcon",
          link: "/file-ledger",
          exact: true,
        },
        {
          label: "Paperlink Pages",
          icon: "DocumentIcon",
          openNew: false,
          link: "/paperlink-pages",
          exact: false,
        },
        {
          label: "Business Page",
          icon: "UserProfileIcon",
          openNew: true,
          link: `/${this.userPage}`,
        },
        {
          label: "Team Members",
          icon: "HoldingHandsIcon",
          link: "/team",
          openNew: false,
          exact: false,
        },
        {
          label: "Billing",
          icon: "QuoteFileIcon",
          link: "/billing",
          openNew: false,
          exact: false,
        },
        {
          label: "FAQ",
          icon: "ConversationIcon",
          link: "/faq",
          exact: false,
          openNew: false,
        },
        {
          label: "Contact us",
          icon: "CustomerCareIcon",
          link: "/contact-us",
          exact: false,
          openNew: false,
        },
      ],
    };
  },
  methods: {
    showModal(val) {
      this.showModal = true;
    },
    clearData() {
      this.errorMessage = "";
      this.partner.firstName = "";
      this.partner.lastName = "";
      this.partner.email = "";
      this.partner.message = "";
    },
    closeModal() {
      this.showModal = false;
    },
    async onSubmit() {
      //  <-- validating user name -->
      let inValidName = false;
      var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (
        format.test(this.partner.firstName.trim()) ||
        format.test(this.partner.lastName.trim())
      ) {
        this.$refs.form.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        this.errorMessage = "Name format not correct";
        inValidName = true;
      }

      if (inValidName) return;

      if (this.isLoading) return;

      this.isLoading = true;

      let data = {
        action: "contactUs",
        firstName: this.partner.firstName,
        lastName: this.partner.lastName,
        email: this.partner.email,
        message: this.partner.message,
        userId: 0,
      };

      await this.$axios
        .post("/request", data)
        .then(() => {
          this.toggleToast({
            active: true,
            msg: `Thank you for contacting us.  We will reach out to you within 24 hours.`,
          });

          this.errorMessage = "";
          this.partner.firstName = "";
          this.partner.lastName = "";
          this.partner.email = "";
          this.partner.message = "";
          this.closeModal();
          // this.messageSent = true;
        })
        .catch((err) => {
          this.$notify.error({
            title: "Error",
            message: "Something went wrong",
          });
          this;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getUserSubscription() {
      this.$axios
        .get(`/subscriptions/?id=${this.$auth.user.subscriptionId}`)
        .then((res) => {
          this.subscription = res.data.data[0];
        });
    },
    removeLinkOptions() {
      //  if(!localStorage.getItem('team_id')) return
      //  this.links = this.links.filter((v)=>
      //   v.label != 'Billings' && v.label != 'Team Members'
      //  )
    },

    openIncognitoWindow() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      if (typeof window.chrome !== "undefined") {
        // Chrome
        window.open(
          `${location.origin}/${this.userPage}`,
          "_blank",
          `toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=${width},height=${height},incognito=yes`
        );
      } else if (typeof window.browser !== "undefined") {
        // Firefox
        window.browser.windows.create({
          url: `${location.origin}/${this.userPage}`,
          incognito: true,
        });
      } else {
        // Other browsers
        window.open(
          `${location.origin}/${this.userPage}`,
          "_blank",
          `toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=100%,width=${widthe},height=${height}`
        );
      }
    },

    socialShareFunction(val) {
      switch (val) {
        case "linkedin":
          window.open(`https://www.linkedin.com/company/80987259/`);
          break;
        case "whatsapp":
          window.open(`whatsapp://send?text=${window.location.origin}`);
          break;
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?text=${window.location.origin}`);
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`
          );
          break;
        case "instagram":
          window.open(`https://www.instagram.com/paperdaz_/`);
          break;
      }
    },
    getCurrentRoute() {
      let pathHistory = this.$nuxt.$router.history.current.fullPath;
      this.links = this.links.map((item, i) => {
        if (pathHistory == item.link || pathHistory == `${item.link}/`) {
          return { ...item, exact: true };
        } else {
          return { ...item, exact: false };
        }
      });
    },
    shuffleRoute(index, link, name, openNew) {
      if (link === "/contact-us") return (this.showModal = true);
      if (openNew) {
        window.open(`${location.origin}/${this.userPage}`);
        // this.openIncognitoWindow()
        return;
      }
      this.links = this.links.map((item, i) => {
        if (index == i) {
          return { ...item, exact: true };
        } else {
          return { ...item, exact: false };
        }
      });
      switch (name) {
        case "Packages":
          this.isPaidUser
            ? this.$nuxt.$router.push("/settings?tab=billing")
            : this.$nuxt.$router.push("/packages?type=default");
          break;
        default:
          this.$nuxt.$router.push(link);
          break;
      }
    },
    checkToRouteLinks() {
      if (localStorage.getItem("team_id")) {
        this.links = this.filteredLinks.filter(
          (v) => v.label != "Team Members" && v.label != "Billing"
        );
      }
    },
  },
  computed: {
    isAccountTeam() {
      return localStorage.getItem("team_id") ? true : false;
    },
    isPaidUser() {
      switch (this.$auth.user?.role) {
        case UserTypeEnum.PAID:
          return true;
        case UserTypeEnum.FREE:
          return this.switchedAccount?.id ? true : false;
      }
    },
    switchedAccount() {
      return JSON.parse(localStorage.getItem("team_prop")) || {};
    },
    userPage() {
      return localStorage.getItem("team_id")
        ? this.$_teamOwner.businessPage
        : this.$auth.user?.businessPage;
    },
  },
  mounted() {
    this.filteredLinks = this.links;
    this.checkToRouteLinks();
    this.getCurrentRoute();
    this.removeLinkOptions();
  },
  watch: {
    "$auth.user.id": function () {
      this.getCurrentRoute();
      this.checkToRouteLinks();
      this.getUserSubscription();
    },
    isPaidUser(val) {
      if (!val && localStorage.getItem("team_id")) {
        this.links = this.filteredLinks.filter((v) => v.label != "Team Members");
      }
    },
    "$nuxt.$route": function () {
      this.getCurrentRoute();
    },
  },
});
</script>
<style lang="postcss" scoped>
.contac-input {
  @apply w-full bg-white h-[60px] border-[1px] border-[#E5E5E5] rounded-[7px] px-3 py-3 outline-none focus:!border-[#0000005e];
}

.outline-btn {
  @apply border-[1px] border-[#E6AF23] py-4 rounded-[50px] font-[800] w-full text-[#E6AF23];
}

.outline-btn-sm {
  @apply border-[1px] py-2 px-6 rounded-[10px];
}

.nav-item {
  @apply flex items-center whitespace-nowrap gap-4 text-paperdazgray-300 text-sm py-4 px-4 rounded-xl transition ease-in-out overflow-hidden;
  background: transparent;

  & > * {
    position: relative;
    z-index: 1;
  }

  &.active {
    @apply text-white bg-paperdazgreen-300;
    transition: 0.25s;
    box-shadow: 0px 5px 7px 2px rgba(95, 201, 63, 0.25);
    position: relative;

    /* &::before {
      content: "";
      position: absolute;
      height: 13px;
      width: 13px;
      border-radius: 50%;
      top: 8px;
      right: 15%;
      background: rgba(255, 255, 255, 0.2);
    }

    &::after {
      content: "";
      position: absolute;
      height: 45px;
      width: 45px;
      border-radius: 50%;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(10%, 20%);
    } */
  }
}
</style>
