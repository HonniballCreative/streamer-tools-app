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
    <p class="display-6">Thanks for downloading Streamerific Tools!</p>

    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title"><i class="fas fa-film"></i> Video Randomizer Tool</h5>
        <p class="card-text">Create browser source compatible files to pick a random video from a list of files that you choose!</p>
        <router-link :to="{ name: 'VideoRandomizerIndex' }" class="d-block btn btn-primary">Configure</router-link>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>
