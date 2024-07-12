<template>
  <div>
    <button v-if="deferredPrompt" @click="installPWA">
      <svg
        width="18"
        height="18"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.8115 15.3072V1.70962C16.8115 1.0533 17.3436 0.52124 17.9999 0.52124C18.6562 0.52124 19.1883 1.0533 19.1883 1.70962V15.3072L22.2763 11.9618C22.7215 11.4796 23.4733 11.4495 23.9556 11.8947C24.4379 12.3398 24.4679 13.0917 24.0228 13.5739L18.8731 19.1527C18.6481 19.3964 18.3316 19.535 17.9999 19.535C17.6682 19.535 17.3516 19.3964 17.1267 19.1527L11.977 13.5739C11.5318 13.0917 11.5619 12.3398 12.0442 11.8947C12.5264 11.4495 13.2783 11.4796 13.7235 11.9618L16.8115 15.3072Z"
          fill="#424242"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.94707 6.46341C2.94707 6.24463 3.12443 6.06728 3.3432 6.06728H12.058C12.7143 6.06728 13.2464 5.53523 13.2464 4.8789C13.2464 4.22258 12.7143 3.69052 12.058 3.69052H3.3432C1.81178 3.69052 0.570312 4.93198 0.570312 6.46341V24.6852C0.570312 26.2167 1.81178 27.4581 3.3432 27.4581H13.1727C12.9022 29.6369 11.8978 31.6605 10.3702 33.4109C10.0638 33.762 9.99086 34.2598 10.1837 34.684C10.3765 35.1083 10.7995 35.3807 11.2656 35.3807H24.7339C25.1999 35.3807 25.6229 35.1083 25.8157 34.684C26.0086 34.2598 25.9356 33.762 25.6292 33.4109C24.1016 31.6605 23.0972 29.6369 22.8267 27.4581H32.6566C34.188 27.4581 35.4295 26.2167 35.4295 24.6852V6.46341C35.4295 4.93198 34.188 3.69052 32.6566 3.69052H23.9418C23.2855 3.69052 22.7534 4.22258 22.7534 4.8789C22.7534 5.53523 23.2855 6.06728 23.9418 6.06728H32.6566C32.8754 6.06728 33.0527 6.24463 33.0527 6.46341V24.6852C33.0527 24.904 32.8754 25.0814 32.6566 25.0814H3.3432C3.12442 25.0814 2.94707 24.904 2.94707 24.6852V6.46341ZM15.5643 27.4581C15.3654 29.4644 14.6706 31.3322 13.6262 33.0039H22.3732C21.3288 31.3322 20.634 29.4644 20.4352 27.4581H15.5643Z"
          fill="#424242"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'InstallPwaButton',
  data() {
    return {
      deferredPrompt: null,
    }
  },

  // Listen for the beforeinstallprompt event and save the deferredPrompt object
  mounted() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      this.deferredPrompt = event
    })
  },

  // In a method triggered by a button click, use the deferredPrompt object to prompt the user to install the PWA
  methods: {
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt()
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User installed the PWA')
          } else {
            console.log('User dismissed the PWA install prompt')
          }
          this.deferredPrompt = null
        })
      }
    },
  },
}
</script>
