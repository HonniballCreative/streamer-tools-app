<script>
import {defineComponent} from 'vue';

export default defineComponent({
  data() {
    return {}
  }
});
</script>


<template>
  <div class="component-container">
    <p class="animate__animated animate__fadeIn">Thanks for downloading Streamerific Tools!</p>

    <div class="card animate__animated animate__fadeIn animate__delay-1s" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Video Randomizer</h5>
        <p class="card-text">This tool allows you to have a randomly selected video play when you switch to a scene or hide/show the controlling browser source in OBS Studio</p>
        <router-link to="/video-randomizer" class="btn btn-primary">Configure</router-link>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>
