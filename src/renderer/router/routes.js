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
      title: 'Welcome',
    }
  },
  {
    name: 'VideoRandomizer',
    component: SimpleRouter,
    path: '/video-randomizer',
    redirect: { name: 'VideoRandomizerIndex' },
    meta: {
      title: 'Video Randomizer',
    },
    children: [
      {
        component: VideoRandomizerIndex,
        name: 'VideoRandomizerIndex',
        path: 'index',
        meta: {
          title: 'Welcome',
        }
      },
      {
        component: VideoRandomizerCreate,
        name: 'VideoRandomizerCreate',
        path: 'create',
        meta: {
          title: 'Create New Randomizer',
        }
      },
    ]
  },
]
