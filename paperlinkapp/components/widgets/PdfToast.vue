<template>
    <div
    :class="[$store.getters.getToast.active ? 'scale-100' : 'scale-0']"
    class="fixed z-[100] bg-paperdazgreen-300 text-white top-0 left-0 w-screen duration-150">
        <div class="py-3 px-4 w-full text-center" v-html="$store.getters.getToast.msg"></div>
       <button class="absolute top-2 right-2" @click="removePopUp" >&#x2715;</button>
    </div>
  </template>
  
  <script>
  import mixins from 'vue-typed-mixins'
  import GlobalMixin from '~/mixins/GlobalMixin'
  
  export default mixins(GlobalMixin).extend({
    methods: {
      removePopUp(event) {
          this.toggleToast({
            active: false,
            msg: ``,
          })
      },
    },
  })
  </script>
  
  <style lang="scss" scoped></style>
  