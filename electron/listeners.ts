import { inspect } from "util"
import { app } from "electron"
import pino from "pino"
import readDirRecursively from "./lib/readingDirectory"
import path from "path"
import fsPromise from "fs/promises"
import { PathLike } from "original-fs"
import { Configuration } from "./lib/configuration"

const logger = pino({ level: "info" })

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

export { getSongsPathFromDirectories }
