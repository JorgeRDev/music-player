/// <reference types="vite-plugin-electron/electron-env" />

import type SongInfo from "../src/lib/songInfo"

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    App: {
      FileSystem: {
        openDirectoriesSelectDialog: () => Promise<string[] | null>
      }
      MusicManager: {
        getSongsPathFromDirectories: (
          directories: string[],
          onSongPath: (songPath: string) => void,
        ) => void
        getSongMetadata: (
          songPath: SongPath,
          options?: { compressImage: boolean },
        ) => Promise<SongInfo | null>
        getSongBuffer: (
          songPath: SongPath | undefined,
        ) => Promise<Buffer | undefined>
        getLyrics: (
          songPath: SongPath,
          onGetLyrics: (songLyrics: string) => void,
        ) => void
      }
      FullScreen: {
        onFullScreen: (callback: (arg: boolean) => void) => void
      }
      Configuration: {
        readConfiguration: () => Promise<Configuration>
      }
    }
  }
}
