import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { fileTreeState } from "../../atoms/tree"
import {
  loadFileTreeFromLocalStorage,
  saveFileTree,
} from "../../util/handleLocalStorage"
import { FileSystemManager } from "../../domains/file"
import { convertToObject } from "../../util/convertTree"
import { FileSystemTree, WebContainer } from "@webcontainer/api"
import { ViewTree } from "../ViewTree"

interface Props {
  webcontainerInstance: WebContainer | undefined
}

export const DirectoryTree: React.FC<Props> = ({ webcontainerInstance }) => {
  const [filePath, setFilePath] = useState("")
  const setFileTree = useSetRecoilState(fileTreeState)
  const [isOpenTree, setIsOpenTree] = useState(false)
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
  return (
    <>
      <button
        className="bg-slate-900 hover:bg-slate-700 border-2 rounded-30 border-blue-500 text-white text-lg w-200 h-60 py-2 px-4 m-4"
        onClick={() => setIsOpenTree(true)}
      >
        Open Directory Tree
      </button>
      {isOpenTree && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="border-2 rounded-30 border-blue-500 rounded-lg bg-slate-900 md:w-500 p-16 flex flex-col items-start">
            <div className="grid grid-cols-1 gap-4">
              <form onSubmit={handleFileCreation} className="flex items-center">
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
              <ViewTree webcontainerInstance={webcontainerInstance} />
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
    </>
  )
}
