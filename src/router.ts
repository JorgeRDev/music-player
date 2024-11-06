import { createWebHashHistory, createRouter } from 'vue-router'

import MusicView from './views/MusicView.vue'
import SettingsView from './views/SettingsView.vue'

const routes = [
    { path: '/', component: MusicView},
    {path: '/settings', component: SettingsView}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router