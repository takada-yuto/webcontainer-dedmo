import { useEffect } from "react"
import _ from "lodash"
import { FileTree, FileTreeProps, TreeNode, utils } from "@sinm/react-file-tree"
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon"
import "@sinm/react-file-tree/icons.css"
import "@sinm/react-file-tree/styles.css"
import { loadFileTreeFromLocalStorage, writeIndexJS } from "../Home"
import { useRecoilState } from "recoil"
import { fileTreeState } from "../../atoms/tree"
import { FileSystemTree } from "@webcontainer/api"
import * as react from "react"
import { InternalHighlightProps } from "prism-react-renderer"
import { codeState } from "../../atoms/code"

const sorter = (treeNodes: TreeNode[]) =>
  _.orderBy(
    treeNodes,
    [
      (node) => (node.type === "directory" ? 0 : 1),
      (node) => utils.getFileName(node.uri),
    ],
    ["asc", "asc"]
  )
export const loadFileNameLocalStorage = () => {
  const storedFileName = localStorage.getItem("fileName")
  const initialFileName = "/src/src/App.tsx"
  return storedFileName
    ? storedFileName.replace(/"/g, "")
    : initialFileName.replace(/"/g, "")
}
export const loadFileLocalStorage = (fileName: string) => {
  const initialFileObj = {
    name: "/src/src/App.tsx",
    content: "",
  }
  const storedFile = localStorage.getItem(fileName)
  if (storedFile) {
    const fileName = JSON.parse(storedFile).name.replace(/"/g, "")
    const fileContent = JSON.parse(storedFile).content
    const storedFileObj = {
      name: fileName,
      content: fileContent,
    }
    return storedFileObj
  } else {
    return initialFileObj
  }
}

// ファイルの名前をローカルストレージに保存
export const saveFileNameToLocalStorage = (fileName: string) => {
  localStorage.setItem("fileName", JSON.stringify(fileName))
}
// ファイルの名前と内容をローカルストレージに保存
export const saveFileToLocalStorage = (fileName: string, content: string) => {
  const file = { name: fileName, content: content }
  localStorage.setItem(fileName, JSON.stringify(file))
}
export const ViewTree = () => {
  const [fileTree, setFileTree] = useRecoilState(fileTreeState)
  const [code, setCode] = useRecoilState(codeState)
  const loadTree = () => {
    return Promise.resolve(fileTree)
  }

  // コンポーネント内で直接関数を定義して使用します
  useEffect(() => {
    loadTree().then((loadedTree) => {
      // ツリーがロードされたら拡張して設定します
      if (loadedTree) {
        const expandedTree = { ...loadedTree, expanded: true }
        setFileTree(expandedTree as TreeNode)
      }
    })
  }, [])

  const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
    const fileTree: FileSystemTree = loadFileTreeFromLocalStorage()
    setFileTree(
      (tree) =>
        utils.assignTreeNode(tree, treeNode.uri, {
          expanded: !treeNode.expanded,
        }) as TreeNode
    )
    const textareaEl = document.querySelector(
      "#myTextarea"
    ) as unknown as react.FunctionComponentElement<InternalHighlightProps>
    const storedFileContent = loadFileLocalStorage(treeNode.uri)
    saveFileNameToLocalStorage(treeNode.uri)
    if (textareaEl != null) {
      if (treeNode.type === "directory") return

      const findFileInDirectory = (directory: any, filePath: string): any => {
        const pathParts = filePath.split("/").filter(Boolean)

        let currentDir = directory

        for (const part of pathParts) {
          if (
            !currentDir ||
            (!currentDir[part] && !currentDir.directory[part])
          ) {
            // ディレクトリが存在しないか、指定されたパスが存在しない場合は null を返す
            return null
          }
          if (currentDir[part]) {
            currentDir = currentDir[part]
          } else if (currentDir.directory[part]) {
            currentDir = currentDir.directory[part]
          }
        }

        return currentDir
      }

      const fileObj = findFileInDirectory(fileTree, treeNode.uri)
      if ("file" in fileObj) {
        setCode(
          storedFileContent.content
            ? storedFileContent.content
            : (fileObj.file.contents as string)
        )
        saveFileToLocalStorage(treeNode.uri, fileObj.file.contents as string)
      } else {
        console.log(fileObj)
      }
    }
  }
  const itemRender = (treeNode: TreeNode) => (
    <FileItemWithFileIcon treeNode={treeNode} />
  )
  useEffect(() => {
    writeIndexJS(code)
  }, [code])

  return (
    <div className="italic text-center pl-12 h-300 min-w-450 bg-gray-100 shadow-lg rounded-lg">
      <FileTree
        itemRenderer={itemRender}
        tree={fileTree}
        onItemClick={toggleExpanded}
        sorter={sorter}
      />
    </div>
  )
}
