import { atom } from "recoil"
import { TreeNode } from "@sinm/react-file-tree"

export const initialTree: TreeNode = {
  type: "directory",
  uri: "/src",
  children: [
    {
      type: "directory",
      uri: "/src/components",
      children: [
        {
          type: "file",
          uri: "/src/components/hello.tsx",
        },
      ],
    },
    {
      type: "directory",
      uri: "/src/pages",
      children: [
        {
          type: "file",
          uri: "/src/pages/index.tsx",
        },
      ],
    },
    {
      type: "file",
      uri: "/src/package.json",
    },
    {
      type: "file",
      uri: "/src/tsconfig.json",
    },
    {
      type: "file",
      uri: "/src/next-env.d.ts",
    },
  ],
}
export const nextjsInitialTree: TreeNode = {
  type: "directory",
  uri: "/src",
  children: [
    {
      type: "directory",
      uri: "/src/public",
      children: [
        {
          type: "file",
          uri: "/src/public/index.html",
        },
      ],
    },
    {
      type: "directory",
      uri: "/src/src",
      children: [
        {
          type: "file",
          uri: "/src/src/globals.css",
        },
        {
          type: "file",
          uri: "/src/src/App.tsx",
        },
        {
          type: "file",
          uri: "/src/src/index.tsx",
        },
      ],
    },
    {
      type: "file",
      uri: "/src/package.json",
    },
    {
      type: "file",
      uri: "/src/postcss.config.js",
    },
    {
      type: "file",
      uri: "/src/tailwind.config.js",
    },
    {
      type: "file",
      uri: "/src/tsconfig.json",
    },
  ],
}

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
