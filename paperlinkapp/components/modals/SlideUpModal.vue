<template>
  <div>
    <button @click="openModal">Open Modal</button>

    <transition name="slide-modal">
      <div v-if="dialogVisible" @click="closeModal" class="slide-modal-container">
        <div class="modal-content">
          <!-- Your modal content goes here -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    openModal() {
      this.dialogVisible = true;
    },
    closeModal() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.slide-modal-container {
  @apply absolute bottom-0 h-[100vh] left-0 w-full  grid place-items-center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.modal-content {
  background-color: white;
  width: 100%;
  height: 100px;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 1s;
}

.slide-modal-enter-active,
.slide-modal-leave-active {
  transition: transform 1s;
}

.slide-modal-enter,
.slide-modal-leave-to {
  transform: translateY(0);
}
</style>
