// import './style.css'
// import { WebContainer } from '@webcontainer/api';
// import { files } from '../../lib/webContainerSideFiles';

// let webcontainerInstance:WebContainer;

// window.addEventListener('load', async () => {
//   webcontainerInstance = await WebContainer.boot();
//   await webcontainerInstance.mount(files);

//   const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
//   console.log(packageJSON);

//   const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  
//   if (await installProcess.exit !== 0) {
//     throw new Error('Installation failed');
//   };

//   const textareaEl = document.querySelector('textarea') as HTMLTextAreaElement;
//   if (textareaEl != null) {
//     const fileNode = files['index.js'];
//     if ('file' in fileNode) {
//       textareaEl.value = fileNode.file.contents as string;
//       textareaEl.addEventListener('input', (_event) => {
//         writeIndexJS(textareaEl.value);
//       });
//     }
//   }
  

//   startDevServer();
// });

// const startDevServer = async () => {
//   console.log('npm run start!!!');
//   await webcontainerInstance.spawn('npm', ['run', 'start']);
  
//   const iframeEl = document.querySelector('iframe');
//   console.log(iframeEl)
//   webcontainerInstance.on('server-ready', (_port, url) => {
//     console.log(url)
//     if(iframeEl!=null) {
//       iframeEl.src = url;
//     }
//   });
// }

// const writeIndexJS = async (content:string) => {
//   await webcontainerInstance.fs.writeFile('/index.js', content);
// };
// export const Home = () => {
//   return (
//     <>
//       <div id="app" className="container">
//         <div className="editor">
//           <textarea>loading.....</textarea>
//         </div>
//         <div className="preview">
//           <iframe src="../Preview" allow="sharedarraybuffer"></iframe>
//         </div>
//       </div>
//     </>
//   )
// }