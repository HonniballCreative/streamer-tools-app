<script>
import { defineComponent } from 'vue';
import Breadcrumbs from './breadcrumbs.vue'

export default defineComponent({
  name: 'AppMenu',

  components: {
    Breadcrumbs,
  }
});
</script>


<template>
  <nav class="navbar navbar-expand fixed-top navbar-light bg-light animate__animated animate__fadeInDown">
    <div class="container-fluid">
      <breadcrumbs />

      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" :href="LINKS.troubleshooting" target="_blank">
            FAQ
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link" :href="LINKS.twitter" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :href="LINKS.youtube" target="_blank">
            <i class="fab fa-youtube"></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>


<style lang="scss">
</style>
