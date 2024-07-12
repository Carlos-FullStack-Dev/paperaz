<template>
  <section class="bg-gradient-to-t from-white to-transparent">
    <div class="container py-20">
      <!-- show if verified -->
      <div class="reset-pass-section">
        <div class="container">
          <div class="row">
            <form @submit.prevent="resetPassword" class="col-lg-6 md:order-2 order-1">
              <div class="left-form">
                <div class="form form-outer shadow-2xl">
                  <div class="heading">
                    <h1>Welcome Back!</h1>
                    <h3 class="capitalize">{{ username }}</h3>
                  </div>
                  <h6>Create a password</h6>
                  <div class="form-group">
                    <label for="">Password</label>
                    <!-- <input class="form-control" v-model="user.password" type="password"
                      :disabled="isLoading || isRedirecting" required placeholder="Password" /> -->
                    <password-field
                      v-model="user.password"
                      :disabled="isLoading || isRedirecting"
                      placeholder="Password"
                    />
                  </div>
                  <div class="form-group">
                    <label for="">Retype password</label>
                    <password-field
                      v-model="user.passwordConfirmation"
                      :disabled="isLoading || isRedirecting"
                      placeholder="Confirm Password"
                    />
                  </div>

                  <div class="">
                    <div class="error-wrapper">
                      <div
                        :class="[
                          alphabet.test(this.user.password)
                            ? 'bg-[green]'
                            : 'bg-[#808080b8]',
                        ]"
                        class="error-indicator"
                      ></div>
                      <span
                        class="text-[11px]"
                        :class="[
                          alphabet.test(this.user.password)
                            ? 'text-[green]'
                            : 'text-[#808080b8]',
                        ]"
                      >
                        Password must contain upper</span
                      >
                    </div>
                    <div class="error-wrapper">
                      <div
                        :class="[
                          number.test(this.user.password)
                            ? 'bg-[green]'
                            : 'bg-[#808080b8]',
                        ]"
                        class="error-indicator"
                      ></div>
                      <span
                        class="text-[11px]"
                        :class="[
                          number.test(this.user.password)
                            ? 'text-[green]'
                            : 'text-[#808080b8]',
                        ]"
                      >
                        Password must contain number</span
                      >
                    </div>
                    <div class="error-wrapper">
                      <div
                        :class="[
                          charac.test(this.user.password)
                            ? 'bg-[green]'
                            : 'bg-[#808080b8]',
                        ]"
                        class="error-indicator"
                      ></div>
                      <span
                        class="text-[11px]"
                        :class="[
                          charac.test(this.user.password)
                            ? 'text-[green]'
                            : 'text-[#808080b8]',
                        ]"
                      >
                        Password must contain symbol</span
                      >
                    </div>
                    <div class="error-wrapper">
                      <div
                        :class="[
                          this.user.password?.length > 8
                            ? 'bg-[green]'
                            : 'bg-[#808080b8]',
                        ]"
                        class="error-indicator"
                      ></div>
                      <span
                        class="text-[11px]"
                        :class="[
                          this.user.password?.length > 8
                            ? 'text-[green]'
                            : 'text-[#808080b8]',
                        ]"
                      >
                        Password must be more than 8 characters</span
                      >
                    </div>
                    <div class="error-wrapper">
                      <div
                        :class="[isPasswordEqual ? 'bg-[green]' : 'bg-[#808080b8]']"
                        class="error-indicator"
                      ></div>
                      <span
                        class="text-[11px]"
                        :class="[isPasswordEqual ? 'text-[green]' : 'text-[#808080b8]']"
                      >
                        Password match</span
                      >
                    </div>
                  </div>
                  <button
                    class="register-btn h-10 w-full mt-6 text-white rounded-lg shadow px-5 text-sm disabled:bg-opacity-70"
                    :class="[
                      getIsFormValid || !isLoading ? 'opacity-100 ' : 'opacity-40  ',
                    ]"
                    :disabled="!getIsFormValid || isLoading"
                  >
                    <span class="inline-flex items-center gap-3">
                      <span v-show="!isLoading">Change Password</span>
                      <transition name="fade" :duration="100">
                        <span v-show="isLoading" class="animate-spin">
                          <spinner-dotted-icon height="22" width="22" color="white" />
                        </span>
                      </transition>
                    </span>
                  </button>
                </div>
              </div>
            </form>
            <div class="col-lg-6 md:order-1 order-2">
              <div class="flex flex-col w-full h-full items-center mt-[30px]">
                <img src="../static/card2.png" class="w-[300px]" alt="" />
                <div class="flex">
                  <div class="text-2xl text-[#8E8989] font-bold px-3 text-center">
                    Thank you for <br />being <br />Responsible!!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import TimesIcon from "~/components/svg-icons/TimesIcon.vue";
