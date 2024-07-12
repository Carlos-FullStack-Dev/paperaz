<template>
  <div id="pdf-layout" class="relative bg-[#E0E0E0] min-h-screen">
    <div
      id="sidebar-container"
      class="h-full overflow-hidden relative"
      :class="{ active: collapseSidebar }"
    >
      <div class="overlay" @click="collapseSidebar = false"></div>
      <dashboard-sidebar class="relative" @close="collapseSidebar = false" />
    </div>
    <PdfToast/>
    <PdfNavbar
      class="sticky top-0 justify-self-stretch z-50"
      :title="$store.state.pdfPageName || ''"
      :compact="true"
      @open-sidebar="collapseSidebar = true"
    />
    <Nuxt />
  </div>
</template>

<script lang="js">
import Vue from 'vue'
import DashboardNavbar from '~/components/navbars/DashboardNavbar.vue'
import DashboardSidebar from '~/components/sidebars/DashboardSidebar.vue'
import login from '~/mixins/login'
import mixins from 'vue-typed-mixins'
import PdfNavbar from '~/components/navbars/PdfNavbar.vue'
import PdfToast from '~/components/widgets/PdfToast.vue'

export default mixins(login).extend({
  components: { DashboardNavbar, DashboardSidebar, PdfNavbar, PdfToast },
  name: 'PdfLayout',
  data() {
    return {
      collapseSidebar: false,
    }
  },
  created() {
    //@ts-ignore
    this.filterUsers()
  },
  mounted() {
    this.resizeEventListener()
    window.addEventListener('resize', this.resizeEventListener)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeEventListener)
  },
  methods: {
    resizeEventListener() {
      const root = document.querySelector(':root') 
      root.style.setProperty('--viewport-height', `${window.innerHeight}px`)
    },
  }
})
</script>

<style scoped lang="scss">
#pdf-layout {
  height: var(--viewport-height, 100vh);
  min-height: var(--viewport-height, 100vh);
  max-height: var(--viewport-height, 100vh);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  // grid-template-rows: 1fr;
  /* // grid-template-rows: 1fr; */
  grid-template-rows: max-content 1fr;
}

#sidebar-container {
  --sidebar-container-width: 245px;
  position: fixed;
  z-index: 51;
  top: 0;
  bottom: 0;
  left: calc(0px - var(--sidebar-container-width));
  width: var(--sidebar-container-width);
  // left: calc(-1 * var(--sidebar-container-width));
  box-shadow: 2px 0px 13px 2px rgb(151 151 151 / 31%);
  transition: all ease-in-out 200ms;
  & .overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    opacity: 0;
    pointer-events: none;
    transition: all ease-in-out 200ms;
  }

  &.active {
    left: 0;
    .overlay {
      opacity: 1;
      pointer-events: all;
    }
  }

  @media only screen and (min-width: 1024px) {
    display: none;
    
    & .overlay {
      display: none;
    }
  }

}
</style>
