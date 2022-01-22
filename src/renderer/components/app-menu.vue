<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppMenu',

  data(){
    return {}
  }
});
</script>


<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Streamerific Tools</router-link>
    </div>
  </nav>
</template>


<style lang="scss">
</style>
