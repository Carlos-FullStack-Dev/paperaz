import UserTypeEnum from '~/models/UserTypeEnum'

  export default{
    computed: {
      appIsFreeUser(){
        return this.$auth?.user?.role == UserTypeEnum.FREE
      }
    },
  }