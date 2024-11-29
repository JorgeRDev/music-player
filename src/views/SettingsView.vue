<script setup lang="ts">
import ThemeSetting from "../components/settings/Theme.vue"
import MusicLocationSetting from "../components/settings/MusicLocation.vue"
</script>

<template>
  <div class="settings-container">
    <div class="view-header">
      <h2 class="f:36">Settings</h2>
    </div>
    <div class="settings-content">
      <ThemeSetting />
      <MusicLocationSetting />
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-content {
  border-radius: 1rem 0 0 0;
  background-color: var(--color-background-soft);
  width: 100%;
  padding: 2% 2% 2% 4%;
  flex-grow: 1;
  overflow-y: scroll;
  scrollbar-width: thin;
}
</style>
