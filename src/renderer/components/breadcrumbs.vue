<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Breadcrumbs',
});
</script>


<template>
  <div class="py-2 mb-0">
    <ol class="breadcrumb m-0">
      <li class="breadcrumb-item">
        <router-link :to="{ name: 'Home' }">
          <i class="fas fa-home"></i>
        </router-link>
      </li>

      <li
        class="breadcrumb-item"
        v-for="route in $route.matched"
        :key="route.name"
      >
        <router-link
          :to="{ name: route.name }"
          :class="[
            'text-decoration-none',
            ($route.fullPath === route.path) ? 'active text-dark cursor-default' : 'text-primary'
          ]"
        >
          {{ route.meta.title }}
        </router-link>
      </li>
    </ol>
  </div>
</template>


<style lang="scss">
</style>
