<script setup lang="ts">
import { ref, Ref, inject, watch } from "vue"
const theme: Ref<"light" | "dark" | "system"> = inject("theme", ref("system"))

const updateTheme = inject(
  "updateTheme",
  (value: "light" | "dark" | "system") => {
    if (value != undefined) {
      theme.value = value
    }
  },
)

const selected: Ref<"light" | "dark" | "system" | undefined> = ref(theme.value)

watch(selected, () => {
  if (selected.value != undefined) {
    updateTheme(selected.value)
  }
})
</script>

<template>
  <div class="option">
    <section>Theme</section>
    <label for="Theme">Theme:</label>
    <select v-model="selected">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  </div>
</template>
