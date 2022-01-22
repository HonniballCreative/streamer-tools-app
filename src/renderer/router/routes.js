import Home from '@/routes/home.vue'
import VideoRandomizer from '@/routes/video-randomizer.vue'

export default [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'VideoRandomizer',
    path: '/video-randomizer',
    component: VideoRandomizer
  },
]
