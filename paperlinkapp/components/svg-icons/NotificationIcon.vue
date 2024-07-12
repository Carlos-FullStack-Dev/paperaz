<template>
  <svg width="29" height="29" viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.4997 26.583C15.8288 26.583 16.9163 25.4955 16.9163 24.1663H12.083C12.083 25.4955 13.1584 26.583 14.4997 26.583ZM21.7497 19.333V13.2913C21.7497 9.58176 19.768 6.47634 16.3122 5.65467V4.83301C16.3122 3.83009 15.5026 3.02051 14.4997 3.02051C13.4968 3.02051 12.6872 3.83009 12.6872 4.83301V5.65467C9.21926 6.47634 7.24967 9.56967 7.24967 13.2913V19.333L4.83301 21.7497V22.958H24.1663V21.7497L21.7497 19.333Z"
      :fill="fillColor"
    />
  </svg>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  name: "NotificationIcon",
  props: {
    fillColor: {
      type: String,
      default: "black",
    },
  },
});
</script>
