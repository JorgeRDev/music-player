import {Ref} from "vue";

export interface IUserSettings extends IUserSettingsData{
    musicDirectories: Ref<string[]>,
    theme: Ref<"light" | "dark" | "system">,
    language: Ref<"en" | "es" >

    addMusicDirectory(directory: string): Promise<void>
    removeMusicDirectory(directory: string): void

    loadConfiguration(): Promise<void>
    saveConfiguration(): Promise<void>
}