<template>
  <el-dialog
    :visible.sync="showModal"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
  >
    <template #title>
      <div class="w-full">
        <div
          class="bg-[#77B550] lg:border-t-4 lg:border-[#E6AF23] lg:bg-transparent mb-4 lg:!mb-0 flex relative justify-center lg:justify-start items-center h-[60px] w-full"
        >
          <button
            @click="closeModal()"
            class="absolute top-[50%] right-4 translate-y-[-50%]"
          >
            <img src="../../assets/icons/x_white.svg" alt="" />
          </button>
          <p class="text-white lg:hidden text-[1.2rem]">Contact Us</p>
          <p class="text-[1.2rem] px-4 hidden lg:block">CONTACT</p>
        </div>
        <p class="text-[1rem] text-center lg:!text-left px-4 mb-3 text-[#8E8E8E]">
          We will reply in 24 hours.
        </p>
      </div>
    </template>
    <!-- Start:: Body -->
    <div class="justify-center input-fill pb-2">
      <form ref="form" @submit.prevent="onSubmit">
        <message-alert-widget
          :message="'Message sent '"
          v-show="messageSent"
          type="success"
          class="mb-8"
        />
        <input
          required
          v-model="partner.firstName"
          type="text"
          placeholder="First Name"
          class="contac-input mb-8"
        />
        <input
          required
          v-model="partner.lastName"
          type="text"
          placeholder="Last Name"
          class="contac-input mb-8"
        />

        <input
          required
          v-model="partner.email"
          type="text"
          placeholder="Email"
          class="contac-input mb-8"
        />
        <textarea
          required
          v-model="partner.message"
          type="text"
          placeholder="Message"
          class="contac-input min-h-[100px]"
        />

        <div class="flex mt-4 justify-center md:justify-end">
          <button
            @click="closeModal()"
            class="outline-btn-sm flex-1 md:flex-none text-[#F93120] border-[#F93120] mr-4"
          >
            CANCEL
          </button>
          <button
            :class="[isLoading ? 'opacity-60' : 'opacity-100']"
            :disabled="isLoading"
            class="outline-btn-sm flex-1 md:flex-none justify-center flex text-white bg-[#77C360]"
          >
            <span v-if="!isLoading" class="mr-2">SEND</span>
            <transition v-else name="fade" :duration="100">
              <span class="animate-spin">
                <SpinnerDottedIcon height="18" width="22" />
              </span>
            </transition>
          </button>
        </div>
      </form>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import CheckedFillIcon from "../svg-icons/CheckedFillIcon.vue";

export default Vue.extend({
  name: "ResetPasswordModal",
  components: { SpinnerDottedIcon, CheckedFillIcon },
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
  computed: {},
  data() {
    return {
      showModal: false,
      isLoading: false,
      errorMessage: "",
      partner: {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        type: "customer",
      },
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
    clearData() {
      this.errorMessage = "";
      this.partner.firstName = "";
      this.partner.lastName = "";
      this.partner.email = "";
      this.partner.message = "";
    },
    closeModal() {
      this.showModal = false;
    },
    closeModal() {
      this.$emit("updateVisibility", false);
    },
    async onSubmit() {
      //  <-- validating user name -->
      let inValidName = false;
      var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (
        format.test(this.partner.firstName.trim()) ||
        format.test(this.partner.lastName.trim())
      ) {
        this.$refs.form.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        this.errorMessage = "Name format not correct";
        inValidName = true;
      }

      if (inValidName) return;

      if (this.isLoading) return;

      this.isLoading = true;

      let data = {
        action: "contactUs",
        firstName: this.partner.firstName,
        lastName: this.partner.lastName,
        email: this.partner.email,
        message: this.partner.message,
        userId: 0,
      };

      await this.$axios
        .post("/request", data)
        .then(() => {
          this.toggleToast({
            active: true,
            msg: `Thank you for contacting us.  We will reach out to you within 24 hours.`,
          });

          this.errorMessage = "";
          this.partner.firstName = "";
          this.partner.lastName = "";
          this.partner.email = "";
          this.partner.message = "";
          this.closeModal();
          // this.messageSent = true;
        })
        .catch((err) => {
          this.$notify.error({
            title: "Error",
            message: "Something went wrong",
          });
          this;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
</script>

<style ang="scss" scoped>
* >>> .el-dialog {
  @apply w-[95%] lg:w-[50%] !rounded-[1.5rem] lg:!rounded-[0rem];
  /* border-radius: 20px !important;
  border-radius: 8px !important; */
  position: relative !important;
  overflow: hidden;
}

* >>> .el-dialog__header {
  padding: 0px !important;
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
.card-left {
  @apply min-h-[100px] w-[100%] relative px-6 py-4;
  box-shadow: 0px 8.66781px 15.6021px 8.66781px rgba(0, 0, 0, 0.25);

  &::after {
    content: "";
    position: absolute;
    height: 8px;
    width: 100%;
    top: 0;
    left: 0;
    background: #e6af23;
  }
}

.contac-input {
  @apply w-full bg-white h-[60px] border-[1px] border-[#E5E5E5] rounded-[7px] px-3 py-3 outline-none focus:!border-[#0000005e];
}

.outline-btn {
  @apply border-[1px] border-[#E6AF23] py-4 rounded-[50px] font-[800] w-full text-[#E6AF23];
}

.outline-btn-sm {
  @apply border-[1px] py-2 px-6 rounded-[10px];
}
</style>
