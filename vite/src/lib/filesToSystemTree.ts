import { DirectoryNode, FileSystemTree } from "@webcontainer/api"

export type Files = {
  [key: string]: {
    value: string
    language: string
    active?: boolean
    hidden?: boolean
    tabbed?: boolean
  }
}
export function filesToSystemTree(input: Files): FileSystemTree {
  const output: FileSystemTree = {}

  for (const key in input) {
    // Remove any './' from the beginning of the key
    const adjustedKey = key.startsWith("./") ? key.slice(2) : key

    const splitKeys = adjustedKey.split("/").filter(Boolean)

    let currentOutput = output
    for (let i = 0; i < splitKeys.length; i++) {
      const subKey = splitKeys[i]

      // If we're at a file, assign it as file with contents
      if (i === splitKeys.length - 1) {
        currentOutput[subKey] = { file: { contents: input[key].value } }
      } else {
        // Otherwise, create a new directory if it doesn't exist
        if (!currentOutput[subKey]) {
          currentOutput[subKey] = { directory: {} }
        }

        const fileNode = currentOutput[subKey] as DirectoryNode
        currentOutput = fileNode.directory!
      }
    }
  }

  return output
}
