import * as react from "react"
import {
  DirectoryNode,
  FileNode,
  FileSystemTree,
  WebContainer,
} from "@webcontainer/api"
import {
  loadFileNameLocalStorage,
  loadFileTreeFromLocalStorage,
} from "./handleLocalStorage"
import { FileSystemManager } from "../domains/file"
import { InternalHighlightProps } from "prism-react-renderer"
import { Terminal } from "xterm"
import { startDevServer } from "./startDevContainer"
import { SetterOrUpdater } from "recoil"

export const setupContainer = async (
  webcontainerInstance: WebContainer | undefined,
  setCode: SetterOrUpdater<string>
) => {
  const initialFileTree = loadFileTreeFromLocalStorage()
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot()
  } else {
    webcontainerInstance.teardown()
    const iframeEl = document.querySelector("iframe")
    iframeEl!.src = "../Preview"
    webcontainerInstance = await WebContainer.boot()
  }
  const fileSystemManager = new FileSystemManager(initialFileTree)
  await webcontainerInstance.mount(fileSystemManager.files)
  const rootDirectory = Object.keys(initialFileTree)[0]
  const installProcess = await webcontainerInstance.spawn("sh", [
    "-c",
    `cd ${rootDirectory} && npm i`,
  ])
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data)
      },
    })
  )

  if ((await installProcess.exit) !== 0) {
    throw new Error("Installation failed")
  }

  const textareaEl = document.querySelector(
    "#codeEditor"
  ) as unknown as react.FunctionComponentElement<InternalHighlightProps>
  const terminalEl1 = document.querySelector(".terminal1") as HTMLElement
  const isDirectory = (node: DirectoryNode | FileNode) => {
    if (!node) return
    if ("directory" in node) {
      const directory = node.directory as FileSystemTree
      const rawFileName = loadFileNameLocalStorage()
      const lastSlashIndex = rawFileName.lastIndexOf("/")
      // ファイル名を取得
      const fileName =
        lastSlashIndex !== -1
          ? rawFileName.substring(lastSlashIndex + 1)
          : rawFileName
      const fileNode = directory[fileName]
      isDirectory(fileNode)
    } else if ("file" in node) {
      new Promise((resolve) => setTimeout(resolve, 5000))
      setCode(node.file.contents as string)
    } else {
      return
    }
  }
  if (textareaEl != null) {
    for (const [_, value] of Object.entries(fileSystemManager.files)) {
      isDirectory(value)
    }
  }
  const terminal1 = new Terminal({
    convertEol: true,
  })
  terminal1.open(terminalEl1)
  startDevServer(terminal1, initialFileTree, webcontainerInstance)
}
