<template>
  <div class="">
    <div v-show="editingDetails" class="flex mb-4 mt-[-15px] lg:hidden justify-between">
      <button
        class="h-[40px] w-[40px] rounded-md grid place-content-center"
        @click="stopEditing"
      >
        <img src="~/assets/icons/x_red.svg" alt="" />
      </button>
      <button
        @click="onSubmit"
        class="h-[40px] w-[40px] rounded-md grid place-content-center bg-[#E9F8EA]"
      >
        <span class="inline-flex items-center gap-3">
          <img v-show="!loading" src="~/assets/icons/check.svg" alt="" />
          <transition name="fade" :duration="100">
            <span v-show="loading" class="animate-spin">
              <spinner-dotted-icon height="22" width="22" />
            </span>
          </transition>
        </span>
      </button>
    </div>

    <form
      @submit.prevent="onSubmit"
      ref="form"
      class="profile-info-form grid grid-cols-1 gap-5"
    >
      <message-alert-widget
        :message="errorMessage"
        v-show="errorMessage"
        type="error"
        class="my-2 w-[100%] ml-[0%]"
      />

      <div class="w-full">
        <div class="mx-2 w-full">
          <p class="mb-1" :class="[editingDetails ? 'text-black' : 'text-gray-300']">
            Business name
          </p>
          <!-- <el-input
            placeholder="Contact name"
            class="pr-4 mb-4"
            v-model="formData.firstName"
            type="text"
            :disabled="!editingDetails"
          /> -->
          <input
            class="custom-input mb-4"
            placeholder="Business name"
            :class="[editingDetails ? 'text-black' : 'text-gray-300']"
            v-model="formData.name"
            type="text"
            :disabled="!editingDetails"
          />
        </div>
        <div class="mx-2 w-full">
          <p class="mb-1" :class="[editingDetails ? 'text-black' : 'text-gray-300']">
            Contact name
          </p>
          <!-- <el-input
            placeholder="Contact name"
            class="pr-4 mb-4"
            v-model="formData.firstName"
            type="text"
            :disabled="!editingDetails"
          /> -->
          <input
            class="custom-input mb-4"
            placeholder="Contact name"
            :class="[editingDetails ? 'text-black' : 'text-gray-300']"
            v-model="formData.firstName"
            type="text"
            :disabled="!editingDetails"
          />
        </div>
        <div class="mx-2 w-full">
          <p class="mb-1" :class="[editingDetails ? 'text-black' : 'text-gray-300']">
            Email address
          </p>
          <input
            class="custom-input mb-4"
            placeholder="Email address"
            :class="[editingDetails ? 'text-black' : 'text-gray-300']"
            v-model="formData.email"
            type="text"
            :disabled="true"
          />
          <!-- <el-input
            placeholder="Email address"
            class="pr-4 mb-4"
            v-model="formData.email"
            type="text"
            :disabled="true"
          /> -->
        </div>
        <div class="mx-2 w-full">
          <p class="mb-1" :class="[editingDetails ? 'text-black' : 'text-gray-300']">
            Contact number
          </p>
          <input
            class="custom-input mb-4"
            placeholder="Contact number"
            :class="[editingDetails ? 'text-black' : 'text-gray-300']"
            v-model="formData.phone"
            type="phone"
            :disabled="!editingDetails"
          />
          <!-- <el-input
            v-model="formData.phone"
            class="pr-4 mb-4"
            placeholder="Contact number"
            :disabled="!editingDetails"
            type="phone"
          /> -->
        </div>
      </div>
      <transition name="fade">
        <div
          class="hidden lg:flex items-center justify-center mt-2"
          v-show="editingDetails"
        >
          <button
            :disabled="!editingDetails || loading"
            class="shadow h-10 px-5 text-white rounded-md bg-paperdazgreen-300 disabled:opacity-50"
          >
            <span class="inline-flex items-center gap-3">
              <span>Update</span>
              <transition name="fade" :duration="100">
                <span v-show="loading" class="animate-spin">
                  <spinner-dotted-icon height="22" width="22" />
                </span>
              </transition>
            </span>
          </button>
        </div>
      </transition>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import mixins from "vue-typed-mixins";
