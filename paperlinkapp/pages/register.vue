<template>
  <section class="bg-paperdazgreen-300 reg-container pt-10">
    <div class="flex flex-wrap p-3 justify-around items-center container">
      <div class="w-full sm:w-6/12 md:w-5/12 sm:mr-1 lg:mr-0">
        <message-alert-widget
          :message="errorMessageUser"
          v-show="errorMessageUser"
          type="error"
          class="my-2 w-[80%] ml-[0%]"
        />
        <p class="md:text-[2rem] text-white">Account Information</p>
        <span class="text-[0.9rem] mb-10 text-white"
          >Enter the required information to continue</span
        >
        <div class="mt-8">
          <el-input
            :disabled="loading"
            class="text-input"
            placeholder="Business name"
            required
            v-model="business_name"
          />
          <el-input
            :disabled="loading"
            class="text-input"
            placeholder="Contact name"
            required
            v-model="contact_name"
          />
          <el-input
            :disabled="loading"
            class="text-input"
            placeholder="Email address"
            required
            v-model="business_email"
          />
          <el-input
            :disabled="loading"
            class="text-input"
            placeholder="Contact number"
            required
            v-model="business_number"
          />
        </div>
      </div>

      <div
        class="w-full sm:w-6/12 md:w-5/12 px-2 md:px-3 bg-white pb-3 rounded-[1.1rem] shadow-lg"
      >
        <div class="w-full p-3">
          <form class="">
            <div class="form-group group-label">
              <label>Total due</label>
              <label class="text-xl" for=""
                >$
                {{
                  packageInfo.isMonthly
                    ? packageInfo.monthlyPrice
                    : packageInfo.yearlyPrice
                }}
                <abbr class="text-xs">{{
                  packageInfo.isMonthly ? "monthly" : "yearly"
                }}</abbr>
              </label>
            </div>
            <div class="h-[1px] bg-gray-300"></div>
            <div class="h-4"></div>
            <div class="grid mb-6">
              <label class="font-[500] flex items-center justify-between" for="">
                Credit Card
                <div class="row flex items-center">
                  <img
                    class="w-[70px] mb-1 mr-[-15px]"
                    src="~/assets/icons/Mastercard.svg"
                  />
                  <img class="w-[70px] mb-1 mr-[-15px]" src="~/assets/icons/Visa.svg" />
                  <img class="w-[70px] mb-1 mr-[-15px]" src="~/assets/icons/Amex.svg" />
                  <img class="w-[70px] mb-1" src="~/assets/icons/Discover.svg" />
                </div>
              </label>
            </div>
            <message-alert-widget
              class="mb-7"
              :message="errorMessage"
              v-if="errorMessage"
              :type="'error'"
            />

            <div class="form-group mb-3">
              <label class="input-label" for="">Name of card holder</label>
              <el-input placeholder="Name Surname" required v-model="card_name" />
            </div>
            <div class="form-group mb-3">
              <label class="input-label" for="">Card Number</label>
              <el-input
                placeholder="0000-0000-0000-0000"
                :value="cardNumberWithDashes"
                @input="inputCardNumber"
                required
              />
            </div>
            <div class="grid gap-5 grid-cols-2">
              <div class="form-group">
                <label class="input-label" for="">Expiration Date</label>
                <el-input
                  :disabled="loading"
                  placeholder="MM/YY"
                  required
                  :value="expirationDateWithSlashes"
                  @input="inputExpirationDate"
                />
              </div>
              <div class="form-group">
                <label class="input-label" for="">CVC</label>
                <el-input
                  :disabled="loading"
                  placeholder="000"
                  required
                  v-model="cvv"
                  type="password"
                  maxlength="3"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="w-full flex justify-center mt-12">
        <button
          @click="submit"
          :class="[
            isLoading || !checkFilledInput
              ? 'opacity-60 cursor-not-allowed'
              : 'opacity-100',
          ]"
          :disabled="isLoading || !checkFilledInput"
          class="w-[50%] sm:w-[320px] py-2 bg-white rounded-[0.7rem] flex justify-center items-center"
        >
          <span class="mr-2">Next</span>

          <spinner-dotted-icon
            v-show="isLoading"
            height="20"
            width="20"
            class="animate-spin ml-1"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import { ErrorHandler } from "~/types/ErrorFunction";

