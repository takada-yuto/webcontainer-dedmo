import { WebContainer } from "@webcontainer/api"
import {
  loadFileLocalStorage,
  loadFileNameLocalStorage,
  saveFileToLocalStorage,
} from "./handleLocalStorage"

// ファイル変更内容をコンテナに書き込む
export const writeCode2Container = async (
  content: string,
  webcontainerInstance: WebContainer | undefined
) => {
  const filePath = loadFileNameLocalStorage()
  saveFileToLocalStorage(filePath, content)
  const fileObj = loadFileLocalStorage(filePath)
  if (!webcontainerInstance) {
    console.log("Creating instance")
  } else {
    await webcontainerInstance.fs.writeFile(filePath, fileObj.content)
  }
}
