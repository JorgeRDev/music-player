import { createApp, computed, ref, Ref, readonly, nextTick, watch } from "vue";
import { ipcRenderer } from "electron/renderer";
import { shell } from "electron/common";
import "@master/css";

import "./assets/styles/styles.css";

import App from "./App.vue";
import router from "./router";

const htmlClassList = computed(() => document.documentElement.classList);
const storagedTheme = window.localStorage.getItem("theme");
const theme: Ref<"light" | "dark" | "system" | undefined> = ref(undefined);
const updateTheme = (value: "light" | "dark" | "system") => {
  if (value) {
    theme.value = value;
  }
};

const isDark = computed(
  () =>
    theme.value === "dark" ||
    (!theme.value && window.matchMedia("(prefers-color-scheme: dark)").matches)
);

if (storagedTheme != null) {
  if (storagedTheme === "light") {
    theme.value = "light";
  } else if (storagedTheme === "dark") {
    theme.value === "dark";
  } else {
    theme.value === "system";
  }
} else {
  htmlClassList.value.toggle("light", !isDark.value);
  htmlClassList.value.toggle("dark", isDark.value);
}

/* 
  
  if (!storagedTheme.value) {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
    
    app.provide('htmlClassList', htmlClassList)
    app.provide('storagedTheme', storagedTheme)
    app.provide('isDark', isDark) */

const app = createApp(App);
app.use(router);
app.mount("#app");

/* nextTick(() => {
      // Use contextBridge
      window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
      })
    }) */

app.provide("theme", readonly(theme));
app.provide("updateTheme", updateTheme);

document.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === "+" || event.key === "-")
  ) {
    event.preventDefault();
  }
});
