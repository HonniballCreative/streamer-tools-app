<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      default: () => {
        return {
          link: {},
          title: {},
          link: {},
          title: {},
          summary: {},
          link: {},
          updated: '',
          'media:thumbnail': {}
        }
      }
    }
  },
});
</script>


<template>
  <div class="card post-card-main border-0 rounded-0 bg-light">
    <a class="card-img-top rounded-0" :href="post.link.href" target="_blank">
      <img
        class="img-fluid"
        :src="post['media:thumbnail'].url"
        :alt="post.title.text"
      >
    </a>

    <div class="card-body d-flex flex-column pt-0">
      <h4 class="mb-1">
        <a class="text-dark text-decoration-none" :href="post.link.href" target="_blank">
          {{ post.title.text }}
        </a>
      </h4>

      <p class="excerpt mb-0">
        {{ post.summary.text }}
      </p>
    </div>

    <div class="card-footer mt-auto bg-light border-0 px-2">
      <a class="btn btn-outline-dark d-block" :href="post.link.href" target="_blank">
        Read More
      </a>
    </div>
  </div>
</template>


<style lang="scss">
</style>
