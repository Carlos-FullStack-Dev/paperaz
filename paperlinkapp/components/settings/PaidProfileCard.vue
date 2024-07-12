<template>
  <div class="lg:bg-white flex items-center lg:block py-3 min-h-[100px] rounded-2xl">
    <div class="rounded-2xl px-4 md:py-6 lg:px-6 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <!-- <h3 class="uppercase text-paperdazgray-500 font-semibold text-center mb-4 text-xl">
          {{ userAccount }}
        </h3> -->
        <letter-avatar
          v-if="!$auth.user.profilePicture"
          class="p-5 rounded-4 font-[70px] object-cover cursor-pointer mr-1 mb-2"
          :username="user.companyName || userFullName"
        />
        <div v-else class="w-28 h-28 sm:w-40 sm:h-40 p-0.5 mb-2">
          <div
            @click="visibleUploadImageDialog = true"
            class="w-full h-full relative border-2 border-[#679b46] p-1 cursor-pointer rounded-[1rem]"
          >
            <button
              @click="visibleUploadImageDialog = true"
              class="lg:hidden absolute bg-[#679b46] bottom-[-5px] p-1 right-[-10px] items-center justify-center rounded-lg"
            >
              <img class="h-4" src="~/assets/icons/gallary-white.svg" />
            </button>
            <img
              :src="profilePhoto"
              class="w-full h-full profilePhoto rounded-[1rem]"
              alt=""
            />
          </div>
        </div>
        <!-- <p class="text-lg font-semibold mb-2 capitalize">
          {{ `${user.firstName} ${user.lastName}` }}
        </p> -->
      </div>
    </div>

    <div class="flex ml-0 sm:ml-0 mb-4 flex-col w-full items-center justify-center">
      <button
        @click="visibleUploadImageDialog = true"
        style="box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25)"
        class="hidden lg:flex items-center py-2 px-4 justify-center rounded-lg mb-5"
      >
        <img src="~/assets/icons/edit-icon.svg" class="mr-3" />
        {{ $auth.user.profilePicture ? "Edit" : "Upload" }}
      </button>

      <el-dropdown @command="onDateFormatSelected" trigger="click" class="w-[100%]">
        <div class="flex mb-2 lg:mb-4 items-center justify-center">
          <button
            class="lg:border-[1px] w-[85%] py-2.5 px-3 rounded-[10px] sm:border-[#22252948] bg-white lg:bg-transparent flex items-center justify-center text-black"
          >
            <p class="w-full">{{ dateType }}</p>
            <img class="ml-4 scale-90" src="../../assets/icons/arrow-down.svg" alt="" />
          </button>
        </div>
        <el-dropdown-menu slot="dropdown" class="table-menu-dropdown-menu">
          <el-dropdown-item
            v-for="(value, key, index) in dateFormat"
            :key="key"
            :command="value"
            class="dropdown-item"
          >
            <div class="flex justify-between w-full border-t border-gray-200">
              <span class="ml-1">{{ value.name }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="onTimeFormatSelected" trigger="click" class="w-full">
        <div class="flex w-full lg:mb-4 items-center justify-center">
          <button
            class="lg:border-[1px] w-[85%] px-3 py-2.5 rounded-[10px] lg:border-[#22252948] bg-white lg:bg-transparent flex items-center justify-center text-black"
          >
            <p class="w-full">{{ timeType }}</p>
            <img class="ml-4 scale-90" src="../../assets/icons/arrow-down.svg" alt="" />
          </button>
        </div>
        <el-dropdown-menu slot="dropdown" class="table-menu-dropdown-menu">
          <el-dropdown-item
            v-for="(value, key, index) in timeFormat"
            :key="key"
            :command="value"
            class="dropdown-item"
          >
            <div class="flex justify-between w-full border-t border-gray-200">
              <span class="ml-1">{{ value }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <QrcodeShare :link="link" v-model="showQrcode" />

    <ShareFilesModal :link="link" v-model="showShareCompany" />
    <cropper-image-upload
      :show="visibleUploadImageDialog"
      @visibleDialog="(show) => (visibleUploadImageDialog = show)"
    />
  </div>
</template>

<script>
import Vue from "vue";
import BarcodeIcon from "../svg-icons/BarcodeIcon.vue";
import BuildingIcon from "../svg-icons/BuildingIcon.vue";
import ShareIcon from "../svg-icons/ShareIcon.vue";
import CropperImageUpload from "../cropper/CropperImageUpload.vue";
import login from "~/mixins/login";
import mixins from "vue-typed-mixins";
import UserTypeEnum from "~/models/UserTypeEnum";
import QrcodeShare from "../company-files/Tabs/QrcodeShare.vue";
import ShareFilesModal from "../company-files/Tabs/ShareFilesModal.vue";
import LetterAvatar from "../widgets/LetterAvatar.vue";

export default mixins(login).extend({
  name: "PaidProfileCard",
  components: {
    BarcodeIcon,
    ShareIcon,
    BuildingIcon,
    QrcodeShare,
    ShareFilesModal,
    CropperImageUpload,
    LetterAvatar,
  },
  data() {
    return {
      showQrcode: false,
      showShareCompany: false,
      visibleUploadImageDialog: false,
      dateType: "MM/DD/YY",
      timeType: this.$store?.getters?.getTimeFormat,
      dateFormat: [
        { name: "MM/DD/YY", value: "mm/dd/yyyy" },
        { name: "DD/MM/YY", value: "dd/mm/yyyy" },
        { name: "YY/MM/DD", value: "yyyy/mm/dd" },
        { name: "Month D, Yr", value: "mmm dd, yyyy" },
      ],
      timeFormat: ["h:MM TT", "h:MM:ss TT", "h:MM:ss TT Z", "HH:MM:ss"],
    };
  },

  mounted() {
    // dateType: this.$store?.getters?.getDateFormat,
    let newDate = this.dateFormat.filter(
      (item) => item.value === this.$store?.getters?.getDateFormat
    );

    this.dateType = newDate[0].name;
  },
  computed: {
    userFullName() {
      return `${this.user?.firstName} ${this.user?.lastName}`;
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto;
    },
    user() {
      return this.$auth.user;
    },
    link() {
      return `${window.origin}/public-profile/${this.$auth.user.id}`;
    },

    userAccount() {
      switch (this.$auth.user.role) {
        case UserTypeEnum.PAID:
          return "PAID ACCOUNT";
        case UserTypeEnum.TEAM:
          return "TEAM ACCOUNT";
      }
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
  methods: {
    onDateFormatSelected(value) {
      this.$store.commit("SET_DATEFORMAT", value.value);
      this.dateType = value.name;
    },
    onTimeFormatSelected(value) {
      this.$store.commit("SET_TIMEFORMAT", value);
      this.timeType = value;
    },
    showQrcodeFunc() {
      this.showQrcode = true;
    },
    showShareCompanyFunc() {
      this.showShareCompany = true;
    },
    PopUpFileInput() {
      try {
        (this.$refs?.profileInput).click();
      } catch (err) {
        // console.log(err);
      }
    },

    async uploadProfilePicture(eventy) {
      let fileInput = event.target;

      if (fileInput.files.length < 1 || fileInput.files[0].size / 1024 / 1024 > 2) {
        this.$notify.error({
          message: "File size must be less than 2MB",
        });
        return;
      }

      let formdata = new FormData();
      formdata.append("upload", fileInput.files[0], "user-profile-picture.jpg");
      formdata.append("type", "profilePicture");
      formdata.append("userId", this.user.id);

      this.$axios
        .$patch(`/files`, formdata)
        .then(() => {
          //@ts-ignore
          this.filterUsers();
        })
        .catch(() => {
          this.$notify.error({
            message: "Unable to upload profile picture",
          });
        });
    },
  },
});
</script>
