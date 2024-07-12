<template>
    <div class="flex flex-wrap w-screen mt-0 justify-center h-screen bg-paperdazgreen-300">
       <div>
        <h1 class="text-[20px] text-center w-full  text-white my-12">Oops, sorry the file you are looking for is no longer available!</h1>
       <div >
          <img class="w-[90%] max-w-[800px]" src="./assets/delete_paperlink.svg"/>
       </div>
       </div>
    </div>
</template>

<script>
    export default {
      methods: {
        goToPaperLink(){
            this.$store.commit('SET_PDF_EXIT', true)
            this.$nuxt.$router.push('')
        }
      },   
    }
</script>

<style lang="scss" scoped>

</style>