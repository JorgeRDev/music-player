import { dialog } from "electron"
import { readFile } from "node:fs/promises"
import { extname } from "node:path"
import { parseWebStream } from "music-metadata"
import { uint8ArrayToBase64 } from "uint8array-extras"
import SongMetadata from "./lib/songMetadata"
import { createReadStream } from "fs"
import { ReadableStream } from "stream/web"
import { inspect } from "util"
import pino from "pino"
import { basename } from "node:path"

const logger = pino({ level: "info" })

async function chooseDirectories(): Promise<string[] | null> {
  try {
    logger.info("Executing chooseDirectories() handler")

    logger.trace(
      'Executing dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"],})',
    )
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"],
      title: "Choose directories",
      buttonLabel: "Choose folders",
    })
    logger.trace(
      `dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"],}) has returned:\n\t${inspect(filePaths, { breakLength: Infinity })}`,
    )

    if (canceled || filePaths.length === 0) {
      logger.info("No directories selected. Returning null.")
      return null
    }

    return filePaths
  } catch (error) {
    throw error
  }
}

async function getSongBuffer(songPath: string): Promise<Buffer | undefined> {
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
}

async function getSongMetadata(
  songPath: SongPath,
  options?: { compressImage: boolean },
): Promise<SongMetadata | null> {
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
    if (songMetadata.common.title != undefined) {
      _songMetadata.title = songMetadata.common.title
    } else {
      _songMetadata.title = basename(songPath, extname(songPath))
    }
    _songMetadata.album = songMetadata.common.album
    if (songMetadata.common.picture != undefined) {
      if (options?.compressImage) {
        _songMetadata.frontCover = uint8ArrayToBase64(
          songMetadata.common.picture[0].data,
        )
      } else {
        _songMetadata.frontCover = uint8ArrayToBase64(
          songMetadata.common.picture[0].data,
        )
      }
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
}

export { chooseDirectories, getSongMetadata, getSongBuffer }
