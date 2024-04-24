import {
  DirectoryNode,
  FileNode,
  FileSystemTree,
  WebContainer,
} from "@webcontainer/api"
import { Terminal } from "xterm"

export const startDevServer = async (
  terminal: Terminal,
  initialFileTree: FileSystemTree,
  webcontainerInstance: WebContainer | undefined
) => {
  const rootDirectory = Object.keys(initialFileTree)[0]
  const rootDirectoryObj = initialFileTree[rootDirectory] as DirectoryNode
  const packageJsonObj = rootDirectoryObj.directory["package.json"] as FileNode
  const packageJsonContent = packageJsonObj.file.contents as string
  const packageJsonScripts = JSON.parse(packageJsonContent).scripts
  let startCommand = ""
  if (packageJsonScripts.start) {
    startCommand = "start"
  } else {
    startCommand = "dev"
  }
  console.log(`npm run ${startCommand}`)
  const serverProcess = await webcontainerInstance!.spawn("sh", [
    "-c",
    `cd ${rootDirectory} && npm run ${startCommand}`,
  ])

  const iframeEl = document.querySelector("iframe")
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    })
  )
  webcontainerInstance!.on("server-ready", (_port, url) => {
    iframeEl!.src = url
    console.log(url)
  })
  console.log(iframeEl!.src)
}
