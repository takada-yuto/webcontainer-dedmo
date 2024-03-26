import { WebContainer } from "@webcontainer/api"
import { atom } from "recoil"
const initialWebcontainerInstance = WebContainer.boot()
// ファイルツリーの状態を管理するアトム
export const webcontainerState = atom({
  key: "webcontainerState",
  default: initialWebcontainerInstance,
})
