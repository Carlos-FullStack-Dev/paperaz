<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <template #title>
      <div class="flex justify-end">
        <button @click="closeModal()" class="">
          <img src="../../assets/icons/x.svg" alt="" />
        </button>
      </div>
      <span class="text-center text-xl block w-full">Create Password</span>
    </template>
    <!-- Start:: Body -->
    <div class="justify-center input-fill pb-2">
      <el-input placeholder="user email" disabled class="w-full" v-model="email" />
      <!-- <el-input placeholder="Create password" type="password" class="w-full rounded-[100px] mt-3" v-model="password" />
      <el-input placeholder="Retype password" class="w-full mt-3 mb-3" type="password" v-model="confirm_pasword" /> -->
      <password-field v-model="password" placeholder="Create password" />
      <password-field v-model="confirm_pasword" placeholder="Retype password" />

      <div class="">
        <div class="error-wrapper">
          <div
            :class="[alphabet.test(this.password) ? 'bg-[green]' : 'bg-[#808080b8]']"
            class="error-indicator"
          ></div>
          <span
            class="text-[11px]"
            :class="[alphabet.test(this.password) ? 'text-[green]' : 'text-[#808080b8]']"
          >
            Password must contain upper</span
          >
        </div>
        <div class="error-wrapper">
          <div
            :class="[number.test(this.password) ? 'bg-[green]' : 'bg-[#808080b8]']"
            class="error-indicator"
          ></div>
          <span
            class="text-[11px]"
            :class="[number.test(this.password) ? 'text-[green]' : 'text-[#808080b8]']"
          >
            Password must contain number</span
          >
        </div>
        <div class="error-wrapper">
          <div
            :class="[charac.test(this.password) ? 'bg-[green]' : 'bg-[#808080b8]']"
            class="error-indicator"
          ></div>
          <span
            class="text-[11px]"
            :class="[charac.test(this.password) ? 'text-[green]' : 'text-[#808080b8]']"
          >
            Password must contain symbol</span
          >
        </div>
        <div class="error-wrapper">
          <div
            :class="[this.password?.length > 8 ? 'bg-[green]' : 'bg-[#808080b8]']"
            class="error-indicator"
          ></div>
          <span
            class="text-[11px] p"
            :class="[this.password?.length > 8 ? 'text-[green]' : 'text-[#808080b8]']"
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

      <div class="w-full flex justify-center mt-5">
        <button
          :disabled="!getIsFormValid || loading"
          :class="[getIsFormValid || !loading ? 'opacity-100' : 'opacity-40']"
          @click="submit"
          class="w-[80%] bg-paperdazgreen-300 text-white py-2 rounded flex items-center justify-center cursor-pointer"
        >
          Continue
          <SpinnerDottedIcon
            v-show="loading"
            class="animate-spin ml-1"
            width="20"
            height="20"
          />
        </button>
      </div>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import CheckedFillIcon from "../svg-icons/CheckedFillIcon.vue";
import jwt, { decode, JsonWebTokenError } from "jsonwebtoken";
import login from "~/mixins/login";
import PasswordField from "~/components/widgets/PasswordField.vue";

export default Vue.extend({
  name: "ResetPasswordModal",
  mixins: [login],
  components: { SpinnerDottedIcon, CheckedFillIcon, PasswordField },
  model: {
    prop: "visible",
    event: "updateVisibility",
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userInfo: { type: Object },
  },
  computed: {
    userPayload() {
      return {
        token: jwt.sign(
          { data: this.userInfo.data?.user_id },
          process.env.NUXT_ENV_BACKEND_JWT_TOKEN
        ),
        action: "reset_password",
        newPassword: this.password,
      };
    },
    isPasswordEqual() {
      if (this.password?.trim()?.length === 0) return false;
      return this.password == this.confirm_pasword;
    },
    getIsFormValid() {
      let isFormValid;
      if (
        this.charac.test(this.password) &&
        this.number.test(this.password) &&
        this.alphabet.test(this.password) &&
        this.password?.length > 8 &&
        this.password === this.confirm_pasword
      ) {
        isFormValid = true;
      } else {
        isFormValid = false;
      }
      return isFormValid;
    },
  },
  data() {
    return {
      password: "",
      email: "",
      confirm_pasword: "",
      showModal: false,
      errorMessage: "",
      loading: false,
      newSaveData: {},
      charac: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      number: /[0-9]/,
      alphabet: /[A-Za-z]/,
      sendAction: null,
    };
  },
  watch: {
    visible(val) {
      this.showModal = val;
    },
    showModal(val) {
      this.$emit("updateVisibility", val);
    },
    userInfo(val) {
      this.email = this.userInfo.data?.email;
    },
  },
  mounted() {
    this.showModal = this.visible;
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    closeModal() {
      this.$emit("updateVisibility", false);
    },
    async submit() {
      if (!this.getIsFormValid) return;

      this.loading = true;
      await this.$axios
        .patch(`/users/${this.userInfo.data?.user_id}`, this.userPayload)
        .then((res) => {
          this.$router.push(`/${this.userInfo.data?.businessPage}`);
        })
        .catch((err) => {
          this.$notify.error({
            title: "Error",
            message: "Something went wrong",
          });
          this.loading = false;
          console.log(err, "error messages");
        });
    },
  },
});
</script>

<style ang="scss" scoped>
* >>> .el-dialog {
  width: 416px !important;
  max-width: 95% !important;
  border-radius: 20px !important;
  border-radius: 8px !important;
  position: relative !important;
  overflow: hidden;
}

* >>> .el-dialog__header {
  padding-bottom: 20px;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  /* padding-top: 0 !important;
      padding-bottom: 0 !important; */
  background: #fcfcfd;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.error-wrapper {
  @apply my-2 flex flex-row items-center;
}

.error-indicator {
  @apply mr-2 w-[10px] overflow-hidden h-[10px] rounded-[100%] p-[2px];
}

.input-field {
  @apply mt-4;
  border-radius: 4px !important;
}
</style>
