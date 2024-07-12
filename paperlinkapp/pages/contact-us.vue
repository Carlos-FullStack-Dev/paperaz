<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-full mb-8">
    <div class="hidden lg:flex flex-col items-center px-6 mb-8 md:mb-0">
      <p class="text-center text-[#414142] font-[800] text-[20px] mb-12">
        We look forward to <br />
        hearing from you!
      </p>
      <p class="text-center text-[1rem] mb-16 text-[#8E8E8E] leading-6">
        We strive to make the best Paperlink <br />
        for everyone. Drop us a note with any <br />
        feedback, questions or concerns. <br />
        We’d love to hear from you. Initiate a <br />
        chat to talk to us 9am to 5pm PST.
      </p>

      <div class="card-left flex flex-col items-center justify-center">
        <p class="text-center text-[#414142] font-[800] text-[20px] mb-12">
          Chat with us
        </p>
        <p class="text-center text-[1rem] mb-16 text-[#8E8E8E] leading-6">
          Our team is ready to answer any <br />
          questions you may have.
        </p>
        <button @click="initiateChat" class="outline-btn">INITIATE CHAT</button>
      </div>
    </div>
    <div class="px-4">
      <div class="card-left py-8 h-full">
        <p class="text-[#414142] text-[15px] mb-2 mt-4">CONTACT</p>
        <p class="text-[0.9rem] text-[#8E8E8E] mb-2 leading-6">
          We will reply within 24 hours.
        </p>

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

          <div class="flex mt-4 justify-start md:justify-end">
            <button
              @click="onClear"
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
        <!-- <button class="outline-btn">
          INITIATE CHAT
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import mixins from "vue-typed-mixins";
import GlobalMixin from "~/mixins/GlobalMixin";

export default mixins(GlobalMixin).extend({
  name: "ContactUsPage",
  layout: "dashboard",
  auth: true,
  components: {
    SpinnerDottedIcon,
    MessageAlertWidget,
  },
  head() {
    return {
      script: [
        // ...
        {
          hid: "tawk.to",
          // src: "https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg",
          defer: true,
        },
      ],
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },
  data() {
    return {
      isLoading: false,
      errorMessage: "",
      messageSent: false,
      partner: {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        type: "customer",
      },
    };
  },

  methods: {
    mouseHover(id) {},

    async initiateChat() {
      try {
        // Tawk_API?.toggle();
      } catch (error) {
        //
      }
    },

    onClear() {
      this.partner.firstName = "";
      this.partner.lastName = "";
      this.partner.email = "";
      this.partner.message = "";
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
            msg: ` Thank you!  We look forward to partnering  with you. `,
          });
          this.errorMessage = "";
          this.partner.firstName = "";
          this.partner.lastName = "";
          this.partner.email = "";
          this.partner.message = "";
          this.messageSent = true;
        })
        .catch((err) => {
          console.log(err.response, "contact us ");
          this.errorMessage = "Unable to register, try again later ";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    try {
      let frame = document.querySelectorAll(".widget-visible");
      frame[0].style.display = "block";
    } catch (error) {
      //
    }
  },
  beforeDestroy() {
    try {
      let frame = document.querySelectorAll(".widget-visible");
      frame[0].style.cssText = "display: none !important";
    } catch (error) {
      //
    }
  },
});
</script>
<style lang="scss" scoped>
.card-left {
  @apply min-h-[100px] w-[100%] relative px-6 py-4 shadow-md md:shadow-lg;
  // box-shadow: 0px 8.66781px 15.6021px 8.66781px rgba(0, 0, 0, 0.25);

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
  @apply w-full bg-white h-[60px] rounded-[17px] px-3 py-3;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
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
