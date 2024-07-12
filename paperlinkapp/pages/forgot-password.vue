<template>
  <section class="bg-paperdazgreen-300 min-h-[100vh] to-transparent">
    <div class="container py-20">
      <div class="w-full max-w-lg mx-auto bg-white shadow-2xl rounded-xl px-6 py-10">
        <h4 class="text-[24px] font-medium mb-2">Forgot your password?</h4>

        <p class="text-gray-500 text-[14px] mb-8">
          Fear not. We'll email you instructions to reset your password.
        </p>

        <form action="" class="text-sm" @submit.prevent="onSubmit">
          <message-alert-widget
            :message="alertMessage.message"
            v-show="alertMessage.message"
            :type="alertMessage.isSuccess ? 'success' : 'error'"
            class="mb-8"
          />
          <div class="mb-2">
            <label for="" class="mb-2 block text-sm font-medium text-gray-500"
              >EMAIL</label
            >
            <el-input
              v-model="user.email"
              :disabled="isLoading"
              type="email"
              placeholder="Your email"
              required
            />
          </div>

          <!-- <recaptcha /> -->

          <div class="flex flex-col items-center">
            <button
              class="h-10 rounded-lg shadow px-5 text-white text-sm bg-paperdazgreen-300 disabled:bg-opacity-70"
              :class="[isLoading ? 'cursor-progress' : '']"
              :disabled="isLoading"
            >
              <span class="inline-flex items-center gap-3">
                <span>Reset Password</span>
                <transition name="fade" :duration="100">
                  <span v-show="isLoading" class="animate-spin">
                    <spinner-dotted-icon height="22" width="22" />
                  </span>
                </transition>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import SocialAuth from "~/components/auth/SocialAuth.vue";
import CheckIcon from "~/components/svg-icons/CheckIcon.vue";
import ExclamationIcon from "~/components/svg-icons/ExclamationIcon.vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import SvgIcon from "~/components/svg-icons/SvgIcon.vue";
import InputField from "~/components/widgets/InputField.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import PasswordField from "~/components/widgets/PasswordField.vue";

export default Vue.extend({
  name: "LoginPage",
  auth: "guest",
  components: {
    SocialAuth,
    InputField,
    PasswordField,
    SvgIcon,
    SpinnerDottedIcon,
    ExclamationIcon,
    MessageAlertWidget,
    CheckIcon,
  },
  layout: "landing",
  data() {
    return {
      user: {
        email: undefined,
        action: "forgot_password",
      },
      isLoading: false,
      alertMessage: {
        isSuccess: false,
        message: "",
      },
    };
  },
  mounted() {
    this.user.email = this.$store.getters.getSaveEmailExist;
  },
  created() {
    this.$auth.loggedIn ? this.logout() : null;
  },
  methods: {
    onSubmit() {
      event?.preventDefault();

      if (!this.user.email || this.isLoading) return;

      this.isLoading = true;
      this.alertMessage.message = "";

      this.$axios
        .post(`/users`, this.user)
        .then((response) => {
          this.alertMessage.isSuccess = true;
          this.alertMessage.message = response?.data?.message;
          // this.user.email = ''
          localStorage.removeItem("redirect_paperdaz_path");
          localStorage.removeItem("paperdaz_userID");
          localStorage.removeItem("main_user_paperdaz_token");
          localStorage.setItem("reset_user_mail", this.user.email);
          this.$auth.loggedIn ? this.logout() : null;
          this.$nuxt.$router.push("/");

          this.toggleToast({
            msg: "Check email to reset password",
            active: true,
          });
        })
        .catch(({ response }) => {
          this.alertMessage.isSuccess = false;
          this.alertMessage.message = response.data.message || "unable to reset password";
        })
        .finally(() => {
          this.isLoading = false;
        });

      // this.$nuxt.$router.push('/create-new-password')
    },
    // async onSubmit() {
    //   try {
    //     const token = await this.$recaptcha.execute('login')
    //     console.log('ReCaptcha token:', token)

    //     // send token to server alongside your form data
    //   } catch (error) {
    //     console.log('Login error:', error)
    //   }
    // },
  },
});
</script>

<style lang="postcss" scoped>
#remember-me-checkbox {
  &:not(:checked) + label {
    @apply bg-paperdazgray-400;

    & .overlay {
      @apply bg-paperdazgray-400 bg-opacity-20;
    }
  }

  &:checked + label {
    @apply bg-paperdazgreen-300;

    & .overlay {
      opacity: 1;
      @apply bg-paperdazgreen-300 bg-opacity-20;
    }
  }

  & + label {
    z-index: 2;

    & .overlay {
      z-index: -1;
      opacity: 0;
      @apply transition ease-in-out absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
    }

    &:hover .overlay {
      opacity: 1;
    }
  }
}
</style>
