<template>
  <div
    v-if="!isAppMode || 
    ( isAppMode && 
      this.$store?.getters?.isVisited && 
      this.$store?.getters?.isBack ) || 
      ( !$auth.loggedIn && !isPaid ) "
    id="landing-layout"
    class="relative bg-paperdazgreen-300 flex flex-col min-h-screen"
  >
    <app-bar />
    <main>
      <LandingToast />
      <Nuxt class="flex-1" />
    </main>
    <!-- <app-footer /> -->
    <!-- <CookiesPop/> -->
  </div>
</template>
<script>
import Vue from "vue";
import AppBar from "~/components/widgets/AppBar.vue";
import AppFooter from "~/components/widgets/AppFooter.vue";
import CookiesPop from "~/components/landing/cookiesPop.vue";
import mixins from "vue-typed-mixins";
import login from "~/mixins/login";
import LandingToast from "~/components/widgets/LandingToast.vue";
import GlobalMixin from "~/mixins/GlobalMixin";

export default mixins(login, GlobalMixin).extend({
  components: { AppBar, AppFooter, CookiesPop, LandingToast },
  loading: false,
  async created() {
    const businessPage_url = localStorage.getItem('businessPage_url');
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('is Appmode');
      if(businessPage_url != null && this.initialLoad == true){
        this.initialLoad = false;
        if ( businessPage_url !== "") {
          console.log('business?', businessPage_url);
          this.$nuxt.$router.push(`/${businessPage_url}`);
        }
      }
    }
    await this.filterUsers();
  },
});
</script>
