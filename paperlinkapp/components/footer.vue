<template>
  <div
    class="min-h-[100px] flex-col lg:flex-row w-full lg:justify-start items-center lg:items-end h-fit bg-white flex py-4 px-[6%]"
  >
    <div class="text-[0.8rem] flex items-end md:pr-3 text-[#B9B8C1]">
      <p class="">© Paperdaz LLC, 1968 S Coast Hwy Suite 4302, Laguna Beach CA 92651</p>
    </div>

    <div class="flex items-end">
      <nuxt-link to="/terms-condition" class="text-[0.8rem] px-3">
        Terms of Use
      </nuxt-link>
      <nuxt-link to="/privacy-policy" class="text-[0.8rem] px-3">
        Privacy Policy
      </nuxt-link>
      <nuxt-link to="/contact-us-landing" class="text-[0.8rem] px-3">
        Contact Us
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "Footer",
};
</script>
