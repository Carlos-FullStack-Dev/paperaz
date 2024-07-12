<template>
  <el-dialog
    :visible.sync="showModal"
    :append-to-body="true"
    style=""
    :show-close="false"
    center
    class="relative text-[#414042]"
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
    <!--End:: Close Button -->
    <template #title>
      <h4 class="text-center font-semibold text-xl">Share</h4>
      <div
        class="w-full text-center font-semibold py-2 pt-3 text-paperdazgreen-250"
      ></div>
    </template>
    <!-- Start:: Body -->
    <form ref="form">
      <div
        class="text-centerfont-medium flex justify-between item mx-auto mb-4 whitespace-none"
      >
        <p class="w-full">
          <input
            type="email"
            class="py-2 focus:border-paperdazgray-500 px-2 w-full mb-2 rounded-md border-[1px] border-paperdazgray-500"
            v-model="email"
            placeholder="Email"
          />
        </p>
      </div>

      <div class="flex justify-around">
        <button
          class="disabled:bg-opacity-50 disabled:cursor-progress h-10 text-xs w-full text-white rounded shadow bg-paperdazgreen-400"
          @click="onSubmit"
          :disabled="loading"
        >
          <span class="inline-flex gap-1 items-center text-[16px]">
            Send
            <spinner-dotted-icon
              v-show="loading"
              height="20"
              width="20"
              class="animate-spin"
            />
          </span>
        </button>
      </div>
    </form>
    <div class="w-full flex justify-between pt-6 items-center py-4">
      <button
        @click="copyToClipboard"
        class="flex-1 flex justify-center mr-4 text-[0.5rem] xxs:text-[0.58rem] sm:text-xs bg-paperdazgray-300/20 items-center py-2 px-2 rounded"
      >
        <link-icon width="20" height="20" color="rgb(96,98,102)" class="cursor-pointer" />
        <abbr class="pl-2"> Copy Link</abbr>
      </button>

      <button
        @click="showQrcode = true"
        class="flex-1 flex justify-center text-[0.5rem] xxs:text-[0.58rem] sm:text-xs bg-paperdazgray-300/20 items-center py-2 px-2 rounded"
      >
        <qrcode-icon width="20" height="20" class="cursor-pointer" />
        <abbr class="pl-2">Open QR</abbr>
      </button>
    </div>

    <QrcodeShare :link="qrcodeLink" v-model="showQrcode" />
    <div class="w-full flex justify-center pt-6 items-center py-4">
      <div class="w-75 flex justify-between">
        <div class="flex items-center">
          <a href="#" class="my-1">
            <img src="~/assets/img/fb.png" width="42" class="rounded-full mr-2"/>
          </a>
        </div>
        <div class="flex items-center">
          <a href="#" class="my-1">
            <img src="~/assets/img/tw.png" width="42" class="rounded-full mr-2"/>
          </a>
        </div>
        <div class="flex items-center">
          <a href="#" class="my-1">
            <img src="~/assets/img/insta.png" width="42" class="rounded-full mr-2"/>
          </a>
        </div>
        <div class="flex items-center">
          <a href="#" class="my-1">
            <img src="~/assets/img/Ik.png" width="42" class="rounded-full mr-2"/>
          </a>
        </div>
      </div>
    </div>
    <!-- end :: body -->
  </el-dialog>
</template>

<script>
import Vue from "vue";
import SpinnerDottedIcon from "~/components/svg-icons/SpinnerDottedIcon.vue";
import FacebookIcon from "../svg-icons/FacebookIcon.vue";
import TwitterIcon from "../svg-icons/TwitterIcon.vue";
import EnvelopeIcon from "../svg-icons/EnvelopeIcon.vue";
import PlusIcon from "~/components/svg-icons/PlusIcon.vue";
import LinkIcon from "~/components/svg-icons/LinkIcon.vue";
import EnvelopeIconShare from "~/components/svg-icons/EnvelopeIconShare.vue";
import QrcodeIcon from "../svg-icons/QrcodeIcon.vue";
import QrcodeShare from "./Tabs/QrcodeShare.vue";
import { ExtractFormPdf } from "~/types/extractFormPdf";

