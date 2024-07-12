<template>
  <div class="self-center flex items-center">
    <button @click="showShareCompanyFilesFunc">
      <ShareOutlineIcon />
    </button>
    <ShareFilesModal :userFile="file" @qrLoad="showQrcodeFileFunc" v-model="showShareCompanyFiles" />
    <QrcodeShare :userFile="file" v-model="showQrcodeFiles" />
  </div>
</template>
<script>
import HeartOutlineIcon from '~/components/svg-icons/HeartOutlineIcon.vue'
import ShareIcon from '~/components/svg-icons/ShareIcon.vue'
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue'
import ShareFilesModal from '../../company-files/Tabs/ShareFilesModal.vue'
import QrcodeShare from '../../company-files/Tabs/QrcodeShare.vue'
export default {
  name: 'searchShare',
  components: { HeartOutlineIcon, ShareIcon, ShareOutlineIcon, ShareFilesModal, QrcodeShare },
  props: {
    link: String,
    file: {
      type: Object
    },
    showShareIcon: {
      type: Boolean,
      default: false
    },
    showLikeIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fillHeartColor: 'none',
      toggleHeartColor: true,
      favouriteFileId: null,
      favouriteFileLoaded: false,
      showShareCompanyFiles:false,
      showQrcodeFiles: false
    }
  },
  watch: {
    'file': function () {
      this.getFavouriteFile()
    }
  },


  computed: {
    user() {
      return this.$auth.user
    },
    isExistFavouriteData(){
      return this.favouriteFileLoaded
    }
  },
  methods: {
    animateElement(elem) {
      if (!this.$auth.loggedIn) return
      elem.classList.add('scale-out')
      setTimeout(() => {
        elem.classList.remove('scale-out')
      }, 300);
    },
    showQrcodeFileFunc() {
      this.showQrcodeFiles = true;
    },
    showShareCompanyFilesFunc() {
      this.showShareCompanyFiles = true
    },
    setFileFavourite() {
      if (!this.$auth.loggedIn) return
      this.animateElement(this.$refs.heart)
      if (!this.file) return;
      if (this.fillHeartColor == "none") {
        this.$axios.$post('/favourites', { fileId: this.file.id })
          .then((response) => {
            this.fillHeartColor = '#77C360';
            this.favouriteFileId = response.id;
            this.getFavouriteFile()
          })
      }
      else {
        this.$axios.$delete(`/favourites/${this.favouriteFileId}`)
          .then(() => {
            this.fillHeartColor = 'none';
            this.getFavouriteFile()
          })
      }
    },
    shareInDevice() {
      if (navigator.share) {
        navigator
          .share({
            // Title that occurs over
            // web share dialog
            title: 'Paperdaz',
            // URL to share
            url: this.link,
          })
          .then(() => { })
          .catch((err) => {
            // Handle errors, if occured
          })
      } else {
        // Alerts user if API not available
        console.log("Browser doesn't support this API !")
      }
    },
  },
}
</script>
<style scoped>
.heart-icon {
  transition: 0.3s;
}
.scale-out {
  transform: scale(1.4);
}
</style>