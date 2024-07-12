<template>
  <div>
    <p class="w-full text-center px-3 relative top-[50px] text-white font-semibold text-[24px]">
      Your clients can scan QR Code to access your<br/> PaperLink Business Page on their own mobile device!
    </p>
    <img class="left-[70px] top-[390px] md:top-[140px] z-10 absolute w-36" src="@/assets/icons/pwa-qrcode.svg"/>
    <img class="left-[230px] md:top-[200px] z-10 absolute sm:w-48 -rotate-[0deg]" src="@/assets/icons/spiral_arrow_lime.svg"/>
  </div>
</template>

<script>
import ShareOutlineIcon from '~/components/svg-icons/ShareOutlineIcon.vue';
export default {
  components: {
    ShareOutlineIcon
  }
}
</script>

<style lang="scss" scoped></style>
