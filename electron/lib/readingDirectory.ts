import { readdir } from "fs/promises"
import { join } from "path"
import { extname } from "path"

export default async function readDirRecursively(
  dir: string,
): Promise<string[]> {
  const files: string[] = []

  async function readDirInnerRecursively(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        await readDirInnerRecursively(fullPath)
      } else {
        if (extname(entry.name) === ".flac" || extname(entry.name) === ".mp3") {
          files.push(fullPath)
        }
      }
    }
  }
  await readDirInnerRecursively(dir)
  return files
}
