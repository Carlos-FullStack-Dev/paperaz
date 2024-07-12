<template>
  <div class="small-details-card-container grid-cols-4 px-3 px-sm-0">
    <top-details-card
      v-for="(tab, i) in topDetail"
      :key="i"
      :isActive="tab.key === activeTab"
      @click.native="searchFilter(tab.key, tab.action, tab.action)"
    >
      <template #icon>
        <component :is="tab.icon" />
      </template>
      <template #count>{{ tab.total}}</template>
      <!-- <template #count v-else>{{ originalPdfFiles.length }}</template> -->
      <template #name>{{ tab.label }}</template>
    </top-details-card>
  </div>
</template>

<script>
import Vue from 'vue'
import TopDetailsCard from './TopDetailsCard.vue'
import { mapActions, mapState } from 'vuex'
import FileAction from '~/models/FileAction'
import UserTypeEnum from '~/models/UserTypeEnum'
import NoteAndPenIconVue from '~/components/svg-icons/NoteAndPenIcon.vue'
import LedgerIcon from '~/components/svg-icons/LedgerIcon.vue'
import PageIconVue from '~/components/svg-icons/PageIcon.vue'
import TickCircleIconVue from '~/components/svg-icons/TickCircleIcon.vue'

export default Vue.extend({
  components: {
    TopDetailsCard,
    NoteAndPenIconVue,
    LedgerIcon,
    PageIconVue,
    TickCircleIconVue,
  },
  props: {
    // ledger, confirmed, signed, saved, shared
    activeTab: {
      type: String,
      default: '',
    },
  },
  model: {
    prop: 'activeTab',
    event: 'updateActiveTab',
  },
  data() {
    return {
      topDetail: [],
      labels: [
        {
          label: 'ledger',
          params: "",
          key: 'ledger',
          action: '',
          count: 896,
          icon: LedgerIcon,
        },
        {
          label: 'completed',
          key: 'completed',
          count: 25,
          params: "complete",
          action: 'complete',
          icon: PageIconVue,
        },
        {
          label: 'signed',
          key: 'signed',
          count: 25,
          params: "sign",
          action: 'sign',
          icon: NoteAndPenIconVue,
        },
        {
          label: 'confirmed',
          key: 'confirmed',
          count: 25,
          params: "confirm",
          action: 'confirm',
          icon: TickCircleIconVue,
        },
      ],
    }
  },
  computed: {
    ...mapState(['originalPdfFiles']),
  },
  watch: {
    topDetail(val){
        console.log(val)
    },
    '$auth.user': function () {
      this.getTopContainerDetails()
    },
  },
  mounted() {
    this.getTopContainerDetails()
  },
  methods: {
    getTopContainerDetails() {
      let paramsId = this.$_queryId

      const ledgers = this.$axios.get(`/ledger?userId=${paramsId}`)
      const completeFiles = this.$axios.get(
        `/ledger?userId=${paramsId}&action=complete`
      )
      const signFiles = this.$axios.get(
        `/ledger?userId=${paramsId}&action=sign`
      )
      const confirmFiles = this.$axios.get(
        `/ledger?userId=${paramsId}&action=confirm`
      )
      try {
        Promise.all([ledgers, completeFiles, signFiles, confirmFiles]).then(
          (res) => {
            this.topDetail = res.map((item, index) => {
              return {
                total: item?.data?.total,
                label: this.labels[index].label,
                action: this.labels[index].action,
                icon: this.labels[index].icon,
                key: this.labels[index]?.key
              }
            })
          }
        )
      } catch ({ response }) {}
    },

    isFilterActions(val) {
      switch (val) {
        case FileAction.LEDGER:
          return (this.originalPdfFiles || []).length
        case FileAction.SHARED:
          return (this.originalPdfFiles || []).filter((e) => e?.shared != null)
            .length
        case FileAction.SAVED:
          return (this.originalPdfFiles || []).filter(
            (e) => e?.favourites.length > 0
          ).length
        default:
          return (this.originalPdfFiles || []).filter(
            (e) => e?.fileAction == val
          ).length
      }
    },
    searchFilter(tab, label, params) {
      this.$emit('updateActiveTab', tab)
      this.$store.commit('FILTER_USERs', label)
      this.$store.commit("SET_LEDGER_PARAMS", params)
      this.$router.push('file-ledger')
    },
  },
})
</script>
<style lang="postcss" scoped>
.small-details-card-container {
  @apply gap-3 lg:gap-4;
  display: grid;
}
</style>
