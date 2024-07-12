<template>
    <div class="w-[100vw] h-[100vh] flex justify-center items-center">
        <SpinnerDottedIcon class="animate-spin"/>
    </div>
</template>

<script>
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import jwt, { decode, JsonWebTokenError } from 'jsonwebtoken'

    export default {
    name: "permission",

    async created() {
        const { permission } = this.$route.query;
        // return
        let permissionOpt = jwt.verify(permission, process.env.NUXT_ENV_BACKEND_JWT_TOKEN);
        // return
        this.$axios.post(`/permissions`, {
            fileId: permissionOpt.data.fileId,
            userId: permissionOpt.data.userId,
            fileOwnerId: permissionOpt.data.userId,
            isGranted: true
        })
        .then((response)=>{
            this.$notify.success({
                message:"permisssion Granted"
            })
            this.$router.push("/dashboard")
        })
        .catch(()=>{
            this.$notify.error({
                message:"failed to grant permisssion"
            })
        })
 
    },
    components: { SpinnerDottedIcon }
}
</script>

<style scoped>

</style>