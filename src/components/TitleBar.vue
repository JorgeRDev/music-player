<script setup lang="ts">
import DarkToggleButton from "./ThemeToggleButton.vue"

import IconVue from "./icons/IconVue.vue"
</script>

<template>
  <div class="title-bar">
    <p class="ml:1rem font-color:$(color-text) font-weight:normal">
      Media Player
    </p>
  </div>
  <!-- <header
    class="position:sticky top:40px justify-content:space-between width:100%"
  >
    <div class="display:flex margin:1rem|2rem">
      <IconVue />
      <div class="margin-left:1rem">
        <h1 class="color:gray-90@dark">{{ title }}</h1>
        <p class="font-weight:600 color:gray-48">{{ version }}</p>
      </div>
    </div>
    <DarkToggleButton class="margin:0|2rem" />
  </header> -->
</template>

<style scoped>
.title-bar {
  display: flex;
  flex-direction: column;
  align-items: start;
  place-content: center;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;

  min-height: 5rem;
}

svg {
  height: 5rem;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
}
</style>
