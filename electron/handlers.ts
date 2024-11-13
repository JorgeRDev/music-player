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
  "getSongBuffer",
  async (event, songPath: string): Promise<Buffer | undefined> => {
    logger.info(`executing getSong(${songPath}) handler`)

    logger.trace(`reading file ${songPath}`)
    const song = await readFile(songPath)

    if (song) {
      logger.info(`getSong(${songPath}) has returned the song successfully`)
      return song
    } else {
      logger.info(`getSong(${songPath}) has failed`)
      return undefined
    }
  },
)

ipcMain.handle(
  "getSongMetadata",
  async (event, songPath: SongPath): Promise<SongMetadata | null> => {
    logger.info(`executing getSongMetadata(${songPath})`)

    let nodeStream
    let songStream

    nodeStream = createReadStream(songPath)

    nodeStream.on("open", async (fd) => {
      try {
      } catch (err) {}
    })

    nodeStream.on("error", (error) => {})

    // 3. Verificar si está leyendo datos
    nodeStream.on("data", (chunk) => {})

    // 4. Saber cuando termina
    nodeStream.on("end", () => {})

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
    const songMetadata = await parseWebStream(
      songStream,
      {
        mimeType: "audio",
      },
      {
        observer: (update) => {
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
            songStream.cancel()
          }
        },
      },
    )

    if (songMetadata != undefined) {
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
      _songMetadata.format = songMetadata.format.container

      logger.info(
        `getSongMetadata(${songPath}) returned ${inspect(_songMetadata, { breakLength: Infinity, maxArrayLength: 2, maxStringLength: 50 })}`,
      )
      return _songMetadata
    }
    return null
  },
)
