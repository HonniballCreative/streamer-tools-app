<script>
import {defineComponent} from 'vue';

export default defineComponent({
  data() {
    return {
      msg: 'You\'re at the home page!'
    }
  }
});
</script>


<template>
  <div class="component-container">
    <h1 class="animate__animated animate__fadeInUp"><i class="fas fa-pencil"></i> Welcome Home!</h1>
    <p class="animate__animated animate__fadeInUp animate__delay-1s">{{msg}}</p>

    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Video Randomizer</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <router-link to="/video-randomizer" class="btn btn-primary">Configure</router-link>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>
