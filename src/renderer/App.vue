<template>
  <div class="app-container pt-5">
    <app-loader v-if="loading" id="main-app-loader" msg="Loading Application" />

    <app-menu />

    <div class="container-fluid pt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ipcRenderer } from '@/electron';

import AppMenu from './components/app-menu.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppMenu
  },
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    this.loading = false
  }
});
</script>

<style lang="scss">
</style>
