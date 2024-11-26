import { createWebHashHistory, createRouter } from "vue-router"

import MusicView from "./views/MusicView.vue"
import SettingsView from "./views/SettingsView.vue"
import PlaylistsView from "./views/PlaylistsView.vue"

const routes = [
  { path: "/", component: MusicView },
  { path: "/settings", component: SettingsView },
  { path: "/playlists", component: PlaylistsView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
