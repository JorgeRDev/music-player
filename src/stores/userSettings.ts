import { defineStore} from "pinia"
import {IUserSettings} from "../models/stores/userSettings.ts";
import {Ref, ref, toRaw} from "vue";

export const useUserSettings = defineStore('userSettings', (): IUserSettings => {
    const musicDirectories: Ref<string[]> = ref([])
    const theme: Ref<"light" | "dark" | "system"> = ref("system")
    const language: Ref< "en" | "es" > = ref("en")

    const loadConfiguration = async () => {
        console.log('loading configuration')
        const {musicDirectories: _musicDirectories, theme: _theme, language: _language} = await window.App.Configuration.readConfiguration()
        musicDirectories.value = _musicDirectories
        theme.value = _theme
        language.value = _language
    }

    const saveConfiguration = async () => {
        await window.App.Configuration.saveConfiguration({musicDirectories: toRaw(musicDirectories.value), language: toRaw(language.value), theme: toRaw(theme.value)})
    }

    const addMusicDirectory = async (directory: string) => {
        console.log('adding music directory: ' + directory)
        musicDirectories.value.push(directory)

        await window.App.Configuration.saveConfiguration({musicDirectories: toRaw(musicDirectories.value), language: toRaw(language.value), theme: toRaw(theme.value)})
    }

    const removeMusicDirectory = async (directory: string) => {
        musicDirectories.value.splice(musicDirectories.value.indexOf(directory), 1)
        await window.App.Configuration.saveConfiguration({musicDirectories: toRaw(musicDirectories.value), language: toRaw(language.value), theme: toRaw(theme.value)})
    }

    return ({
        musicDirectories,
        theme,
        language,
        loadConfiguration,
        saveConfiguration,
        addMusicDirectory,
        removeMusicDirectory
    })
})