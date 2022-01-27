import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { loadPreferences, appVersion } from '@/electron'

import routes from '@/router/routes.js'

const app = createApp(App);

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})
app.use(router);

import App from './App.vue'

const uiPrefs = loadPreferences('ui')
app.config.globalProperties.UI_PREFERENCES = uiPrefs
app.config.globalProperties.APP_VERSION = appVersion

app.config.globalProperties.LINKS = {
  troubleshooting: 'https://streameredu.com/troubleshooting-and-tips',
  twitter: 'https://twitter.com/StreamerEdu',
  youtube: 'https://www.youtube.com/channel/UCif1IkNaiXd2xe0G_tz1F2w',
  kofi: 'https://ko-fi.com/streamerific',
}


import AppLoader from '@/components/app-loader.vue'
app.component('app-loader', AppLoader);

app.mount('#app');
