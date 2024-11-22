import { PathLike } from "original-fs"
import path from "path"
import { app } from "electron"
import fsPromise from "fs/promises"
const userAppDataPath: PathLike = app.getPath("appData")
const configurationFilePath: PathLike = path.join(
  userAppDataPath,
  "configuration.json",
)

export interface Configuration {
  directories: string[]
  theme: "light" | "dark" | "system"
}

const defaultConfiguration: Configuration = {
  directories: [],
  theme: "system",
}

async function readConfiguration(): Promise<Configuration> {
  try {
    const configurationFileContent: string = await fsPromise.readFile(
      configurationFilePath,
      "utf-8",
    )

    return JSON.parse(configurationFileContent)
  } catch (error) {
    throw error
  }
}

async function writeConfiguration(configuration: Configuration): Promise<void> {
  try {
    let configurationFileContentObject: Configuration = defaultConfiguration

    const configurationFilePathExists: boolean = await fsPromise
      .access(configurationFilePath)
      .then(() => true)
      .catch(() => false)

    if (configurationFilePathExists) {
      const configurationFileContent: string = await fsPromise.readFile(
        configurationFilePath,
        "utf-8",
      )

      let configurationFileContentObject: Configuration = JSON.parse(
        configurationFileContent,
      )

      configurationFileContentObject.directories = configuration.directories

      await fsPromise.writeFile(
        configurationFilePath,
        JSON.stringify(configurationFileContentObject),
      )
    } else {
      configurationFileContentObject.directories = configuration.directories
    }

    await fsPromise.writeFile(
      configurationFilePath,
      JSON.stringify(configurationFileContentObject),
    )
  } catch (error) {
    throw error
  }
}

export { readConfiguration, writeConfiguration }
