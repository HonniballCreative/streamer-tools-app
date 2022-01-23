<script>
import { defineComponent } from 'vue'
import { loadBlogPosts } from '@/electron'

import PostCard from '@/components/post-card.vue'

export default defineComponent({
  components: {
    PostCard
  },

  data() {
    const blogPosts = loadBlogPosts()
    return {
      loadingBlogPosts: false,
      blogPosts: blogPosts,

      tools: [
        {
          icon: 'fas fa-film',
          title: 'Video Randomizer',
          summary: 'Create browser source compatible files to pick a random video from a list of files that you choose!',
          route: 'VideoRandomizerIndex',
          btn_text: 'Configure',
          img: '/img/tools/video-randomizer.png',
        },
        {
          icon: 'fas fa-text-width',
          title: 'Text Animator',
          summary: 'Text animations made simple! Configure with an online form, copy the URL, and paste into an OBS Browser source.',
          link: 'https://streameredu.com/obs-studio-text-animator',
          img: '/img/tools/text-animator.png',
        },
        {
          icon: 'fas fa-image',
          title: 'Image Animator',
          summary: 'Image animations made simple! Configure with an online form, copy the URL, and paste into an OBS Browser source.',
          link: 'https://streameredu.com/obs-studio-image-animator',
          img: '/img/tools/image-animator.png',
        },
        {
          icon: 'far fa-stopwatch',
          title: 'Countdown Timer',
          summary: 'Stream countdown timer made simple! Configure with an online form, copy the URL, and paste into an OBS Browser source.',
          link: 'https://streameredu.com/obs-studio-countdown-timer',
          img: '/img/tools/countdown-timer.png',
        },
        {
          icon: 'far fa-clock',
          title: 'Countdown to Time',
          summary: 'Stream countdown to a spacific time made simple! Configure with an online form, copy the URL, and paste into an OBS Browser source.',
          link: 'https://streameredu.com/obs-studio-countdown-to-time',
          img: '/img/tools/countdown-to-time.png',
        },
        {
          icon: 'fab fa-youtube',
          title: 'YouTube Playlist Randomizer',
          summary: 'Randomize any public YouTube playlist for your stream! Configure with an online form, copy the URL, and paste into an OBS Browser source.',
          link: 'https://streameredu.com/obs-studio-youtube-playlist-randomizer',
          img: '/img/tools/youtube-playlist-randomizer.png',
        },
      ]
    }
  },

  methods: {
    refreshBlogPosts(){
      if(this.loadingBlogPosts) return
      this.loadingBlogPosts = true
      setTimeout(() => {
        const blogPosts = loadBlogPosts()
        this.blogPosts = blogPosts
        this.loadingBlogPosts = false
      }, 1000)
    }
  }
});
</script>


<template>
  <div class="component-container">
    <h1>Streamerific Tools!</h1>
    <p class="lead fw-normal">Streamerific tools are a collection of OBS Studio helpers that simplify the process of creating various features for your live stream. Please follow us on <a class="text-decoration-none" :href="LINKS.twitter" target="_blank">@Streamerific</a> on Twitter for all updates regarding new tools and products.</p>

    <h1 class="border-bottom py-2"><i class="fas fa-tools text-primary"></i> Tools</h1>

    <div class="blog-posts row d-flex flex-wrap" v-if="blogPosts.length > 0">
      <div
        class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch mb-3"
        v-for="tool in tools"
        :key="tool.route"
      >
        <router-link
          :to="{ name: tool.route }"
          v-if="tool.btn_text"
        >
          <img :src="tool.img" class="rounded" :alt="tool.title">
        </router-link>
        <a
          class="position-relative"
          target="_blank"
          :href="tool.link"
          :to="{ name: tool.route }"
          v-if="tool.link"
        >
          <img :src="tool.img" class="rounded" :alt="tool.title">
          <div class="position-absolute bottom-0 end-0">
            <div class="rounded bg-black text-white bg-opacity-75 px-3 py-1 mb-2 me-2">
              <small>Opens in Browser <i class="fas fa-external-link"></i></small>
            </div>
          </div>
        </a>
      </div>
    </div>

    <h1 class="border-bottom py-2">
      <i class="fas fa-bullhorn text-primary me-2"></i> Announcements &amp; News
      <span class="float-end pt-1">
        <i
          :class="[
            'fas fa-sync fa-fw text-primary cursor-pointer fsp-60',
            (loadingBlogPosts) ? 'fa-spin' : ''
          ]"
          @click="refreshBlogPosts"
        ></i>
      </span>
    </h1>

    <div class="blog-posts row d-flex flex-wrap" v-if="blogPosts.length > 0">
      <div
        class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch mb-3"
        v-for="post in blogPosts"
        :key="post.id"
      >
        <post-card :post="post" />
      </div>
    </div>
    <div class="no-posts" v-else>
      None...
    </div>
  </div>
</template>


<style lang="scss">

</style>
