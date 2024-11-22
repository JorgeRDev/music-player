import { join } from "path"
import { readdir } from "fs/promises"
import { extname } from "path"
import { inspect } from "util"
import pino from "pino"

const logger = pino({ level: "info" })

async function getSongsPathFromDirectories(
  event: Electron.IpcMainInvokeEvent,
  directories: string[],
) {
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
    logger.trace(`executing readDirRecursively(${directory}) of ${directories}`)
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
}

export { getSongsPathFromDirectories }
