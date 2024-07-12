<template>
    <div>
      <h1>hello</h1>
      <draggable v-model="myArray">
        <transition-group>
            <div class="bg-red-500 py-4 my-1" v-for="element in [1,2,3,4,5]" :key="element">
                {{element}}
            </div>
        </transition-group>
    </draggable>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
    export default {
        name: 'TestPage',
       layout: 'dashboard',
       components: {draggable}
    }
</script>

<style lang="scss" scoped>

</style>