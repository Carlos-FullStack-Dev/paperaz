<template>
  <div class="grid lg:grid-cols-[1fr,max-content] lg:mb-12 lg:gap-5">
    <div
      class="lg:border-2 lg:border-paperdazgreen-400 w-full rounded-2xl overflow-hidden relative bg-white text-[#505050]"
    >
      <div class="p-1 lg:p-5 overflow-x-auto custom-scrollbar">
        <table class="custom-table">
          <thead>
            <tr class="text-lg">
              <th class="text-left w-3/12 flex">
                <span
                  class="inline-block text-[0.8rem] lg:text-[1.1rem] lg:border-b-2 border-paperdazgreen-400 font-[500]"
                  >Feature</span
                >
              </th>
              <th class="w-3/12">
                <div class="flex justify-center">
                  <span
                    class="text-[0.8rem] lg:text-[1.1rem] inline-block font-[500] lg:border-b-2 border-paperdazgreen-400"
                    >Price/unit</span
                  >
                </div>
              </th>
              <th class="w-3/12">
                <div class="flex justify-center">
                  <span
                    class="hidden md:inline-block text-[0.8rem] lg:text-[1.1rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                    >Quantity</span
                  >
                  <span
                    class="inline-block md:hidden text-[0.8rem] lg:text-[1.1rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                    >Qty.</span
                  >
                </div>
              </th>
              <th class="w-3/12">
                <div class="flex justify-center">
                  <span
                    class="inline-block text-[0.8rem] lg:text-[1.1rem] font-[500] lg:border-b-2 border-paperdazgreen-400"
                    >Amount</span
                  >
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paperlink</td>
              <td class="text-center text-[0.8rem] lg:text-[0.9rem]">
                {{ formatPrice(settings.custom_paperlink_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <!-- <el-input
                            v-model="customPackage.paperlink"
                            style="width: 80px"
                            type="number"
                            min="1"
                          /> -->
                  <!-- <el-input-number
                    v-model.number="customPackage.paperlink"
                    :step="0"
                    size="small"
                    :min="0"
                    :max="20"
                  /> -->
                  <add-input
                    :max="20"
                    :onchange="(e) => (customPackage.paperlink = e)"
                  />
                </div>
              </td>
              <td class="text-center">
                {{
                  formatPrice(
                    Number(settings.custom_paperlink_price) *
                      Number(customPackage.paperlink)
                  )
                }}
              </td>
            </tr>
            <tr>
              <td>Team Member</td>
              <td class="text-center text-[0.8rem] lg:text-[0.9rem]">
                {{ formatPrice(settings.custom_team_members_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <add-input
                    :max="20"
                    :onchange="(e) => (customPackage.teamMembers = e)"
                  />
                </div>
              </td>
              <td class="text-center text-[0.8rem] sm:text-[0.9rem]">
                {{
                  formatPrice(
                    Number(settings.custom_team_members_price) *
                      Number(customPackage.teamMembers)
                  )
                }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="md:flex items-center w-full">
                  Fillable PDF
                  <small class="block w-full">(One time charge)</small>
                </div>
              </td>
              <td class="text-center text-[0.8rem] lg:text-[0.9rem]">
                {{ formatPrice(settings.custom_fillable_pdf_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <!-- <el-input
                            v-model="customPackage.team_members"
                            style="width: 80px"
                            type="number"
                            min="1"
                          /> -->
                  <!-- <el-input-number
                    v-model.number="customPackage.teamMembers"
                    :step="0"
                    size="small"
                    :min="0"
                    :max="20"
                  /> -->
                  <add-input
                    :max="20"
                    :onchange="(e) => (customPackage.fillable = e)"
                  />
                </div>
              </td>
              <td class="text-center text-[0.8rem] sm:text-[0.9rem]">
                {{
                  formatPrice(
                    Number(settings.custom_fillable_pdf_price) *
                      Number(customPackage.fillable)
                  )
                }}
              </td>
            </tr>

            <tr>
              <td>
                <div class="flex items-center">
                  <div class="mr-1">
                    <input
                      v-model="customPackage.whiteGlove"
                      type="checkbox"
                      class="white_glove_input"
                    />
                  </div>
                  <div class="md:flex items-center w-full">
                    White Glove
                    <small class="block w-full">(One time charge)</small>
                  </div>
                </div>
              </td>
              <td class="text-center text-[0.8rem] lg:text-[0.9rem]">
                {{ formatPrice(settings.custom_white_glove_price) }}
              </td>
              <td>
                <div class="grid place-items-center">
                  <input
                    v-model="customPackage.whiteGlove"
                    type="checkbox"
                    class="white_glove_input"
                  />
                </div>
              </td>
              <td class="text-center text-[0.8rem] sm:text-[0.9rem]">
                {{
                  formatPrice(
                    Number(settings.custom_white_glove_price) *
                      Number(customPackage.whiteGlove)
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="border-t-2 hidden border-paperdazgreen-400 py-4 px-10 text-lg font-bold lg:flex justify-between"
      >
        <span>Total Amount</span>
        <span class="text-[#606060]">{{ formatPrice(totalCost) }}</span>
      </div>
    </div>

    <CardPaymentModal
      :customPackage="customPackage"
      v-model="showConfirmPassword"
    />
  </div>
</template>

<script>
import CustomPackagecard from './widget/PackageCard.vue'
import CheckIcon from '~/components/svg-icons/CheckIcon.vue'
import Vue from 'vue'
import StringUtils from '~/utils/StringUtils'
import CardPaymentModal from './modals/CardPaymentModal.vue'
import AddInput from './AddInput'

export default Vue.extend({
  name: 'SelectCustomPackage',
  components: { CheckIcon, AddInput, CustomPackagecard, CardPaymentModal },
  data() {
    return {
      settings: {
        custom_paperlink_price: 2,
        custom_team_members_price: 2,
        custom_fillable_pdf_price: 5,
        custom_white_glove_price: 4,
        custom_cc_price: 0,
        custom_public_profile_price: 0,
        custom_company_ledger_price: 0,
      },
      showConfirmPassword: false,
      customPackage: {
        name: 'Custom',
        description: 'Custom package',
        paperlink: 1,
        teamMembers: 0,
        cc: 1,
        fillable: 0,
        whiteGlove: false,
        publicProfile: true,
        companyLedger: true,
      },
    }
  },
  async fetch() {
    // await this.$axios.$get('/package/custom').then((response) => {
    //   this.settings = response.settings
    // })
  },
  computed: {
    totalCost() {
      const paperLinkPrice =
        Number(this.settings.custom_paperlink_price) *
        Number(this.customPackage.paperlink)
      const teamMembersPrice =
        Number(this.settings.custom_team_members_price) *
        Number(this.customPackage.teamMembers)
      const ccFlowPrice =
        Number(this.settings.custom_cc_price) * Number(this.customPackage.cc)
      const publicProfilePrice = !this.customPackage.publicProfile
        ? 0
        : Number(this.settings.custom_public_profile_price)
      const companyLedgerPrice = !this.customPackage.companyLedger
        ? 0
        : Number(this.settings.custom_company_ledger_price)
      const companyWhiteGlove = !this.customPackage.whiteGlove
        ? 0
        : Number(this.settings.custom_white_glove_price)
      return (
        paperLinkPrice +
        teamMembersPrice +
        ccFlowPrice +
        publicProfilePrice +
        companyLedgerPrice +
        companyWhiteGlove
      )
    },
    stagingPackage() {
      const stag = { ...this.customPackage }
      Object.assign(stag, {
        monthlyPrice: this.totalCost,
        yearlyPrice: this.totalCost * 10,
      })
      return stag
    },
  },
  methods: {
    setname() {
      //... code goes here
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

<style scoped>
.white_glove_input {
  transform: scale(1.6);
  margin-right: 8px;
  caret-color: rgb(119, 195, 96);
}
input[type='checkbox'] {
  filter: hue-rotate(253deg);
}
</style>
