import { atom } from "recoil"
import { initialCode } from "../lib/webContainerSideFiles"

// エディターのコードの状態を管理するアトム
export const codeState = atom({
  key: "codeState",
  default: initialCode,
})
