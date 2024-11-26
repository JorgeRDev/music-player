<script setup lang="ts">
import MusicIcon from "./icons/MusicIcon.vue"
</script>

<template>
  <div class="menu">
    <RouterLink to="/" class="menu-link">
      <div class="aspect:1/1 h:1rem">
        <MusicIcon />
      </div>
      <span>Music Library</span>
    </RouterLink>
    <RouterLink to="/settings" class="menu-link">
      <div class="aspect:1/1 bg:rgba(107,106,109,0.247) h:1rem"></div>
      <span>Settings</span>
    </RouterLink>
    <RouterLink to="/playlists" class="menu-link">
      <div class="aspect:1/1 bg:rgba(107,106,109,0.247) h:1rem"></div>
      <span>Playlist</span>
    </RouterLink>
  </div>
</template>

<style>
.menu {
  display: none;
}

@media (min-height: 175px) {
  .menu {
    display: flex;
    flex-direction: column;
    place-content: center;
    padding: 0.5rem 0.5rem;
    overflow-x: hidden;
  }
}

.menu-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 0.3rem;
}

.router-link-active {
  background-color: rgba(48, 48, 48, 0.1);
  color: var(--color-text);
  font-weight: 500;
}
</style>
