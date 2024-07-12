<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showModal"
    style=""
    :show-close="false"
    center
    class="relative shadow-lg"
  >
    <template #title>
      <div class="flex flex-col justify-end items-start">
        <p class="mb-1">CONTACT</p>
        <p class="text-[0.8rem] mb-3 text-[#8E8E8E]">We will reply in 24 hours.</p>
      </div>
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

        <message-alert-widget
          :message="errorMessage"
          v-show="errorMessage"
          type="error"
          class="my-2 w-[80%] ml-[0%]"
        />

        <div class="flex mt-4 justify-end">
          <button
            @click="closeModal()"
            class="outline-btn-sm text-[#F93120] border-[#F93120] mr-4"
          >
            Clear
          </button>
          <button
            :class="[isLoading ? 'opacity-60' : 'opacity-100']"
            :disabled="isLoading"
            class="outline-btn-sm text-white bg-[#77C360]"
          >
            <span v-if="!isLoading" class="mr-2">Send</span>
            <transition v-else name="fade" :duration="100">
              <span class="animate-spin">
                <SpinnerDottedIcon height="22" width="22" />
              </span>
            </transition>
          </button>
        </div>
      </form>
    </template>
    <!-- Start:: Body -->

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";

import CheckedFillIcon from "../svg-icons/CheckedFillIcon.vue";
import jwt, { decode, JsonWebTokenError } from "jsonwebtoken";
import login from "~/mixins/login";
import PasswordField from "~/components/widgets/PasswordField.vue";

export default Vue.extend({
  name: "ResetPasswordModal",
  components: { SpinnerDottedIcon, MessageAlertWidget, CheckedFillIcon, PasswordField },
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
  },
  mounted() {
    this.showModal = this.visible;
  },
  methods: {
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
          this.errorMessage = "Unable to register, try again later ";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    closeModal() {
      this.showModal = false;
    },
    closeModal() {
      this.$emit("updateVisibility", false);
    },
  },
});
</script>

<style lang="scss" scoped>
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
  @apply w-full bg-white h-[60px] border-[1px] border-black rounded-[7px] px-3 py-3;
}

.contac-input:focus {
  border-color: #e6af23 !important;
}

.outline-btn {
  @apply border-[1px] border-[#E6AF23] py-4 rounded-[50px] font-[800] w-full text-[#E6AF23];
}

.outline-btn-sm {
  @apply border-[1px] py-2 px-6 rounded-[10px];
}
</style>
