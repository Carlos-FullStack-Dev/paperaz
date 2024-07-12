<template>
  <el-dialog
    :close-on-click-modal="true"
    :visible.sync="showModal"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <div class="border-[2px] border-[#DCDCDC] min-h-[200px] m-3 p-2">
      <div class="flex flex-col items-center lg:flex-row justify-center mb-4">
        <logo-with-text class="h-[50px] lg:h-[100px] w-auto" />

        <p
          class="text-[#77C360] ml-[13px] md:ml-[-20px] mb-[1.1rem] font-[600] text-[1.4rem]"
        >
          Services Menu
        </p>
      </div>

      <div class="flex justify-around mb-6">
        <div class="border-b-[2px] border-[#FF7900]">
          <p class="text-[0.5rem] md:text-[0.7rem] lg:text-[0.9rem]">
            Mandatory with account
          </p>
        </div>
        <div class="border-b-[2px] border-[#19BAD7]">
          <p class="text-[0.5rem] md:text-[0.7rem] lg:text-[0.9rem]">Optional Features</p>
        </div>
      </div>

      <div
        class="grid grid-cols-2 mb-7 gap-y-2 gap-x-[2rem] md:gap-x-[3rem] lg:gap-x-[4rem]"
      >
        <div
          class="w-full flex justify-center md:justify-end col-span-2 sm:col-span-1 items-center"
        >
          <div class="card-item">
            <div class="flex justify-between items-end h-[40px]">
              <div class="flex items-center h-full">
                <p class="font-[600] text-[1rem]">Business Page</p>
              </div>
              <p class="text-[2rem] !mb-[-11px] flex items-end text-[#FF7900] font-bold">
                1
              </p>
            </div>
            <div class="border-y-[1px] min-h-[40px] py-2 pr-5 border-[#DADADA]">
              <p class="text-[0.6rem]">
                PaperLink Business Page is included with every account, and displays all
                PaperLink files.
              </p>
            </div>

            <div class="flex justify-between pr-5 items-center">
              <div class="flex items-end py-2">
                <img
                  class="h-[30px] mr-2"
                  src="~/assets/icons/menu_business.svg"
                  alt=""
                />
                <p class="text-[#FF7900] text-[0.6rem]">Monthly charge</p>
              </div>
              <p class="font-[700] text-[1.4rem]">$10</p>
            </div>
          </div>
        </div>
        <div
          class="w-full flex justify-center md:justify-start col-span-2 sm:col-span-1 items-center"
        >
          <div class="card-item">
            <div class="flex justify-between items-end h-[40px]">
              <div class="flex items-center h-full">
                <p class="font-[600] text-[1rem]">Team Member</p>
              </div>
              <p class="text-[2rem] !mb-[-11px] flex items-end text-[#FF7900] font-bold">
                2
              </p>
            </div>
            <div class="border-y-[1px] min-h-[40px] py-2 pr-5 border-[#DADADA]">
              <p class="text-[0.6rem]">Each member can manage files on PaperLink.</p>
            </div>

            <div class="flex justify-between pr-5 items-center">
              <div class="flex items-end py-2">
                <img
                  class="h-[30px] mr-2"
                  src="~/assets/icons/menu_business.svg"
                  alt=""
                />
                <p class="text-[#FF7900] text-[0.6rem]">Monthly charge</p>
              </div>
              <div class="flex items-center">
                <p class="font-[700] !p-0 text-[1.4rem]">$2</p>
                <sup class="text-[0.4rem]">/User</sup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-2 mb-7 gap-y-2 gap-x-[2rem] md:gap-x-[3rem] lg:gap-x-[4rem]"
      >
        <div
          class="w-full flex justify-center md:justify-end col-span-2 sm:col-span-1 items-center"
        >
          <div class="card-item">
            <div class="flex justify-between items-end h-[40px]">
              <div class="flex items-center h-full">
                <p class="font-[600] text-[1rem]">Paperlink</p>
              </div>
              <p class="text-[2rem] !mb-[-11px] flex items-end text-[#FF7900] font-bold">
                3
              </p>
            </div>
            <div class="border-y-[1px] min-h-[40px] py-2 pr-5 border-[#DADADA]">
              <p class="text-[0.6rem]">
                Turn your PDF forms into a Paperlink for users to  complete anytime,
                anywhere on a mobile device.
              </p>
            </div>

            <div class="flex justify-between pr-5 items-center">
              <div class="flex items-end py-2">
                <img
                  class="h-[30px] mr-2"
                  src="~/assets/icons/menu_business.svg"
                  alt=""
                />
                <p class="text-[#FF7900] text-[0.6rem]">Monthly charge</p>
              </div>
              <div class="flex items-center">
                <p class="font-[700] !p-0 text-[1.4rem]">$2</p>
                <sub class="text-[0.4rem]">/Pages</sub>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full flex justify-center md:justify-start col-span-2 sm:col-span-1 items-center"
        >
          <div class="card-item-blue">
            <div class="flex justify-between items-end h-[40px]">
              <div class="flex items-center h-full">
                <p class="font-[600] text-[1rem]">Fillable PDF</p>
              </div>
              <p class="text-[2rem] !mb-[-11px] flex items-end text-[#19BAD7] font-bold">
                4
              </p>
            </div>
            <div class="border-y-[1px] min-h-[40px] py-2 pr-5 border-[#DADADA]">
              <p class="text-[0.6rem]">
                We turn regular PDFs into Fillable PDFs so clients can navigate each line
                with ease.
              </p>
            </div>

            <div class="flex justify-between pr-5 items-center">
              <div class="flex items-end py-2">
                <img
                  class="h-[30px] mr-2"
                  src="~/assets/icons/menu_business.svg"
                  alt=""
                />
                <p class="text-[#19BAD7] text-[0.6rem]">One Time Charge</p>
              </div>
              <div class="flex items-center">
                <p class="font-[700] !p-0 text-[1.4rem]">$5</p>
                <sub class="text-[0.4rem]">/Page</sub>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 mb-7 gap-y-2 gap-x-2">
        <div class="w-full flex justify-center col-span-1 items-center">
          <div class="card-item-blue">
            <div class="flex justify-between items-end h-[40px]">
              <div class="flex items-center h-full">
                <p class="font-[600] text-[1rem]">White Glove Service</p>
              </div>
              <p class="text-[2rem] !mb-[-11px] flex items-end text-[#19BAD7] font-bold">
                5
              </p>
            </div>
            <div class="border-y-[1px] min-h-[40px] py-2 pr-5 border-[#DADADA]">
              <p class="text-[0.6rem]">
                We turn regular PDFs into Fillable PDFs so clients can navigate each line
                with ease.
              </p>
            </div>

            <div class="flex justify-between pr-5 items-center">
              <div class="flex items-end py-2">
                <img
                  class="h-[30px] mr-2"
                  src="~/assets/icons/menu_business.svg"
                  alt=""
                />
                <p class="text-[#19BAD7] text-[0.6rem]">One Time Charge</p>
              </div>
              <div class="flex items-center">
                <p class="font-[700] !p-0 text-[1.4rem]">$1</p>
                <sub class="text-[0.4rem]">/Page</sub>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Start:: Body -->

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
import LogoWithText from "~/components/LogoWithText.vue";

