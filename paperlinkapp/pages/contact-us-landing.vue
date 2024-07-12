<template>
  <div class="!bg-[#FCFEFA] min-h-[100vh]">
    <section class="relative">
      <div
        class="px-5 text-center text-black absolute inline-block transform top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        <h4 class="text-4xl lg:text-5xl font-semibold whitespace-nowrap">
          <span class="text-paperdazgreen-400">Contact</span>
          Us
        </h4>
        <p class="text-[#414142] font-medium">
          Have any questions? We'd love to hear from you.
        </p>
      </div>
      <img
        src="~/assets/img/world_map.svg"
        alt=""
        class="w-full max-w-full max-h-80 min-h-[250px] object-cover"
      />
    </section>
    <section class="container card-containers">
      <article
        class="contact-us-card"
        v-for="card in cards"
        :key="card.id"
        @mouseover="currentActiveCard = card.id"
        @mouseleave="currentActiveCard = 2"
        :class="{ active: card.id === currentActiveCard }"
      >
        <header>
          <h4 class="card-header">{{ card.heading }}</h4>
        </header>

        <div class="body">
          {{ card.content }}
        </div>

        <button
          v-if="card.command === 'faq'"
          class="button"
          @click="handleCommand(card.command || '')"
        >
          {{ card.buttonText }}
        </button>

        <button
          v-else
          class="button"
          :class="
            card.command === 'partners'
              ? 'text-white border-[#e6af23] bg-[#FFA600] lg:bg-white lg:!text-[#e6af23]'
              : card.command === 'tawk'
              ? 'text-white border-[#3477EBl] bg-[#3477EB] lg:bg-white lg:!text-[#e6af23]  '
              : currentActiveCard
              ? 'lg:!text-[#fff] '
              : ''
          "
          @click="handleCommand(card.command || '')"
        >
          {{ card.buttonText }}
        </button>
      </article>
    </section>
    <contact-us-modal v-model="showModel" />
  </div>
</template>

<script>
import Vue from "vue";
import ContactUsModal from "~/components/modals/ContactUsModel.vue";

export default Vue.extend({
  name: "ContactUsPage",
  layout: "landing",
  components: {
    ContactUsModal,
  },
  auth: false,
  head() {
    return {
      script: [
        // ...
        {
          hid: "tawk.to",
          // src: "https://embed.tawk.to/61ee08389bd1f31184d8e4d8/1fq4t07bg",
          defer: true,
        },
      ],
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   location.href = to.fullPath
  //   return
  // },
  data() {
    return {
      currentActiveCard: 2,
      showModel: false,
      cards: [
        {
          id: 1,
          heading: "Partnership",
          content:
            "Let's strategically partner to keep everyone SAFE while reducing carbon footprint in the world we live in.",
          buttonText: "CONTACT US",
          command: "partners",
        },
        {
          id: 2,
          heading: "FAQ's & Support",
          content:
            "Our support team is spread across the globe to give you answers fast. We also have answers ready for many frequently asked questions.",
          buttonText: "VISIT FAQ's",
          command: "faq",
        },
        {
          id: 3,
          heading: "Chat with us",
          content: "Our team is ready to answer any questions you may have.",
          buttonText: "INITIATE CHAT",
          command: "tawk",
        },
      ],
    };
  },
  methods: {
    mouseHover(id) {},
    getCardColor(id) {
      if (id === 1) return "partner_card";
      if (id === 2) return "faq_card";
      if (id === 3) return "chat_card";
    },
    handleCommand(command) {
      switch (String(command).toLowerCase()) {
        case "faq":
          this.$nuxt.$router.push("/faq-landing");
          break;
        case "partners":
          this.showModel = true;
          break;
        case "tawk":
          try {
            // Tawk_API?.toggle();
          } catch (error) {
            //
          }
          // ;(
          //   document.querySelector('.tawk-button') as HTMLButtonElement
          // )?.click()
          break;
      }
    },
  },
  mounted() {
    try {
      let frame = document.querySelectorAll(".widget-visible");
      frame[0].style.display = "block";
    } catch (error) {
      //
    }
  },
  beforeDestroy() {
    try {
      let frame = document.querySelectorAll(".widget-visible");
      frame[0].style.cssText = "display: none !important";
    } catch (error) {
      //
    }
  },
});
</script>

<style lang="scss" scoped>
.header {
  @apply text-2xl lg:text-3xl text-paperdazgreen-400 mb-1.5 lg:mb-2 font-semibold;
}

.body {
  @apply text-[#414142] font-medium text-sm lg:text-base;
}

.card-containers {
  @apply py-9;
  --col-counts: 1;
  display: grid;
  grid-template-columns: repeat(var(--col-counts), 1fr);
  gap: 24px;

  @media only screen and (min-width: 768px) {
    @apply py-20;
    --col-counts: 3;
  }
  @media only screen and (min-width: 1024px) {
    gap: 32px;
  }
}

.contact-us-card {
  @apply shadow border-[1px] rounded-[1.5rem] md:rounded-[0px] border-[#0000002b] md:border-t-[3px] md:border-t-[#e6af23];
  --accent-color: #e6af23;
  --scaling-factor: 1.05;
  max-width: 100%;
  transition: all 0.3s ease-in-out;
  background: white;
  transform: scale(1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  z-index: 1;
  padding: 32px 16px;

  @media only screen and (min-width: 768px) {
    --scaling-factor: 1.2;
    box-shadow: 0px 10px 18px 10px rgba(75, 75, 75, 0.15);
    // border: none;
  }

  & .card-header {
    @apply text-center text-[#414142] text-xl font-semibold mb-8;
  }

  & .body {
    @apply text-center  font-normal mb-6;
    flex: 1;
    font-size: 13px;
  }

  & > .button {
    @apply w-full h-10 text-sm font-semibold rounded-full;
    color: var(--accent-color);
    border: 1px solid var(--accent-color);
    transition: all 0.3s ease-in-out;
  }
}

.contact-us-card.active {
  @apply border-t-[#7DAE5A];
  --accent-color: #77b550;
  transform: scale(var(--scaling-factor));
  z-index: 2;
  & > .button {
    color: white !important;
    background: var(--accent-color);
  }
}
</style>
