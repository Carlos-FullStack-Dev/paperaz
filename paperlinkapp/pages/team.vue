<template>
  <main class="">
    <top-details-card-container v-model="activeTab" class="mb-5" />
    <!-- <leaves-details-container class="mb-12" /> -->

    <div class="flex items-center flex-wrap gap-4 justify-between mb-6 max-sm:px-4">
      <div class="flex items-center">
        <h5 class="!text-[0.8 rem] lg:!text-[1rem] font-semibold text-[#272727]">
          Team Members
        </h5>
        <div
          class="min-h-[30px] md:border-[#77C360] text-[#77C360] ml-3 rounded-[50%] flex items-center justify-center border-[1px] min-w-[30px] bg-white"
        >
          <p class="">{{ totalMembers }}</p>
        </div>
      </div>
      <social-sharing url="https://example.com"> Share </social-sharing>
      <div class="text-white flex items-center">
        <form
          action=""
          class="w-full xs:max-w-[280px] text-xs font-medium flex items-center relative justify-end mr-2"
          @submit.prevent="$event.preventDefault()"
        >
          <span class="el-dropdown-link no-roll">
            <!-- <span class="el-dropdown-link" :class="[show ? 'left-roll' : 'no-roll']"> -->
            <input
              type="text"
              class="search-input text-black h-10 pl-4 mr-2 bg-transparent flex-1 border border-paperdazgreen-300 rounded-tl-lg rounded-bl-lg focus:border-paperdazgreen-700 outline-none"
              placeholder="Search Files"
              v-model="teamSearch"
            />
          </span>

          <div
            v-if="showInviteTeamMemberModal"
            @click="showInviteTeamMemberModal = false"
            class="w-screen h-screen fixed top-0 left-0 bg-black/30 backdrop-blur-sm z-[100]"
          ></div>
        </form>

        <div
          v-if="showInviteTeamMemberModal"
          class="w-full lg:hidden bg-black/30 backdrop-blur-sm z-[2000] flex items-center justify-center left-0 top-0 fixed h-full"
        >
          <div
            class="z-[1001] relative px-6 py-4 bg-white rounded-md sm:w-[400px] w-[90vw]"
          >
            <button
              class="absolute top-2 right-2 text-black text-[2rem]"
              @click="showInviteTeamMemberModal = false"
            >
              <img src="~/assets/icons/x_red.svg" />
            </button>
            <p class="text-black">Email</p>
            <input
              class="w-full p-2 py-2 rounded-sm my-3 bg-white border-[1px] border-gray-300 text-black"
              v-model="teamEmail"
              placeholder="Email"
            />
            <div class="w-full flex justify-center">
              <button
                @click="sendTeamInvite"
                class="h-10 w-[90%] rounded-lg shadow px-5 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
                :class="[isLoading ? 'cursor-progress' : '']"
                :disabled="isLoading"
              >
                <span class="inline-flex items-center gap-3">
                  <span>Invite</span>
                  <transition name="fade" :duration="100">
                    <span v-show="isLoading" class="animate-spin">
                      <spinner-dotted-icon height="22" width="22" />
                    </span>
                  </transition>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div class="w-auto relative pr-0">
          <button
            class="circle hidden circle-18 bg-paperdazgreen-400 relative text-[1.5rem] hover:bg-paperdazgreen-70 z-[1001]"
            @click="showInviteTeamMemberModal = true"
          >
            +
            <!-- <user-plus-icon width="16" height="16" /> -->
          </button>
          <div
            v-if="showInviteTeamMemberModal"
            class="absolute hidden lg:block z-[1001] px-6 py-4 right-0 top-16 bg-white rounded-md sm:w-[400px] w-[90vw]"
          >
            <div class="triangle"></div>
            <p class="text-black">Email</p>
            <input
              class="w-full p-2 py-2 rounded-sm my-3 bg-white border-[1px] border-gray-300 text-black"
              v-model="teamEmail"
              placeholder="Email"
            />
            <div class="w-full flex justify-center">
              <button
                @click="sendTeamInvite"
                class="h-10 w-[90%] rounded-lg shadow px-5 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
                :class="[isLoading ? 'cursor-progress' : '']"
                :disabled="isLoading"
              >
                <span class="inline-flex items-center gap-3">
                  <span>Invite</span>
                  <transition name="fade" :duration="100">
                    <span v-show="isLoading" class="animate-spin">
                      <spinner-dotted-icon height="22" width="22" />
                    </span>
                  </transition>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-white overflow-x-auto custom-scrollbar relative">
      <!-- START:Team container spinner -->
      <div
        v-if="teamSpinner || updateTeamSpiunner"
        class="w-full grid place-items-center h-full h-min-[300px] absolute top-0 left-0 z-30"
        :class="[updateTeamSpiunner ? 'bg-transparent' : 'bg-white']"
      >
        <SpinnerDottedIcon class="animate-spin" />
      </div>
      <!-- END:Team container spinner -->
      <img
        v-show="teamMembers.length === 0 && !teamSpinner && !updateTeamSpiunner"
        src="../assets/img/dashboard-bg.png"
        class="position-absolute mt-24 md:left-[30%] z-50 md:w-auto sm:w-[200px]"
      />
      <table
        v-if="teamMembers.length === 0 && !teamSpinner && !updateTeamSpiunner"
        key="3"
        ref="fileLedgerTable"
        class="file-ledger-table"
      >
        <thead>
          <tr class="text-left">
            <th class="text-left fixed-col left font-[500]">No</th>
            <th class="text-center font-[500]">Email</th>
            <th class="text-center font-[500]"></th>
            <th class="text-center font-[500]"></th>
            <th class="text-center font-[500]">Name</th>
            <th class="fixed-col right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <td class="text-left fixed-col left">{{ i }}</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="fixed-col right"></td>
          </tr>
        </tbody>
      </table>

      <section v-else class="px-4 py-4 w-full">
        <div class="border-b-[1px] border-gray-200 flex items-center py-3">
          <p class="text-left !text-[0.7rem] lg:!text-[1rem] inline-block w-1/12">No</p>
          <p class="text-left !text-[0.7rem] lg:!text-[1rem] inline-block w-5/12">
            Email
          </p>

          <p class="!text-[0.7rem] lg:!text-[1rem] pl-2 inline-block w-6/12">Name</p>
        </div>

        <div
          v-for="(member, i) in teamMembers"
          :key="i"
          class="border-b-[1px] border-gray-200 list-none px-0 py-3 flex items-center w-full"
        >
          <div class="w-1/12">
            {{ i + 1 }}
          </div>
          <div class="flex items-center w-5/12 truncate">
            <div class="flex items-center gap-3 sm:min-w-[150px] truncate pr-2">
              <div class="truncate">
                <p
                  class="truncate !text-[0.7rem] lg:!text-[1rem] md;text-base font-normal text-left sm:ml-1"
                >
                  {{
                    member?.user?.email.charAt(0).toUpperCase() + member?.user?.email.slice(1)
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="w-6/12 pl-2 flex justify-between items-center">
            <div class="flex items-center sm:min-w-[150px] truncate">
              <div class="truncate">
                <p
                  class="truncate flex !text-[0.7rem] lg:!text-[1rem] md:text-base font-normal text-left sm:ml-1"
                >
                  {{
                    `${member?.user?.firstName || "Pending"} ${member?.user?.lastName || ""}`
                  }}

                  <span class="hidden ml-2 lg:block">{{
                    user?.id === member?.user?.id ? "(you)" : ""
                  }}</span>
                </p>
              </div>
            </div>

            <div>
              <p
                class="!text-[0.7rem] lg:hidden lg:!text-[1rem] md:text-base"
                v-show="user?.id === member?.user?.id"
              >
                (You)
              </p>
              <button @click="onDelete(member)" v-show="user?.id !== member?.user?.id">
                <img src="~/assets/icons/x_red.svg" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="flex justify-center">
      <FilePagination :totalFile="totalFile" @setPage="setPage" />
    </div>
    <max-invite-modal v-model="showMaxInvite" :teamMembers="totalTeamMembers" />
    <DeleteTeamMember
      :refresh="refresh"
      :member="seletedMember"
      v-model="showDelateModal"
    />
  </main>
</template>

<script>
import Vue from "vue";
import LeavesDetailsContainer from "~/components/dashboard/LeavesDetailsContainer.vue";
import TopDetailsCardContainer from "~/components/dashboard/TopDetailsCardContainer.vue";
import ArrowDownIcon from "~/components/svg-icons/ArrowDownIcon.vue";
import EllipsisIconVerticalIcon from "~/components/svg-icons/EllipsisIconVerticalIcon.vue";
import NoteAndPenIconVue from "~/components/svg-icons/NoteAndPenIcon.vue";
import PageIconVue from "~/components/svg-icons/PageIcon.vue";
import SearchIcon from "~/components/svg-icons/SearchIcon.vue";
import TickCircleIconVue from "~/components/svg-icons/TickCircleIcon.vue";
import UserPlusIcon from "~/components/svg-icons/UserPlusIcon.vue";
import Paid_User from "~/mixins/Paid_User";
import MaxInviteModal from "~/components/teams/MaxInviteModal.vue";
import AuthUser from "~/models/AuthUser";
import FilePagination from "~/components/pagination/FilePagination.vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import StatusUser from "~/models/StatusUser";
import LedgerIcon from "~/components/svg-icons/LedgerIcon.vue";
import LetterAvatar from "~/components/widgets/LetterAvatar.vue";
import DeleteTeamMember from "~/components/modals/DeleteTeamMember.vue";
import SocialSharing from "vue-social-sharing";

export default Vue.extend({
  components: {
    TopDetailsCardContainer,
    LeavesDetailsContainer,
    EllipsisIconVerticalIcon,
    SearchIcon,
    UserPlusIcon,
    ArrowDownIcon,
    MaxInviteModal,
    FilePagination,
    SpinnerDottedIcon,
    LedgerIcon,
    LetterAvatar,
    SocialSharing,
    DeleteTeamMember,
  },
  name: "TeamsPage",
  layout: "dashboard",
  auth: true,
  data() {
    return {
      activeTab: "ledger",
      showInviteTeamMemberModal: false,
      searchParam: "",
      showMaxInvite: false,
      show: false,
      returnedTeamMember: 0,
      teamMembers: [],
      totalMembers: null,
      teamSpinner: true,
      updateTeamSpiunner: false,
      reachTeamLimit: false,
      totalTeamMembers: null,
      teamSearch: "",
      teamEmail: "",
      isLoading: false,
      allTeamMember: 0,
      showDelateModal: false,
      seletedMember: {},
      tabs: [
        {
          label: "Ledger",
          key: "ledger",
          count: 896,
          action: "ledger",
          icon: NoteAndPenIconVue,
        },
        {
          label: "Completed",
          key: "completed",
          count: 25,
          action: "complete",
          icon: PageIconVue,
        },
        {
          label: "Confirmed",
          key: "confirmed",
          count: 25,
          action: "confirm",
          icon: TickCircleIconVue,
        },
        {
          label: "Signed",
          key: "signed",
          count: 25,
          action: "sign",
          icon: NoteAndPenIconVue,
        },
      ],
    };
  },
  asyncData({ store, $axios, $auth }) {
    store.commit("SET_PAGE_NAME", { name: "Team" });
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    canUserInvite() {
      return this.totalMembers >= this.totalTeamMembers;
    },
    userType() {
      return UserTypeEnum;
    },
  },
  mounted() {
    this.getTeamMember(this.returnedTeamMember, this.teamSearch);
    this.getUserSubscription();
  },
  methods: {
    onDelete(member) {
      if(!member) return
      this.seletedMember = member;
      this.showDelateModal = true;
    },
    sendTeamInvite() {
      this.isLoading = true;
      this.$axios
        .post("/request", {
          action: "invite_link",
          email: this.teamEmail,
          userId: this.$auth?.user?.id,
        })
        .then(() => {
          this.isLoading = false;
          this.showInviteTeamMemberModal = false;
          this.teamEmail = "";
          this.getTeamMember(this.returnedTeamMember, this.teamSearch);
          this.toggleToast({
            msg: "Team member invitation sent!",
            active: true,
            msg_mobile: "Team member invitation sent!",
          });
        })
        .catch(() => {
          this.$notify({
            title: "",
            message: "Error occurred, Cannot send invite",
          });
        })
        .finally(() => (this.isLoading = false));
      // .then(() => {
      //   this.isLoading = false;
      //   this.showInviteTeamMemberModal = false;
      //   this.teamEmail = "";
      //   this.toggleToast({
      //     msg: "Team member invitation sent!",
      //     active: true,
      //     msg_mobile: "Team member invitation sent!",
      //   });
      // })
      // .catch(() =>
      //   this.$notify({
      //     title: "",
      //     message: "Error occurred, Cannot send invite",
      //   }).finally(() => {
      //     this.isLoading = false;
      //   })
      //   // this.getTeamMember(this.returnedTeamMember, this.teamSearch)
    },
    setPage(val) {
      this.teamSpinner = true;
      this.returnedTeamMember = val;
    },
    setStatus(val, type) {
      this.updateTeamSpiunner = true;
      this.$axios.$patch(`/users/${val}`, { status: type }).then(() => {
        this.getTeamMember(this.returnedTeamMember);
      });
    },
    async getUserSubscription() {
      this.$axios
        .$get(`/subscriptions/?userId=${this.$auth.user.id}`)
        .then((response) => {
          this.totalTeamMembers = response.data[0].teamMembers;
        })
        .catch(() => {
          this.reachTeamLimit = true;
        });
    },
    setTeamAccess(val, type) {
      this.updateTeamSpiunner = true;
      this.$axios.$patch(`/users/${val}`, { teamAccess: type }).then(() => {
        this.getTeamMember(this.returnedTeamMember);
      });
    },
    refresh() {
      this.getTeamMember(this.returnedTeamMember, this.teamSearch);
    },
    getTeamMember(val, search) {
      this.$axios
        .$get(
          `/teammembers?teamsId=${this.$auth.user.teamId}&$sort[createdAt]=-1&$skip=${val}`
        )
        .then((response) => {
          console.log(",,,gfsudksdlsdklsd", response)
          this.teamMembers = response.data;
          this.totalMembers = response.total;
        })
        .catch(() => {
          this.$notify.error({
            title: "teams",
            message: "Error, could not get teams",
          });
        })
        .finally(() => {
          (this.teamSpinner = false), (this.updateTeamSpiunner = false);
        });
    },
    MaxInviteFunc() {
      this.showMaxInvite = true;
    },
    getStatusClass(val) {
      switch (val.toLowerCase()) {
        case "active":
          return "text-white bg-paperdazgreen-400";
        case "pending":
          return "text-white bg-[#5078B5]";
        case "disabled":
          return "text-white bg-[#909090]";
        default:
          return "text-white bg-[#909090]";
      }
    },
  },
  beforeMount() {
    if (this.$auth.user.status == StatusUser.EXPIRED) {
      this.$notify.error({
        message: "Your subscription is expired, go to billing to renew",
      });
      this.$nuxt.$router.push("/dashboard");
    }
  },
  watch: {
    "$auth.user": function () {
      this.getTeamMember(this.returnedTeamMember, this.teamSearch);
      this.getUserSubscription();
    },
    returnedTeamMember: function () {
      this.getTeamMember(this.returnedTeamMember, this.teamSearch);
    },
    teamSearch: function () {
      this.getTeamMember(this.returnedTeamMember, this.teamSearch);
    },
  },
});
</script>

<style lang="postcss" scoped>
.file-ledger-table {
  --background: white;
  @apply max-sm:text-xs sm:text-base w-full whitespace-nowrap;
  border-collapse: separate;
  border-spacing: 0px 0px;
  height: fit-content;
  & tr {
    @apply border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    &.highlight {
      --background: rgba(233, 254, 219, 0.46);
    }
  }
  & th {
    @apply max-sm:pt-4 max-sm:pb-1 sm:pt-8 sm:pb-3 max-sm:text-xs sm:text-base;
    background: var(--background);
  }
  & td {
    @apply py-3 max-sm:text-xs sm:text-base;
  }
  & td,
  & th {
    @apply px-1 border-b border-gray-100;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    &:first-child {
      @apply pl-5;
    }
    &:last-child {
      @apply pr-5;
    }
    &.fixed-col {
      position: sticky;
      background: white;
      background: var(--background);
      &.left {
        left: -0.1px;
      }
      &.right {
        right: -0.1px;
      }
    }
  }
}

.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid white;
  position: absolute;
  top: -15px;
  right: 10px;
}
/* .search-input {
  & ~ .search-dropdown {
    @apply opacity-0 translate-y-[5%] pointer-events-none;
  }
  &:active,
  &:focus {
    & ~ .search-dropdown {
      @apply opacity-100 translate-y-0 pointer-events-auto;
    }
  }
} */
</style>
