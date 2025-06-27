import { PathLike } from "original-fs"
import path from "path"
import { app } from "electron"
import fsPromise from "fs/promises"
const userAppDataPath: PathLike = app.getPath("appData")
const configurationFilePath: PathLike = path.join(
  userAppDataPath,
  `/temp/configuration.json`,
)

const defaultConfiguration: IUserSettingsData = {
  musicDirectories: [],
  theme: "system",
  language: "en",
}

async function readConfiguration(): Promise<IUserSettingsData> {
  try {
    console.log('Reading configuration file')

    console.log('checking if configuration file exists: ', configurationFilePath, '')
    const configurationFilePathExists: boolean = await fsPromise
      .access(configurationFilePath)
      .then(() => true)
      .catch(() => false)

    if (!configurationFilePathExists) {
    console.log('Configuration file does not exist. Creating it: ', configurationFilePath, '')
      await fsPromise.writeFile(
        configurationFilePath,
        JSON.stringify(defaultConfiguration),
      )
    } else {
      console.log('Configuration file exists. Reading it: ', configurationFilePath, '')
    }

    const configurationFileContent: string = await fsPromise.readFile(
      configurationFilePath,
      "utf-8",
    )

    let configurationFileContentObject: IUserSettingsData = JSON.parse(
      configurationFileContent,
    )

    return configurationFileContentObject
  } catch (error) {
    throw error
  }
}

async function writeConfiguration(configuration: IUserSettingsData): Promise<void> {

  console.log('Executing save configuration')
  try {
    console.log('Reading previous configuration file')
    let configurationFileContentObject: IUserSettingsData =
      await readConfiguration()

    console.log(`overwriting ${configuration.musicDirectories}`)
    if (configuration.musicDirectories) {
      configurationFileContentObject.musicDirectories = configuration.musicDirectories
    }

    console.log(`overwriting ${configuration.theme}`)
    if (configuration.theme) {
      configurationFileContentObject.theme = configuration.theme
    }

    console.log(`overwriting in ${configurationFilePath}:\n\t${JSON.stringify(configurationFileContentObject, null, 2)}`)
    await fsPromise.writeFile(
      configurationFilePath,
      JSON.stringify(configurationFileContentObject),
    )
  } catch (error) {
    throw error
  }
}

export { readConfiguration, writeConfiguration }
