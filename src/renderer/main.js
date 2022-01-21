import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import routes from '@/router/routes.js'

import AppLoader from '@/components/app-loader.vue'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

import App from './App.vue'

import './scss/bootstrap.scss'
import '../../node_modules/animate.css/animate.min.css'

const app = createApp(App);
app.component('app-loader', AppLoader);
app.use(router);

app.mount('#app');
