<template>
  <div class="rounded-2xl py-8 grid grid-cols-1 lg:grid-cols-[max-content,1fr] gap-6">
    <profile-card class="lg:w-[262px] w-full max-w-full" />
    <form class="w-full mx-auto bg-white rounded-2xl p-3" @submit.prevent="submit">
      <div class="mb-7 mt-4">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >Current Password</label
        >

        <el-input
          placeholder=""
          show-password
          required
          v-model="formData.oldPassword"
          :disabled="!editingDetails || loading"
        ></el-input>
      </div>
      <div class="mb-7">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >New Password</label
        >
        <el-input
          placeholder=""
          show-password
          required
          class="!bg-pink-400 !rounded-[1rem] !border-red-400"
          v-model="formData.password"
        ></el-input>
      </div>
      <div class="mb-10">
        <label for="" class="block text-[#282533] font-medium text-lg mb-2"
          >Confirm New Password</label
        >
        <el-input
          placeholder=""
          show-password
          required
          v-model="formData.confirmPassword"
          :disabled="!editingDetails || loading"
        ></el-input>
        <small
          class="text-red-600 text-xs"
          v-show="
            editingDetails &&
            formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
          "
          >Password fields don't match
        </small>
      </div>

      <message-alert-widget
        :message="alertMessage.message"
        v-show="alertMessage.message && editingDetails"
        :type="alertMessage.isSuccess ? 'success' : 'error'"
        class="mb-8"
      />
      <div class="flex justify-center">
        <button
          class="disabled:opacity-50 w-full lg:w-auto disabled:cursor-not-allowed bg-paperdazgreen-300 text-white rounded-xl h-12 px-5 font-medium text-lg"
          v-show="editingDetails"
          :disabled="loading"
        >
          <span class="inline-flex gap-2 items-center">
            Update Password
            <span class="inline-block" v-show="loading && editingDetails">
              <spinner-dotted-icon class="animate-spin" height="18" width="18" />
            </span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import ProfileCard from "../ProfileCard.vue";
import PenIcon from "~/components/svg-icons/PenIcon.vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import TimesIcon from "~/components/svg-icons/TimesIcon.vue";
import InputField from "~/components/widgets/InputField.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import PasswordField from "~/components/widgets/PasswordField.vue";
import mixins from "vue-typed-mixins";
import login from "~/mixins/login";

export default mixins(login).extend({
  name: "ChangePasswordTab",
  components: {
    InputField,
    PasswordField,
    PenIcon,
    TimesIcon,
    SpinnerDottedIcon,
    MessageAlertWidget,
    MessageAlertWidget,
    ProfileCard,
  },
  data() {
    return {
      editingDetails: true,
      loading: false,
      formData: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
        action: "user_update_password",
        test: "$2a$10$q2uLuYadYf5mars2wxBmruvdXPxDXXIoBvVffb39FQEeWVaI0Iurm",
      },
      alertMessage: {
        isSuccess: false,
        message: "",
      },
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();

      if (
        this.loading ||
        !this.formData.oldPassword ||
        !this.formData.password ||
        !this.formData.confirmPassword ||
        this.formData.confirmPassword !== this.formData.password
      )
        return;

      this.loading = true;
      this.alertMessage.message = "";

      let cloneFormData = this.formData;

      delete cloneFormData.confirmPassword;

      this.$axios
        .$patch(`/users/${this.$auth.user.id}`, cloneFormData)
        .then(async (response) => {
          await this.$notify.success({
            message: "Password updated successfully",
            title: "Password Update",
          });

          // this.formData = {
          //   oldPassword: '',
          //   password: '',
          //   confirmPassword: '',
          //   "isUpdatePassword":true,
          //   "test":process.env.UPDATE_PASSWORD_TEST
          // }

          this.editingDetails = false;
        })
        .catch((err) => {
          console.log("erroe", err);
          this.alertMessage.isSuccess = false;
          this.alertMessage.message =
            err.response.data.message || err.message || "Unable to update password";
          this.editingDetails = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

<style lang="scss">
.custom-input {
  @apply w-full px-4 text-[0.9rem] outline-none rounded-lg h-[40px] border-[1px] border-paperdazgray-200 mr-2 focus:border-paperdazgray-600;
}
</style>
