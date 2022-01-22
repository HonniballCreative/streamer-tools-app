import SimpleRouter from '@/components/simple-router.vue'

import Home from '@/routes/home.vue'

import VideoRandomizerIndex from '@/routes/video-randomizer/index.vue'
import VideoRandomizerCreate from '@/routes/video-randomizer/create.vue'

export default [
  {
    component: Home,
    name: 'Home',
    path: '/',
    meta: {
      headerTitle: 'home',
    }
  },
  {
    component: SimpleRouter,
    path: '/video-randomizer',
    children: [
      {
        component: VideoRandomizerIndex,
        name: 'VideoRandomizer',
        path: 'index',
        meta: {
          headerTitle: 'Video Randomizer',
        }
      },
      {
        component: VideoRandomizerCreate,
        name: 'VideoRandomizerCreate',
        path: 'create',
        meta: {
          headerTitle: 'Create New Video Randomizer',
        }
      },
    ]
  },
]
