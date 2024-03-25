import './style.css'
import { DirectoryNode, FileSystemTree, WebContainer } from '@webcontainer/api';
import { reactFiles } from '../../lib/webContainerSideFiles';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import ViewTree from '../ViewTree';

let webcontainerInstance:WebContainer;

window.addEventListener('load', async () => {
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(reactFiles);

  const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  console.log(packageJSON);

  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  
  if (await installProcess.exit !== 0) {
    throw new Error('Installation failed');
  };

  const textareaEl = document.querySelector('textarea') as HTMLTextAreaElement;
  const terminalEl1 = document.querySelector('.terminal1') as HTMLElement;
  const terminalEl2= document.querySelector('.terminal2') as HTMLElement;
  if (textareaEl != null) {
    // const fileNode = files['index.js'];
    const pages = reactFiles.components as DirectoryNode
    const directory = pages.directory as FileSystemTree
    const fileNode = directory['hello.tsx'];
    if ('file' in fileNode) {
      textareaEl.value = fileNode.file.contents as string;
      textareaEl.addEventListener('input', (_event) => {
        writeIndexJS(textareaEl.value);
      });
    }
  }
  console.log(terminalEl1)
  console.log(terminalEl2)
  const installDependencies = async(terminal: Terminal) => {
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        terminal.write(data);
      }
    }))
    return installProcess.exit;
  }
  const terminal1 = new Terminal({
    convertEol: true,
  });
  const terminal2 = new Terminal({
    convertEol: true,
  });
  terminal1.open(terminalEl1);
  terminal2.open(terminalEl2);
  const exitCode = await installDependencies(terminal1);
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };
  async function startShell(terminal: Terminal) {
    const shellProcess = await webcontainerInstance.spawn('jsh', {terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    }},);
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );
    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
    });
    return shellProcess;
  };
  startDevServer(terminal1);
  startShell(terminal2);
  console.log(webcontainerInstance)
});

const startDevServer = async (terminal: Terminal) => {
  console.log('test npm run start!!!');
  console.log(terminal)
  const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
  
  const iframeEl = document.querySelector('iframe');
  console.log(iframeEl)
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  webcontainerInstance.on('server-ready', (_port, url) => {
    console.log(url)
    if(iframeEl!=null) {
      iframeEl.src = url;
    }
  });
}

export const writeIndexJS = async (content:string) => {
  await webcontainerInstance.fs.writeFile('/components/hello.tsx', content);
};
export const Test = () => {
  console.log("test")
  return (
    <>
      <div id="app" className="container">
        <div className="editor">
          <ViewTree />
          <textarea>loading.....</textarea>
        </div>
        <div className="preview">
          <iframe src="../Preview" allow="sharedarraybuffer"></iframe>
        </div>
      </div>
      <div id="app" className="terminalcontainer">
        <div className="terminal1"></div>
        <div className="terminal2"></div>
      </div>
    </>
  )
}