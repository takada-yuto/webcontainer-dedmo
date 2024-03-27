import { TreeNode } from "@sinm/react-file-tree"
import { FileSystemTree } from "@webcontainer/api"
export const convertToObject = (
  files: FileSystemTree,
  basePath: string = ""
): TreeNode => {
  const tree: TreeNode = {
    type: "directory",
    uri: basePath,
    children: [],
  }

  for (const [key, value] of Object.entries(files)) {
    if ("directory" in value) {
      // ディレクトリの場合は再帰的に変換し、ディレクトリ名を basePath に追加して uri を設定
      const directoryNode: TreeNode = convertToObject(
        value.directory,
        basePath + "/" + key
      )
      tree.children!.push(directoryNode)
    } else if ("file" in value) {
      // ファイルの場合は basePath を含めたファイルパスを uri として設定
      const fileNode: TreeNode = {
        type: "file",
        uri: basePath + "/" + key,
      }
      tree.children!.push(fileNode)
    }
  }

  return tree
}