export default Vue.extend({
  name: "edit-company-folder",
  components: {
    SpinnerDottedIcon,
    FacebookIcon,
    TwitterIcon,
    EnvelopeIcon,
    PlusIcon,
    LinkIcon,
    EnvelopeIconShare,
    QrcodeIcon,
    QrcodeShare,
  },

  model: {
    prop: "visible",
    event: "updateVisibility",
  },
  props: {
    type: {
      type: String,
    },
    userFile: {
      type: Object,
    },
    userInfo: {
      type: Object,
    },
    link: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isCompanyNameShare: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showQrcodeFiles: false,
      folderTextareaData: "",
      showModal: false,
      showQrcode: false,
      email: "",
      // userFile:{},
      loading: false,
      twiterLink: "",
      inputs: [
        {
          value: "",
        },
      ],
      generateFileProperty: {},
      proceedToRequest: true,
      generatedFile: {},
    };
  },
  watch: {
    visible(val) {
      this.showModal = val;
    },
    showModal(val) {
      this.$emit("updateVisibility", val);
    },
    userFile: function () {},
  },
  mounted() {
    this.showModal = this.visible;
  },

  computed: {
    qrcodeLink() {
      return this.link;
    },
    emailWithLink() {
      return this.link == undefined;
    },
  },

  methods: {
    addEmailinputs() {
      // let addEmail = true;
      // Array.from(this.$refs.form.elements).forEach(element => {
      //   if (element.type == 'email' && !element.value.trim())
      //     addEmail = false
      // });
      // if (!addEmail) return

      this.inputs.push({ value: "" });
    },

    // async uploadGeneratedFile(val){
    //   if(Object.keys(this.generateFileProperty).length < 1 ) return
    //   // console.log(this.packagename)
    //   // return
    //   const updateVal = {
    //     "isEditing":true,
    //     downloadLink:val.downloadLink,
    //     key:val.key,
    //     originalFileId: this.userFile.id,
    //     userId: this.$auth.user.id
    //   }
    //   await this.$axios.$post(`/files`, { ...updateVal })
    //     .then((response)=>{
    //     console.log(response)
    //      this.generatedFile = response
    //     })
    //    .catch((err)=>{
    //     this.proceedToRequest = false
    //     })
    // },
    async setTwitterShare() {
      await this.$axios.patch(`/files/${this.userFile.id}`, { shared: "twitter" });
      await this.$emit("refresh");
      window.open(
        this.link ||
          `https://twitter.com/intent/tweet?url=${window.location.origin}/pdf/${this.userFile.paperLink}`
      );
    },
    async setFacebookShare() {
      await this.$axios.patch(`/files/${this.userFile.id}`, { shared: "facebook" });
      this.$emit("refresh");
      window.open(
        this.link ||
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/pdf/${this.userFile.paperLink}`
      );
      this.$emit("refresh");
    },
    setLinkCopy() {
      navigator.clipboard.writeText(this.link);
      this.$notify.success({
        message: "copied successfully",
      });
    },

    copyToClipboard() {
      const textToCopy = this.link;
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = 0;
      input.value = textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);

      this.$notify.success({
        title: "Copy",
        message: "Link copied successfully",
      });
    },
    showQrcodeFileFuncEmit() {
      this.$emit("qrLoad");
      this.$emit("updateVisibility", false);
    },
    closeModal() {
      this.$emit("updateVisibility", false);
    },
    async onSubmit(event) {
      event?.preventDefault();

      this.loading = true;

      let requestData = {
        action: "shareLink",
        email: this.email,
        link: this.link,
        title: this.type.replace(".pdf", ""),
        userId: 0,
      };
      this.$axios
        .post(`/request`, requestData)
        .then((response) => {
          this.$notify.success({
            title: "Shared",
            message: "Paperlink shared successfully",
          });
          this.$emit("updateVisibility", false);
          this.$emit("refresh");
          this.$nuxt.refresh();
          this.email = "";

          // ------ set the input field to empty -----
          this.folderTextareaData = "";
          this.inputs = [0];
        })
        .catch((err) => {
          this.$notify.error({
            title: "Shared",
            message: "Paperlink shared Failed",
          });
          // console.log(err.response, "request failed");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

<style scoped>
.color-white {
  fill: white !important;
}

* >>> .el-dialog {
  width: 416px !important;
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
  /* padding-top: 0 !important; */
  /* padding-bottom: 0 !important; */
  @apply !px-4 sm:!px-6;
  background: #fcfcfd;
}

* >>> .el-select .el-input__inner {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
