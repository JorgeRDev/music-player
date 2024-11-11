import { ipcMain, dialog } from "electron";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { parseBuffer } from "music-metadata";
import { uint8ArrayToBase64 } from "uint8array-extras";
import SongMetadata from "./lib/songMetadata";

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

ipcMain.on(
  "getSongsPathFromDirectories",
  async (event, directories: string[]) => {
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
              files.push(fullPath);
            }
          }
        }
      }
      await readDirInnerRecursively(dir);
      return files;
    }

    console.log(`executing getSongsPathFromDirectories(${directories})`);

    for (const directory of directories) {
      const filesPaths = await readDirRecursively(directory);

      for (const filePath of filesPaths) {
        /* const songInfo: Map<SongPath, SongInfo> = new Map();

        const _songInfo: SongInfo = new SongInfo(filePath);

        await _songInfo.setBuffer();
        console.log(`_songInfo has recieved ${_songInfo.getBuffer()}`);

        _songInfo.createBlobFromBuffer();
        console.log(`_songInfo has recieved ${_songInfo.getBlob()}`);

        _songInfo.createURLFromBlob();
        console.log(`_songInfo has recieved ${_songInfo.getURL()}`);

        _songInfo.createMetadataFromBuffer();
        console.log(`_songInfo has recieved ${_songInfo.getMetadata()}`);

        _songInfo.createFrontCoverURL();
        console.log(`_songInfo has recieved ${_songInfo.getFrontCoverURL()}`);

        songInfo.set(filePath, _songInfo); */
        event.sender.send("getSongsPathFromDirectories-reply", filePath);
      }
    }
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
  async (event, songBuffer: Buffer): Promise<SongMetadata | null> => {
    const songMetadata = await parseBuffer(songBuffer);

    if (songMetadata != undefined) {
      const _songMetadata: SongMetadata = new SongMetadata();

      _songMetadata.title = songMetadata.common.title;
      _songMetadata.album = songMetadata.common.album;
      if (songMetadata.common.picture != undefined) {
        _songMetadata.frontCover = uint8ArrayToBase64(
          songMetadata.common.picture[0].data
        );
      }
      _songMetadata.year = songMetadata.common.year;
      _songMetadata.artist = songMetadata.common.artist;
      _songMetadata.albumArtist = songMetadata.common.albumartist;
      _songMetadata.genre = songMetadata.common.genre;
      _songMetadata.duration = songMetadata.format.duration;
      _songMetadata.itemType = songMetadata.format.container;

      return _songMetadata;
    }

    return null;
  }
);

/* ipcMain.handle(
  "",
  async (event, dirs: string[]): Promise<Map<string, SongInfo> | undefined> => {
    console.log("Executing getSongsInfoFromDirectories()");

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


 */
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
