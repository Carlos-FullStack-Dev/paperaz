<template>
  <div>
    <component :is="profileCardComponent" class="h-full" />
  </div>
</template>
<script>
import Vue from 'vue'
import PaidProfileCard from '~/components/settings/PaidProfileCard.vue'

import UserTypeEnum from '~/models/UserTypeEnum'

export default Vue.extend({
  name: 'ProfileCard',
  components: { PaidProfileCard },
  data() {
    return {}
  },
  computed: {
    userType() {
      return this.$store.getters.userType
    },
    profileCardComponent() {
      return PaidProfileCard
    },
  },
})
</script>
