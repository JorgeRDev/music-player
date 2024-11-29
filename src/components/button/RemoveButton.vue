<script setup lang="ts">
import RemoveIcon from "../icons/RemoveIcon.vue"
</script>

<template>
  <button class="fluent-button">
    <RemoveIcon />
  </button>
</template>

<style scoped>
.fluent-button {
  background-color: var(--color-ui-background);
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  border: 1px solid #e5e5e5;
  aspect-ratio: 1/1;
  height: 2rem;
}

.fluent-button:hover {
  background-color: var(--color-ui-background-hover);
}
</style>
