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
    <h1>Welcome Home!</h1>
    <p>{{msg}}</p>
  </div>
</template>


<style lang="scss">

</style>
