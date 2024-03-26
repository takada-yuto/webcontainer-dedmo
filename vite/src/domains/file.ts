import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";

export class FileSystemManager {
  public files: FileSystemTree;

  constructor(initialFiles: FileSystemTree) {
    this.files = this.removeEmptyKeys(initialFiles); // 空文字のキーを除外して初期値を保存
  }

  private removeEmptyKeys(tree: FileSystemTree): FileSystemTree {
    const cleanedTree: FileSystemTree = {};
    for (const key in tree) {
      if (key !== "") {
        const value = tree[key] as DirectoryNode
        if ("directory" in value) {
          cleanedTree[key] = { directory: this.removeEmptyKeys(value.directory) };
        } else {
          cleanedTree[key] = value as FileNode;
        }
      }
    }
    return cleanedTree;
  }
  get initialFiles(): FileSystemTree {
    return this.initialFiles
  }

  // ファイルを追加するメソッド
  addFile(filePath: string, fileContents: string): void {
    const pathParts = filePath.split("/");
    let currentDir: any = this.files; // 現在のディレクトリを初期化

    // パスの各要素に対してループ
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (i === pathParts.length - 1) {
        // パスの最後の要素ならばファイルを追加または上書き
        currentDir[part] = { file: { contents: fileContents } };
      } else {
        // パスの途中の要素ならばディレクトリを追加
        if (!currentDir[part]) {
          // ディレクトリが存在しない場合は新しく追加
          currentDir[part] = { directory: {} };
        }
        currentDir = currentDir[part].directory; // 次のディレクトリへ移動
      }
    }
  }


  // ファイルを削除するメソッド
  deleteFile(filePath: string): void {
    const pathParts = filePath.split("/").filter((part) => part !== ""); // '/' で分割し、空の要素を除外
    let currentDir: any = this.files; // 現在のディレクトリを初期化

    // パスの各要素に対してループ
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (i === pathParts.length - 1) {
        // パスの最後の要素ならばファイルを削除
        delete currentDir[part];
      } else {
        // パスの途中の要素ならばディレクトリに移動
        if (!currentDir[part]) {
          // ディレクトリが存在しない場合は削除するファイルは存在しないため、処理を終了
          return;
        }
        currentDir = currentDir[part].directory; // 次のディレクトリへ移動
      }
    }
  }

  // 現在のファイルツリーを取得するメソッド
  getFiles(): FileSystemTree {
    return { ...this.files }; // コピーして返す
  }
}

// // 使用例
// const fileSystemManager = new FileSystemManager(reactFiles); // 初期値を設定

// // ファイルを追加
// fileSystemManager.addFile("/pages/newPage.tsx", "New page contents");

// // ファイルを削除
// fileSystemManager.deleteFile("/pages/index.tsx");

// // 現在のファイルツリーを取得
// const currentFiles = fileSystemManager.getFiles();
// console.log(currentFiles);
