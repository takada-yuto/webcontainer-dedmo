import { atom } from "recoil"
import { TreeNode } from "@sinm/react-file-tree"

export const initialTree: TreeNode = {
  type: "directory",
  uri: "src",
  children: [
    {
      type: "directory",
      uri: "/components",
      children: [
        {
          type: "file",
          uri: "/components/hello.tsx",
        },
      ],
    },
    {
      type: "directory",
      uri: "/pages",
      children: [
        {
          type: "file",
          uri: "/pages/index.tsx",
        },
      ],
    },
    {
      type: "file",
      uri: "/package.json",
    },
    {
      type: "file",
      uri: "/tsconfig.json",
    },
    {
      type: "file",
      uri: "/next-env.d.ts",
    },
  ],
}

// ファイルツリーの状態を管理するアトム
export const fileTreeState = atom({
  key: "fileTreeState",
  default: initialTree,
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

// // 使用例
// const SomeComponent = () => {
//   const [fileTree, setFileTree] = useRecoilState(fileTreeState);

//   const handleAddFile = () => {
//     const newFileUri = "/path/to/newFile.tsx"; // 追加するファイルのURI
//     setFileTree(addFile(fileTree, newFileUri) as TreeNode);
//   };

//   const handleDeleteFile = (targetFileUri: string) => {
//     setFileTree(deleteFile(fileTree, targetFileUri));
//   };

//   return (
//     <div>
//       {/* ファイルの追加ボタン */}
//       <button onClick={handleAddFile}>ファイルを追加</button>

//       {/* ファイルの削除ボタン */}
//       <button onClick={() => handleDeleteFile("/components/hello.tsx")}>
//         hello.tsxを削除
//       </button>

//       {/* その他のコンポーネント */}
//     </div>
//   );
// };
