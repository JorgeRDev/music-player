import { inspect } from "util"
import { app, ipcMain } from "electron"
import pino from "pino"
import readDirRecursively from "../lib/readingDirectory"
import path from "path"
import fsPromise from "fs/promises"
import { PathLike } from "original-fs"
import { Configuration } from "../lib/configuration"

const logger = pino({ level: "trace" })

async function getSongsPathFromDirectories(
  event: Electron.IpcMainInvokeEvent,
  directories: string[],
) {
  try {
    logger.info(`executing getSongsPathFromDirectories(${directories}) handler`)

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
  } catch (error) {
    throw error
  }
}

async function getLyrics(event: Electron.IpcMainInvokeEvent, songPath: string) {
  try {
    logger.info(`executing getLyrics(${songPath})`)

    logger.trace(`getting lyricsDir`)
    const lyricsDir = path.dirname(songPath)
    logger.trace(`lyricsDir: ${lyricsDir}`)

    logger.trace(`getting lyricsFile`)
    const lyricsFile = `${path.basename(songPath, path.extname(songPath))}.lrc`
    logger.trace(`lyricsFile: ${lyricsFile}`)

    logger.trace(`getting lyricsPath`)
    const lyricsPath = path.join(lyricsDir, lyricsFile)
    logger.trace(`lyricsPath: ${lyricsPath}`)

    const lyricsContent = await fsPromise.readFile(lyricsPath, "utf-8")
    logger.trace(lyricsContent)

    event.sender.send("getLyrics-reply", lyricsContent)
    ipcMain.removeListener("getLyrics", getLyrics)
  } catch (error) {
    throw error
  }
}

async function saveConfiguration(
  event: Electron.IpcMainInvokeEvent,
  configuration: Configuration,
) {
  try {
    const userAppDataPath: PathLike = app.getPath("appData")
    const configurationFilePath: PathLike = path.join(
      userAppDataPath,
      "configuration.json",
    )
    const configurationFilePathExists: boolean = await fsPromise
      .access(configurationFilePath)
      .then(() => true)
      .catch(() => false)

    let configurationFileContent: string

    if (configurationFilePathExists) {
      await fsPromise.mkdir(path.dirname(configurationFilePath), {
        recursive: true,
      })

      configurationFileContent = await fsPromise.readFile(
        configurationFilePath,
        "utf-8",
      )
    } else {
      await fsPromise.writeFile(
        configurationFilePath,
        JSON.stringify(configuration),
      )
    }
  } catch (error) {
    throw error
  }
}

export { getSongsPathFromDirectories, getLyrics }
