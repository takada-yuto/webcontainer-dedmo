import { TreeNode } from "@sinm/react-file-tree";
import { FileSystemTree } from "@webcontainer/api";
export const convertToObject = (files: FileSystemTree) => {
  const tree: TreeNode = {
    type: "directory",
    uri: "",
    children: []
  };

  for (const [key, value] of Object.entries(files)) {
    if ("directory" in value) {
      const directoryNode: any = {
        type: "directory",
        uri: key,
        children: convertToObject(value.directory).children
      };
      tree.children!.push(directoryNode);
    } else if ("file" in value) {
      const fileNode: any = {
        type: "file",
        uri: key
      };
      tree.children!.push(fileNode);
    }
  }

  return tree;
};
