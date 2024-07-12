<template>
  <div>
    <div class="flex lg:hidden justify-center items-center my-4">
      <p class="text-[1rem]">Pay annually and get a 20% discount</p>
      <button
        @click="showModalComponent"
        class="w-[50px] h-[50px] ml-4 mt-[-10px] cursor-pointer"
      >
        <img
          width="30px"
          height="30px"
          src="~/assets/icons/menu-banner-icon.svg"
          alt=""
        />
      </button>
    </div>
    <div
      class="grid lg:px-[6%] min-h-full lg:grid-cols-[1fr,max-content] mb-12 lg:gap-10"
    >
      <div
        class="lg:border-2 px-[6%] lg:px-[0%] border-paperdazgreen-400 w-full rounded-2xl overflow-hidden relative bg-white text-[#505050]"
      >
        <div class="overflow-x-auto custom-scrollbar">
          <table class="custom-table lg:px-4">
            <thead>
              <tr class="text-lg">
                <th class="text-left w-3/12 flex">
                  <span
                    class="inline-block text-[0.8rem] lg:text-[0.9rem] lg:border-b-2 border-paperdazgreen-400 font-[500]"
                    >Feature</span
                  >

                  <div class="relative hidden lg:block h-full w-full">
                    <button
                      @click="showModalComponent"
                      class="absolute w-[50px] h-[50px] top-[-10px] cursor-pointer left-[20px]"
                    >
                      <img
                        width="30px"
                        height="30px"
                        src="~/assets/icons/menu-banner-icon.svg"
                        alt=""
                      />
                    </button>
                  </div>
                </th>
                <th class="w-3/12">
                  <div class="flex justify-center">
                    <span
                      class="text-[0.8rem] lg:text-[1rem] inline-block font-[500] lg:border-b-2 border-paperdazgreen-400"
                      >Price/unit</span
                    >
                  </div>
                </th>
                <th class="w-3/12">
                  <div class="flex justify-center">
                    <span
                      class="hidden lg:inline-block text-[0.8rem] lg:text-[0.9rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                      >Quantity</span
                    >
                    <span
                      class="inline-block lg:hidden text-[0.8rem] lg:text-[0.9rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                      >Qty.</span
                    >
                  </div>
                </th>
                <th class="w-3/12">
                  <div class="flex w-full justify-end">
                    <span
                      class="inline-block text-[0.8rem] lg:text-[0.9rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                      >Amount</span
                    >
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr class="h-[100px]">
                <td class="w-3/12 text-[0.8rem] sm:text-[0.9rem]">
                  Business Page
                </td>
                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <label
                      for="public-profile-checkbox"
                      class="inline-grid place-items-center h-7 w-7 rounded border border-gray-300 p-1 cursor-pointer"
                    >
                      <transition name="fade" :duration="100">
                        <check-icon
                          height="12"
                          width="16"
                          v-show="customPackage.publicProfile"
                        />
                      </transition>
                    </label>
                  </div>
                </td>
                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <input
                      type="checkbox"
                      hidden
                      id="public-profile-checkbox"
                      :disabled="true"
                      v-model="customPackage.publicProfile"
                    />
                    <label
                      for="public-profile-checkbox"
                      class="inline-grid place-items-center h-7 w-7 rounded border border-gray-300 p-1 cursor-pointer"
                    >
                      <transition name="fade" :duration="100">
                        <check-icon
                          height="12"
                          width="16"
                          v-show="customPackage.publicProfile"
                        />
                      </transition>
                    </label>
                  </div>
                </td>
                <td class="text-end w-3/12">
                  {{
                    formatPrice(
                      !customPackage.publicProfile
                        ? 0
                        : Number(settings.custom_public_profile_price)
                    )
                  }}
                </td>
              </tr>

              <tr>
                <td class="w-3/12 text-[0.8rem] sm:text-[0.9rem]">
                  Team Member
                </td>
                <td class="text-center text-[0.8rem] sm:text-[0.9rem] w-3/12">
                  {{ formatPrice(settings.custom_team_members_price) }}
                </td>
                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <add-input
                      :onchange="(e) => (customPackage.teamMembers = e)"
                    />
                  </div>
                </td>
                <td class="text-end w-3/12">
                  {{
                    formatPrice(
                      Number(settings.custom_team_members_price) *
                        Number(customPackage.teamMembers)
                    )
                  }}
                </td>
              </tr>

              <tr>
                <td class="w-3/12 text-[0.8rem] sm:text-[0.9rem]">
                  Paperlink Page
                </td>
                <td class="text-center text-[0.8rem] sm:text-[0.9rem] w-3/12">
                  {{ formatPrice(settings.custom_paperlink_price) }}
                </td>
                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <add-input
                      :onchange="(e) => (customPackage.paperlink = e)"
                    />
                  </div>
                </td>
                <td class="text-end w-3/12">
                  {{
                    formatPrice(
                      Number(settings.custom_paperlink_price) *
                        Number(customPackage.paperlink)
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td
                  class="w-3/12 text-[0.8rem] sm:text-[0.9rem] flex flex-col sm:flex-row"
                >
                  Fillable PDF
                  <span class="text-[0.7rem] text-[#707070]"
                    >(One time charge)</span
                  >
                </td>
                <td class="text-center text-[0.8rem] sm:text-[0.9rem] w-3/12">
                  {{ formatPrice(settings.custom_paperlink_price) }}
                </td>
                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <add-input
                      :onchange="(e) => (customPackage.fillable = e)"
                    />
                  </div>
                </td>
                <td class="text-end w-3/12">
                  {{
                    formatPrice(
                      Number(settings.custom_fillable_price) *
                        Number(customPackage.fillable)
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td class="w-3/12">
                  <div class="text-[0.8rem] items-center flex sm:text-[0.9rem]">
                    <input
                      type="checkbox"
                      v-model="customPackage.isWhiteGlover"
                      class="mr-3 transform scale-125"
                    />
                    <div class="flex flex-col sm:flex-row">
                      <p>White Glove Service</p>
                      <span class="text-[0.7rem] text-[#707070]"
                        >(One time charge)</span
                      >
                    </div>
                  </div>
                </td>
                <td class="text-center text-[0.8rem] sm:text-[0.9rem] w-3/12">
                  {{ formatPrice(settings.custom_White_glove_price) }}
                </td>

                <td class="w-3/12">
                  <div class="grid place-items-center">
                    <add-input
                      v-if="customPackage.isWhiteGlover"
                      :min="0"
                      v-model="customPackage.whiteGlove"
                      :onchange="(e) => (customPackage.whiteGlove = e)"
                    />
                    <input
                      v-else
                      type="checkbox"
                      v-model="customPackage.isWhiteGlover"
                      class="mr-3 transform scale-125"
                    />
                  </div>
                </td>

                <td class="text-end w-3/12">
                  {{
                    formatPrice(
                      Number(settings.custom_White_glove_price) *
                        Number(customPackage.whiteGlove)
                    )
                  }}
                </td>
              </tr>

              <!-- <tr>
              <td>Company Ledger</td>
              <td class="text-center">Included</td>
              <td>
                <div class="grid place-items-center">
                  <input
                    type="checkbox"
                    hidden
                    id="company-ledger-checkbox"
                    :disabled="true"
                    v-model="customPackage.companyLedger"
                  />
                  <label
                    for="company-ledger-checkbox"
                    class="inline-grid place-items-center h-7 w-7 rounded border border-gray-300 p-1 cursor-pointer"
                  >
                    <transition name="fade" :duration="100">
                      <check-icon
                        height="12"
                        width="16"
                        v-show="customPackage.companyLedger"
                      />
                    </transition>
                  </label>
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    !customPackage.companyLedger
                      ? 0
                      : Number(settings.custom_company_ledger_price)
                  )
                }}
              </td>
            </tr> -->
            </tbody>
          </table>
        </div>
        <div
          class="border-t-[1px] border-[#75C05F] py-4 px-4 text-[1.2rem] font-[500] hidden lg:flex justify-between"
        >
          <span>Total Amount</span>
          <span class="text-[#606060]">{{ formatPrice(totalCost) }}</span>
        </div>
      </div>
      <div
        class="md:min-w-[300px] lg:min-w-[320px] bg-white rounded-t-[20px] lg:rounded-[20px] p-3"
      >
        <custom-packagecard
          show-bottom-button
          class="w-full"
          @setName="setname"
          :staging-package="stagingPackage"
          @bottom-button-clicked="$emit('next-tab', $event)"
          :edited="true"
          :create="true"
          :isLight="true"
          :totalAmount="formatPrice(totalCost)"
        />
      </div>

      <MenuModel v-model="showModel" />
    </div>
  </div>
</template>

<script>
import CustomPackagecard from '../settings/CustomPackagecard.vue'

import CheckIcon from '../svg-icons/CheckIcon.vue'
import Vue from 'vue'
import StringUtils from '~/utils/StringUtils'
import MenuModel from '~/components/modals/MenuModel.vue'
import AddInput from '~/components/billing/AddInput.vue'

export default Vue.extend({
  name: 'SelectCustomPackage',
  components: { CheckIcon, MenuModel, AddInput, CustomPackagecard },
  data() {
    return {
      showModel: false,
      settings: {
        custom_paperlink_price: 2,
        custom_white_glove_service: 2,
        custom_team_members_price: 2,
        custom_cc_price: 0,
        custom_White_glove_price: 2,
        custom_public_profile_price: 10,
        custom_company_ledger_price: 0,
        custom_fillable_price: 2,
      },
      customPackage: {
        name: 'Custom',
        description: 'Custom package',
        paperlink: 1,
        teamMembers: 1,
        cc: 1,
        fillable: 1,
        whiteGlove: 0,
        publicProfile: true,
        companyLedger: true,
        isWhiteGlover: false,
      },
    }
  },
  async fetch() {
    // await this.$axios.$get('/package/custom').then((response) => {
    //   this.settings = response.settings
    // })
  },
  watch: {
    'customPackage.isWhiteGlover'() {
      this.customPackage.whiteGlove = 0
    },
  },
  computed: {
    totalCost() {
      const paperLinkPrice =
        Number(this.settings.custom_paperlink_price) *
        Number(this.customPackage.paperlink)
      const teamMembersPrice =
        Number(this.settings.custom_team_members_price) *
        Number(this.customPackage.teamMembers)
      const fillablePdfPrice =
        Number(this.settings.custom_fillable_price) *
        Number(this.customPackage.fillable)
      const ccFlowPrice =
        Number(this.settings.custom_cc_price) * Number(this.customPackage.cc)
      const publicProfilePrice = !this.customPackage.publicProfile
        ? 0
        : Number(this.settings.custom_public_profile_price)
      const companyLedgerPrice = !this.customPackage.companyLedger
        ? 0
        : Number(this.settings.custom_company_ledger_price)
      const companyWhiteGlovePrice = Number(this.settings.custom_White_glove_price) *
        Number(this.customPackage.whiteGlove)

      const DiscountedPrice =
        paperLinkPrice +
        teamMembersPrice +
        ccFlowPrice +
        publicProfilePrice +
        fillablePdfPrice +
        companyLedgerPrice +
        companyWhiteGlovePrice

      return DiscountedPrice
    },
    stagingPackage() {
      const stag = { ...this.customPackage }
      Object.assign(stag, {
        monthlyPrice: this.totalCost,
        yearlyPrice: Math.floor(
          this.totalCost * 12 - this.totalCost * 12 * 0.2
        ),
      })
      return stag
    },
  },
  methods: {
    showModalComponent() {
      this.showModel = true
    },
    formatPrice(amount) {
      return StringUtils.formatPrice(Number(amount))
    },
    createAndProceed({ stagingPackage, isMonthly }) {
      const data = { ...this.customPackage }
      data.plan = isMonthly ? 'monthly' : 'yearly'
      return
      // Create the custom package
      this.$axios.$post('/package/custom', data).then((response) => {
        debugger
        // this.$emit('next-tab', { stagingPackage, isMonthly })
      })
    },
  },
})
</script>
