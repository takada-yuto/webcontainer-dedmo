import {
  DirectoryNode,
  FileNode,
  FileSystemTree,
  WebContainer,
} from "@webcontainer/api"
import { Terminal } from "xterm"
import "xterm/css/xterm.css"
import { FileSystemManager } from "../../domains/file"
import { useEffect, useState } from "react"
import { ViewTree } from "../ViewTree"
import { useRecoilState, useSetRecoilState } from "recoil"
import { fileTreeState } from "../../atoms/tree"
import { convertToObject } from "../../util/convertTree"
import { Renderer, RichTextarea } from "rich-textarea"
import { Highlight, InternalHighlightProps, themes } from "prism-react-renderer"
import * as react from "react"
import { codeState } from "../../atoms/code"
import {
  loadFileLocalStorage,
  loadFileNameLocalStorage,
  loadFileTreeFromLocalStorage,
  saveFileToLocalStorage,
  saveFileTree,
} from "../../util/handleLocalStorage"
import { FileUpload } from "../FileUpload"

let webcontainerInstance: WebContainer | undefined

// ファイル変更内容をコンテナに書き込む
export const writeIndexJS = async (content: string) => {
  const filePath = loadFileNameLocalStorage()
  saveFileToLocalStorage(filePath, content)
  const fileObj = loadFileLocalStorage(filePath)
  if (!webcontainerInstance) {
    console.log("Creating instance")
  } else {
    await webcontainerInstance.fs.writeFile(filePath, fileObj.content)
  }
}
export const Home = () => {
  const [code, setCode] = useRecoilState(codeState)
  const startDevServer = async (
    terminal: Terminal,
    initialFileTree: FileSystemTree
  ) => {
    const rootDirectory = Object.keys(initialFileTree)[0]
    const rootDirectoryObj = initialFileTree[rootDirectory] as DirectoryNode
    const packageJsonObj = rootDirectoryObj.directory[
      "package.json"
    ] as FileNode
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
    })
    console.log(iframeEl)
  }
  const setupContainer = async () => {
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
      "#myTextarea"
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
    startDevServer(terminal1, initialFileTree)
  }
  useEffect(() => {
    localStorage.clear() // コンテナ起動時に前回までの情報を削除
    setupContainer()
  }, [])
  useEffect(() => {
    writeIndexJS(code)
  }, [code])
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
    saveFileTree(fileSystemManager.files as FileSystemTree)
    setFileTree(convertedTree.children![0])
    await webcontainerInstance!.mount(fileSystemManager.files)
    setFilePath("")
  }
  const handleFileSystemTreeChange = async (value: FileSystemTree) => {
    await webcontainerInstance!.mount(value) // 値を親コンポーネントの状態に設定する
  }

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    caretColor: "white",
    backgroundColor: "rgb(40, 42, 54)",
    padding: "1rem",
  }

  const rendererHandler = () => {
    const fileName = loadFileNameLocalStorage()
    let language: string
    const fileExtension = fileName.split(".").pop()
    const languageArray = [
      // 公式で提供されている言語
      "markup",
      "jsx",
      "tsx",
      "swift",
      "kotlin",
      "objectivec",
      "js-extras",
      "reason",
      "rust",
      "graphql",
      "yaml",
      "go",
      "cpp",
      "markdown",
      "python",
    ]
    if (fileExtension && fileExtension in languageArray) {
      language = fileExtension
    } else {
      language = "tsx"
    }
    const renderer: Renderer = (value) => {
      return (
        <Highlight theme={themes.dracula} code={value} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <div className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </Highlight>
      )
    }
    return renderer
  }
  const [isOpenTree, setIsOpenTree] = useState(false)
  const [isOpenForm, setIsOpenForm] = useState(false)

  return (
    <>
      <div className="home bg-slate-900">
        <div>
          <div className="flex flex-row">
            <div className="flex flex-col min-h-screen items-center justify-center">
              <div className="flex flex-row">
                <button
                  className="bg-slate-900 hover:bg-slate-700 border-2 border-blue-500 text-white text-lg w-200 h-60 py-2 px-4 m-4"
                  style={{
                    borderRadius: "30px",
                  }}
                  onClick={() => setIsOpenTree(true)}
                >
                  Open Directory Tree
                </button>
                <button
                  className="bg-slate-900 hover:bg-slate-700 border-2 border-blue-500 text-white text-lg w-200 h-60 py-2 px-4 m-4"
                  style={{
                    borderRadius: "30px",
                  }}
                  onClick={() => setIsOpenForm(true)}
                >
                  Open Create Project Form
                </button>
                <div className="flex flex-col text-white justify-between">
                  <p>※ リロードでデータが消えます</p>
                  <h1>{loadFileNameLocalStorage()}</h1>
                </div>
              </div>
              {isOpenTree && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                  <div
                    className="border-2 border-blue-500 rounded-lg bg-slate-900 md:w-500 p-16 flex flex-col items-start"
                    style={{
                      borderRadius: "30px",
                    }}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <form
                        onSubmit={handleFileCreation}
                        className="flex items-center"
                      >
                        <div>
                          <input
                            type="text"
                            placeholder="例: src/components/Home/index.tsx"
                            value={filePath}
                            onChange={handleFilePathChange}
                            className="border-gray-300 focus:ring focus:border-blue-300 rounded-lg shadow-sm mr-8 px-4 py-2 w-400"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
                        >
                          追加
                        </button>
                      </form>
                      <ViewTree />
                    </div>
                    <div className="flex mt-auto w-full">
                      <button
                        className="bg-blue-500 hover:bg-white hover:text-blue-500 px-100 mt-16 mx-120"
                        onClick={() => setIsOpenTree(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isOpenForm && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                  <div
                    className="border-2 border-blue-500 rounded-lg bg-slate-900 md:w-500 p-16 flex flex-col items-start"
                    style={{
                      borderRadius: "30px",
                    }}
                  >
                    <FileUpload
                      onFileSystemTreeChange={handleFileSystemTreeChange}
                      setIsOpenForm={setIsOpenForm}
                      setupContainer={setupContainer}
                    />
                  </div>
                </div>
              )}
            </div>
            <div hidden className="terminal1"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:min-h-800">
          <div className="grid grid-cols-1">
            <div>
              <RichTextarea
                id="myTextarea"
                style={style}
                onChange={(e) => {
                  setCode(e.target.value)
                  writeIndexJS(e.target.value)
                }}
                value={code}
              >
                {rendererHandler()}
              </RichTextarea>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <iframe
              src="../Preview"
              className="max-h-full border-4 border-blue-500"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "30px",
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  )
}
