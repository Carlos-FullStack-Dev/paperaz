<template>
  <div class="grid grid-rows-5">
    <section class="row-span-4 bg-[#ffff] lg:!bg-paperdazgreen-300">
      <div>
        <keep-alive>
          <component
            :is="currentTabComponent"
            @next-tab="nextTab($event)"
            :staging-package-info="stagingPackageInfo"
            :packages="packages"
            pagesCustom="custom-package"
          />
        </keep-alive>
      </div>
    </section>
    <div class="row-span-1 bg-white lg:!bg-paperdazgreen-300 items-end flex">
      <Footer />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import PackageBasicInfoTabVue from "~/components/packages/tabs/PackageBasicInfoTab.vue";
import PackagePaymentTabVue from "~/components/packages/tabs/PackagePaymentTab.vue";
import SelectPackgeTabVue from "~/components/packages/tabs/SelectPackgeTab.vue";
import MailIcon from "~/components/svg-icons/MailIcon.vue";
import PaymentCardIcon from "~/components/svg-icons/PaymentCardIcon.vue";
import UserProfileSolidIcon from "~/components/svg-icons/UserProfileSolidIcon.vue";
import Footer from "~/components/footer.vue";

export default Vue.extend({
  components: { UserProfileSolidIcon, MailIcon, PaymentCardIcon, Footer },
  name: "PackagesLandingPage",
  layout: "landing",
  auth: false,
  data() {
    return {
      tabLevel: 1,
      stagingPackageInfo: undefined,
      packages: [],
      name: undefined,
    };
  },
  head() {
    return {
      script: [
        // ...
        // {
        //   hid: 'tawk.to',
        //   src: 'https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg',
        //   defer: true,
        // },
        {
          src: "~/components/script/splide.min.js",
        },
      ],
    };
  },

  mounted() {
    this.tabLevel = Number(this.$route.query.tablevel);
  },

  computed: {
    currentTabComponent() {
      switch (this.tabLevel) {
        case 1:
          this.$nuxt.$router.push(`/package?tablevel=1`);
          return SelectPackgeTabVue;
        case 2:
          this.$nuxt.$router.push(`/package?tablevel=2`);
          return PackageBasicInfoTabVue;
        case 3:
          this.$nuxt.$router.push(`/package?tablevel=3`);
          return PackagePaymentTabVue;
        default:
          return {
            render(createElement) {
              return createElement("h1", "Unknown tab");
            },
          };
      }
    },
  },
  methods: {
    nextTab(val) {
      if (this.tabLevel == 1) {
        this.stagingPackageInfo = val;
      }
      this.tabLevel += 2;
    },
  },
  watch: {
    "$route.query.tablevel": function () {
      this.tabLevel = Number(this.$route.query.tablevel);
    },
  },
});
</script>

<style lang="scss" scoped>
.tab-indicator-container {
  @apply mx-auto relative flex items-center justify-between mb-20 w-full max-w-[600px];
  --circle-size: 60px;
  &.second::before {
    background: #77b550;
  }
  &.third::after {
    background: #77b550;
  }
  &::before {
    content: "";
    position: absolute;
    height: 2px;
    left: calc(var(--circle-size) + 3px);
    width: calc(50% - calc(var(--circle-size)) * 1.5 - 3px * 2);
    background: #909090;
  }
  &::after {
    content: "";
    position: absolute;
    height: 2px;
    left: calc(50% + var(--circle-size) / 2 + 3px);
    width: calc(50% - calc(var(--circle-size)) * 1.5 - 3px * 2);
    background: #909090;
  }
}
.tab-indicator-circle {
  @apply border-2 border-[#909090]
            text-[#909090] text-2xl relative;
  &.active {
    @apply border-paperdazgreen-400
            text-paperdazgreen-400;
  }
  & .highlight {
    @apply absolute text-xs whitespace-nowrap;
    top: calc(100% + 8px);
  }
}
</style>
