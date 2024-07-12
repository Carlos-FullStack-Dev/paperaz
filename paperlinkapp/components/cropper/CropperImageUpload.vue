<template>
  <div>
    <ballloader v-show="imageUpload" />
    <el-dialog
      :visible.sync="show"
      id="profile-image-cropper"
      title="Profile Image"
      :width="width"
      :before-close="() => $emit('visibleDialog', false)"
    >
      <div>
        <div class="upload-example__cropper-wrapper">
          <cropper
            ref="cropper"
            class="upload-example__cropper"
            :stencil-size="{
              width: 140,
              height: 140,
            }"
            :stencil-props="{
              handlers: {},
              movable: false,
              resizable: false,
              aspectRatio: 1,
            }"
            :transitions="true"
            image-restriction="stencil"
            :default-boundaries="boundaries"
            :src="image.src"
            @change="updateSize"
          />
          <vertical-buttons>
            <square-button title="Zoom In" @click="zoom(2)">
              <img :src="require('~/assets/icons/zoom-in.svg')" />
            </square-button>
            <square-button title="Zoom Out" @click="zoom(0.5)">
              <img :src="require('~/assets/icons/zoom-out.svg')" />
            </square-button>
            <square-button title="Move Top" @click="move('top')">
              <img :src="require('~/assets/icons/arrow-top.svg')" />
            </square-button>
            <square-button title="Move Left" @click="move('left')">
              <img :src="require('~/assets/icons/arrow-left.svg')" />
            </square-button>
            <square-button title="Move Right" @click="move('right')">
              <img :src="require('~/assets/icons/arrow-right.svg')" />
            </square-button>
            <square-button title="Move Bottom" @click="move('bottom')">
              <img :src="require('~/assets/icons/arrow-bottom.svg')" />
            </square-button>
          </vertical-buttons>
          <div
            class="upload-example__reset-button"
            title="Reset Image"
            @click="reset()"
          >
            <img :src="require('~/assets/img/reset.svg')" />
          </div>
          <div class="upload-example__file-type" v-if="image.type">
            {{ image.type }}
          </div>
        </div>
        <div class="upload-example__buttons-wrapper">
          <button class="upload-example__button" @click="$refs.file2.click()">
            <input
              ref="file2"
              type="file"
              accept="image/*"
              @change="loadImage($event)"
            />
            Browse image
          </button>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('visibleDialog', false)">Cancel</el-button>
          <el-button type="primary" @click="saveImage"> Upload </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style src="~/assets/cropper.css">

</style>

<script>
import login from '~/mixins/login'
import mixins from 'vue-typed-mixins'
import { Cropper } from 'vue-advanced-cropper';
import VerticalButtons from './VerticalButtons';
import SquareButton from './SquareButton';
import ballloader from '../loader/ballloader.vue'

export default mixins(login).extend({
  name: 'cropper-image-upload',
  components: {
    Cropper,
    VerticalButtons,
    SquareButton,
    ballloader
  },
  data() {
    return {
      dialogVisible: false,
      imageUpload: false,
      image: {
        src: null,
        type: null,
      },
      size: {
        width: null,
        height: null,
      },
      windowWidth: 0,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['visibleDialog'],
  mounted() {
  },
  created() {
    this.windowWidth = window.innerWidth
    window.addEventListener("resize", this.onWindowResizeHandle);
  },
  destroyed() {
    window.removeEventListener("resize", this.onWindowResizeHandle);
  },
  methods: {
    boundaries({ cropper, imageSize }) {
      return {
        width: cropper.clientWidth,
        height: cropper.clientHeight,
      };
    },
    updateSize({ coordinates }) {
      this.size.width = Math.round(coordinates.width);
      this.size.height = Math.round(coordinates.height);
    },
    saveImage () {
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob((blob) => {
        this.uploadProfilePicture(blob);
      }, this.image.type);
    },
    async uploadProfilePicture(image) {
      this.imageUpload = true;
      let formdata = new FormData()
      formdata.append('upload', image, 'user-profile-picture.jpg')
      formdata.append('type', 'profilePicture')
      formdata.append('userId', this.user.id)
      await this.$axios
        .$patch(`/files`, formdata)
        .then((response) => {
          //@ts-ignore
          this.$emit('visibleDialog', false)
          this.imageUpload = false
          this.reset()
          this.filterUsers()
        })
        .catch((err) => {
          console.log({err})
          this.imageUpload = false;
          this.$notify.error({
            message: 'Unable to upload profile picture'
          })
        })
    },
    loadImage(event) {
      const { files } = event.target;
      if (files && files[0]) {
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        const blob = URL.createObjectURL(files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = {
            src: blob,
            type: this.getMimeType(e.target.result, files[0].type),
          };
        };
        reader.readAsArrayBuffer(files[0]);
      }
    },
    zoom(factor) {
      this.$refs.cropper.zoom(factor);
    },
    move(direction) {
      if (direction === 'left') {
        this.$refs.cropper.move(-this.size.width / 4);
      } else if (direction === 'right') {
        this.$refs.cropper.move(this.size.width / 4);
      } else if (direction === 'top') {
        this.$refs.cropper.move(0, -this.size.height / 4);
      } else if (direction === 'bottom') {
        this.$refs.cropper.move(0, this.size.height / 4);
      }
    },
    reset() {
      this.image = {
        src: null,
        type: null,
      };
      const input = this.$refs.file2
      input.type = 'text'
      input.type = 'file'
    },
    getMimeType(file, fallback = null) {
      const byteArray = new Uint8Array(file).subarray(0, 4);
      let header = '';
      for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          return 'image/png';
        case '47494638':
          return 'image/gif';
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          return 'image/jpeg';
        default:
          return fallback;
      }
    },
    onWindowResizeHandle (event) {
      this.windowWidth = event.target.innerWidth
    }
  },
  computed: {
    user() {
      return this.$auth?.user
    },
    width() {
      return this.windowWidth > 800 ? '50%' : '90%'
    }
  },
})
</script>