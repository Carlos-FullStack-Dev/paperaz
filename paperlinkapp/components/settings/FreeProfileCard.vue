<template>
  <div class="bg-white rounded-2xl px-6 flex items-center justify-center">
    <div class="flex flex-col items-center">

      <p
        class="
          text-black
          text-center
          text-sm
          px-3.5
          py-1.5
          rounded-full
          mb-3
        "
      >
        Free Account
      </p>
      <div
        class="
          circle
          circle-50
          rounded-full
          mx-auto
          mb-3
          h-full
          p-1
          cursor-pointer
          profile-avatar
        "
      >

    
        <img
          :src="profilePhoto"
          class="circle w-full h-full profilePhoto"
          alt=""
        />
        <div class="absolute w-[28px] h-[28px] flex justify-center items-center bg-paperdazgreen-400 rounded-full right-[4px] bottom-[4px]" @click="visibleUploadImageDialog = true">
          <carmera-icon />
        </div>
      </div>
      <p class="text-xl mb-1 capitalize">
        {{ `${user.firstName} ${user.lastName}` }}
      </p>
      <!-- <p
        class="
          text-paperdazpurple-100
          text-center
          text-sm
          px-3.5
          py-1.5
          bg-white
          rounded-full
          mb-3
          drop-shadow-md
        "
      >
        Free Account
      </p> -->
      <!-- <p class="flex items-center gap-2 cursor-pointer">
        <span>
          <location-icon />
        </span>
        <span
          class="
            text-center
            text-xs
          "
          style="color: #1400FF;"
          >
          Click on icon to pin location
        </span>
      </p> -->
      <!-- <div
        class="border border-paperdazgray-100 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full"
      >
        <p class="mr-2">{{ `${(user || {}).totalLeavesEarned}` }}</p>
        <single-leaf-no-stalk />
      </div> -->
    </div>

    <cropper-image-upload
      :show="visibleUploadImageDialog"
      @visibleDialog="(show) => (visibleUploadImageDialog = show)"
    />
  </div>
</template>

<script>
import SingleLeafNoStalk from '../svg-icons/SingleLeafNoStalk.vue'
import LocationIcon from '../svg-icons/LocationIcon.vue'
import CarmeraIcon from '../svg-icons/CameraIcon.vue'
import CropperImageUpload from '../cropper/CropperImageUpload.vue'
import login from '~/mixins/login'
import mixins from 'vue-typed-mixins'

export default mixins(login).extend({
  name: 'FreeProductCard',
  components: {
    SingleLeafNoStalk,
    LocationIcon,
    CarmeraIcon,
    CropperImageUpload,
  },
  data() {
    return {
      visibleUploadImageDialog: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    profilePhoto() {
      return this.$store.getters.profilePhoto
    },
  },
  methods: {
    async uploadProfilePicture(event) {
      let fileInput = event.target

      if (
        fileInput.files.length < 1 ||
        fileInput.files[0].size / 1024 / 1024 > 2
      ) {
        this.$notify.error({
          message: 'File size must be less than 2MB',
        })
        return
      }

      let formdata = new FormData()
      formdata.append('upload', fileInput.files[0], 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', this.user.id)

      this.$axios
        .$patch(`/files`, formdata)
        .then(async () => {
          //@ts-ignore
          this.filterUsers()
        })
        .catch(() => {
          this.$notify.error({
            message: 'Unable to upload profile picture',
          })
        })
    },
  },
})
</script>

<style scoped>
.profile-avatar {
  position: relative;
}
.profile-avatar::before {
  @apply bg-paperdazgreen-400;
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%; 
  padding: 2px; 
  /* background:linear-gradient(45deg,#98CAE9,#FFB0F4);  */
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
}
</style>

