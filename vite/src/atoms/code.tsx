import { atom } from "recoil"

// エディターのコードの状態を管理するアトム
export const codeState = atom({
  key: "codeState",
  default: "",
})
