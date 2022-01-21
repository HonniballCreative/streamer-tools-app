<template>
  <div id="app" class="conatiner-fluid">
    <app-loader v-if="loading" id="main-app-loader" msg="Loading Application" />
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ipcRenderer } from '@/electron';

export default defineComponent({
  name: 'app',
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    ipcRenderer.send('message', 'Hello from App.vue!');
  }
});
</script>

<style lang="scss">
@import "scss/bootstrap.scss";
</style>
