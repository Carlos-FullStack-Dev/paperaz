<template>
<el-dialog :visible.sync="showModal" :append-to-body="true" style="" :show-close="false" center class="relative text-[#414042]">
    <!-- Start:: Body -->

    <div class="">
        <button @click="setFileAction('complete')" class="flex items-center gap-5 justify-center  icon_action w-full py-3 rounded-lg">
            <abbr class="mr-3 w-7">
                <CheckIcon /></abbr> 
          <span class="w-20 text-left	">Complete</span>

        </button>

        <button @click="setFileAction('sign')" class="flex items-center gap-5 justify-center icon_action  w-full py-3 rounded-lg">
            <abbr class="mr-3 w-7 ">
                <SignIcon /></abbr> 
          <span class="w-20 text-left	">Sign</span>

        </button>

        <button @click="setFileAction('confirm')" class="flex items-center gap-5 justify-center  icon_action  w-full py-3 rounded-lg">
            <abbr class="mr-3 w-7">
                <ConfirmIcon/></abbr> 
          <span class="w-20 text-left	">Confirm</span>

        </button>
    </div>
    <!-- end :: body -->
</el-dialog>
</template>

  
  
<script>
import Vue from 'vue'
import CheckIcon from '../assets/CompleteIcon.vue'
import SignIcon from "../assets/SignIcon.vue"
import ConfirmIcon from "../assets/ConfirmTool.vue"

export default Vue.extend({
    name: 'AlertModal',
    components: {
        CheckIcon,
        SignIcon,
        ConfirmIcon
    },
    model: {
        prop: 'visible',
        event: 'updateVisibility',
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        handleActionChange: {
            type: Function
        }
    },
    data() {
        return {
            showModal: false,
            errorMessage: '',
            loading: false,
            newSaveData: {},
            sendAction: null,
        }
    },
    watch: {
        visible(val) {
            this.showModal = val
        },
        showModal(val) {
            this.$emit('updateVisibility', val)
        },
    },
    mounted() {
        this.showModal = this.visible
    },
    methods: {
        setFileAction(val) {
            this.handleActionChange(val)
            this.closeModal()
        },
        closeModal() {
            this.$emit('updateVisibility', false)
        },

    },
})
</script>
  
  
<style scoped>
*>>>.el-dialog {
    width: 416px !important;
    max-width: 95% !important;
    border-radius: 20px !important;
    border-radius: 8px !important;
    position: relative !important;
    overflow: hidden;
}

*>>>.el-dialog__header {
    padding-bottom: 20px;
}

*>>>.el-dialog__header,
*>>>.el-dialog__footer {
    text-align: left !important;
}

*>>>.el-dialog__body {
    /* padding-top: 0 !important;
    padding-bottom: 0 !important; */
    background: #fcfcfd;
}

*>>>.el-select .el-input__inner {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.icon_action>abbr>svg>g>path {
    fill: #737373
}

.icon_action:hover .icon_action>abbr>svg>g>path {
    fill: white !important;
}

.icon_action:hover {
    color: white;
    @apply bg-paperdazgreen-300
}
.icon_action:hover path {
  fill: white;
}
</style>
