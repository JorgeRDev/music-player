import { ipcMain, dialog } from "electron"
import { readdir, readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import { parseWebStream } from "music-metadata"
import { uint8ArrayToBase64 } from "uint8array-extras"
import SongMetadata from "./lib/songMetadata"
import { createReadStream } from "fs"
import { ReadableStream } from "stream/web"
import { inspect } from "util"
import pino from "pino"

const logger = pino({ level: "trace" })

ipcMain.handle("chooseDirectories", async (): Promise<string[] | null> => {
  try {
    logger.info("Executing chooseDirectories() handler")

    logger.trace(
      'Executing dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"],})',
    )
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"],
    })
    logger.trace(
      `dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"],}) has returned:\n\t${inspect(filePaths, { breakLength: Infinity })}`,
    )

    if (canceled) {
      logger.info("The user has canceled the operation.\nReturning null.")
      return null
    }

    if (Array.isArray(filePaths)) {
      logger.info(
        `The user has chosen:\n\t${inspect(filePaths, { breakLength: Infinity })}`,
      )
      return filePaths
    } else {
      return null
    }
  } catch (error) {
    logger.error(`Error in chooseDirectories() handler: ${error}`)
    return null
  }
})

ipcMain.on(
  "getSongsPathFromDirectories",
  async (event, directories: string[]) => {
    logger.info(`executing getSongsPathFromDirectories(${directories}) handler`)

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
              files.push(fullPath)
            }
          }
        }
      }
      await readDirInnerRecursively(dir)
      return files
    }

    for (const directory of directories) {
      logger.trace(
        `executing readDirRecursively(${directory}) of ${directories}`,
      )
      const filesPath = await readDirRecursively(directory)
      logger.trace(
        `readDirRecursively(${directory}) has returned:\n\t${inspect(filesPath, { breakLength: Infinity, maxArrayLength: 2, maxStringLength: 50 })}`,
      )
      logger.info(
        `emitting getSongsPathFromDirectories-reply event with the filesPath`,
      )
      for (const filePath of filesPath) {
        event.sender.send("getSongsPathFromDirectories-reply", filePath)
      }
    }
  },
)

ipcMain.handle(
  "getSong",
  async (event, songPath: string): Promise<Buffer | undefined> => {
    logger.info(`executing getSong(${songPath}) handler`)

    logger.trace(`reading file ${songPath}`)
    const song = await readFile(songPath)

    if (song) {
      logger.info(`getSong(${songPath}) has returned ${song}`)
      return song
    } else {
      logger.info(`getSong(${songPath}) has returned null`)
      return undefined
    }
  },
)

ipcMain.handle(
  "getSongInfo",
  async (event, songPath: SongPath): Promise<SongMetadata | null> => {
    logger.info(`executing getSongInfo(${songPath})`)

    let nodeStream
    let songStream

    nodeStream = createReadStream(songPath)

    nodeStream.on("open", async (fd) => {
      console.log("Stream abierto, file descriptor:", fd)
      try {
      } catch (err) {
        console.error("Error al obtener la metadata:", err)
      }
    })

    nodeStream.on("error", (error) => {
      console.error("Error en el stream:", error)
    })

    // 3. Verificar si está leyendo datos
    nodeStream.on("data", (chunk) => {})

    // 4. Saber cuando termina
    nodeStream.on("end", () => {
      console.log("Stream terminado")
    })

    songStream = new ReadableStream({
      type: "bytes",
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(chunk)
        })
        nodeStream.on("end", () => controller.close())
        nodeStream.on("error", (error) => controller.error(error))
      },
      cancel() {
        nodeStream.destroy()
      },
    })
    console.log(`songStream has returned ${songStream}`)
    const songMetadata = await parseWebStream(
      songStream,
      {
        mimeType: "audio",
      },
      {
        observer: (update) => {
          console.log(
            `update has returned ${inspect(update.metadata.common.title)}`,
          )
          if (
            update.metadata.common.title &&
            update.metadata.common.album &&
            update.metadata.common.picture &&
            update.metadata.common.year &&
            update.metadata.common.artist &&
            update.metadata.common.albumartist &&
            update.metadata.common.genre &&
            update.metadata.format.duration &&
            update.metadata.format.container
          ) {
            console.log(
              `songMetadata has returned ${inspect(update)} inside the observer`,
            )
            songStream.cancel()
          }
        },
      },
    )
    console.log(`songMetadata has returned ${songMetadata}`)
    /* if (songStream) {
      console.log(`songStream is not undefined`)
      const songMetadata = await parseWebStream(
        songStream,
        {
          mimeType: "audio/mpeg",
        },
        {
          observer: (update) => {
            console.log(`update has returned ${update}`)
            if (
              update.metadata.common.title &&
              update.metadata.common.album &&
              update.metadata.common.picture &&
              update.metadata.common.year &&
              update.metadata.common.artist &&
              update.metadata.common.albumartist &&
              update.metadata.common.genre &&
              update.metadata.format.duration &&
              update.metadata.format.container
            ) {
              console.log(`songMetadata has returned ${update}`)
              songStream.cancel()
            }
          },
        },
      )
*/
    console.log(`songMetadata has returned ${songMetadata}`)
    if (songMetadata != undefined) {
      console.log(`songMetadata is not undefined`)
      const _songMetadata: SongMetadata = new SongMetadata()
      _songMetadata.title = songMetadata.common.title
      _songMetadata.album = songMetadata.common.album
      if (songMetadata.common.picture != undefined) {
        _songMetadata.frontCover = uint8ArrayToBase64(
          songMetadata.common.picture[0].data,
        )
      }
      _songMetadata.year = songMetadata.common.year
      _songMetadata.artist = songMetadata.common.artist
      _songMetadata.albumArtist = songMetadata.common.albumartist
      _songMetadata.genre = songMetadata.common.genre
      _songMetadata.duration = songMetadata.format.duration
      _songMetadata.itemType = songMetadata.format.container

      console.log(`_songMetadata has returned ${_songMetadata.title}`)
      return _songMetadata
    }
    return null
  },
)

/* const songMetadata = await parseBuffer(songBuffer);

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

    return null; */

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
