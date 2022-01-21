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
    <h1 class="animate__animated animate__fadeInUp">Welcome Home!</h1>
    <p class="animate__animated animate__fadeInUp animate__delay-1s">{{msg}}</p>
  </div>
</template>


<style lang="scss">

</style>
