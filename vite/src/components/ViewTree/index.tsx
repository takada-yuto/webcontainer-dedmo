import { useEffect } from "react";
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
import { loadFileTreeFromLocalStorage, writeIndexJS } from "../Test";
import { useRecoilState } from "recoil";
import { fileTreeState } from "../../atoms/tree";
import { FileSystemTree } from "@webcontainer/api";


const sorter = (treeNodes: TreeNode[]) =>
  _.orderBy(
    treeNodes,
    [
      (node) => (node.type === "directory" ? 0 : 1),
      (node) => utils.getFileName(node.uri)
    ],
    ["asc", "asc"]
  );
  export const loadFileNameLocalStorage = () => {
    const storedFileName = localStorage.getItem('fileName');
    const initialFileName = '/components/hello.tsx'
    return storedFileName ? storedFileName.replace(/"/g, '') : initialFileName.replace(/"/g, '');
  };
  export const loadFileLocalStorage = (fileName: string) => {
    const initialFileObj = { 
      name: '/components/hello.tsx',
      content: ""
    }
    const storedFile = localStorage.getItem(fileName);
    if (storedFile) {
      const fileName = JSON.parse(storedFile).name.replace(/"/g, '');
      const fileContent = JSON.parse(storedFile).content;
      const storedFileObj = {
        name: fileName,
        content: fileContent
      }
      return storedFileObj
    } else {
      return initialFileObj
    }
  };
  
  // ファイルの名前をローカルストレージに保存
  const saveFileNameToLocalStorage = (fileName: string) => {
    localStorage.setItem('fileName', JSON.stringify(fileName));
  };
  // ファイルの名前と内容をローカルストレージに保存
  export const saveFileToLocalStorage = (fileName: string, content: string) => {
    const file = { name: fileName, content: content };
    localStorage.setItem(fileName, JSON.stringify(file));
  };
  export const ViewTree = () => {
    const [fileTree, setFileTree] = useRecoilState(fileTreeState);
    const loadTree = () => {
      return Promise.resolve(fileTree);
    };

  // コンポーネント内で直接関数を定義して使用します
  useEffect(() => {
    loadTree()
      .then((loadedTree) => {
        // ツリーがロードされたら拡張して設定します
        if (loadedTree) {
          const expandedTree = { ...loadedTree, expanded: true };
          setFileTree(expandedTree as TreeNode);
        }
      });
  }, []);

  const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
    const initialFileTree: FileSystemTree = loadFileTreeFromLocalStorage();
    setFileTree((tree) =>
      utils.assignTreeNode(tree, treeNode.uri, {
        expanded: !treeNode.expanded
      }) as TreeNode
    );
    const textareaEl = document.querySelector('textarea') as HTMLTextAreaElement;
    const storedFileContent = loadFileLocalStorage(treeNode.uri)
    if (textareaEl != null) {
      if (treeNode.type === 'directory') return
      saveFileNameToLocalStorage(treeNode.uri)
      const lastSlashIndex = treeNode.uri.lastIndexOf('/');

      // ファイル名を取得
      const fileName = lastSlashIndex !== -1 ? treeNode.uri.substring(lastSlashIndex + 1) : treeNode.uri;
      const matchedFile = Object.entries(initialFileTree).find(([key, value]) => {
        if ('directory' in value) {
          // もしディレクトリならその中から探す
          return Object.keys(value.directory).includes(fileName);
        } else {
          // ディレクトリでなければ直接ファイル名と照合する
          return key === fileName;
        }
      });
      
      const fileObject = matchedFile ? matchedFile[1] : null;
      
      if ('file' in fileObject!) {
        textareaEl.value = storedFileContent.content ? storedFileContent.content : fileObject.file.contents as string;
        textareaEl.addEventListener('input', (_event) => {
          writeIndexJS(textareaEl.value);
        });
        saveFileToLocalStorage(treeNode.uri, fileObject.file.contents as string)
      } else {
        const file = fileObject?.directory[fileName]
        if ('file' in file!) {
          textareaEl.value = storedFileContent.content ? storedFileContent.content : file.file.contents as string;
          textareaEl.addEventListener('input', (_event) => {
            writeIndexJS(textareaEl.value);
          });
          saveFileToLocalStorage(treeNode.uri, file.file.contents as string)
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
        tree={fileTree}
        onItemClick={toggleExpanded}
        sorter={sorter}
      />
    </div>
  );
};