export default Vue.extend({
  name: "RegisterPage",
  auth: false,
  layout: "landing",
  components: { SpinnerDottedIcon, MessageAlertWidget },
  data() {
    return {
      isLoading: false,
      errorMessage: "",
      cardNumberWithDashes: "",
      card_name: "",
      cvv: "",
      cardId: undefined,
      expirationDateWithSlashes: "",
      companyName: "",
      business_name: "",
      contact_name: "",
      business_email: "",
      business_number: "",
      errorMessageUser: "",
      cardId: null,
    };
  },
  created() {
    if (!this.$store.getters.getPackageInfo?.paperlink) {
      this.$router.push("/package?tablevel=1");
    }
  },
  computed: {
    checkFilledInput() {
      return (
        this.business_email.trim() &&
        this.contact_name &&
        this.business_number &&
        this.business_name &&
        this.cardNumber &&
        this.card_name &&
        this.cvv
      );
    },
    userPayload() {
      return {
        email: this.business_email.trim(),
        firstName: this.contact_name,
        lastName: "",
        phone: this.business_number,
        companyName: this.business_name,
      };
    },
    cardPayload() {
      return {
        card_holder_name: this.card_name,
        card_number: this.cardNumber,
        exp_month: this.expMonth,
        exp_year: this.expYear,
        cvv: this.cvv,
        userId: this.$auth.user?.id,
      };
    },
    subscriptionPayload() {
      let {
        companyLedger,
        name: packageName,
        paperlink,
        publicProfile,
        teamMembers,
        cc,
        isMonthly,
        isWhiteGlover: isWhiteGloveService,
        whiteGlove: whiteGloveService
      } = this.$store.getters.getPackageInfo;

      return {
        action: "subscribe",
        plan: isMonthly ? "monthly" : "yearly",
        companyLedger,
        packageName,
        paperlink,
        publicProfile,
        teamMembers,
        cc,
        isWhiteGloveService,
        whiteGloveService,
        userId: this.$auth.user?.id,
        fillablePdf: 0,
      };
    },
    packageInfo() {
      return this.$store?.getters?.getPackageInfo;
    },
    cardNumber() {
      return this.cardNumberWithDashes.replace(/-+/g, "");
    },
    expirationDateString() {
      return this.expirationDateWithSlashes.split("/").join("") || "";
    },
    expYear() {
      return this.expirationDateString.split("").splice(2, 4).join("");
    },
    expMonth() {
      return this.expirationDateString.split("").splice(0, 2).join("");
    },
  },
  methods: {
    setBusinessName(val) {
      console.log(val);
      this.business_name = val.replace(/\s/g, "");
    },
    async createUser() {
      this.isLoading = true;
      try {
        await this.$axios.post("/users", this.userPayload).then(async (response) => {
          this.$auth.setUser(response.data);
          await this.createCard();
        });
      } catch ({ response }) {
        console.log(response);
        this.isLoading = false;
        this.errorMessageUser = this.$_ErrorHandler(response);
      }
    },
    async testCard() {
      this.isLoading = true;
      try {
        let clonePayload = this.cardPayload;
        clonePayload.action = "testCard";
        delete clonePayload.userId;

        await this.$axios.post("/cards", clonePayload).then((res) => {
          this.createUser();
        });
      } catch ({ response }) {
        this.isLoading = false;
        this.errorMessage = this.$_ErrorHandler(response);
      }
    },
    async createCard() {
      await this.$axios
        .post("/cards", this.cardPayload)
        .then((res) => {
          this.cardId = res.data.id;
          this.createSubscription();
        })
        .catch((err) => console.log(err));
    },
    async deleteCard() {
      await this.$axios.delete(`/cards/${this.cardId}`);
    },
    async getUserByEmail() {
      this.$axios.get(`/users/?email=${this.business_email}`).then(async (res) => {
        if (res.data.data[0].isEmailVerified == 0) {
          await this.deleteCard();
          await this.deleteUser(res.data.data[0].id);
        }
      });
    },
    async deleteUser(val) {
      await this.$axios.delete(`/users/${val}`);
    },
    async createSubscription() {
      await this.$axios
        .post("/subscriptions", this.subscriptionPayload)
        .then((res) => {
          this.toggleToast({
            msg:
              "Thank you for going paperless! We have sent a receipt with instructions to verify your email!",
            active: true,
          });
          this.$nuxt.$router.push("/");
        })
        .catch(async (err) => {
          this.isLoading = false;
          this.errorMessage = err;
          await this.getUserByEmail();
        })
        .finally(() => (this.isLoading = false));
    },
    async submit() {
      await this.testCard();
    },
    inputCardNumber(val) {
      if (val.length > 19) return;
      let temp = val.replace(/(-+)|([^0-9]+)/g, "");
      this.cardNumberWithDashes = (temp.match(/.{1,4}/g) || []).join("-");
    },
    inputExpirationDate(val) {
      let temp = val.replace(/\/+|[^0-9]+/g, "");
      if (temp.length > 4) return;

      // Check if the month is greater than 12
      if (temp.length === 2) {
        if (Number(temp) > 12) temp = "0" + temp;
        if (Number(temp) == 0) temp = "01";
      }

      if (temp.length == 4 && Number(temp.substring(2, 4)) == 0) {
        temp = temp.substring(0, 2) + "01";
      }

      let finalVal = (temp.match(/.{1,2}/g) || []).join("/");
      this.expirationDateWithSlashes = finalVal;
    },
  },
  mounted() {
    console.log(">>>>>>>>", this.packageInfo, this.$store.getters.getPackageInfo);
  },
});
</script>
<style lang="scss" scoped>
.input-label {
  @apply text-xs px-1 my-2;
}
.group-label {
  @apply flex justify-between items-center py-2;
}
.dropdown {
  @apply absolute top-[100%] left-0 w-full bg-white;
  max-height: 150px;
  overflow-y: scroll;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: 1px 3px 5px rgba(203, 206, 206, 0.692);
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
.width-full {
  width: 100%;
  text-align: left;
}

.reg-container {
  margin-right: auto;
  margin-left: auto;
  @apply px-[3%] md:px-[7%] xl:px-[10%];

  // max-width: unset;
  // max-width: 1200px;
}
.text-input {
  @apply py-3 border-none outline-none rounded-[0.6rem] w-full;
}
</style>
