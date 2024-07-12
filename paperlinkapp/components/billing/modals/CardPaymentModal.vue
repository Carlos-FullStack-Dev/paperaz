<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative"
  >
    <!--Start:: Close Button -->
    <div class="absolute -top-3 -right-3" style="padding: inherit">
      <span
        class="circle circle-12 bg-white cursor-pointer text-red-600"
        @click="closeModal()"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 3.19188L7.02451 0.167368C7.24767 -0.0557892 7.60948 -0.0557892 7.83263 0.167368C8.05579 0.390524 8.05579 0.752333 7.83263 0.975489L4.80812 4L7.83263 7.02451C8.05579 7.24767 8.05579 7.60948 7.83263 7.83263C7.60948 8.05579 7.24767 8.05579 7.02451 7.83263L4 4.80812L0.975489 7.83263C0.752333 8.05579 0.390524 8.05579 0.167368 7.83263C-0.0557892 7.60948 -0.0557892 7.24767 0.167368 7.02451L3.19188 4L0.167368 0.975489C-0.0557892 0.752333 -0.0557892 0.390524 0.167368 0.167368C0.390524 -0.0557892 0.752333 -0.0557892 0.975489 0.167368L4 3.19188Z"
            fill="#414042"
          />
        </svg>
      </span>
    </div>

    <div >
      <div class="w-full bg-white rounded shadow-lg">
        <div class="w-full p-3">
          <form class="">
            <div class="form-group group-label">
              <label>Total </label>
              <label class="text-xl" for=""
                >$
                {{
                  packageInfo.isMonthly
                    ? packageInfo.monthlyPrice
                    : packageInfo.yearlyPrice
                }}/
                <abbr class="text-xs">{{
                  packageInfo.isMonthly ? 'monthly' : 'yearly'
                }}</abbr>
              </label>
            </div>
            <div class="h-[1px] bg-gray-300"></div>
            <div class="h-4"></div>
            <div class="grid mb-10">
              <label class="font-bold flex items-center justify-between" for="">
                Credit Card
                <img
                  class="float-right inline w-[134px]"
                  src="~/assets/img/payment.png"
                />
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
              <el-input
                placeholder="Name Surname"
                required
                v-model="card_name"
              />
            </div>
            <div class="form-group mb-3">
              <label class="input-label" for="">Card Number</label>
              <el-input
                placeholder="0000-0000-0000-0000"
                :value="cardNumberWithDashes"
                @input="inputCardNumber"
                required
                ref="cardNumber"
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

           <div class="w-full flex justify-center mt-5">
            <button 
            :disabled="loading"
            :class="[ loading ? 'opacity-50' : 'opacity-100']"
            @click="patchCard"
             class="w-10/12 py-2 rounded-md bg-paperdazgreen-300 text-white flex items-center justify-center">
              Pay
              <spinner-dotted-icon v-show="loading" class="text-white animate-spin ml-1" width="20" />
            </button>
           </div>
          </form>
        </div>
      </div>
    </div>

    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
export default Vue.extend({
  name: 'InsufficientCreditModal',
  components: { SpinnerDottedIcon },
  model: {
    prop: 'visible',
    event: 'updateVisibility',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    customPackage: Object
  },
  data() {
    return {
      showModal: false,
      errorMessage: '',
      loading: false,
      cardNumberWithDashes: '',
      card_name: '',
      cvv: '',
      cardId: undefined,
      expirationDateWithSlashes: '',
      card: {}
    }
  },
  watch: {
    visible(val) {
      this.showModal = val
      val ? this.getCard() : null
      console.log(">>>>?????mmmmmmm", this.customPackage)
    },
    showModal(val) {
      this.$emit('updateVisibility', val)
    },
  },
  computed: {
    cardPayload(){
       return {
        card_holder_name: this.card_name,
        cvv: this.cvv,
        exp_month: this.expMonth,
        exp_year: this.expYear,
        card_number: this.cardNumber
       }
    },
    subscriptionPayload(){
       return {
        action:"buyMoreFeature",
        additional_fillablePdf: this.customPackage.fillable,
        isWhiteGloveService: this.customPackage.whiteGlove,
        additional_paperlink: this.customPackage.paperlink,
        additional_teamMembers: this.customPackage.teamMembers,
       }
    },
    packageInfo() {
      return this.$store?.getters?.getPackageInfo
    },
    cardNumber() {
      return this.cardNumberWithDashes.replace(/-+/g, '')
    },
    expirationDateString() {
      return this.expirationDateWithSlashes.split('/').join('') || ''
    },
    expYear() {
      return this.expirationDateString.split('').splice(2, 4).join('')
    },
    expMonth() {
      return this.expirationDateString.split('').splice(0, 2).join('')
    },
  },
  mounted() {
    this.showModal = this.visible
  },
  methods: {
    closeModal() {
      this.$emit('updateVisibility', false)
    },
    getCard(){
       try {
        this.$axios.get(`cards/?userId=${this.$auth.user.id}`)
        .then((response)=>{
          this.card = response.data.data[0];
          console.log(this.card)
          this.card_name = this.card.card_holder_name
          this.cvv= this.card.cvv
          this.inputCardNumber(this.card.card_number)
          this.inputExpirationDate(`${this.card.exp_month}${this.card.exp_year}`)
        })
       } catch (error) {
        //
       }
    },
    patchCard(){
      this.loading = true
       try {
        this.$axios.patch(`/cards/${this.card.id}`, this.cardPayload)
        .then(()=> this.patchSubscription())
       } catch (response) {
        this.errorMessage = this.$_ErrorHandler(response)
       }
    },
    patchSubscription(){
        try {
          this.$axios.patch(`/subscriptions/${this.$auth.user.subscriptionId}`, this.subscriptionPayload)
        } catch ({response}) {
          this.errorMessage = this.$_ErrorHandler(response)
        } finally {
          this.loading = false
          this.closeModal()
        }
    },
    inputCardNumber(val) {
      if (val.length > 19) return
      let temp = val.toString().replace(/(-+)|([^0-9]+)/g, '')
      this.cardNumberWithDashes = (temp.match(/.{1,4}/g) || []).join('-')
    },
    inputExpirationDate(val) {
      let temp = val.replace(/\/+|[^0-9]+/g, '')
      if (temp.length > 4) return

      // Check if the month is greater than 12
      if (temp.length === 2) {
        if (Number(temp) > 12) temp = '0' + temp
        if (Number(temp) == 0) temp = '01'
      }

      if (temp.length == 4 && Number(temp.substring(2, 4)) == 0) {
        temp = temp.substring(0, 2) + '01'
      }

      let finalVal = (temp.match(/.{1,2}/g) || []).join('/')
      this.expirationDateWithSlashes = finalVal
    },
  },
})
</script>

<style scoped>
* >>> .el-dialog {
  width: 450px !important;
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
.group-label {
    @apply flex justify-between items-center py-2;
  }
</style>
