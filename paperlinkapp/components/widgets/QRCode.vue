<template>
    <div class="text-sm bg-paperdazgreen-400" ref="canvas_XX"></div>
</template>

<script>
export default {
    props: { url: String},
  methods: {
    InitializeQRCode(){
      const qrCode = new QRCodeStyling({
        width: 150,
        height: 150,
        type: "svg",
        data: this.url || "https://paperdaz.com/",
        image: "/icon.png",
        dotsOptions: {
            color: "black",
            type: "rounded"
        },
        backgroundOptions: {
            color: "white",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 5
        }
    });

    qrCode.append(this.$refs.canvas_XX);
    // qrCode.download({ name: "qr", extension: "png" });

    },
  },
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js'
    script.defer = true

    script.addEventListener('load', () => {
      this.InitializeQRCode() // Call your function after the script is loaded
    })
    document.head.appendChild(script);
  },
}
</script>

<style lang="scss" scoped></style>
