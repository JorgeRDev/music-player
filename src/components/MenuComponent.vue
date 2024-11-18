<template>
  <div class="flex flex:column px:0.5rem overflow-x:hidden">
    <RouterLink to="/" class="menu-link">
      <div class="aspect:1/1 bg:rgba(107,106,109,0.247) h:1rem"></div>
      <span>Music Library</span>
    </RouterLink>
    <RouterLink to="/settings" class="menu-link">
      <div class="aspect:1/1 bg:rgba(107,106,109,0.247) h:1rem"></div>
      <span>Settings</span>
    </RouterLink>
    <RouterLink to="/playlist" class="menu-link">
      <div class="aspect:1/1 bg:rgba(107,106,109,0.247) h:1rem"></div>
      <span>Playlist</span>
    </RouterLink>
  </div>
</template>

<style>
.menu-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 0.3rem;
}

.router-link-active {
  background-color: rgba(48, 48, 48, 0.1);
  color: var(--color-text);
  font-weight: 500;
}
</style>
