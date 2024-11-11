import { ipcMain, dialog } from "electron";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { parseBuffer } from "music-metadata";
import { SongInfo } from "../src/lib/songInfo";
import { uint8ArrayToBase64 } from "uint8array-extras";

ipcMain.handle("chooseDirectories", async (): Promise<string[] | null> => {
  try {
    console.log("Executing chooseDirectories() handler");

    console.log("Executing dialog.showOpenDialog()");
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"],
    });

    console.log(`dialog.showOpenDialog() has returned ${filePaths}`);

    if (canceled) {
      console.log("The user has canceled the operation");
      return null;
    }

    if (Array.isArray(filePaths)) {
      console.log(`Returning ${typeof filePaths} ${filePaths}`);
      return filePaths;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al seleccionar directorios:", error);
    return null;
  }
});

ipcMain.handle(
  "getSongsInfoFromDirectories",
  async (event, dirs: string[]): Promise<Map<string, SongInfo> | undefined> => {
    console.log("Executing getSongsInfoFromDirectories()");

    const songsPaths: string[] = [];

    async function readDirRecursively(dir: string): Promise<string[]> {
      const files: string[] = [];

      async function readDirInnerRecursively(dir: string): Promise<void> {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
            await readDirInnerRecursively(fullPath);
          } else {
            if (
              extname(entry.name) === ".flac" ||
              extname(entry.name) === ".mp3"
            ) {
              files.push(fullPath); // Agregamos el archivo al arreglo
            }
          }
        }
      }
      await readDirInnerRecursively(dir);
      return files;
    }

    for (const directory of dirs) {
      const allFiles = await readDirRecursively(directory);

      for (const file of allFiles) {
        songsPaths.push(file);
      }
    }

    const songsInfo: Map<string, SongInfo> = new Map();

    for (const songPath of songsPaths) {
      const songBuffer = await readFile(songPath);
      const songMetadata = await parseBuffer(songBuffer);

      if (songMetadata != undefined) {
        const songInfo: SongInfo = new SongInfo();

        songInfo.title = songMetadata.common.title;
        songInfo.album = songMetadata.common.album;
        if (songMetadata.common.picture != undefined) {
          songInfo.frontCover = uint8ArrayToBase64(
            songMetadata.common.picture[0].data
          );
        }
        songInfo.year = songMetadata.common.year;
        songInfo.artist = songMetadata.common.artist;
        songInfo.albumArtist = songMetadata.common.albumartist;
        songInfo.genre = songMetadata.common.genre;
        songInfo.duration = songMetadata.format.duration;
        songInfo.itemType = songMetadata.format.container;

        songsInfo.set(songPath, songInfo);
      }
    }

    return songsInfo;
  }
);

ipcMain.handle(
  "getSong",
  async (event, songPath: string): Promise<Buffer | undefined> => {
    const song = await readFile(songPath);

    if (song) {
      return song;
    }
  }
);

ipcMain.handle(
  "getSongInfo",
  async (event, songBuffer: Buffer): Promise<SongInfo | null> => {
    const songMetadata = await parseBuffer(songBuffer);

    if (songMetadata != undefined) {
      const songInfo: SongInfo = new SongInfo();

      songInfo.title = songMetadata.common.title;
      songInfo.album = songMetadata.common.album;
      if (songMetadata.common.picture != undefined) {
        songInfo.frontCover = uint8ArrayToBase64(
          songMetadata.common.picture[0].data
        );
      }
      songInfo.year = songMetadata.common.year;
      songInfo.artist = songMetadata.common.artist;
      songInfo.albumArtist = songMetadata.common.albumartist;
      songInfo.genre = songMetadata.common.genre;
      songInfo.duration = songMetadata.format.duration;
      songInfo.itemType = songMetadata.format.container;

      return songInfo;
    }

    return null;
  }
);
/* ipcMain.on(
  "getSongsFromDirectories",
  async (event, dirs: string[]): Promise<void> => {
    console.log(`getAllSongsFrom(${dirs}) has been called.`)

    const songsPaths: string[] = []

    async function readDirRecursively(dir: string): Promise<string[]> {
      const files: string[] = []

      async function readDirInnerRecursively(dir: string): Promise<void> {
        const entries = await readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = join(dir, entry.name)

          if (entry.isDirectory()) {
            await readDirInnerRecursively(fullPath)
          } else {
            if (
              extname(entry.name) === ".flac" ||
              extname(entry.name) === ".mp3"
            ) {
              files.push(fullPath) // Agregamos el archivo al arreglo
            }
          }
        }
      }
      await readDirInnerRecursively(dir)
      return files
    }

    for (const directory of dirs) {
      const allFiles = await readDirRecursively(directory)

      for (const file of allFiles) {
        songsPaths.push(file)
      }
    }

    console.log(`GetAllSongsFrom(${dirs}) is returning ${songsPaths}`)
    const msgEmitted = ipcMain.emit("songsUpdated", songsPaths)
    console.log(msgEmitted)
  },
)
 */

/* ipcMain.handle(
  "getSong",
  async (event, songPath: string): Promise<Buffer | null> => {
    const fileReaded = await readFile(songPath)

    if (fileReaded != undefined) {
      return fileReaded
    }

    return null
  },
) */
