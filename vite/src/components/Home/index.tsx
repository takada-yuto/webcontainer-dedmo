import { WebContainer } from "@webcontainer/api"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { codeState } from "../../atoms/code"
import { loadFileNameLocalStorage } from "../../util/handleLocalStorage"
import { CodeEditor } from "../CodeEditor"
import { DirectoryTree } from "../DirectoryTree"
import { CreateProjectForm } from "../CreateProjectForm"
import { writeCode2Container } from "../../util/writeCode2Container"
import { setupContainer } from "../../util/setupContainer"

let webcontainerInstance: WebContainer | undefined

export const Home = () => {
  const [code, setCode] = useRecoilState(codeState)

  // 初回起動
  useEffect(() => {
    localStorage.clear() // コンテナ起動時に前回までの情報を削除
    setupContainer(webcontainerInstance, setCode)
  }, [])

  // CodeEditor書き換え
  useEffect(() => {
    writeCode2Container(code, webcontainerInstance)
  }, [code])

  return (
    <>
      <div className="h-100vh bg-slate-900">
        <div>
          <div className="flex flex-row">
            <div className="flex flex-col min-h-screen items-center justify-center">
              <div className="flex flex-row">
                <DirectoryTree webcontainerInstance={webcontainerInstance} />
                <CreateProjectForm
                  webcontainerInstance={webcontainerInstance}
                  setCode={setCode}
                />
                <div className="flex flex-col text-white justify-between">
                  <p>※ リロードでデータが消えます</p>
                  <h1>{loadFileNameLocalStorage()}</h1>
                </div>
              </div>
            </div>
            <div hidden className="terminal1"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:min-h-800">
          <CodeEditor webcontainerInstance={webcontainerInstance} />
          <iframe
            src="../Preview"
            className="w-100p h-100p border-4 rounded-30 border-blue-500"
          ></iframe>
        </div>
      </div>
    </>
  )
}
