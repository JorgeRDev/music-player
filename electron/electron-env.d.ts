/// <reference types="vite-plugin-electron/electron-env" />

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
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  FileSystem: {
    chooseDirectories: () => Promise<string[] | null>;
  };
  MusicManager: {
    getSongsInfoFromDirectories: (
      dirs: string[]
    ) => Promise<Map<string, SongInfo> | null>;
    getSongInfo: (songBuffer: Buffer) => Promise<SongInfo>;
    getSong: (songPath) => Promise<Buffer | undefined>;
  };
  App: {
    onFullScreen: (callback: (arg: boolean) => void) => void;
  };
}
