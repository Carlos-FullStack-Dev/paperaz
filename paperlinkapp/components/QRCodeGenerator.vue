<template>
  <div>
    <canvas ref="canvas" width="200" height="200" class="object-contain rounded-[20px]" />
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: {
    url: {
      type: String,
    },
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    childFunction() {
      var canvas = this.$refs.canvas;
      var anchor = document.createElement("a");
      anchor.href = canvas?.toDataURL("image/png");
      anchor.download = "Paperdaz-QR-IMAGE.PNG";
      anchor.click();
    },
    generateQRCode() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Generate the QR code
      QRCode.toCanvas(canvas, this.url, (error) => {
        if (error) console.error(error);
        else {
          // Load the logo image
          const logo = new Image();
          logo.src = require("../assets/icons/paper_icon.svg"); // Change the path to your logo

          // When the logo image is loaded, add it to the QR code
          logo.onload = () => {
            const logoSize = canvas.width * 0.4; // Adjust the logo size
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            context.drawImage(logo, x, y, logoSize, logoSize);
          };
        }
      });
    },
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
</style>
