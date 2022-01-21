<script>
import {defineComponent} from 'vue';

export default defineComponent({
  props: ['msg']
});
</script>


<template>
  <div class="app-loader d-flex flex-column align-items-center justify-content-center text-white">
    <img src="/img/Logo-Loader.gif" width="50" height="50" />
    <div class="loader-content lead">{{ msg }}</div>
  </div>
</template>


<style lang="scss">
</style>
