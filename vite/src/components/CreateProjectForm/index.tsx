import { FileSystemTree, WebContainer } from "@webcontainer/api"
import { useState } from "react"
import { FileUpload } from "../FileUpload"
import { SetterOrUpdater } from "recoil"

interface Props {
  webcontainerInstance: WebContainer | undefined
  setCode: SetterOrUpdater<string>
}

export const CreateProjectForm: React.FC<Props> = ({
  webcontainerInstance,
  setCode,
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const handleFileSystemTreeChange = async (value: FileSystemTree) => {
    await webcontainerInstance!.mount(value) // 値を親コンポーネントの状態に設定する
  }
  return (
    <>
      <button
        className="bg-slate-900 hover:bg-slate-700 border-2 rounded-30 border-blue-500 text-white text-lg w-200 h-60 py-2 px-4 m-4"
        onClick={() => setIsOpenForm(true)}
      >
        Open Create Project Form
      </button>
      {isOpenForm && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="border-2 rounded-30 border-blue-500 rounded-lg bg-slate-900 md:w-500 p-16 flex flex-col items-start">
            <FileUpload
              onFileSystemTreeChange={handleFileSystemTreeChange}
              setIsOpenForm={setIsOpenForm}
              webcontainerInstance={webcontainerInstance}
              setCode={setCode}
            />
          </div>
        </div>
      )}
    </>
  )
}
