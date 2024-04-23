import { FileSystemTree } from "@webcontainer/api"
import { nextjsFiles } from "../lib/webContainerSideFiles"
import { initialFile } from "../lib/projectData"

// ローカルストレージからファイルツリーを読み込み
export const loadFileTreeFromLocalStorage = () => {
  const storedFileTree = localStorage.getItem("fileTree")
  return storedFileTree ? JSON.parse(storedFileTree) : nextjsFiles
}

// ファイルツリーを更新する場合、ローカルストレージに保存
export const saveFileTree = (newFileTree: FileSystemTree) => {
  localStorage.setItem("fileTree", JSON.stringify(newFileTree))
}
// 直前までのファイルツリーを読み込み
export const loadPassedFileTreeFromLocalStorage = () => {
  const storedFileTree = localStorage.getItem("passedFileTree")
  return storedFileTree ? JSON.parse(storedFileTree) : nextjsFiles
}

// 直前までのファイルツリーをローカルストレージに保存
export const savePassedFileTree = (passedFileTree: FileSystemTree) => {
  localStorage.setItem("passedFileTree", JSON.stringify(passedFileTree))
}

export const loadFileLocalStorage = (fileName: string) => {
  const initialFileObj = {
    name: initialFile.path,
    content: initialFile.content,
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

// ファイルの名前と内容をローカルストレージに保存
export const saveFileToLocalStorage = (fileName: string, content: string) => {
  const file = { name: fileName, content: content }
  localStorage.setItem(fileName, JSON.stringify(file))
}

// ファイルの名前をローカルストレージに保存
export const saveFileNameToLocalStorage = (fileName: string) => {
  localStorage.setItem("fileName", JSON.stringify(fileName))
}

export const loadFileNameLocalStorage = () => {
  const storedFileName = localStorage.getItem("fileName")
  const initialFileName = initialFile.path
  return storedFileName
    ? storedFileName.replace(/"/g, "")
    : initialFileName.replace(/"/g, "")
}
// ファイルの名前をローカルストレージに保存
export const savePassedFileNameToLocalStorage = (fileName: string) => {
  localStorage.setItem("passedFileName", JSON.stringify(fileName))
}

export const loadPassedFileNameLocalStorage = () => {
  const storedFileName = localStorage.getItem("passedFileName")
  const initialFileName = initialFile.path
  return storedFileName
    ? storedFileName.replace(/"/g, "")
    : initialFileName.replace(/"/g, "")
}
