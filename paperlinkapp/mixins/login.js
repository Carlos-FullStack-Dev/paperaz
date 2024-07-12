import Vue from 'vue'
import UserTypeEnum from '~/models/UserTypeEnum'
import StatusUser from '~/models/StatusUser'
import axios from 'axios'

export default {
  data() {
    return {
      isAppMode: false,
      isPaid: true,
      initialLoad: true,
      teams: []
    }
  },
  methods: {
    async getUserTeams(id){
      const response = await this.$axios.get(`/teammembers?userId=${id}`)
      this.teams = response.data.data
      localStorage.setItem("team_id", this.teams[0].ownersId)
      localStorage.setItem("team_prop", JSON.stringify(this.teams[0]))
    },
    async checkIfTeamMemberIsExpired(teamId) {
      await this.$axios.$get(`/users/${teamId}`).then((response) => {
        if (response?.status == StatusUser.EXPIRED) {
          this.$auth.logout()
          window.location.assign(
            `/login/?error=Opps, Team subscription is expired`
          )
        }
      })
      return
    },

    async fetchUser(id) {
      await this.$axios
        .$get(`/users/?id=${id}`)
        .then(async (response) => {
          localStorage.setItem('paperdaz_userID', id)
          const [userData] = response.data

          //check user role to set users
          if(userData.role === UserTypeEnum.PAID){
            localStorage.setItem("user", JSON.stringify(userData))
            this.$auth.setUser(userData)
            this.$store.commit('SET_PAGE_USER', this.$auth.user)
          } else if(userData.role === UserTypeEnum.FREE){
            this.getUserTeams(userData.id)
          }

          // set the user
          if (
            this.$auth.user.role == UserTypeEnum.PAID ||
            this.$auth.user.role == UserTypeEnum.TEAM
          ) {
            if (window.matchMedia('(display-mode: standalone)').matches) {
              if (!this.$store?.getters?.isVisited) {
                this.$store.commit('SET_VISITED')
                this.$nuxt.$router.push(`/${this.$auth.user?.businessPage}`)
              }
            }
          }
          // route to login, if user is not paid or free
          if (
            userData.role == UserTypeEnum.ADMIN ||
            userData.role == UserTypeEnum.SUPER_ADMIN
          ) {
            await this.$auth.logout()
            window.location.assign(
              `/login/?error=Opps, Admin cannot be logged in to  user plattform`
            )
            return
          }

          if (userData?.status !== StatusUser.ACTIVE) {
            await this.$auth.logout()
            window.location.assign(
              `/login/?error=Your account is ${userData?.status}ed, reach out to support for help`
            )
          }
        })
        .catch(async ({ response }) => {
          if (response?.status == 401) await this.$auth.logout()
          this.$nuxt.$router.push('/login?error=Login session has expired')
          localStorage.removeItem('paperdaz_userID')
        })
    },

    // < LOGIN -- user>
    async loginUser(response) {
      const { id } = response.data.user
      localStorage.setItem(
        'main_user_paperdaz_token',
        response.data.accessToken
      )
      this.$auth.strategy.token.set(response.data.accessToken)
      this.fetchUser(id)
    },

    // < GET_USER -- user>
    async filterUsers() {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.isAppMode = true
      }

      if (this.$auth.loggedIn && localStorage.getItem('paperdaz_userID')) {
        this.isPaid = true
        const id = localStorage.getItem('paperdaz_userID')
        this.fetchUser(id)
        return
      } else if (!localStorage.getItem('paperdaz_userID')) {
        this.isPaid = false
        await this.$auth.logout()
      }
    },
  },
  async beforeMounted() {
    await this.filterUsers()
  },
}
