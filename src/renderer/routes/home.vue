<script>
import { defineComponent } from 'vue'
import { loadBlogPosts, loadUpdatePost } from '@/electron'

import PostCard from '@/components/post-card.vue'

export default defineComponent({
  components: {
    PostCard,
  },

  data() {
    const blogPosts = loadBlogPosts()
    const updatePost = loadUpdatePost()
    return {
      loadingBlogPosts: false,
      blogPosts: blogPosts,
      updatePost: updatePost,

      tools: [
        {
          icon: 'fas fa-film',
          title: 'Video Randomizer',
          route: 'VideoRandomizerIndex',
          btn_text: 'Configure',
          img: 'img/tools/video-randomizer.png',
        },
        {
          icon: 'fas fa-text-width',
          title: 'Text Animator',
          link: 'https://streameredu.com/obs-studio-text-animator',
          img: 'img/tools/text-animator.png',
        },
        {
          icon: 'fas fa-image',
          title: 'Image Animator',
          link: 'https://streameredu.com/obs-studio-image-animator',
          img: 'img/tools/image-animator.png',
        },
        {
          icon: 'far fa-stopwatch',
          title: 'Countdown Timer',
          link: 'https://streameredu.com/obs-studio-countdown-timer',
          img: 'img/tools/countdown-timer.png',
        },
        {
          icon: 'far fa-clock',
          title: 'Countdown to Time',
          link: 'https://streameredu.com/obs-studio-countdown-to-time',
          img: 'img/tools/countdown-to-time.png',
        },
        {
          icon: 'fab fa-youtube',
          title: 'YouTube Playlist Randomizer',
          link: 'https://streameredu.com/obs-studio-youtube-playlist-randomizer',
          img: 'img/tools/youtube-playlist-randomizer.png',
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
        const updatePost = loadUpdatePost()
        this.blogPosts = blogPosts
        this.updatePost = updatePost
        this.loadingBlogPosts = false
      }, 1000)
    }
  }
});
</script>


<template>
  <div class="component-container">
    <h1>Streamer Tools!</h1>
    <p class="lead fw-normal">Streamer Tools are a collection of OBS Studio helpers that simplify the process of creating various features for your live stream. Please follow us on <a class="text-decoration-none" :href="LINKS.twitter" target="_blank">@StreamerEdu</a> on Twitter for all updates regarding new tools and products.</p>

    <p class="lead fw-normal">I plan on making plenty of other tools for streamers. All the tools that I create will <strong>always be FREE</strong>!</p>

    <a :href="LINKS.kofi" target="_blank">
      <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Support Development on Ko-fi">
    </a>

    <div class="spacer" style="height: 50px;"></div>

    <template v-if="updatePost">
      <h1 class="border-bottom py-2"><i class="fas fa-file-upload text-primary"></i> App Update Available!</h1>
      <p class="lead fw-normal">A new version is available for download. You are running verson: <span class="text-danger fw-bold">{{ APP_VERSION }}</span></p>

      <div class="card text-dark bg-light mb-3 border-0">
        <div class="card-body">
          <div class="d-flex">
            <div class="align-self-center flex-grow-1">
              <h2 class="mb-3">
                <a class="text-dark text-decoration-none" :href="updatePost.link.href">
                  {{ updatePost.title.text }}
                </a>
              </h2>
              <p class="mb-3 lead">
                {{ updatePost.summary.text }}
              </p>

              <a class="btn btn-danger" :href="updatePost.link.href" target="_blank">
                Get Update!
              </a>
            </div>

              <img
                class="img-fluid h-100 d-none d-md-inline-block w-25"
                :src="updatePost['media:thumbnail'].url"
                :alt="updatePost.title.text"
              >
          </div>
        </div>
      </div>
    </template>

    <h1 class="border-bottom py-2"><i class="fas fa-tools text-primary"></i> Tools</h1>

    <div class="row d-flex flex-wrap">
      <div
        class="col-12 col-md-6 col-lg-4 mb-3 d-flex align-items-stretch justify-content-around"
        v-for="tool in tools"
        :key="tool.route"
      >
        <router-link
          class="text-center d-block"
          :to="{ name: tool.route }"
          v-if="tool.btn_text"
        >
          <img :src="tool.img" class="img-fluid rounded" :alt="tool.title">
        </router-link>
        <a
          class="position-relative text-center d-block"
          target="_blank"
          :href="tool.link"
          :to="{ name: tool.route }"
          v-if="tool.link"
        >
          <img :src="tool.img" class="img-fluid rounded" :alt="tool.title">
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
      <div class="card text-dark bg-info bg-opacity-10">
        <div class="card-body text-center">
          <h5 class="card-title"><i class="far fa-bullhorn"></i> No Announcements!</h5>
          <p class="card-text">We have no announcements to share. Enjoy the tools!</p>
        </div>
      </div>
    </div>

    <div class="spacer" style="height: 50px;"></div>
  </div>
</template>


<style lang="scss">

</style>
