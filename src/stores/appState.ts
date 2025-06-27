import {defineStore} from "pinia";
import {IAppState} from "../models/stores/appState.ts";
import {computed, onMounted, Ref, ref} from "vue";

export const useAppState = defineStore('appState', (): IAppState => {
    const fullscreen: Ref<boolean> = ref(false)

    window.App.FullScreen.onFullScreen((isFullScreen) => fullscreen.value = isFullScreen)

    return {
        fullscreen
    }
})
