<template>
  <div class="min-h-[60vh] bg-paperdazgreen-300">
    <!-- <div class="fixed z-[1000000000] w-screen h-screen bg-white"></div> -->
    <hero-page />
    <ConfirmPassword :userInfo="userDecodedInfo" v-model="showConfirmPassword" />

    <Footer />

    <invite-team-member-modal v-model="showAcceptTeamMemberModal" />
  </div>
</template>

<script>
import { Component, Vue, Watch } from "nuxt-property-decorator";
import HeroPage from "~/components/landing/widgets/HeroPageV2.vue";
import LandingJoinSection from "~/components/landing/widgets/LandingJoinSection.vue";
import LandingPageInfo from "~/components/landing/widgets/LandingPageInfo.vue";
import LandingPageKeyFeatures from "~/components/landing/widgets/LandingPageKeyFeatures.vue";
import LandingPageQrScan from "~/components/landing/widgets/LandingPageQrScan.vue";
import LandingDivider from "~/components/landing/widgets/LandingDivider.vue";
import ConfirmPassword from "~/components/modals/ConfirmPassword.vue";
import jwt, { decode, JsonWebTokenError } from "jsonwebtoken";
import Footer from "~/components/footer.vue";
import InviteTeamMemberModal from "~/components/pdf/modals/InviteTeamMemberModal.vue";

import "intro.js/minified/introjs.min.css";

@Component({
  layout: "landing",
  auth: false,
  components: {
    HeroPage,
    LandingPageInfo,
    LandingPageQrScan,
    LandingPageKeyFeatures,
    LandingJoinSection,
    LandingDivider,
    ConfirmPassword,
    Footer,
    InviteTeamMemberModal,
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },
})
export default class LandingPage extends Vue {
  beforeframe = true;
  gsapLoaded = false;
  motionPluginLoaded = false;

  get gsapReadyToSetup() {
    return this.gsapLoaded && this.motionPluginLoaded;
  }
  data() {
    return {
      showConfirmPassword: false,
      userDecodedInfo: {},
      showAcceptTeamMemberModal: false,
    };
  }
  beforeRouteEnter(to, from, next, $route) {
    if (from.query.permissiontoken) {
      sessionStorage.setItem("redirectUrl", from.fullPath);
    }
    next();
  }
//  beforeCreate() {
//   window.location.replace("https://paperdaz.com/")
//  }
  mounted() {
    if (sessionStorage.getItem("requestSentFlag") == "true") {
      this.$notify({
        message: "Request has been sent.",
      });
    }
    setTimeout(function () {
      sessionStorage.setItem("requestSentFlag", false);
    }, 300);
    this;
    if (this.$route.query?.team_reset_token) this.showAcceptTeamMemberModal = true;

    if (!this.$route.query?.verificationToken) return;
    this.$route.query?.verificationToken && (this.showConfirmPassword = true);
    let encodedUser = jwt.verify(
      this.$route.query?.verificationToken,
      process.env.NUXT_ENV_BACKEND_JWT_TOKEN
    );
    this.userDecodedInfo = encodedUser;
  }
  head() {
    return {
      title: "Paperdaz",
      script: [
        {
          hid: "gsap",
          src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js",
          defer: true,
          // Changed after script load
          callback: () => {
            this.gsapLoaded = true;
          },
        },
        {
          hid: "gsap-motion-plugin",
          src:
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/MotionPathPlugin.min.js",
          defer: true,
          // Changed after script load
          callback: () => {
            this.motionPluginLoaded = true;
          },
        },
        // {
        //   hid: 'tawk.to',
        //   src: 'https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg',
        //   defer: true,
        // },
      ],
    };
  } // end head method

  @Watch("gsapReadyToSetup")
  watchGsap(val) {
    if (val) {
      // @ts-ignore
      gsap.registerPlugin(MotionPathPlugin);
      // Check LandingJoinSection for elements
      // @ts-ignore
      gsap.to("#email", {
        duration: 5,
        repeat: 12,
        repeatDelay: 2,
        ease: "power1.inOut",
        motionPath: {
          path: "#path",
          align: "#path",
          autoRotate: 30,
          alignOrigin: [0.5, 0.5],
          offsetY: -3,
        },
      });
    }
  } // end watcher method watchGsap
} // end class LandingPage
</script>
<!-- /* Hide install button once app is downloaded*/ -->
<style lang="css" scoped>
/* Hide install button in Chrome */
@media (display-mode: browser) {
  .dl-button {
    display: none !important;
  }
}

/* Hide install button in other browsers */
@media (display-mode: standalone) {
  .dl-button {
    display: none !important;
  }
}
</style>
