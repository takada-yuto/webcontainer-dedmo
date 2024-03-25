import { useEffect, useState } from "react";
import _ from "lodash";
import {
  FileTree,
  FileTreeProps,
  TreeNode,
  utils
} from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import "@sinm/react-file-tree/icons.css";
import "@sinm/react-file-tree/styles.css";
import "./styles.css";
import { reactFiles } from "../../lib/webContainerSideFiles";
import { writeIndexJS } from "../Test";

const sorter = (treeNodes: TreeNode[]) =>
  _.orderBy(
    treeNodes,
    [
      (node) => (node.type === "directory" ? 0 : 1),
      (node) => utils.getFileName(node.uri)
    ],
    ["asc", "asc"]
  );

const loadTree = () => {
  return import("../../lib/tree.json").then((module) => module.default as TreeNode);
};

const ViewTree = () => {
  const [tree, setTree] = useState<TreeNode | undefined>();

  useEffect(() => {
    loadTree()
      // expand root node
      .then((tree) => Object.assign(tree, { expanded: true }))
      .then(setTree);
  }, []);

  const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
    setTree((tree) =>
      utils.assignTreeNode(tree, treeNode.uri, {
        expanded: !treeNode.expanded
      })
    );
    console.log(treeNode)
    const textareaEl = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textareaEl != null) {
      if (treeNode.type === 'directory') return
      const lastSlashIndex = treeNode.uri.lastIndexOf('/');

      // ファイル名を取得
      const fileName = lastSlashIndex !== -1 ? treeNode.uri.substring(lastSlashIndex + 1) : treeNode.uri;

      console.log(fileName);
      const matchedFile = Object.entries(reactFiles).find(([key, value]) => {
        if ('directory' in value) {
          // もしディレクトリならその中から探す
          return Object.keys(value.directory).includes(fileName);
        } else {
          // ディレクトリでなければ直接ファイル名と照合する
          return key === fileName;
        }
      });
      
      const fileObject = matchedFile ? matchedFile[1] : null;
      
      console.log(matchedFile);
      console.log(fileObject);
      console.log(fileObject)
      if ('file' in fileObject!) {
        textareaEl.value = fileObject.file.contents as string;
        textareaEl.addEventListener('input', (_event) => {
          writeIndexJS(textareaEl.value);
        });
      } else {
        const file = fileObject?.directory[fileName]
        if ('file' in file!) {
          textareaEl.value = file.file.contents as string;
          textareaEl.addEventListener('input', (_event) => {
            writeIndexJS(textareaEl.value);
          });
        }

      }
    }
  };

  // you can customize item renderer
  const itemRender = (treeNode: TreeNode) => (
    <FileItemWithFileIcon treeNode={treeNode} />
  );

  return (
    <div className="App">
      <FileTree
        itemRenderer={itemRender}
        tree={tree}
        onItemClick={toggleExpanded}
        sorter={sorter}
      />
    </div>
  );
};

export default ViewTree;
