<!-- components/DownloadButton.vue -->
<template>
  <button @click="downloadPWA">Download PWA</button>
</template>

<script>
export default {
  methods: {
    downloadPWA() {
      if (this.$store.state.canInstallPWA) {
        // You can manage the PWA install state as needed
        const deferredPrompt = this.$store.state.deferredPrompt;

        if (deferredPrompt) {clear
          
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("PWA installation accepted by user");
            } else {
              console.log("PWA installation rejected by user");
            }
          });
          this.$store.commit("clearDeferredPrompt");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Add styling for the button if needed */
</style>
