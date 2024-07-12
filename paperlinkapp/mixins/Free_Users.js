import UserTypeEnum from '~/models/UserTypeEnum'

  export default{
    computed: {
      appIsFreeUser(){
        return this.$auth?.user.role == UserTypeEnum.FREE
      }
    },
    watch:{
      created(){
        // if ( this.$auth.user.role !== UserTypeEnum.FREE) {   
        //   this.$nuxt.$router.push("/dashboard")
        //  }
      },
      "$auth.user" : function(){
        if ( this.$auth.user.role !== UserTypeEnum.FREE) {   
         this.$nuxt.$router.push("/dashboard")
        }
      }
    }
  }