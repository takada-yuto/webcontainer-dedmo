import { TreeNode } from "@sinm/react-file-tree"
import { DirectoryNode, FileSystemTree } from "@webcontainer/api"
import React, { useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { convertToObject } from "../../util/convertTree"
import { ViewTree } from "../ViewTree"
import { fileTreeState } from "../../atoms/tree"
import {
  loadFileLocalStorage,
  loadFileNameLocalStorage,
  loadFileTreeFromLocalStorage,
  loadPassedFileNameLocalStorage,
  loadPassedFileTreeFromLocalStorage,
  saveFileNameToLocalStorage,
  saveFileTree,
  savePassedFileNameToLocalStorage,
  savePassedFileTree,
} from "../../util/handleLocalStorage"
import { writeIndexJS } from "../Home"
import { codeState } from "../../atoms/code"

interface FileItem {
  path: string
  content: string // ファイルの内容を格納するプロパティを追加
}

interface Props {
  onFileSystemTreeChange: (tree: any) => void // 適切な型に置き換える
  setIsOpenForm: React.Dispatch<React.SetStateAction<boolean>>
  setupContainer: () => Promise<void> // 適切な型に置き換える
}

export const FileUpload: React.FC<Props> = ({
  onFileSystemTreeChange,
  setIsOpenForm,
  setupContainer,
}) => {
  const setFileTree = useSetRecoilState(fileTreeState)
  let treeTest: TreeNode = "" as unknown as TreeNode
  let systemTreeTest: FileSystemTree = "" as unknown as FileSystemTree
  const [newTree, setNewFileTree] = useState(treeTest)
  const [FileSystemTree, setFileSystemTree] = useState(systemTreeTest)
  const setCode = useSetRecoilState(codeState)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const item = e.dataTransfer.items[0]
    const entry = item.webkitGetAsEntry()
    const fileList: FileItem[] = [] // 取得したファイルを格納するリスト

    // ファイルスキャン関数
    const traverseFileTree = async (entry: any, path: string) => {
      const _path = path || ""
      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => {
          entry.file((file: File) => {
            resolve(file)
          })
        })
        const content = await readFileContent(file) // ファイルの内容を取得する
        fileList.push({ path: _path + file.name, content }) // ファイルを取得したらリストにプッシュする
      } else if (entry.isDirectory) {
        const directoryReader = entry.createReader()
        const entries = await new Promise<any[]>((resolve) => {
          directoryReader.readEntries((entries: any[]) => {
            resolve(entries)
          })
        })
        for (let i = 0; i < entries.length; i++) {
          if (
            !entries[i].name.includes(".git") &&
            !entries[i].name.includes("node_modules") &&
            entries[i].name !== "package-lock.json"
          ) {
            await traverseFileTree(entries[i], _path + entry.name + "/")
          }
        }
      }
    }

    // ファイルの内容を読み込む関数
    const readFileContent = async (file: File) => {
      const reader = new FileReader()
      return new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsText(file)
      })
    }

    // ここでドロップされた最初のディレクトリ（or ファイル）を渡す
    await traverseFileTree(entry, "")
    const newFileSystemTree = convertToFileSystemTree(fileList)
    setFileSystemTree(newFileSystemTree)
    const newFileTree = convertToObject(newFileSystemTree).children![0]
    setFileTree(newFileTree)
    const currentFileTree = loadFileTreeFromLocalStorage()
    savePassedFileTree(currentFileTree)
    const currentFileName = loadFileNameLocalStorage()
    savePassedFileNameToLocalStorage(currentFileName)
    saveFileTree(newFileSystemTree)
    setNewFileTree(newFileTree)
    onFileSystemTreeChange(newFileSystemTree)
  }

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const content = await readFileContent(file)
      console.log({ path: file.name, content })
    }
  }

  // ファイルの内容を読み込む関数
  const readFileContent = async (file: File) => {
    const reader = new FileReader()
    return new Promise<string>((resolve) => {
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsText(file)
    })
  }
  const convertToFileSystemTree = (fileList: FileItem[]): FileSystemTree => {
    const tree: FileSystemTree = {}

    const addToTree = (path: string[], content: string) => {
      let currentDir: FileSystemTree = tree
      for (let i = 0; i < path.length - 1; i++) {
        const dirName = path[i]
        if (!currentDir[dirName]) {
          currentDir[dirName] = { directory: {} }
        }
        const dir = currentDir[dirName] as DirectoryNode
        currentDir = dir.directory
      }
      const fileName = path[path.length - 1]
      currentDir[fileName] = { file: { contents: content } }
    }

    fileList.forEach(({ path, content }) => {
      const pathParts = path.split("/")
      addToTree(pathParts, content)
    })

    return tree
  }

  return (
    <>
      <div onDragOver={handleDragOver} onDrop={handleDrop}>
        <div
          className="m-8 w-450 h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="text-center">
            <p className="text-sm text-gray-400">
              フォルダをドロップしてプロジェクトアップロード
            </p>
          </div>
        </div>
        {newTree && <ViewTree />}
        {loadFileNameLocalStorage() && (
          <p className="text-sm text-gray-400 mt-2">
            Current Source File: {loadFileNameLocalStorage()}
          </p>
        )}
      </div>
      <div className="flex mt-auto w-full mt-16">
        <button
          className="bg-blue-500 hover:bg-white hover:text-blue-500 mx-10 p-8"
          onClick={() => {
            setIsOpenForm(false)
            onFileSystemTreeChange(FileSystemTree)
            saveFileTree(FileSystemTree)
            setupContainer()
          }}
          style={{
            borderRadius: "10px",
          }}
        >
          Upload
        </button>
        <button
          className="bg-blue-500 hover:bg-white hover:text-blue-500 mx-10 p-8"
          onClick={() => {
            setIsOpenForm(false)
            const passedFileTree = loadPassedFileTreeFromLocalStorage()
            const passedFileName = loadPassedFileNameLocalStorage()
            const passedContent = loadFileLocalStorage(passedFileName).content
            writeIndexJS(passedContent)
            setCode(passedContent)
            saveFileTree(passedFileTree)
            saveFileNameToLocalStorage(passedFileName)
          }}
          style={{
            borderRadius: "10px",
          }}
        >
          Cansel
        </button>
      </div>
    </>
  )
}
