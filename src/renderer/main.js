import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import routes from '@/router/routes.js'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

import App from './App.vue'

const app = createApp(App);

app.use(router);

app.mount('#app');
