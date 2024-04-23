import { FileSystemTree } from "@webcontainer/api"
import { initialFile } from "./projectData"

export const nextjsFiles: FileSystemTree = {
  // This is a directory - provide its name as a key
  src: {
    directory: {
      public: {
        directory: {
          "index.html": {
            file: {
              contents: `
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
  </body>
</html>
`,
            },
          },
        },
      },
      src: {
        directory: {
          "globals.css": {
            file: {
              contents: `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
            },
          },
          "App.tsx": {
            file: {
              contents: initialFile.content,
            },
          },
          "index.tsx": {
            file: {
              contents: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
            },
          },
        },
      },
      "package.json": {
        file: {
          contents: `
{
  "name": "src",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.96",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3"
  }
}
`,
        },
      },
      "postcss.config.js": {
        file: {
          contents: `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
        },
      },
      "tailwind.config.js": {
        file: {
          contents: `
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
        },
      },
      "tsconfig.json": {
        file: {
          contents: `
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
`,
        },
      },
    },
  },
}
