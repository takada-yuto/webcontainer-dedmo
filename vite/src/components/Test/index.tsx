import {
  DirectoryNode,
  FileNode,
  FileSystemTree,
  WebContainer,
} from "@webcontainer/api"
import { reactFiles } from "../../lib/webContainerSideFiles"
import { Terminal } from "xterm"
import "xterm/css/xterm.css"
import { FileSystemManager } from "../../domains/file"
import { useState } from "react"
import {
  ViewTree,
  loadFileLocalStorage,
  loadFileNameLocalStorage,
  saveFileToLocalStorage,
} from "../ViewTree"
import { useSetRecoilState } from "recoil"
import { fileTreeState } from "../../atoms/tree"
import { convertToObject } from "../../util/convertTree"

let webcontainerInstance: WebContainer | undefined
// ローカルストレージからファイルツリーを読み込み
export const loadFileTreeFromLocalStorage = () => {
  const storedFileTree = localStorage.getItem("fileTree")
  return storedFileTree ? JSON.parse(storedFileTree) : reactFiles
}

// ファイルツリーをローカルストレージに保存
const saveFileTreeToLocalStorage = (fileTree: FileSystemTree) => {
  localStorage.setItem("fileTree", JSON.stringify(fileTree))
}

// ファイルツリーを更新する場合、ローカルストレージに保存
const updateFileTree = (newFileTree: FileSystemTree) => {
  saveFileTreeToLocalStorage(newFileTree)
}

window.addEventListener("load", async () => {
  localStorage.clear()
  const initialFileTree = loadFileTreeFromLocalStorage()
  webcontainerInstance = await WebContainer.boot()
  const fileSystemManager = new FileSystemManager(initialFileTree)
  await webcontainerInstance.mount(fileSystemManager.files)
  const installProcess = await webcontainerInstance.spawn("sh", [
    "-c",
    "cd src/ && npm i",
  ])

  if ((await installProcess.exit) !== 0) {
    throw new Error("Installation failed")
  }

  const textareaEl = document.querySelector("textarea") as HTMLTextAreaElement
  const terminalEl1 = document.querySelector(".terminal1") as HTMLElement
  const terminalEl2 = document.querySelector(".terminal2") as HTMLElement
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
      textareaEl.value = node.file.contents as string
      textareaEl.addEventListener("input", (_event) => {
        writeIndexJS(textareaEl.value)
      })
    } else {
      return
    }
  }
  if (textareaEl != null) {
    for (const [_, value] of Object.entries(fileSystemManager.files)) {
      isDirectory(value)
    }
  }
  const installDependencies = async (terminal: Terminal) => {
    const installProcess = await webcontainerInstance!.spawn("sh", [
      "-c",
      "cd src/ && npm i",
    ])

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data)
        },
      })
    )
    return installProcess.exit
  }
  const terminal1 = new Terminal({
    convertEol: true,
  })
  const terminal2 = new Terminal({
    convertEol: true,
  })
  terminal1.open(terminalEl1)
  terminal2.open(terminalEl2)
  const exitCode = await installDependencies(terminal1)
  if (exitCode !== 0) {
    throw new Error("Installation failed")
  }
  async function startShell(terminal: Terminal) {
    const shellProcess = await webcontainerInstance!.spawn("jsh", {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    })
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data)
        },
      })
    )
    const input = shellProcess.input.getWriter()
    terminal.onData((data) => {
      input.write(data)
    })
    return shellProcess
  }
  startDevServer(terminal1)
  startShell(terminal2)
})

const startDevServer = async (terminal: Terminal) => {
  console.log("npm run dev")
  const serverProcess = await webcontainerInstance!.spawn("sh", [
    "-c",
    "cd src/ && npm run dev",
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
    if (iframeEl != null) {
      iframeEl.src = url
    }
  })
}

export const writeIndexJS = async (content: string) => {
  const filePath = loadFileNameLocalStorage()
  saveFileToLocalStorage(filePath, content)
  const fileObj = loadFileLocalStorage(filePath)
  await webcontainerInstance!.fs.writeFile(filePath, fileObj.content)
}
export const Test = () => {
  const [filePath, setFilePath] = useState("")
  const setFileTree = useSetRecoilState(fileTreeState)
  // ファイルパスの変更ハンドラー
  const handleFilePathChange = (event: any) => {
    setFilePath(event.target.value)
  }

  // ファイル作成ハンドラー
  const handleFileCreation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const initialFileTree = loadFileTreeFromLocalStorage()
    const fileSystemManager = new FileSystemManager(initialFileTree)
    fileSystemManager.addFile(filePath, "")
    const convertedTree = convertToObject(fileSystemManager.files)
    updateFileTree(fileSystemManager.files as FileSystemTree)
    setFileTree(convertedTree.children![0])
    await webcontainerInstance!.mount(fileSystemManager.files)
    setFilePath("")
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="container grid grid-cols-3 gap-4">
          <div className="editor h-1/6 grid grid-cols-1 gap-4 ">
            <form
              onSubmit={handleFileCreation}
              className="flex items-center space-y-4"
            >
              <div>
                <p className="text-gray-600">※ リロードでデータが消えます</p>
                <input
                  type="text"
                  placeholder="ファイルパス"
                  value={filePath}
                  onChange={handleFilePathChange}
                  className="w-full max-w-md border-gray-300 focus:ring focus:border-blue-300 rounded-lg shadow-sm px-4 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
              >
                追加
              </button>
            </form>
            <ViewTree />
          </div>
          <textarea className="flex bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"></textarea>
          <div className="preview flex">
            <iframe
              src="../Preview"
              className="w-full h-full border-4 border-blue-500 rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
        <div className="terminalcontainer grid grid-cols-2 gap-4">
          <div className="terminal1"></div>
          <div className="terminal2"></div>
        </div>
      </div>
    </>
  )
}
