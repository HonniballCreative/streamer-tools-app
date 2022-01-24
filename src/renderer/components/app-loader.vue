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
.app-loader {
  z-index: 9999999999;
  position: fixed !important;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: rgba(black, .7);
}
</style>