export default Vue.extend({
  name: "ResetPasswordModal",
  mixins: [login],
  components: { SpinnerDottedIcon, LogoWithText, CheckedFillIcon, PasswordField },
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
        isEmailVerified: true,
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
  @apply bg-white w-[90%] md:w-[70%]  lg:w-[60%];
  position: relative !important;
  overflow: hidden;
}

* >>> .el-dialog__header {
  background-color: red;
  display: none;
}

* >>> .el-dialog__header,
* >>> .el-dialog__footer {
  text-align: left !important;
}

* >>> .el-dialog__body {
  padding: 0px !important;
  background-color: #fff;

  /* background: #fcfcfd; */
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

.tab {
  @apply border-b-[2px];
}

.card-item {
  @apply relative px-4 py-2 border-[1px] border-[#FF7900]  rounded-lg min-h-[120px] w-[250px];
}
.card-item::after {
  @apply absolute  bg-[#FF7900] w-[5px] left-[-3px] top-[50%] translate-y-[-50%] rounded-md h-[40px];
  content: "";
}
.card-item-blue {
  @apply relative px-4 py-2 border-[1px] border-[#19BAD7]  rounded-lg min-h-[120px] w-[250px];
}
.card-item-blue::after {
  @apply absolute  bg-[#19BAD7] w-[5px] left-[-3px] top-[50%] translate-y-[-50%] rounded-md h-[40px];
  content: "";
}
</style>
