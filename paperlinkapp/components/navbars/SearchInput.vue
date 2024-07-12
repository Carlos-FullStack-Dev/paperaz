<template>
  <div>
    <div v-show="isFocused" class="overlay bg-dark opacity-[0.5]" />
    <div class="z-[22] w-full relative">
      <div class="el-dropdown-link flex align-center">
        <el-input
          placeholder=""
          v-model="searchString"
          size="small"
          class="search-box"
          @blur="onBlurHandle"
          @focus="onClickHandle"
          ref="input"
        >
          <span
            slot="suffix"
            class="grid place-items-center h-full w-full"
            :class="{ 'focused-icon': isFocused }"
            @click="onClickSearchIcon"
          >
            <search-white-icon v-if="isFocused" width="16" height="16" />
            <search-icon v-else width="14" height="14" />
          </span>
        </el-input>
      </div>
    </div>

    <div v-show="isFocused" class="absolute top-[100%] z-[22]">
      <div
        v-if="!loading && !topSearchContent.length"
        class="w-[90vw] lg:w-[40vw] flex justify-center items-center min-h-[200px] bg-white"
      >
        No Paperlink found
      </div>
      <div
        v-if="loading"
        class="w-[90vw] lg:w-[40vw] flex justify-center items-center min-h-[200px] h-full bg-white/80 absolute top-0 left-0 z-10"
      >
        <spinner-dotted-icon height="20" width="20" class="animate-spin" />
      </div>
      <!-- Start:: dropdown -->
      <div
        v-if="!loading && topSearchContent.length"
        class="bg-white rounded-lg whitespace-nowrap w-[90vw] lg:w-[40vw]"
      >
        <div class="max-h-[60vh] custom-scrollbar overflow-y-auto p-2 px-4">
          <article
            class="py-4 text-[#9F9F9F] grid grid-cols-[max-content,1fr,max-content] gap-4 datalist"
            v-for="item in topSearchContent"
            :key="item.id"
          >
            <!-- <img
                :src="
                  (item.user || {}).profile_picture ||
                  '/img/placeholder_picture.png'
                "
                alt=""
                class="h-16 w-16 rounded-2 object-cover"
              /> -->
            <letter-avatar
             @click="$router.push(`/public/profile/${item.userId}`)"
              v-if="!item.user?.profile_picture"
              class="h-16 w-16 rounded-1 object-cover cursor-pointer"
              :username="(item.user || {}).company_name"
            />
            <img
              @click="$router.push(`/public/profile/${item.userId}`)"
              v-else
              class="h-14 w-14 rounded-1 object-cover cursor-pointer" 
              :src="(item.user || {}).profile_picture"
            />

            <div class="overflow-hidden">
              <nuxt-link :to="`/pdf/${item.paperLink}`">
                <p class="text-sm text-black truncate font-semibold">
                  {{ item.fileName }}
                </p>
                <p class="text-xs text-black mb-1 truncate font-semibold">
                  {{ (item.user || {}).company_name }}
                </p>
                <p class="text-[11px] text-black mt-0.5 truncate opacity-50">
                  {{ splittags(item.tags) }}
                </p>
              </nuxt-link>
            </div>
            <SearchShare :showShareIcon="true" :file="item" />
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from 'vue-typed-mixins'
import GlobalMixin from '~/mixins/GlobalMixin'
import login from '@/mixins/login'
import SearchIcon from '../svg-icons/SearchIcon.vue'
import SearchWhiteIcon from '../svg-icons/SearchWhiteIcon.vue'
import SearchShare from '../search-strips/component/SearchShare.vue'
import ballloader from '~/components/loader/ballloader.vue'
import SpinnerDottedIcon from '~/components/svg-icons/SpinnerDottedIcon.vue'
import debounce from '~/types/debounce'
import LetterAvatar from '../widgets/LetterAvatar.vue'

export default mixins(GlobalMixin, login).extend({
  name: 'SearchInput',
  components: {
    SearchIcon,
    SearchWhiteIcon,
    SearchShare,
    ballloader,
    SpinnerDottedIcon,
    LetterAvatar,
  },
  props: {
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onBlurInput', 'onToggle'],
  data() {
    return {
      searchString: '',
      topSearchContent: [],
      isFocused: false,
      loading: false,
      debounceTimeout: null
    }
  },
  computed: {
    payload() {
      return {
        action: 'searchFile',
        query: this.searchString,
      }
    },
    searchResult() {
      if (!this.searchString) return []
      return [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
      ]
    },
  },
  methods: {
    splittags(val) {
      return val
        ?.split(',')
        .map((item) => {
          return `#${item} `
        })
        .join()
    },
    querySearch(_queryString, cb) {
      cb(this.searchResult)
    },
    async getGeneralSearch() {
      this.loading = true

      await this.$axios.post(`/files`, { ...this.payload }).then((response) => {
        const { data } = response.data
        this.topSearchContent = data
        this.loading = false
      })
    },
    onBlurHandle() {
      setTimeout(() => {
        this.isFocused = false
        this.$emit('onBlurInput')
      }, 500)
    },
    onClickHandle() {
      this.isFocused = true
    },
    onClickSearchIcon() {
      this.$refs['input'].focus()
      this.$emit('onToggle')
    },
  },
  watch: {
    isSearch: function (val) {
      if (val) {
        this.$refs['input'].focus()
      }
    },
    payload: function () {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
      this.getGeneralSearch()
      }, 500);
    },
    item(val) {
      console.log(val)
    },
    ['topSearchContent.length']: function (val) {
      if (val > 0) {
        window.scrollTo(0, window.scrollY + 1)
        setTimeout(function () {
          window.scrollTo(0, window.scrollY - 1)
        }, 200)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 21;
  pointer-events: none;
  transition: all ease-in-out 200ms;
}
.focused-icon {
  @apply bg-paperdazgreen-300;
  border-radius: 8px;
  width: 40px;
}
.datalist {
  @apply border-b-2 border-b-gray-200;
}
.datalist:nth-last-child(1) {
  @apply border-b-0 border-b-transparent;
}
</style>
