<template>
  <div
    id="bottom-nav"
    class="justify-between bg-white flex items-center px-6 text-[#606060]"
  >
    <span class="h-full flex items-center justify-center flex-1 px-3" v-show="isSearch">
      <search-input
        @onBlurInput="isSearch = false"
        @onToggle="isSearch = false"
        :isSearch="isSearch"
      />
    </span>
    <span
      class="h-full flex items-center justify-center px-3"
      @click="$emit('open-sidebar')"
    >
      <!-- <hamburger-icon /> -->
      <img src="~/assets/icons/menu_1.svg" />
    </span>
    <a
      v-if="!appIsFreeUser"
      :href="`/${$auth?.user?.businessPage}`"
      target="_blank"
      class="h-full flex items-center justify-center px-1"
    >
      <img src="~/assets/icons/paperdaz_icon.svg" />
    </a>
    <nuxt-link to="/" class="h-full flex items-center justify-center px-1">
      <NotificationIcon fill-color="#999999" class="h-6 !fill-pink-300" />
    </nuxt-link>
    <!-- <nuxt-link
      v-if="appIsFreeUser"
      to="/savefiles"
      class="bottom-nav-save relative h-full flex items-center justify-center flex-1 px-1"
    >
      <heart-outline :isActive="$route.fullPath == '/savefiles'" />
      <span
        v-if="$route.fullPath == '/savefiles'"
        class="absolute bottom-2 left-[calc(50%-2px)] inline-block w-[4px] h-[4px] bg-red-500 rounded-full"
      ></span>
    </nuxt-link> -->
    <!-- <nuxt-link to="/paperlink-pages"  v-if="!appIsFreeUser" class="relative h-full flex items-center justify-center flex-1 px-1" >
      <folder-icon :isActive="$route.fullPath == '/paperlink-pages'" class="w-4 h-4" />
      <span 
      v-if="$route.fullPath == '/company-files'"
      class="absolute bottom-2 left-[calc(50%-2px)] inline-block w-[4px] h-[4px] bg-red-500 rounded-full"></span>
    </nuxt-link> -->
  </div>
</template>
<script>
import Vue from "vue";
import FileIcon from "../svg-icons/FileIcon.vue";
import FolderIcon from "../svg-icons/FolderIcon.vue";
import HomeIcon from "../svg-icons/HomeIcon.vue";
import NotificationIcon from "../svg-icons/NotificationIcon.vue";
import SearchIcon from "../svg-icons/SearchIcon.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import SearchInput from "./SearchInput.vue";
import PublicProfile from "../svg-icons/PublicProfile.vue";
import HeartOutline from "../svg-icons/HeartOutline.vue";
import HamburgerIcon from "../svg-icons/HamburgerIcon.vue";
import BuildingIcon from "../svg-icons/BuildingIcon.vue";
import AppMixins from "~/mixins/AppMixins";
import mixins from "vue-typed-mixins";

export default mixins(AppMixins).extend({
  name: "BottomNav",
  components: {
    FolderIcon,
    FileIcon,
    HomeIcon,
    SearchIcon,
    SearchInput,
    BuildingIcon,
    HamburgerIcon,
    HeartOutline,
    NotificationIcon,
    PublicProfile,
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    mainUserLink() {
      switch (this.$auth?.user?.role) {
        case UserTypeEnum.PAID:
          return (this.$auth.user || {}).id;
        case UserTypeEnum.TEAM:
          return (this.$auth.user || {}).mainAccountId;
      }
      (this.$auth.user || {}).id;
    },
  },
  data() {
    return {
      isSearch: false,
    };
  },
  methods: {
    openUserFiles() {
      switch (this.$auth.user.role) {
        case UserTypeEnum.PAID:
          this.$nuxt.$router.push("/company-files");
          return;
        case UserTypeEnum.FREE:
          this.$nuxt.$router.push("/my-files");
          return;
      }
    },
  },
});
</script>

<style scoped>
#bottom-nav {
  @apply shadow-md;
}
</style>
