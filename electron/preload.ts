import { contextBridge, ipcRenderer } from "electron";
import SongInfo from "lib/songInfo";

const validChannels = ["songs"];

contextBridge.exposeInMainWorld("FileSystem", {
  chooseDirectories: async (): Promise<string[] | null> =>
    ipcRenderer.invoke("chooseDirectories"),
});

contextBridge.exposeInMainWorld("MusicManager", {
  getSongsInfoFromDirectories: async (
    dirs: string[]
  ): Promise<Map<string, SongInfo>> =>
    ipcRenderer.invoke("getSongsInfoFromDirectories", dirs),
  getSong: async (songPath: string): Promise<Buffer | undefined> => {
    console.log(`executing getSong(${songPath})`);

    return ipcRenderer.invoke("getSong", songPath);
  },
  getSongInfo: async (songBuffer: Buffer): Promise<SongInfo | null> =>
    ipcRenderer.invoke("getSongInfo", songBuffer),
});

contextBridge.exposeInMainWorld("App", {
  onFullScreen: (callback: (arg: boolean) => boolean) => {
    console.log(`onFullscreen() se esta ejecutando desde preload.js`);

    ipcRenderer.on("is-app-full-screen", (event, isFullScreen: boolean) => {
      if (isFullScreen) {
        console.log("La aplicación está en pantalla completa");
      } else {
        console.log("La aplicación no está en pantalla completa");
      }
      callback(isFullScreen);
    });
  },
});
