<template>
  <div class="bg-white p-6 rounded-2xl lg:border lg:border-paperdazgreen-400">
    <h3
      class="flex justify-start sm:justify-center sm:text-paperdazgreen-300 sm:border-b-0 border-paperdazgreen-300 sm:font-semibold text-lg sm:text-2xl gap-2 pb-1 relative mb-[0.5rem] sm:mb-7"
    >
      <!-- <span>{{ headerText }} </span> -->
      <!-- <img
        @click="editingDetails = !editingDetails"
        class="absolute h-[35px] lg:hidden scale-50 md:scale-100 bg-white-400 right-0 top-1/2 transform -translate-y-1/2 px-2 py-1"
        src="~/assets/icons/edit_p.svg"
        alt=""
      /> -->
      <button
        @click="editingDetails = !editingDetails"
        type="button"
        class="absolute hidden lg:block scale-50 md:scale-100 bg-white-400 right-0 top-1/2 transform -translate-y-1/2 px-2 py-1"
      >
        <edit-pen-icon v-show="!editingDetails" />

        <times-icon v-show="editingDetails" width="14" height="14" />
      </button>
    </h3>

    <div v-show="!editingDetails" class="flex lg:hidden justify-end w-full mt-[-15px]">
      <button
        @click="editingDetails = !editingDetails"
        class="h-[40px] w-[40px] rounded-md grid place-content-center"
      >
        <img src="~/assets/icons/edit_p.svg" alt="" />
      </button>
    </div>
    <component
      :editingDetails="editingDetails"
      :is="formComponent"
      @stop-editing="editingDetails = false"
      class="sm:mt-4"
    />
  </div>
</template>

<script>
import Vue from "vue";
import EditPenIcon from "../svg-icons/EditPenIcon.vue";
import InputField from "../widgets/InputField.vue";
import UserTypeEnum from "~/models/UserTypeEnum";
import UserForm from "~/components/settings/forms/UserForm.vue";
import CompanyForm from "~/components/settings/forms/CompanyForm.vue";
import TimesIcon from "../svg-icons/TimesIcon.vue";

export default Vue.extend({
  name: "ProfileInfo",
  components: { EditPenIcon, InputField, TimesIcon },
  data() {
    return {
      editingDetails: false,
    };
  },
  computed: {
    userType() {
      return this.$store.getters.userType;
    },

    headerText() {
      switch (this.userType) {
        case UserTypeEnum.FREE:
          return "Personal Profile";
        case UserTypeEnum.PAID:
          return "Company Profile";
        case UserTypeEnum.TEAM:
          return "Team Profile";
        default:
          return "";
      }
    },
    formComponent() {
      switch (this.userType) {
        case UserTypeEnum.FREE:
          return UserForm;
        case UserTypeEnum.PAID:
          return CompanyForm;
        case UserTypeEnum.TEAM:
          return CompanyForm;
        default:
          return {
            render(createElement) {
              return createElement("h1", "Loading....");
            },
          };
          return UserForm;
      }
    },
  },
});
</script>
