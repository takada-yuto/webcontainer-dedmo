import { FileSystemTree } from "@webcontainer/api"

export class FileSystemManager {
  public files: FileSystemTree

  constructor(initialFiles: FileSystemTree) {
    this.files = initialFiles // 空文字のキーを除外して初期値を保存
  }

  get initialFiles(): FileSystemTree {
    return this.initialFiles
  }

  addFile(filePath: string, fileContents: string): void {
    const pathParts = filePath.split("/")
    let currentDir: any = this.files // 現在のディレクトリを初期化

    // パスの各要素に対してループ
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]

      if (i === pathParts.length - 1) {
        // パスの最後の要素ならばファイルを追加または上書き
        currentDir[part] = { file: { contents: fileContents } }
      } else {
        // パスの途中の要素ならばディレクトリを追加
        if (!currentDir[part]) {
          // ディレクトリが存在しない場合は新しく追加
          currentDir[part] = { directory: {} }
        } else if (currentDir[part].directory) {
          // ディレクトリが存在し、既存のディレクトリがある場合はそのディレクトリを参照
          currentDir = currentDir[part].directory
        } else if (currentDir[part].file) {
          // ディレクトリが存在し、既存のファイルがある場合は上書き
          currentDir[part] = { directory: {} }
          currentDir = currentDir[part].directory
        }
      }
    }
  }

  // ファイルを削除するメソッド
  deleteFile(filePath: string): void {
    const pathParts = filePath.split("/").filter((part) => part !== "") // '/' で分割し、空の要素を除外
    let currentDir: any = this.files // 現在のディレクトリを初期化

    // パスの各要素に対してループ
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]

      if (i === pathParts.length - 1) {
        // パスの最後の要素ならばファイルを削除
        delete currentDir[part]
      } else {
        // パスの途中の要素ならばディレクトリに移動
        if (!currentDir[part]) {
          // ディレクトリが存在しない場合は削除するファイルは存在しないため、処理を終了
          return
        }
        currentDir = currentDir[part].directory // 次のディレクトリへ移動
      }
    }
  }

  // 現在のファイルツリーを取得するメソッド
  getFiles(): FileSystemTree {
    return { ...this.files } // コピーして返す
  }
}
