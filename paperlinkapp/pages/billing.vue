<template>
  <div>
    <div class="px-4">
      <div class="w-full lg:w-[550px] rounded-lg flex items-center bg-white">
        <button
          class="w-6/12 py-3 text-center rounded-lg text-sm lg:text-base"
          :class="[
            activeTab == 'billing'
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-transparent text-black',
          ]"
          @click="activeTab = 'billing'"
        >
          Billing
        </button>
        <button
          class="w-6/12 py-3 text-center rounded-lg text-sm lg:text-base"
          @click="activeTab = 'features'"
          :class="[
            activeTab == 'features'
              ? 'bg-paperdazgreen-300 text-white'
              : 'bg-transparent text-black',
          ]"
        >
          Buy more features
        </button>
      </div>
    </div>

    <div class="mt-4">
      <keep-alive>
        <component :is="currentTab"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import BillingDetails from "~/components/billing/BillingDetails.vue";
import SelectCustomBillingPackage from "~/components/billing/SelectCustomBillingPackage.vue";

export default {
  name: "billing",
  layout: "dashboard",
  components: { BillingDetails, SelectCustomBillingPackage },
  data() {
    return {
      activeTab: "billing",
    };
  },
  computed: {
    currentTab() {
      let current_tab = "";
      switch (this.activeTab) {
        case "billing":
          current_tab = "billing-details";
          break;

        case "features":
          current_tab = "select-custom-billing-package";
          break;
      }
      return current_tab;
    },
  },
};
</script>

<style lang="scss" scoped></style>