import InputField from "~/components/widgets/InputField.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import PasswordField from "~/components/widgets/PasswordFieldTwo.vue";

export default Vue.extend({
  name: "CreateNewPasswordPage",
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
    TimesIcon,
  },
  layout: "landing",
  data() {
    return {
      decodedUserInfo: {},
      user: {
        password: "",
        passwordConfirmation: "",
        action: "reset_password",
        token: this.$route.query.token,
      },
      isRedirecting: false,
      isLoading: false,
      errorMessage: "",
      charac: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      number: /[0-9]/,
      alphabet: /[A-Za-z]/,
    };
  },
  beforeMount() {
    if (!this.$route.query.token) {
      this.$nuxt.$router.push("/login");
    }
  },
  computed: {
    isPasswordEqual() {
      if (this.user.password?.trim()?.length === 0) return false;
      return this.user.password == this.user.passwordConfirmation;
    },

    getIsFormValid() {
      let isFormValid;
      if (
        this.charac.test(this.user.password) &&
        this.number.test(this.user.password) &&
        this.alphabet.test(this.user.password) &&
        this.user.password?.length > 8 &&
        this.user.password === this.user.passwordConfirmation
      ) {
        isFormValid = true;
      } else {
        isFormValid = false;
      }
      return isFormValid;
    },
    username() {
      let userInfo = this.decodedUserInfo;
      return localStorage.reset_user_mail;
      // return (userInfo.firstName + ' ' + userInfo.lastName) || ""
    },
    containsCapital() {
      return /[A-Z]+/g.test(this.user.password || "");
    },
    containsSmall() {
      return /[a-z]+/g.test(this.user.password || "");
    },
    containsSpecialCharacter() {
      return /[^a-zA-Z0-9]+/g.test(this.user.password || "");
    },
  },
  methods: {
    resetPassword() {
      event?.preventDefault();

      if (!this.getIsFormValid) return;

      this.isLoading = true;

      if (this.user.passwordConfirmation !== this.user.password) {
        this.errorMessage = "Password does not match";
        return;
      }
      let cloneUserData = this.user;
      cloneUserData.newPassword = cloneUserData.password;

      delete cloneUserData.password;
      delete cloneUserData.passwordConfirmation;

      // return
      this.$axios
        .$patch("/users", {
          ...cloneUserData,
        })

        .then((response) => {
          let url = this.username ? `/login?email=${this.username}` : "/login";
          this.$nuxt.$router.push(url);
        })
        .catch(({ response }) => {
          this.errorMessage = "Could not reset password";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
</script>
<style lang="scss" scoped>
.dropdown {
  @apply absolute top-[100%] left-0 w-full bg-white;
  max-height: 150px;
  overflow-y: scroll;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: 1px 3px 5px rgba(203, 206, 206, 0.692);
}

.form-outer {
  background-color: white !important;
}

.register-btn {
  background-color: #77b550 !important;
}

.dropdown::-webkit-scrollbar {
  width: 5px;
  height: 3px;
  cursor: pointer;
}

.dropdown::-webkit-scrollbar-thumb {
  @apply bg-paperdazgreen-400;
  width: 5px;
  border-radius: 50px;
  cursor: pointer;
}

.dropdown::-webkit-scrollbar-track {
  cursor: pointer;
  @apply border-[1px] border-transparent;
}

.dropdown > li {
  list-style-type: none;
  @apply py-2 px-1;
}

.custom-input {
  @apply w-12 text-center outline-none rounded-lg border-[1px] border-paperdazgray-200 mr-2;
}

.error-wrapper {
  @apply my-2 flex flex-row items-center;
}

.error-indicator {
  @apply mr-2 w-[10px] overflow-hidden h-[10px] rounded-[100%] p-[2px];
}

.width-full {
  width: 100%;
  text-align: left;
}
</style>
