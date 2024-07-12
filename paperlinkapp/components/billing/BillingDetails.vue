<template>
  <div class="bg-white rounded-lg">
    <h2 class="capitalize py-4 border-b-2 border-gray-200 hidden md:block px-3">
      Billing details
    </h2>

    <div class="p-3 overflow-x-auto w-full">
      <div class="w-full">
        <table class="w-full">
          <thead class="border-b-[1px] border-gray-200 px-3 w-full py-2">
            <td class="md:w-[16%] w-6/12">Date</td>
            <td class="w-[16%] hidden md:table-cell text-center">Paperlink</td>
            <td class="w-[16%] hidden md:table-cell text-center px-2">Team Member</td>
            <td class="w-[16%] hidden md:table-cell text-center px-2">Business Page</td>
            <td class="w-[16%] hidden md:table-cell text-center px-2">Discount</td>
            <td class="w-[10%] hidden md:table-cell text-center px-2">Total</td>
            <td class="md:w-[10%] hidden md:table-cell w-6/12 text-right">Receipt</td>
            <td class="md:w-[10%] md:hidden w-6/12 text-right">Billing Details</td>
          </thead>
          <tbody>
            <tr class="px-3 w-full py-2" v-for="billing in billings" :key="billing.id">
              <td class="lg:w-[16%] w-6/12">{{ formatDate(billing.createdAt) }}</td>
              <td class="w-[16%] text-center hidden md:table-cell">
                $2 x {{ billing.paperlink }}
              </td>
              <td class="w-[16%] text-center hidden md:table-cell">
                $2 x {{ billing.teamMember }}
              </td>
              <td class="w-[16%] text-center hidden md:table-cell">
                $10 x {{ billing.businessPage }}
              </td>
              <td class="w-[16%] text-center hidden md:table-cell">
                {{ billing.discount }}%
              </td>
              <td class="w-[10%] text-center hidden md:table-cell">
                ${{ billing.total }}
              </td>
              <td class="md:w-[10%] w-6/12">
                <span
                  @click="openReciept(billing.reciept)"
                  class="inline-flex justify-end w-full cursor-pointer"
                >
                  <img src="~/assets/icons/pdf-icon.svg" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import dateFormat from "dateformat";

export default {
  data() {
    return {
      billings: [],
    };
  },
  mounted() {
    this.getBilling();
  },
  methods: {
    formatDate(val) {
      return dateFormat(val, this.$store?.getters?.getDateFormat);
    },
    openReciept(val) {
      window.open(val, "_blank");
    },
    async getBilling() {
      try {
        await this.$axios
          .get(`/billings/?userId=${this.$auth.user.id}`)
          .then((response) => {
            console.log(response.data.data);
            this.billings = response.data.data;
          });
      } catch ({ response }) {
        this.$_ErrorHandler(response);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
td {
  @apply py-2 text-sm;
}
</style>
