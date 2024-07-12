<template>
  <div
    class="bg-[#EFEFEF] rounded-[2rem] lg:rounded-lg items-center justify-between px-2 py-1 w-[100px] flex lg:w-[120px]"
  >
    <button @click="onSub" class="text-[#222529] text-[1rem]">-</button>

    <input
      class="!w-full mx-2 text-center px-1 py-1 text-[0.8rem] min-w-[20px] focus:border-0 rounded-md"
      type="text"
      v-model="numericInput"
      @input="handleInput"
      @keydown="preventUpDownArrow"
    />

    <button @click="onAdd" class="text-[#222529] text-[1rem]">+</button>
  </div>
</template>

<script>
export default {
  name: "AddInput",
  data() {
    return {
      numericInput: "1",
    };
  },
  props: {
    onchange: {
      type: Function,
      required: true,
    },
    max: {
      type: Number,
      required: false,
      default: 20,
    },
  },
  mounted() {},
  methods: {
    onAdd() {
      if (this.max === Number(this.numericInput)) return null;
      this.numericInput = Number(this.numericInput) + 1;
      this.onchange(Number(this.numericInput));
    },
    onSub() {
      if (this.numericInput == 1) return null;
      this.numericInput = Number(this.numericInput) - 1;
      this.onchange(Number(this.numericInput));
    },
    handleInput() {
      // Remove non-numeric characters
      this.numericInput = this.numericInput.replace(/[^0-9]/g, "");
      this.onchange(Number(this.numericInput));
    },
    preventUpDownArrow(event) {
      // Prevent the up and down arrow keys from changing the value
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
