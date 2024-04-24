import { Renderer, RichTextarea } from "rich-textarea"
import { Highlight, themes } from "prism-react-renderer"
import { loadFileNameLocalStorage } from "../../util/handleLocalStorage"
import { useRecoilState } from "recoil"
import { codeState } from "../../atoms/code"
import { WebContainer } from "@webcontainer/api"
import { writeCode2Container } from "../../util/writeCode2Container"

interface Props {
  webcontainerInstance: WebContainer | undefined
}

export const CodeEditor: React.FC<Props> = ({ webcontainerInstance }) => {
  const [code, setCode] = useRecoilState(codeState)

  // CodeEditor設定
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    caretColor: "white",
    backgroundColor: "rgb(40, 42, 54)",
    padding: "1rem",
  }
  const rendererHandler = () => {
    const fileName = loadFileNameLocalStorage()
    let language: string
    const fileExtension = fileName.split(".").pop()
    const languageArray = [
      // 公式で提供されている言語
      "markup",
      "jsx",
      "tsx",
      "swift",
      "kotlin",
      "objectivec",
      "js-extras",
      "reason",
      "rust",
      "graphql",
      "yaml",
      "go",
      "cpp",
      "markdown",
      "python",
    ]
    if (fileExtension && fileExtension in languageArray) {
      language = fileExtension
    } else {
      language = "tsx"
    }
    const renderer: Renderer = (value) => {
      return (
        <Highlight theme={themes.dracula} code={value} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <div className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </Highlight>
      )
    }
    return renderer
  }

  return (
    <>
      <div>
        <RichTextarea
          id="codeEditor"
          style={style}
          onChange={(e) => {
            setCode(e.target.value)
            writeCode2Container(e.target.value, webcontainerInstance)
          }}
          value={code}
        >
          {rendererHandler()}
        </RichTextarea>
      </div>
    </>
  )
}
