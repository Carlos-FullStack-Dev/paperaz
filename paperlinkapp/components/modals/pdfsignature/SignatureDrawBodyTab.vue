<template>
  <div class="grid place-items-center">
    <div class="w-full mx-auto bg-white rounded">
      <canvas
        ref="signatureCanvas"
        class="border h-56 border-[#C4C4C4] w-full rounded"
      ></canvas>
    </div>
  </div>
</template>

<script>
import mixins from 'vue-typed-mixins'
import SignatureBodyMixin from '~/mixins/SignatureBodyMixin'
import SignaturePad from 'signature_pad'
export default mixins(SignatureBodyMixin).extend({
  name: 'SignatureDrawBodyTab',
  data() {
    return {
      signaturePad: undefined,
    }
  },
  mounted() {
    this.setupCanvases()
  },
  methods: {
    async setupCanvases() {
      await this.$nextTick()
      const canvas = this.$refs.signatureCanvas

      if (!canvas) return

      this.signaturePad = new SignaturePad(canvas, {
        minWidth: 2,
        maxWidth: 5,
      })

      window.addEventListener('resize', this.resizeCanvas)
      this.resizeCanvas()
    },
    async resizeCanvas() {
      await this.$nextTick()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const canvas = this.$refs.signatureCanvas 

      if (!canvas) return

      canvas.width = canvas.offsetWidth * 1
      canvas.height = canvas.offsetHeight * 1
      canvas.getContext('2d')?.scale(1, 1)
    },
    clear() {
      if (!this.signaturePad) return
      this.signaturePad.clear()
    },
    exportImage() {
      this.$emit('export-image', this.getImage())
    },
    getImage() {
      if (!this.signaturePad) return
      const canvas = this.$refs.signatureCanvas 

      const trimmedCanvas = this.trimCanvas(canvas)
      
      if(!trimmedCanvas) return
      return canvas.toDataURL()
    }
  },
  beforeDestroy() {
    try {
      window.removeEventListener('resize', this.resizeCanvas)
    } catch (e) {}
  },
})
</script>
