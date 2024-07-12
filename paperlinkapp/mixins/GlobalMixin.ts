import Vue from 'vue'
import AuthUser from '~/models/AuthUser'
import UserTypeEnum from '~/models/UserTypeEnum'
import { server } from '~/services/new-service'
import { ErrorHandler } from '~/types/ErrorFunction'

export default {
  computed: {
    $_ErrorHandler(){
      return ErrorHandler
    },
    $_server() {
      return server
    },
   $_userId(){
       return JSON.parse(localStorage.getItem('user') as any)?.id
    },
    $_user(){
      return JSON.parse(localStorage.getItem('user') as any)
    },
    $_queryId() : number | null | string{
    //@ts-ignore
    let paramsId: string | null = localStorage.getItem("team_id")? localStorage.getItem("team_id"): (this.$auth as any)?.user?.id;
    return Number(paramsId)
    },
    $_teamOwner(){
       return JSON.parse(localStorage.getItem("team_prop") as string)
    },
    $_subscriptionId() : number | null | string{
      const teamOwner = JSON.parse(localStorage.getItem("team_prop") as string)
      //@ts-ignore
      let paramsId: string | null = localStorage.getItem("team_id") ? teamOwner.user.subscriptionId : (this.$auth as any)?.user?.subscriptionId;
      return Number(paramsId)
      },
    $_teamId() : number | null | string{
      //@ts-ignore
      let teamId: string | null = localStorage.getItem("team_id");
        return Number(teamId)
      }
  },
  watch: {
    "$store.getters.getToast.active"(val: boolean){
        val && setTimeout(() => {
          //@ts-ignore
          this.toggleToast({
            active: false,
            msg: ``,
          })
        }, 5000);
    }
  },
  methods: {
    clearBusinessData(){
      // localStorage.setItem("from_businesspage", "false")
      //@ts-ignore
      // this.$store.commit("SET_BUSINESS_PAGE", false)
    },
    async toggleToast(val: any) {
      await new Promise(resolve => setTimeout(resolve, val.delay || 0));
      //@ts-ignore
      this.$store.commit('SET_TOAST', val);
    },
    async logout(shouldRedirect: boolean = true) {
      // @ts-ignore
      if (shouldRedirect) await this.$nuxt.$router.push('/login')
      localStorage.removeItem('team_id')
      localStorage.removeItem('team_prop')
      localStorage.removeItem('redirect_paperdaz_path')
      //@ts-ignore
      this.$notify({
        title: 'Authentication',
        message: 'Logged out successfully',
        type: 'success',
      })

      // @ts-ignore

      await this.$auth.logout()
      localStorage.removeItem('userID') // remove the local storage userID
    },
  },
}
