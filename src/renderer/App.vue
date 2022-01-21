<template>
  <div id="app" class="conatiner-fluid">
    <app-loader msg="Loading Application" />
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ipcRenderer } from '@/electron';


export default defineComponent({
  name: 'app',
  components: {},
  setup() {
    ipcRenderer.send('message', 'Hello from App.vue!');
  },
});
</script>

<style lang="scss">
@import "scss/bootstrap.scss";
</style>
