import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import routes from '@/router/routes.js'

import AppLoader from '@/components/app-loader.vue'

import { loadPreferences, appVersion } from '@/electron'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

import './scss/bootstrap.scss'
import '../../node_modules/animate.css/animate.min.css'

import App from './App.vue'

const app = createApp(App);

const uiPrefs = loadPreferences('ui')
app.config.globalProperties.UI_PREFERENCES = uiPrefs
app.config.globalProperties.APP_VERSION = appVersion

app.config.globalProperties.LINKS = {
  troubleshooting: 'https://streameredu.com/troubleshooting-and-tips',
  twitter: 'https://twitter.com/StreamerEdu',
  youtube: 'https://www.youtube.com/channel/UCif1IkNaiXd2xe0G_tz1F2w',
}

app.component('app-loader', AppLoader);
app.use(router);

app.mount('#app');
