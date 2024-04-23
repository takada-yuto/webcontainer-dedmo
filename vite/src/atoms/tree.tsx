import { atom } from "recoil"
import { TreeNode } from "@sinm/react-file-tree"
import { convertToObject } from "../util/convertTree"
import { nextjsFiles } from "../lib/webContainerSideFiles"

const nextjsInitialTree: TreeNode = convertToObject(nextjsFiles).children![0]

// ファイルツリーの状態を管理するアトム
export const fileTreeState = atom({
  key: "fileTreeState",
  default: nextjsInitialTree,
})

// ファイルを追加する関数
export const addFile = (tree: TreeNode, newFileUri: string) => {
  // 新しいファイルを追加した新しい配列を作成し、それを新しいツリーに追加する
  const updatedChildren = tree.children
    ? [...tree.children, { type: "file", uri: newFileUri }]
    : [{ type: "file", uri: newFileUri }]
  return {
    ...tree,
    children: updatedChildren,
  } as TreeNode
}

export const deleteFile = (tree: TreeNode, targetFileUri: string) => {
  // treeのchildrenがundefinedの場合はそのまま返す
  if (!tree.children) {
    return tree
  }

  return {
    ...tree,
    children: tree.children.filter((child) => child.uri !== targetFileUri),
  }
}
