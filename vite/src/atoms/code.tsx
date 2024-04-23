import { atom } from "recoil"
import { initialFile } from "../lib/projectData"

// エディターのコードの中身を管理するアトム
export const codeState = atom({
  key: "codeState",
  default: initialFile.content,
})
