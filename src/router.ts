import { createWebHashHistory, createRouter } from "vue-router";

import MusicView from "./views/MusicView.vue";
import SettingsView from "./views/SettingsView.vue";
import PlaylistView from "./views/PlaylistView.vue";

const routes = [
  { path: "/", component: MusicView },
  { path: "/settings", component: SettingsView },
  { path: "/playlist", component: PlaylistView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
