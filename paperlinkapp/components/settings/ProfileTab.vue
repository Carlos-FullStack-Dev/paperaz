<template>
  <div
    class="profile-tab flex items-center overflow-x-auto overflow-y-hidden sm:border-b border-gray-200 custom-scrollbar w-full lg:w-6/12 bg-white rounded-lg"
  >
    <!-- <div
      v-for="(tab, i) in tabs"
      :key="i"
      class="h-8 sm:h-9 lg:h-10 border-b-2 cursor-pointer font-semibold text-sm sm:text-base lg:text-lg whitespace-nowrap"
      :class="[
      currentTab == tab.value
          ? 'border-paperdazgreen-300 text-paperdazgreen-300'
          : 'border-transparent',
        i !== tabs.length - 1 ? 'mr-6 sm:mr-8' : '', tab.hidden ? 'hidden' : ''
      ]"
      @click="setSettingTab(tab.value)"
    > -->
    <div
      v-for="(tab, i) in tabs"
      :key="i"
      class="w-6/12 py-3 cursor-pointer text-center lg:rounded-lg text-sm sm:text-base"
      :class="[
        currentTab == tab.value
          ? 'bg-paperdazgreen-300 rounded-lg text-white'
          : 'bg-transparent text-black',
      ]"
      @click="setSettingTab(tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "ProfileTab",
  model: {
    prop: "currentTab",
    event: "update-tab",
  },
  props: {
    currentTab: {
      type: String,
      default: "",
    },
    tabs: {
      type: Array,
      default: () => [
        { label: "Account", value: "account" },
        { label: "Change Password", value: "change-password" },
      ],
    },
  },
  data() {
    return {};
  },
  methods: {
    setSettingTab(val) {
      this.$nuxt.$router.push(`/settings?tab=${val}`);
      this.$emit(`update-tab`, val);
    },
  },
  watch: {
    "$route.query.tab": function () {
      this.setSettingTab(this.$route.query.tab);
    },
  },
});
</script>

<style scoped>
.profile-tab::-webkit-scrollbar {
  display: none;
}
</style>