import InputField from "~/components/widgets/InputField.vue";
import AuthUser from "~/models/AuthUser";
import timezones from "~/assets/json/timezones";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import login from "~/mixins/login";
import { countryCode } from "~/assets/json/countryCode";
import { countryList } from "~/assets/json/coutry";
import MessageAlertWidget from "~/components/widgets/MessageAlertWidget.vue";
import { ErrorHandler } from "~/types/ErrorFunction";

export default mixins(login).extend({
  name: "CompanyForm",
  components: { InputField, SpinnerDottedIcon, MessageAlertWidget },
  data() {
    return {
      dropDownContent: [],
      setDropDown: false,
      country: "",
      state: "",
      errorMessage: "",
      formData: {
        name: this.$auth.user.companyName,
        email: this.$auth.user.email,
        state: "",
        firstName: this.$auth.user.firstName,
        country: "",
        phone: "",
        timezone: "",
      },
      countries: [],
      states: [],
      timezones,
      loading: false,
      errorMessage: "",
    };
  },
  props: {
    editingDetails: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    await this.fetchCountries();
    await this.fetchStates();

    this.formData.state = this.$auth.user ? this.$auth.user.state : "";
  },
  mounted() {},
  beforeMount() {
    for (const key of Object.keys(this.formData)) {
      if ((this.$auth?.user)[key]) this.formData[key] = this.$auth.user[key];
    }
    (this.country = this.$auth.user.country), (this.state = this.$auth.user.state);
  },
  methods: {
    stopEditing() {
      this.$emit("stop-editing");
    },
    inputPhone(val, title) {
      let valid = true;
      let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~a-zA-Z]/;
      if (format.test(val)) {
        this.errorMessage = `${title} format not correct`;
        valid = false;
      }
      return valid;
    },
    cancleOut(e) {
      if (e.target.tagname != "LI") {
        this.setDropDown = false;
      }
    },
    setCountryInfo(e) {
      this.country = e.target.textContent.trim().toLowerCase();
      this.setDropDown = false;

      //set the state AND TIMEZONE
      try {
        let countryData = countryList.filter((item) =>
          item.name.common.toLowerCase().startsWith(this.country)
        )[0];
        this.formData.timezone = countryData.timezones[0];
        this.state = countryData.capital[0];
      } catch (err) {
        this.state = "";
      }
    },
    displayCountry() {
      if (this.country.trim() != "") {
        this.setDropDown = true;

        this.dropDownContent = countryList
          .map((item) => item)
          .filter((item) => item.name.common.toLowerCase().startsWith(this.country))
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
      } else {
        this.setDropDown = false;
      }
    },
    onSubmit() {
      event?.preventDefault();

      // return

      let newFormData = {
        ...this.formData,
        companyName: this.formData.name,
        country: this.country,
      };

      if (this.loading) return;
      let userId = this.$auth.user?.id;
      this.loading = true;
      this.errorMessage = "";

      try {
        this.$axios.$patch(`/users/${userId}`, newFormData).then(async () => {
          this.filterUsers();
          this.$notify.success({
            title: "Data write",
            message: "Data updated successfully!",
          });

          this.loading = false;
          await this.$nextTick();
          this.$emit("stop-editing");
        });
      } catch ({ response }) {
        let message = ErrorHandler(response);
        this.errorMessage = message;
      }
    },
  },
  watch: {
    "$auth.user": function () {
      for (const key of Object.keys(this.formData)) {
        this.formData[key] = this.$auth.user ? this.$auth.user[key] : "";
      }
      this.formData.name = this.$auth.user.companyName;
    },
  },
  mounted: function () {},
});
</script>

<style lang="postcss" scoped>
.profile-info-form label {
  @apply block font-medium mb-0.5;
  color: #282533;
}

.dropdown {
  @apply absolute top-[100%] left-0 w-full bg-white p-2;
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

.dropdown > div > li {
  list-style-type: none;
  @apply py-2 px-1;
  transition: 0.2s;
}

.dd-image {
  transition: 0.2s;
}

.dropdown > div:hover .dd-image {
  width: 20px;
  height: 20px;
  border-radius: 50px;
}

.dropdown > div > li:hover {
  padding-left: 10px;
}

.custom-input {
  @apply w-full px-4 text-[0.9rem] outline-none rounded-lg h-[40px] border-[1px] border-paperdazgray-200 mr-2 focus:border-paperdazgray-600;
}

.width-full {
  width: 100%;
  text-align: left;
}
</style>
